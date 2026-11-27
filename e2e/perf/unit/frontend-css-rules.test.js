/**
 * Unit tests for the build-time CSS rule data (.config/frontend-css-rules.js)
 * and its PHP reader (Stackable_Frontend_CSS_Rules::get_matching_css).
 *
 * Run: node --test e2e/perf/unit/   (npm run test:perf:unit)
 * The dist/*.rules checks need a build (npm run build / gulp style-split).
 */
const { test } = require( 'node:test' )
const assert = require( 'node:assert' )
const fs = require( 'fs' )
const path = require( 'path' )
const { execFileSync } = require( 'child_process' )
const postcss = require( 'postcss' )
const selectorParser = require( 'postcss-selector-parser' )
const { buildRules, subset, selectorCondition, getScriptClasses } = require( '../../../.config/frontend-css-rules' )

const ROOT = path.resolve( __dirname, '../../..' )
const noScripts = { always: new Set(), prefixes: [], triggered: new Map() }
const cond = ( sel, scripts = noScripts ) => {
	let out
	selectorParser( root => {
		out = selectorCondition( root.nodes[ 0 ], scripts )
	} ).processSync( sel )
	return out
}
// Canonical form of a stylesheet: the list of [media, selector, declarations].
const flat = css => {
	const out = []
	const walk = ( nodes, media ) => nodes.forEach( n => {
		if ( n.type === 'rule' ) {
			n.selectors.forEach( s => out.push( [ media, s.replace( /\s+/g, ' ' ).trim(), n.nodes.map( d => d.toString().replace( /\s+/g, ' ' ) ).join( ';' ) ] ) )
		} else if ( n.type === 'atrule' && n.name === 'media' ) {
			walk( n.nodes, n.params.replace( /\s+/g, ' ' ).trim() )
		} else if ( n.type === 'atrule' ) {
			out.push( [ media, '@' + n.name, n.toString().replace( /\s+/g, ' ' ) ] )
		}
	} )
	walk( postcss.parse( css ).nodes, '' )
	return out
}

test( 'selector conditions', () => {
	assert.deepStrictEqual( cond( '.stk-block-heading .stk-block-heading__text' ), [ 'stk-block-heading', 'stk-block-heading__text' ] )
	assert.deepStrictEqual( cond( '.wp-block-group p' ), [] ) // no Stackable classes: always printed
	assert.deepStrictEqual( cond( ':is(.stk-a,.stk-b) p' ), [ 'stk-a|stk-b' ] )
	assert.deepStrictEqual( cond( ':where(.stk-a, p) .x' ), [] ) // one alternative has no class: can't require one
	assert.deepStrictEqual( cond( '.stk-block-column:nth-child(3)' ), [ 'stk-block-column', '#3' ] )
	assert.deepStrictEqual( cond( '.stk-block-column:nth-child(1)' ), [ 'stk-block-column' ] )
	assert.deepStrictEqual( cond( '.stk-a:not(.stk-b)' ), [ 'stk-a' ] ) // :not() never adds a requirement
	assert.deepStrictEqual( cond( '.has-text-align-center-tablet' ), [ 'has-text-align-center-tablet' ] )
	assert.deepStrictEqual( cond( '.has-text-align-center' ), [] )
	const scripts = { always: new Set( [ 'stk--is-loaded' ] ), prefixes: [ 'stk-block-tab-label-' ], triggered: new Map( [ [ 'stk--is-open', [ 'stk-block-accordion' ] ] ] ) }
	assert.deepStrictEqual( cond( '.stk-x.stk--is-loaded .stk-block-tab-label-2', scripts ), [ 'stk-x' ] ) // added by JS: not required
	assert.deepStrictEqual( cond( '.stk--is-open', scripts ), [ 'stk--is-open|stk-block-accordion' ] ) // added by a block script
} )

test( 'subset keeps rules whose classes are on the page, in order, per media query', () => {
	const css = `.a{color:red}.stk-x .y{color:blue}@media (max-width:767px){.stk-x{margin:0}.stk-z{margin:1px}}.stk-z,.stk-x p{padding:0}.stk-q::-moz-selection,.stk-x::selection{color:red}@font-face{font-family:x;src:url(x.woff)}`
	const rules = buildRules( css, noScripts )
	assert.strictEqual( subset( rules, new Set( [ 'stk-x' ] ) ),
		'.a{color:red}.stk-x .y{color:blue}@media (max-width:767px){.stk-x{margin:0}}.stk-x p{padding:0}.stk-q::-moz-selection,.stk-x::selection{color:red}@font-face{font-family:x;src:url(x.woff)}' )
	assert.strictEqual( subset( rules, new Set() ), '.a{color:red}@font-face{font-family:x;src:url(x.woff)}' )
	// Everything on the page: same rules as the stylesheet.
	assert.deepStrictEqual( flat( subset( rules, new Set( [ 'stk-x', 'stk-z', 'stk-q' ] ) ) ), flat( css ) )
} )

