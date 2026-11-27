// Usage: node compare.js <baselineDir> <afterDir> <reportDir> [--px-threshold=0.0005] [--filter=regex]
// 1) pixel diff per screenshot (pixelmatch, per-pixel threshold 0.1; page fails if diff ratio > px-threshold or height differs)
// 2) asset-order diff (Stackable assets: tag/handle/region sequence)
// 3) cascade-order check on the after state: core -> block files -> inline block styles -> Premium overrides
// 4) computed-style diff of every element in the site container
const fs = require( 'fs' ), path = require( 'path' )
const { PNG } = require( 'pngjs' )
const pixelmatch = require( 'pixelmatch' )
const args = process.argv.slice( 2 )
const [ A, B, R ] = args.filter( a => ! a.startsWith( '--' ) ).map( p => path.resolve( p ) )
const opt = k => ( args.find( a => a.startsWith( `--${ k }=` ) ) || '' ).split( '=' )[ 1 ]
const PX = parseFloat( opt( 'px-threshold' ) || '0.0005' )
const FILTER = opt( 'filter' ) ? new RegExp( opt( 'filter' ) ) : null
fs.mkdirSync( R, { recursive: true } )
const ma = JSON.parse( fs.readFileSync( path.join( A, 'manifest.json' ) ) )
const mb = JSON.parse( fs.readFileSync( path.join( B, 'manifest.json' ) ) )

function pixelDiff( fa, fb, out ) {
	const a = PNG.sync.read( fs.readFileSync( fa ) ), b = PNG.sync.read( fs.readFileSync( fb ) )
	const w = Math.min( a.width, b.width ), h = Math.min( a.height, b.height )
	const crop = ( img ) => { if ( img.width === w && img.height === h ) return img.data; const d = Buffer.alloc( w * h * 4 ); for ( let y = 0; y < h; y++ ) img.data.copy( d, y * w * 4, y * img.width * 4, y * img.width * 4 + w * 4 ); return d }
	const diff = new PNG( { width: w, height: h } )
	const n = pixelmatch( crop( a ), crop( b ), diff.data, w, h, { threshold: 0.1, includeAA: false } )
	const extra = Math.abs( a.height - b.height ) * w
	const ratio = ( n + extra ) / ( Math.max( a.height, b.height ) * w )
	if ( n + extra > 0 ) fs.writeFileSync( out, PNG.sync.write( diff ) )
	return { diffPixels: n, heightA: a.height, heightB: b.height, ratio }
}

