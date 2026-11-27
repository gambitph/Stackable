// Static check: compares the rules of the legacy bundle (frontend_blocks.css + _responsive.css [+ premium])
// with the split files in their canonical print order. Reports
//  - rules missing from / added to the split files (by media|selector|declarations)
//  - pairs of rules whose relative order flipped and that could conflict
//    (same property, same specificity, overlapping subject compound, compatible media).
// Usage: node css-order-check.js <distDir> [--theme=twentytwentyfive] [--premium]
const fs = require( 'fs' ), path = require( 'path' )
const postcss = require( 'postcss' )
const args = process.argv.slice( 2 )
const DIST = path.resolve( args.find( a => ! a.startsWith( '--' ) ) || '/workspace/Stackable/dist' )
const THEME = ( args.find( a => a.startsWith( '--theme=' ) ) || '--theme=twentytwentyfive' ).split( '=' )[ 1 ]
const PREMIUM = args.includes( '--premium' )
const OLD_SEL = ':where([class*=stk--background-scheme],[class*=stk--container-scheme],.stk--has-base-scheme,.stk--has-background-scheme .stk-block-background,.stk--has-container-scheme .stk-container:not(.stk--no-background))'
const read = f => fs.existsSync( path.join( DIST, f ) ) ? fs.readFileSync( path.join( DIST, f ), 'utf8' ) : ''
// The legacy bundle to compare with (defaults to the one in DIST). Use the baseline build, the bundle order can vary between builds.
const LEGACY = path.resolve( ( args.find( a => a.startsWith( '--legacy=' ) ) || `--legacy=${ DIST }` ).split( '=' )[ 1 ] )
const readLegacy = f => fs.existsSync( path.join( LEGACY, f ) ) ? fs.readFileSync( path.join( LEGACY, f ), 'utf8' ) : ''

function rulesOf( css, source ) {
	const out = []
	postcss.parse( css ).walkRules( r => {
		if ( r.parent.type === 'atrule' && /keyframes/.test( r.parent.name ) ) return
		const media = r.parent.type === 'atrule' ? `@${ r.parent.name } ${ r.parent.params }` : ''
		const decls = r.nodes.filter( n => n.type === 'decl' ).map( d => `${ d.prop }:${ d.value }${ d.important ? '!' : '' }` )
		r.selectors.forEach( sel => out.push( { media, sel, decls, props: r.nodes.filter( n => n.type === 'decl' ).map( d => d.prop + ( d.important ? '!' : '' ) ), source } ) )
	} )
	return out
}
// Specificity [a,b,c] with :where = 0, :is/:not/:has = max arg.
function spec( sel ) {
	let a = 0, b = 0, c = 0
	let s = sel
	// handle functional pseudos
	const fn = /:(where|is|not|has|matches)\(/g
	let m
	while ( ( m = fn.exec( s ) ) ) {
		let depth = 1, i = m.index + m[ 0 ].length
		while ( depth && i < s.length ) { if ( s[ i ] === '(' ) depth++; else if ( s[ i ] === ')' ) depth--; i++ }
		const inner = s.slice( m.index + m[ 0 ].length, i - 1 )
		if ( m[ 1 ] !== 'where' ) { const best = splitTop( inner ).map( spec ).sort( cmp ).pop() || [ 0, 0, 0 ]; a += best[ 0 ]; b += best[ 1 ]; c += best[ 2 ] }
		s = s.slice( 0, m.index ) + ' '.repeat( i - m.index ) + s.slice( i ); fn.lastIndex = 0
	}
	a += ( s.match( /#[\w-]+/g ) || [] ).length
	b += ( s.match( /\.[\w-]+|\[[^\]]+\]|:(?!:)[\w-]+(\([^)]*\))?/g ) || [] ).length
	c += ( s.match( /(^|[\s>+~])[a-zA-Z][\w-]*/g ) || [] ).length + ( s.match( /::[\w-]+/g ) || [] ).length
	return [ a, b, c ]
}
const cmp = ( x, y ) => x[ 0 ] - y[ 0 ] || x[ 1 ] - y[ 1 ] || x[ 2 ] - y[ 2 ]
function splitTop( s ) { const out = []; let d = 0, cur = ''; for ( const ch of s ) { if ( ch === '(' ) d++; if ( ch === ')' ) d--; if ( ch === ',' && ! d ) { out.push( cur ); cur = '' } else cur += ch } if ( cur ) out.push( cur ); return out }
function subject( sel ) {
	// rightmost compound (outside parens)
	let d = 0, last = 0
	for ( let i = 0; i < sel.length; i++ ) { const ch = sel[ i ]; if ( ch === '(' ) d++; else if ( ch === ')' ) d--; else if ( ! d && /[\s>+~]/.test( ch ) ) last = i + 1 }
	const comp = sel.slice( last )
	const noFn = comp.replace( /:(where|is|not|has)\([^)]*\)/g, '' )
	const classes = ( noFn.match( /\.[\w-]+/g ) || [] )
	const pseudoEl = ( comp.match( /::?(before|after|placeholder|marker|selection)/ ) || [ '' ] )[ 0 ].replace( /^:+/, '' )
	const tag = ( noFn.match( /^[a-zA-Z][\w-]*/ ) || [ '' ] )[ 0 ]
	return { classes, pseudoEl, tag, raw: comp }
}
function mayOverlap( r1, r2 ) {
	const s1 = subject( r1.sel ), s2 = subject( r2.sel )
	if ( s1.pseudoEl !== s2.pseudoEl ) return false
	if ( s1.tag && s2.tag && s1.tag !== s2.tag ) return false
	if ( s1.classes.length && s2.classes.length ) return s1.classes.some( c => s2.classes.includes( c ) )
	return true
}
function mediaCompatible( m1, m2 ) {
	const rng = m => { const mn = ( m.match( /min-width:\s*(\d+)/ ) || [] )[ 1 ], mx = ( m.match( /max-width:\s*(\d+)/ ) || [] )[ 1 ]; return [ mn ? +mn : 0, mx ? +mx : 1e9 ] }
	const [ a1, b1 ] = rng( m1 ), [ a2, b2 ] = rng( m2 )
	return a1 <= b2 && a2 <= b1
}
const key = r => `${ r.media }|${ r.sel }|${ r.decls.join( ';' ) }`