test( 'column count conditions', () => {
	const rules = buildRules( '.stk-block-column:nth-child(2){order:1}.stk-block-column:nth-child(4){order:2}', noScripts )
	const t = new Set( [ 'stk-block-column' ] )
	assert.strictEqual( subset( rules, t, 1 ), '' )
	assert.strictEqual( subset( rules, t, 3 ), '.stk-block-column:nth-child(2){order:1}' )
	assert.strictEqual( subset( rules, t, 4 ), '.stk-block-column:nth-child(2){order:1}.stk-block-column:nth-child(4){order:2}' )
} )

const builtRules = () => {
	const dist = path.join( ROOT, 'dist' )
	const out = []
	const walk = d => fs.existsSync( d ) && fs.readdirSync( d, { withFileTypes: true } ).forEach( e => {
		const p = path.join( d, e.name )
		if ( e.isDirectory() ) {
			walk( p )
		} else if ( e.name.endsWith( '.rules' ) && fs.existsSync( p.replace( /\.rules$/, '.css' ) ) ) {
			out.push( p.replace( /\.rules$/, '.css' ) )
		}
	} )
	walk( dist )
	walk( path.join( ROOT, 'pro__premium_only', 'dist' ) )
	return out
}
const allTokens = rules => {
	const t = new Set()
	rules.split( '\n' ).forEach( l => ( l.split( '\t' )[ 2 ] || '' ).split( /[\x1f |]/ ).forEach( a => a && a[ 0 ] !== '#' && t.add( a ) ) )
	return t
}

test( 'built .rules files: all tokens give back the whole stylesheet', { skip: ! builtRules().length && 'no build' }, () => {
	const files = builtRules()
	assert.ok( files.some( f => f.endsWith( 'frontend_core.css' ) ), 'frontend_core.rules is built' )
	for ( const file of files ) {
		const rules = fs.readFileSync( file.replace( /\.css$/, '.rules' ), 'utf8' )
		assert.deepStrictEqual( flat( subset( rules, allTokens( rules ), 99 ) ), flat( fs.readFileSync( file, 'utf8' ) ), path.relative( ROOT, file ) )
	}
} )

test( 'PHP get_matching_css prints the same CSS as the JS subset', { skip: ! builtRules().length && 'no build' }, () => {
	const php = path.join( __dirname, 'subset-harness.php' )
	const files = builtRules()
	const pick = [ 'frontend_core.css', 'frontend_responsive.css', 'blocks/heading.css', 'blocks/columns.css', 'blocks/accordion.css', '__premium_only.css' ]
	const picked = files.filter( f => pick.some( p => f.endsWith( p ) ) )
	assert.ok( picked.length >= 5, picked.join( ', ' ) )
	for ( const file of picked ) {
		const rules = fs.readFileSync( file.replace( /\.css$/, '.rules' ), 'utf8' )
		const all = [ ...allTokens( rules ) ]
		const sets = [ [], all, all.filter( ( _, i ) => i % 2 ), all.filter( ( _, i ) => i % 3 === 0 ) ]
		for ( const [ i, tokens ] of sets.entries() ) {
			const cols = [ 0, 99, 2, 4 ][ i ]
			const out = execFileSync( 'php', [ php, file, tokens.join( ',' ), String( cols ) ], { encoding: 'utf8', maxBuffer: 1 << 26 } )
			assert.strictEqual( out, subset( rules, new Set( tokens ), cols ), `${ path.relative( ROOT, file ) } set ${ i }` )
		}
	}
} )

test( 'classes added by frontend scripts are found (e.g. carousel dots)', () => {
	const s = getScriptClasses( ROOT )
	const has = ( cls, block ) => s.always.has( cls ) || ( s.triggered.get( cls ) || new Set() ).has( block )
	assert.ok( has( 'stk-block-carousel__dot', 'stk-block-carousel' ) )
	assert.ok( has( 'stk-block-carousel__dot--active', 'stk-block-carousel' ) )
	assert.ok( s.prefixes.includes( 'stk-block-tab-label-' ) )
} )

test( 'classes added by inline scripts printed from PHP are found (stk--anim-init)', () => {
	const s = getScriptClasses( ROOT )
	assert.ok( s.always.has( 'stk--anim-init' ) )
} )
