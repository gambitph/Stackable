/**
 * Helpers for the frontend performance suite (e2e/perf).
 *
 * The suite runs against a throwaway WordPress site (default <tmp>/stk-perf-ci/site,
 * a fresh-install SQLite snapshot of WP 6.8.3 + Twenty Twenty-Five, the same as
 * the DynamicWP replica). Every run restores the snapshot, links the plugin
 * build under test and starts `php -S`. See e2e/perf/README.md.
 */
const fs = require( 'fs' )
const os = require( 'os' )
const path = require( 'path' )
const { execFileSync, spawn } = require( 'child_process' )
const cheerio = require( 'cheerio' )

const cfg = {
	wpPath: process.env.STK_PERF_WP_PATH || path.join( os.tmpdir(), 'stk-perf-ci', 'site' ),
	url: process.env.STK_PERF_URL || 'http://127.0.0.1:8896',
	plugin: process.env.STK_PERF_PLUGIN || '',
	snapshot: process.env.STK_PERF_SNAPSHOT || path.join( os.tmpdir(), 'stk-perf-ci', 'base.sqlite' ),
	// 'off' (new behavior) or 'on' (legacy flag on)
	legacy: process.env.STK_PERF_LEGACY || 'off',
	opcache: process.env.STK_PERF_OPCACHE || '0',
	premiumMock: process.env.STK_PERF_PREMIUM_MOCK || '',
	slug: 'stackable-ultimate-gutenberg-blocks',
}
cfg.port = new URL( cfg.url ).port
cfg.isPremium = !! cfg.plugin && fs.existsSync( path.join( cfg.plugin, 'pro__premium_only' ) )
cfg.isLegacyMode = cfg.legacy !== 'off'

const FIX = path.join( __dirname, '..', 'fixtures' )

function wp( ...args ) {
	return execFileSync( 'wp', [ `--path=${ cfg.wpPath }`, ...args ], { encoding: 'utf8', stdio: [ 'ignore', 'pipe', 'pipe' ] } ).trim()
}
function wpEval( code ) {
	return wp( 'eval', code )
}

function dbFile() {
	const dir = path.join( cfg.wpPath, 'wp-content/database' )
	// Some SQLite setups keep the database in a hashed folder.
	const sub = fs.readdirSync( dir ).find( f => f.startsWith( '.ht.' ) && fs.statSync( path.join( dir, f ) ).isDirectory() )
	return path.join( dir, sub || '', '.ht.sqlite' )
}

function stopServer() {
	try {
		execFileSync( 'pkill', [ '-f', `php .*-S 127.0.0.1:${ cfg.port }` ] )
	} catch ( e ) {}
}
function sleep( ms ) {
	return new Promise( r => setTimeout( r, ms ) )
}
async function startServer() {
	stopServer()
	await sleep( 500 )
	const log = fs.openSync( `/tmp/stk-perf-server-${ cfg.port }.log`, 'a' )
	const p = spawn( 'php', [ '-d', `opcache.enable=${ cfg.opcache }`, '-d', 'memory_limit=256M', '-S', `127.0.0.1:${ cfg.port }`, '-t', cfg.wpPath ], {
		cwd: cfg.wpPath, detached: true, stdio: [ 'ignore', log, log ], env: { ...process.env, PHP_CLI_SERVER_WORKERS: '4' },
	} )
	p.unref()
	for ( let i = 0; i < 50; i++ ) {
		await sleep( 200 )
		try {
			const r = await fetch( cfg.url + '/' )
			if ( r.status ) {
				return
			}
		} catch ( e ) {}
	}
	throw new Error( 'perf site server did not start' )
}

/**
 * Restore the fresh-install snapshot and activate the plugin under test.
 *
 * @param {Object} o { legacy: 'off'|'on', upgradeFrom: version string to simulate an upgrade }
 */