// Legacy order
let legacyCss = readLegacy( 'frontend_blocks.css' ) + readLegacy( 'frontend_blocks_responsive.css' )
legacyCss = legacyCss.split( OLD_SEL ).join( ':where(.stk-has-scheme)' )
const legacy = rulesOf( legacyCss, 'legacy' )
if ( PREMIUM ) legacy.push( ...rulesOf( readLegacy( 'frontend_blocks__premium_only.css' ), 'legacy-premium' ) )
// New canonical order
const manifest = fs.readFileSync( path.join( DIST, 'frontend_css_manifest.php' ), 'utf8' )
const blocks = [ ...manifest.match( /'blocks' => array\(([^)]*)\)/ )[ 1 ].matchAll( /'([\w-]+)' =>/g ) ].map( m => m[ 1 ] )
const files = [
	...blocks.map( b => `blocks/${ b }.css` ),
	'frontend_core.css', 'frontend_color_schemes.css', 'frontend_design_system.css', `frontend_theme_${ THEME }.css`, 'frontend_core_responsive.css',
]
if ( PREMIUM ) {
	const pm = read( 'frontend_css_manifest__premium_only.php' )
	const pfiles = pm ? [ ...pm.matchAll( /'file' => '([^']+)'/g ) ].map( m => m[ 1 ] ) : []
	files.push( ...pfiles )
}
const neu = []
files.forEach( f => neu.push( ...rulesOf( read( f ), f ) ) )

// Theme rules of other themes are not loaded for this theme, ignore them in legacy.
const otherTheme = r => { const m = r.sel.match( /\.stk--is-([a-z0-9]+)-theme/ ); return m && m[ 1 ] !== THEME }
const legacyKeys = new Map(); legacy.forEach( ( r, i ) => { if ( ! otherTheme( r ) ) legacyKeys.set( key( r ), i ) } )
const newKeys = new Map(); neu.forEach( ( r, i ) => newKeys.set( key( r ), i ) )
const missing = [ ...legacyKeys.keys() ].filter( k => ! newKeys.has( k ) )
const added = [ ...newKeys.keys() ].filter( k => ! legacyKeys.has( k ) )

// Order flips among common rules
const common = neu.map( ( r, i ) => ( { r, ni: i, li: legacyKeys.get( key( r ) ) } ) ).filter( x => x.li !== undefined )
const flips = []
const byProp = {}
common.forEach( x => x.r.props.forEach( p => { ( byProp[ p ] = byProp[ p ] || [] ).push( x ) } ) )
for ( const [ prop, list ] of Object.entries( byProp ) ) {
	for ( let i = 0; i < list.length; i++ ) for ( let j = i + 1; j < list.length; j++ ) {
		const x = list[ i ], y = list[ j ]
		if ( ( x.ni < y.ni ) === ( x.li < y.li ) ) continue
		if ( x.r.sel === y.r.sel && x.r.media === y.r.media && x.r.decls.join() === y.r.decls.join() ) continue
		if ( cmp( spec( x.r.sel ), spec( y.r.sel ) ) !== 0 ) continue
		if ( ! mediaCompatible( x.r.media, y.r.media ) ) continue
		if ( ! mayOverlap( x.r, y.r ) ) continue
		const vx = x.r.decls.filter( d => d.startsWith( prop.replace( '!', '' ) + ':' ) ), vy = y.r.decls.filter( d => d.startsWith( prop.replace( '!', '' ) + ':' ) )
		if ( vx.join() === vy.join() ) continue // same value, order doesn't matter
		flips.push( { prop, a: `${ x.r.source } ${ x.r.media } ${ x.r.sel } {${ vx.join( ';' ) }}`, b: `${ y.r.source } ${ y.r.media } ${ y.r.sel } {${ vy.join( ';' ) }}`, legacyWinner: x.li > y.li ? 'a' : 'b' } )
	}
}
const report = { dist: DIST, theme: THEME, legacyRules: legacy.length, newRules: neu.length, missing: missing.length, added: added.length, flips: flips.length }
console.log( JSON.stringify( report ) )
if ( args.includes( '--verbose' ) ) {
	console.log( '--- missing (first 40)' ); missing.slice( 0, 40 ).forEach( k => console.log( '  ' + k.slice( 0, 220 ) ) )
	console.log( '--- added (first 40)' ); added.slice( 0, 40 ).forEach( k => console.log( '  ' + k.slice( 0, 220 ) ) )
	console.log( '--- flips' ); flips.forEach( f => console.log( `  [${ f.prop }] legacy winner=${ f.legacyWinner }\n     a: ${ f.a.slice( 0, 260 ) }\n     b: ${ f.b.slice( 0, 260 ) }` ) )
}
// Machine-readable result for run-css-order.js
console.log( "STK_ORDER_RESULT " + JSON.stringify( { missing: missing.length, missingKeys: missing, added: added.length, flips: flips.map( f => `[${ f.prop }] ${ f.a } <> ${ f.b }` ) } ) )
