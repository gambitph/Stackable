/**
 * Checks that each block stylesheet only styles its own block.
 *
 * With the per-block CSS loading, `dist/blocks/accordion.css` is only loaded
 * on pages that have an accordion block. So a rule in it that styles another
 * block (e.g. `.stk-block-columns { ... }`) would be missing on pages without
 * an accordion, and that block would look different on those pages.
 *
 * The rule: every selector in `dist/blocks/{block}.css` must have the block's
 * own class, `.stk-block-{block}`. Where it is in the selector doesn't matter:
 * `.stk-block-accordion .stk-block-heading` (a heading inside an accordion)
 * and `.stk-block-columns > .stk-block-accordion` are both fine, because they
 * can only match when an accordion is on the page.
 *
 * Usage (fast: no WordPress, no browser, reads the built CSS):
 *
 *   npm run test:block-css-scope              # checks dist/blocks
 *   npm run test:block-css-scope -- build/stackable/dist/blocks
 *
 * If a rule really has to be shared, add it to ALLOWED below and say why.
 */
/* eslint-disable no-console */
const fs = require( 'fs' )
const path = require( 'path' )
const postcss = require( 'postcss' )

/**
 * Rules that are allowed to not have the block's own class.
 * Each entry: the block (file name), the exact selector, and why.
 */
const ALLOWED = []

// Classes that belong to a block but don't start with its name. Only that
// block adds them to its markup.
const OWN_CLASSES = {
	column: [ 'stk-column-wrapper', 'stk--align-last-block-to-bottom' ],
	'tab-labels': [ 'stk-block-tabs__tab' ], // The tab buttons.
}

/**
 * Whether a selector targets something of the block. These count:
 *
 * - the block class `.stk-block-accordion`
 * - classes of the block's own parts and variations, which are only used
 *   inside that block: `.stk-block-accordion__heading`, `.stk-block-timeline--left`,
 *   and the same without "block-": `.stk-progress-bar`, `.stk-progress-bar__bar`
 * - the block's WordPress class `.wp-block-stackable-accordion`
 * - the classes in OWN_CLASSES above
 * - the block in the editor: `[data-type="stackable/accordion"]`
 *
 * `.stk-block-icon-list` doesn't count for `.stk-block-icon-list-item`, those
 * are different blocks. Classes inside :not() don't count, `:not(.stk-block-tabs)`
 * matches everything but tabs.
 *
 * @param {string} selector A CSS selector, e.g. `.stk-block-tabs > .stk-inner-blocks`.
 * @param {string} block The block name, e.g. `tabs`.
 * @return {boolean} True if the selector targets something of the block.
 */
function isOwnSelector( selector, block ) {
	// Remove :not(...), the parentheses can be nested.
	let withoutNot = selector
	let previous
	do {
		previous = withoutNot
		withoutNot = withoutNot.replace( /:not\([^()]*(\([^()]*\)[^()]*)*\)/g, '' )
	} while ( withoutNot !== previous )

	const names = [
		`stk-block-${ block }`,
		`stk-${ block }`,
		`wp-block-stackable-${ block }`,
		...( OWN_CLASSES[ block ] || [] ),
	]
	const hasOwnClass = names.some( name => {
		// The class, then "__" or "--" (a part or variation) or the end of the class name.
		return new RegExp( `\\.${ name }(__|--|(?![\\w-]))` ).test( withoutNot )
	} )
	return hasOwnClass || withoutNot.includes( `[data-type="stackable/${ block }"]` )
}

/**
 * The selectors in a stylesheet that don't target the block.
 *
 * @param {string} css The stylesheet.
 * @param {string} block The block name, e.g. `accordion`.
 * @return {Array} e.g. [ '.stk-block-columns' ]
 */
function findOtherBlockSelectors( css, block ) {
	const found = []
	postcss.parse( css ).walkRules( rule => {
		// Keyframe steps (from, to, 50%) are not selectors.
		if ( rule.parent && rule.parent.type === 'atrule' && /keyframes$/.test( rule.parent.name ) ) {
			return
		}
		rule.selectors.forEach( selector => {
			const isAllowed = ALLOWED.some( a => a.block === block && a.selector === selector )
			if ( ! isOwnSelector( selector, block ) && ! isAllowed ) {
				found.push( selector )
			}
		} )
	} )
	return [ ...new Set( found ) ]
}

function main() {
	const dir = path.resolve( process.argv[ 2 ] || path.join( __dirname, '..', 'dist', 'blocks' ) )
	if ( ! fs.existsSync( dir ) ) {
		console.error( `${ dir } not found, build the plugin first (npm run build).` )
		process.exit( 1 )
	}
	const files = fs.readdirSync( dir ).filter( f => f.endsWith( '.css' ) )
	if ( ! files.length ) {
		console.error( `No block stylesheets in ${ dir }.` )
		process.exit( 1 )
	}

	let problems = 0
	files.forEach( file => {
		// Premium block stylesheets end with __premium_only, e.g. card__premium_only.css.
		const block = path.basename( file, '.css' ).replace( /__premium_only$/, '' )
		const selectors = findOtherBlockSelectors( fs.readFileSync( path.join( dir, file ), 'utf8' ), block )
		selectors.forEach( selector => {
			console.error( `${ file }: "${ selector }" doesn't target the ${ block } block` )
		} )
		problems += selectors.length
	} )

	if ( problems ) {
		console.error( `\n${ problems } rule(s) style other blocks. A block's stylesheet only loads when that block is on the page,` )
		console.error( 'so move these rules to the stylesheet of the block they style (or to the shared styles),' )
		console.error( 'or add them to ALLOWED in tools/check-block-css-scope.js with the reason.' )
		process.exit( 1 )
	}
	console.log( `Block CSS scope: ${ files.length } block stylesheets only style their own block.` )
}

if ( require.main === module ) {
	main()
}

module.exports = { isOwnSelector, findOtherBlockSelectors }
