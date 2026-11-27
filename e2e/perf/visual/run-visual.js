#!/usr/bin/env node
/**
 * Visual + computed-style regression test over the regression site
 * (36 targets: Twenty Twenty-Five, Twenty Twenty-One, custom breakpoints;
 * 1440/768/375 (+1050 for breakpoints)). Wraps capture.js + compare.js and
 * turns the report into pass/fail.
 *
 *   STK_VISUAL_PLUGIN=<build> STK_PERF_LEGACY=off|on node e2e/perf/visual/run-visual.js <outDir> [--baseline=<dir>] [--noise=<report.json>] [--filter=re]
 *
 * Primary signal: computed styles of every element (pixel diffs are noisy
 * because of animations and JS timers, they are reported but don't fail).
 * A target fails if
 *  - more elements changed computed style than the noise allowance
 *    (noise = two captures of the same build), or
 *  - the cascade check in compare.js finds a stylesheet printed out of order
 *    (new behavior; with the legacy flag the order must be the old one), or
 *  - (legacy flag on) the Stackable asset list differs from the baseline.
 * Exit code 0 = pass.
 */
const fs = require( 'fs' ), path = require( 'path' )
const { execFileSync, spawnSync } = require( 'child_process' )
const args = process.argv.slice( 2 )
const opt = ( k, d ) => ( args.find( a => a.startsWith( `--${ k }=` ) ) || `--${ k }=${ d }` ).split( '=' ).slice( 1 ).join( '=' )
const OUT = path.resolve( args.find( a => ! a.startsWith( '--' ) ) || '/tmp/stk-visual' )
const SITE_PATH = process.env.STK_VISUAL_WP_PATH || '/workspace/stk-site'
const SITE = process.env.SITE || 'http://127.0.0.1:8891'
const PLUGIN = process.env.STK_VISUAL_PLUGIN
const LEGACY = ( process.env.STK_PERF_LEGACY || 'off' ) !== 'off'
const BASE = path.resolve( opt( 'baseline', '/workspace/stackable-css-bloat/baseline-r2' ) )
const NOISE = opt( 'noise', '/workspace/stackable-css-bloat/reports/noise-baseline-vs-r2/report.json' )
const FILTER = opt( 'filter', '' )
const SKIP_CAPTURE = args.includes( '--skip-capture' )
// Random content (Ajax Load More shows random posts): computed styles are informational.
const RANDOM = /dyn-alm/
const SLACK_CHANGED = 4, SLACK_MISSING = 12
const NODE_PATH = [ path.resolve( __dirname, '../../../node_modules' ), '/workspace/stackable-css-bloat/harness/node_modules' ].join( ':' )

const wp = ( ...a ) => execFileSync( 'wp', [ `--path=${ SITE_PATH }`, ...a ], { encoding: 'utf8', stdio: [ 'ignore', 'pipe', 'pipe' ] } )
function restart() {
	try {
		execFileSync( 'pkill', [ '-f', 'php -S 127.0.0.1:8891' ] )
	} catch ( e ) {}
	spawnSync( 'sleep', [ '1' ] )
	execFileSync( 'bash', [ '-c', `cd ${ SITE_PATH } && (PHP_CLI_SERVER_WORKERS=6 nohup php -S 127.0.0.1:8891 -t ${ SITE_PATH } > /tmp/stk-server.log 2>&1 &) ; sleep 2` ] )
}

