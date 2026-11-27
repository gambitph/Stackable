/**
 * Cascade-order check for the split frontend CSS.
 *
 * The canonical order is the order of the rules in the static stylesheets as
 * if they were one stylesheet: block stylesheets (in manifest order), shared
 * core, color schemes, design system, theme compatibility, responsive, then
 * Premium. Whatever subset of those rules a page gets, and however they are
 * printed (links, inline, combined), the last copy of each rule on the page
 * must keep the canonical relative order, otherwise the cascade can change.
 */
const fs = require( 'fs' )
const path = require( 'path' )
const { execFileSync } = require( 'child_process' )
const postcss = require( 'postcss' )

const norm = s => s.replace( /\s+/g, ' ' ).trim()
// :is()/:where() arguments may be pruned per page, compare without them.
const normSel = s => norm( s ).replace( /:(is|where)\((?:[^()]|\([^()]*\))*\)/g, ':$1(*)' )

function tuples( css ) {
	const out = []
	let root
	try {
		root = postcss.parse( css )
	} catch ( e ) {
		return out
	}
	root.walkRules( r => {
		if ( r.parent.type === 'atrule' && /keyframes/.test( r.parent.name ) ) {
			return
		}
		const media = r.parent.type === 'atrule' ? norm( `@${ r.parent.name } ${ r.parent.params }` ) : ''
		const decls = r.nodes.filter( n => n.type === 'decl' ).map( d => `${ d.prop }:${ norm( d.value ) }${ d.important ? '!' : '' }` ).join( ';' )
		for ( const sel of r.selectors ) {
			out.push( `${ media }|${ normSel( sel ) }|${ decls }` )
		}
	} )
	return out
}

function readManifest( dist, file ) {
	const f = path.join( dist, file )
	if ( ! fs.existsSync( f ) ) {
		return null
	}
	const json = execFileSync( 'php', [ '-r', `define('ABSPATH','/'); echo json_encode(include '${ f }');` ], { encoding: 'utf8' } )
	return JSON.parse( json )
}

/**
 * Canonical rule sequence of the split stylesheets of a plugin build.
 *
 * @param {string} pluginDir     The plugin build folder (with dist/).
 * @param {Object} options
 * @param {string} options.theme Theme slug, for the theme-specific stylesheet.
 * @return {string[]} Rule keys in print order.
 */
function canonical( pluginDir, { theme = 'twentytwentyfive' } = {} ) {
	const dist = path.join( pluginDir, 'dist' )
	const read = f => fs.existsSync( path.join( dist, f ) ) ? fs.readFileSync( path.join( dist, f ), 'utf8' ) : ''
	const m = readManifest( dist, 'frontend_css_manifest.php' )
	if ( ! m ) {
		return null
	}
	const files = []
	Object.keys( m.blocks ).forEach( b => files.push( `blocks/${ b }.css` ) )
	files.push( 'frontend_core.css', 'frontend_color_schemes.css', 'frontend_design_system.css', `frontend_theme_${ theme }.css`, 'frontend_core_responsive.css' )
	const pm = readManifest( dist, 'frontend_css_manifest__premium_only.php' )
	if ( pm ) {
		( pm.styles || [] ).forEach( s => files.push( s.file ) )
	}
	const seq = []
	files.forEach( f => tuples( read( f ) ).forEach( t => seq.push( t ) ) )
	const index = new Map()
	seq.forEach( ( t, i ) => {
		if ( ! index.has( t ) ) {
			index.set( t, [] )
		}
		index.get( t ).push( i )
	} )
	return {
		seq, index, files,
	}
}

/**
 * @param {string} pageCss All Stackable static CSS on the page in document order.
 * @param {string[]} canon  The canonical rule order from canonical().
 * @return {{ known: number, unknown: number, inversions: Array }} Counts of rules found in / missing from canon, and the out-of-order pairs.
 */
function check( pageCss, canon ) {
	const list = tuples( pageCss )
	// Last copy of each rule wins.
	const last = new Map()
	list.forEach( ( t, i ) => last.set( t, i ) )
	const ordered = [ ...last.entries() ].sort( ( a, b ) => a[ 1 ] - b[ 1 ] ).map( e => e[ 0 ] )
	let known = 0
	let prev = -1
	let unknown = 0
	const inversions = []
	for ( const t of ordered ) {
		const idx = canon.index.get( t )
		if ( ! idx ) {
			unknown++
			continue
		}
		known++
		// Earliest canonical position not before the previous rule.
		const next = idx.find( i => i >= prev )
		if ( next === undefined ) {
			// Only a problem if this rule can conflict with a rule printed
			// before it; report it, the caller decides.
			inversions.push( {
				rule: t.slice( 0, 200 ), at: idx[ idx.length - 1 ], after: canon.seq[ prev ].slice( 0, 200 ),
			} )
			continue
		}
		prev = next
	}
	return {
		known, unknown, inversions,
	}
}

module.exports = {
	tuples, canonical, check,
}