const kind = a => {
	const h = a.handle || ''
	if ( a.tag === 'style' && a.blockScoped ) return 'inline-block'
	// Round 2: one combined <style> (core, blocks, responsive and the global inline styles in the canonical
	// order; printed again from the first new rule when later content needs more), counts as the core stylesheet.
	if ( /^stk-frontend-css(-\d+)?$/.test( h ) ) return 'core'
	if ( /premium/.test( h ) || /__premium_only/.test( a.src || '' ) ) return 'premium'
	if ( /^ugb-style-css-nodep|nodep/.test( h ) ) return 'global-inline'
	if ( /responsive/.test( h ) ) return 'responsive'
	if ( /^ugb-style-css(-reprint(-\d+)?)?$/.test( h ) || /frontend_core\.css|frontend_blocks\.css/.test( a.src || '' ) ) return 'core'
	if ( /^stk-block-|ugb-block-.*-css|\/dist\/blocks\//.test( h + ' ' + ( a.src || '' ) ) ) return 'block'
	if ( /color-schemes|design-system/.test( h ) ) return 'core-addon'
	return 'other-stk'
}
// Canonical print order of the static Stackable stylesheets, same as the cascade of the old single bundle:
// block files, core, color schemes / design system, theme, responsive, global inline styles, Premium.
// The generated per-block inline styles must come after all the static stylesheets except Premium.
const RANK = { block: 0, core: 1, 'core-addon': 2, theme: 3, responsive: 4, 'global-inline': 5, premium: 6 }
function cascadeCheck( list ) {
	const css = list.filter( a => a.isStk && ( a.tag === 'link' || a.tag === 'style' ) ).map( a => ( { ...a, kind: /^ugb-style-css-theme/.test( a.handle || '' ) ? 'theme' : kind( a ) } ) )
	const issues = [], warnings = []
	const core = css.filter( a => a.kind === 'core' ), blocks = css.filter( a => a.kind === 'block' || a.kind === 'inline-block' )
	if ( ! core.length && blocks.length ) issues.push( 'no core stylesheet while Stackable blocks present' )
	const ranked = css.filter( a => RANK[ a.kind ] !== undefined )
	// Every stylesheet must be followed by (the last copy of) each stylesheet kind ranked after it.
	// Shared stylesheets may be printed again after late block stylesheets.
	const lastOf = {}
	ranked.forEach( ( a, i ) => { lastOf[ a.kind ] = i } )
	ranked.forEach( ( a, i ) => {
		Object.keys( lastOf ).forEach( k => {
			if ( RANK[ k ] > RANK[ a.kind ] && lastOf[ k ] < i ) issues.push( `${ a.kind }:${ a.handle } printed after the last ${ k }` )
		} )
	} )
	const lastStatic = Math.max( -1, ...ranked.filter( a => a.kind !== 'premium' && a.kind !== 'global-inline' ).map( a => a.i ) )
	css.filter( a => a.kind === 'inline-block' && a.i < lastStatic ).forEach( a => warnings.push( `inline block style #${ a.i } printed before a static stylesheet` ) )
	return { sequence: css.map( a => `${ a.kind }:${ a.handle || '(inline)' }@${ a.region }` ), issues, warnings }
}
function orderDiff( la, lb ) {
	const key = a => `${ a.tag }:${ a.handle || ( a.blockScoped ? '(block-inline)' : '(inline)' ) }@${ a.region }`
	const sa = la.filter( a => a.isStk ).map( key ), sb = lb.filter( a => a.isStk ).map( key )
	const removed = sa.filter( k => ! sb.includes( k ) ), added = sb.filter( k => ! sa.includes( k ) )
	const common = sa.filter( k => sb.includes( k ) ), commonB = sb.filter( k => sa.includes( k ) )
	return { identical: JSON.stringify( sa ) === JSON.stringify( sb ), removed: [ ...new Set( removed ) ], added: [ ...new Set( added ) ], commonOrderSame: JSON.stringify( common ) === JSON.stringify( commonB ) }
}
function computedDiff( fa, fb ) {
	if ( ! fs.existsSync( fa ) || ! fs.existsSync( fb ) ) return null
	// The new color scheme marker class is expected, ignore it in the element keys.
	const norm = o => Object.fromEntries( Object.entries( o ).map( ( [ k, v ] ) => [ k.replace( /\.stk-has-scheme(?=[.|]|$)/g, '' ), v ] ) )
	const a = norm( JSON.parse( fs.readFileSync( fa ) ) ), b = norm( JSON.parse( fs.readFileSync( fb ) ) )
	const ka = Object.keys( a ), kb = new Set( Object.keys( b ) )
	let changed = 0; const samples = []
	const missing = ka.filter( k => ! kb.has( k ) ).length, extra = [ ...kb ].filter( k => ! ( k in a ) ).length
	for ( const k of ka ) {
		if ( ! kb.has( k ) ) continue
		const d = Object.keys( a[ k ] ).filter( p => a[ k ][ p ] !== b[ k ][ p ] )
		const d2 = Object.keys( b[ k ] ).filter( p => ! ( p in a[ k ] ) )
		if ( d.length || d2.length ) { changed++; if ( samples.length < 15 ) samples.push( { el: k.slice( -160 ), props: d.concat( d2 ).slice( 0, 6 ).map( p => `${ p }: ${ a[ k ][ p ] } -> ${ b[ k ][ p ] }` ) } ) }
	}
	return { elements: ka.length, changed, missing, extra, samples }
}

const report = { baseline: A, after: B, pxThreshold: PX, targets: {} }
let fails = 0
for ( const id of Object.keys( ma.targets ) ) {
	if ( FILTER && ! FILTER.test( id ) ) continue
	if ( ! mb.targets[ id ] ) { report.targets[ id ] = { missing: true }; fails++; continue }
	const r = { pixels: {}, computed: {} }
	for ( const vw of Object.keys( ma.targets[ id ].screenshots ) ) {
		const fa = path.join( A, id, `shot-${ vw }.png` ), fb = path.join( B, id, `shot-${ vw }.png` )
		const out = path.join( R, id.replace( /\//g, '__' ) + `-${ vw }-diff.png` )
		const d = pixelDiff( fa, fb, out ); d.pass = d.ratio <= PX && d.heightA === d.heightB
		r.pixels[ vw ] = d
		r.computed[ vw ] = computedDiff( path.join( A, id, `computed-${ vw }.json` ), path.join( B, id, `computed-${ vw }.json` ) )
	}
	const la = JSON.parse( fs.readFileSync( path.join( A, id, 'assets.json' ) ) ), lb = JSON.parse( fs.readFileSync( path.join( B, id, 'assets.json' ) ) )
	r.assetOrder = orderDiff( la, lb )
	r.cascade = cascadeCheck( lb )
	r.stkCssBytes = { before: ma.targets[ id ].stkCssBytes, after: mb.targets[ id ].stkCssBytes }
	r.pass = Object.values( r.pixels ).every( p => p.pass ) && ! r.cascade.issues.length
	if ( ! r.pass ) fails++
	report.targets[ id ] = r
}
fs.writeFileSync( path.join( R, 'report.json' ), JSON.stringify( report, null, 1 ) )
const lines = [ `# Compare ${ path.basename( A ) } -> ${ path.basename( B ) }`, '', `Pixel threshold: ${ PX } (ratio of differing pixels); per-pixel tolerance 0.1`, '', '| target | pass | max px diff ratio | height change | computed-style changed els (max) | asset order | cascade issues | Stackable CSS bytes before -> after |', '|---|---|---|---|---|---|---|---|' ]
for ( const [ id, r ] of Object.entries( report.targets ) ) {
	if ( r.missing ) { lines.push( `| ${ id } | MISSING | | | | | | |` ); continue }
	const px = Object.values( r.pixels ), maxR = Math.max( ...px.map( p => p.ratio ) )
	const hc = px.filter( p => p.heightA !== p.heightB ).map( p => `${ p.heightA }->${ p.heightB }` ).join( ' ' ) || '-'
	const cc = Math.max( ...Object.values( r.computed ).map( c => c ? c.changed : 0 ) )
	lines.push( `| ${ id } | ${ r.pass ? 'yes' : '**NO**' } | ${ maxR.toFixed( 6 ) } | ${ hc } | ${ cc } | ${ r.assetOrder.identical ? 'identical' : `changed (+${ r.assetOrder.added.length }/-${ r.assetOrder.removed.length })` } | ${ r.cascade.issues.length } | ${ r.stkCssBytes.before } -> ${ r.stkCssBytes.after } |` )
}
lines.push( '', `Failures: ${ fails }` )
fs.writeFileSync( path.join( R, 'summary.md' ), lines.join( '\n' ) )
console.log( lines.join( '\n' ) )
process.exitCode = fails ? 1 : 0