if ( ! SKIP_CAPTURE ) {
	if ( PLUGIN ) {
		const link = path.join( SITE_PATH, 'wp-content/plugins/stackable-ultimate-gutenberg-blocks' )
		try {
			fs.unlinkSync( link )
		} catch ( e ) {}
		fs.symlinkSync( PLUGIN, link )
	}
	if ( LEGACY ) {
		wp( 'option', 'update', 'stackable_use_legacy_frontend_css', '1' )
	} else {
		try {
			wp( 'option', 'delete', 'stackable_use_legacy_frontend_css' )
		} catch ( e ) {}
	}
	restart()
	fs.rmSync( OUT, { recursive: true, force: true } )
	const cap = spawnSync( 'node', [ path.join( __dirname, 'capture.js' ), OUT, ...( FILTER ? [ FILTER ] : [] ) ], { stdio: 'inherit', env: { ...process.env, NODE_PATH, SITE } } )
	if ( cap.status !== 0 ) {
		console.error( 'capture failed' )
		process.exit( 2 )
	}
}
const REPORT = OUT + '-report'
spawnSync( 'node', [ path.join( __dirname, 'compare.js' ), BASE, OUT, REPORT, ...( FILTER ? [ `--filter=${ FILTER }` ] : [] ) ], { stdio: 'ignore', env: { ...process.env, NODE_PATH } } )
const report = JSON.parse( fs.readFileSync( path.join( REPORT, 'report.json' ) ) )
const noise = fs.existsSync( NOISE ) ? JSON.parse( fs.readFileSync( NOISE ) ) : { targets: {} }
const maxOf = ( r, f ) => Math.max( 0, ...Object.values( ( r && r.computed ) || {} ).map( c => c ? f( c ) : 0 ) )

const rows = [], failures = []
for ( const [ id, r ] of Object.entries( report.targets ) ) {
	if ( r.missing ) {
		failures.push( `${ id }: missing in capture` )
		continue
	}
	const n = noise.targets[ id ]
	const changed = maxOf( r, c => c.changed ), me = maxOf( r, c => c.missing + c.extra )
	const allowC = maxOf( n, c => c.changed ) + SLACK_CHANGED, allowME = maxOf( n, c => c.missing + c.extra ) + SLACK_MISSING
	const pxMax = Math.max( ...Object.values( r.pixels ).map( p => p.ratio ) )
	const why = []
	if ( ! RANDOM.test( id ) ) {
		if ( changed > allowC ) {
			why.push( `computed changed ${ changed } > ${ allowC }` )
		}
		if ( me > allowME ) {
			why.push( `missing/extra elements ${ me } > ${ allowME }` )
		}
	}
	// With the legacy flag the stylesheets are printed like the old release
	// (checked below), the cascade check is for the new print order.
	if ( r.cascade.issues.length && ! ( LEGACY && r.assetOrder.identical ) ) {
		why.push( `cascade: ${ r.cascade.issues.slice( 0, 3 ).join( '; ' ) }` )
	}
	if ( LEGACY && ! r.assetOrder.identical ) {
		why.push( `asset list differs (+${ r.assetOrder.added.join( ',' ) } -${ r.assetOrder.removed.join( ',' ) })` )
	}
	rows.push( { id, pass: ! why.length, changed, allowC, me, allowME, pxMax: +pxMax.toFixed( 4 ), cssBytes: r.stkCssBytes, why } )
	if ( why.length ) {
		failures.push( `${ id }: ${ why.join( ' | ' ) }` )
	}
}
const md = [ `# Visual/computed regression: ${ path.basename( OUT ) } vs ${ path.basename( BASE ) } (legacy ${ LEGACY ? 'on' : 'off' })`, '',
	'| target | pass | computed changed (allow) | missing+extra (allow) | max px ratio (info) | Stackable CSS bytes base -> now |', '|---|---|---|---|---|---|',
	...rows.map( r => `| ${ r.id } | ${ r.pass ? 'yes' : '**NO**' } | ${ r.changed } (${ r.allowC }) | ${ r.me } (${ r.allowME }) | ${ r.pxMax } | ${ r.cssBytes.before } -> ${ r.cssBytes.after } |` ),
	'', `Targets: ${ rows.length }, failures: ${ failures.length }`, ...failures.map( f => `- ${ f }` ) ]
fs.writeFileSync( path.join( REPORT, 'visual-test.md' ), md.join( '\n' ) + '\n' )
fs.writeFileSync( path.join( REPORT, 'visual-test.json' ), JSON.stringify( { pass: ! failures.length, rows, failures }, null, 1 ) )
console.log( md.join( '\n' ) )
process.exit( failures.length ? 1 : 0 )