async function resetSite( o = {} ) {
	const legacy = o.legacy || cfg.legacy
	stopServer()
	fs.copyFileSync( cfg.snapshot, dbFile() )
	const pl = path.join( cfg.wpPath, 'wp-content/plugins', cfg.slug )
	try {
		fs.unlinkSync( pl )
	} catch ( e ) {}
	if ( ! cfg.plugin ) {
		throw new Error( 'Set STK_PERF_PLUGIN to the plugin build to test' )
	}
	fs.symlinkSync( cfg.plugin, pl )
	const mu = path.join( cfg.wpPath, 'wp-content/mu-plugins' )
	fs.mkdirSync( mu, { recursive: true } )
	for ( const f of fs.readdirSync( mu ) ) {
		fs.unlinkSync( path.join( mu, f ) )
	}
	fs.copyFileSync( path.join( __dirname, '..', 'mu', 'stk-perf-test-hooks.php' ), path.join( mu, 'stk-perf-test-hooks.php' ) )
	if ( cfg.isPremium && cfg.premiumMock ) {
		fs.copyFileSync( cfg.premiumMock, path.join( mu, 'stackable-e2e-mock-premium.php' ) )
	}
	if ( o.upgradeFrom ) {
		// A site that ran an older Stackable: the version option is from before.
		wp( 'option', 'update', 'stackable_current_version_installed', o.upgradeFrom )
	}
	wp( 'plugin', 'activate', cfg.slug )
	if ( legacy === 'on' ) {
		wp( 'option', 'update', 'stackable_use_legacy_frontend_css', '1' )
	}
	await startServer()
}

function createPage( slug, fixture, extra = [] ) {
	const file = fixture.includes( '/' ) ? fixture : path.join( FIX, fixture )
	return parseInt( wp( 'post', 'create', file, '--post_type=page', `--post_name=${ slug }`, `--post_title=${ slug }`, '--post_status=publish', '--porcelain', ...extra ), 10 )
}

async function get( p, headers = {} ) {
	const r = await fetch( p.startsWith( 'http' ) ? p : cfg.url + p, { headers } )
	return {
		status: r.status, text: await r.text(), headers: r.headers,
	}
}

async function metrics( p, headers = {} ) {
	const r = await get( p, { 'X-Stk-Perf': '1', ...headers } )
	const m = r.text.match( /<!-- stk-perf (\{.*?\}) -->/ )
	return m ? JSON.parse( m[ 1 ] ) : null
}

const isStkStaticTag = ( el, $ ) => {
	const id = $( el ).attr( 'id' ) || ''
	const href = $( el ).attr( 'href' ) || ''
	if ( el.tagName === 'link' ) {
		return href.includes( `/plugins/${ cfg.slug }/` )
	}
	return /^(ugb|stk)[-_]/.test( id )
}

/**
 * The Stackable stylesheets on a page, in document order (the static CSS:
 * <link>s to our files and our <style id="..."> tags, not the generated
 * per-block styles inside the content).
 *
 * @param {string} html Page HTML.
 */
async function stkStyles( html ) {
	const $ = cheerio.load( html )
	const out = []
	for ( const el of $( 'link[rel="stylesheet"], style' ).toArray() ) {
		if ( ! isStkStaticTag( el, $ ) ) {
			continue
		}
		const inHead = $( el ).closest( 'head' ).length > 0
		const id = $( el ).attr( 'id' ) || ''
		if ( el.tagName === 'link' ) {
			const href = $( el ).attr( 'href' ).replace( /&#038;/g, '&' )
			const css = ( await get( href ) ).text
			out.push( {
				tag: 'link', id, href: href.replace( /[?&]ver=[^&]*/, '' ).replace( cfg.url, '' ), css, bytes: Buffer.byteLength( css ), inHead,
			} )
		} else {
			const css = $( el ).html() || ''
			out.push( {
				tag: 'style', id, css, bytes: Buffer.byteLength( css ), inHead,
			} )
		}
	}
	return out
}
const allCss = styles => styles.map( s => s.css ).join( '\n' )

/** Unique CSS markers used to tell which stylesheet's rules are on a page. */
const MARK = {
	// Rules only in that block's stylesheet.
	accordion: /\.stk-block-accordion summary/,
	tabs: /\.stk-block-tab-labels/,
	heading: /\.stk-block-heading/,
	columns: /\.stk-block-columns/,
	// The shared stylesheet (always there when a block is on the page).
	core: /\.stk-block\{|\.stk-block \{|\.stk-block,|:root\{--stk/,
	// A color scheme rule (the scheme selector differs between new and legacy).
	schemes: /:where\(\.stk-block\)>:is\(p,div\)\{color:var\(--stk-text-color\)/,
	// A design system rule.
	designSystem: /border-style:var\(--stk-container-border-style\)/,
	themeTT5: /stk--is-twentytwentyfive-theme/,
}

module.exports = {
	cfg, wp, wpEval, resetSite, startServer, stopServer, createPage, get, metrics, stkStyles, allCss, MARK, FIX, sleep,
}
