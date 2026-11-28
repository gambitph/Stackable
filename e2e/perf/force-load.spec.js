/**
 * The stackable_force_css_load filter and the injected-block loader.
 *
 * - With the filter, every block stylesheet loads in full (rules are not
 *   trimmed to the blocks on the page).
 * - Stackable markup added by a script after load (which PHP never saw),
 *   blocks rendered late, and content given to
 *   Stackable_Init::enqueue_frontend_assets_for_content() are styled the same
 *   as when every style is loaded.
 *
 * The styled cases compare the computed styles of every Stackable element
 * (keyed by its unique id class) with the same request with the filter on,
 * where all the styles are on the page.
 */
const { test, expect } = require( '@playwright/test' )
const fs = require( 'fs' ),
	path = require( 'path' )
const {
	cfg, wp, wpEval, resetSite, createPage, get, stkStyles, allCss, FIX,
} = require( './lib/site' )

const PROPS = [ 'color', 'background-color', 'background-image', 'font-size', 'font-weight', 'line-height', 'padding-top', 'padding-left', 'margin-top', 'margin-bottom', 'border-top-width', 'border-top-left-radius', 'flex-direction', 'flex-wrap', 'column-gap', 'justify-content', 'text-align', 'box-shadow' ]
const INJECT = [ 'color-scheme.html', 'tabs.html', 'accordion.html', 'carousel.html', 'columns.html' ]
const ids = {}

// Global color schemes (base, background and container schemes and custom schemes).
function setSchemeOptions( on, { base = true } = {} ) {
	const opts = JSON.parse( fs.readFileSync( path.join( FIX, 'color-scheme-options.json' ), 'utf8' ) )
	if ( ! base ) {
		// No base scheme: the body has no scheme marker, only the blocks with a
		// scheme (and the backgrounds / containers) are matched.
		delete opts.stackable_global_base_color_scheme
		opts.stackable_global_color_scheme_generated_css = opts.stackable_global_color_scheme_generated_css.replace( /:root\s*\{[^}]*\}/g, '' )
	}
	// One WP-CLI call for all the options.
	const json = Buffer.from( JSON.stringify( opts ) ).toString( 'base64' )
	wpEval( `foreach ( json_decode( base64_decode( '${ json }' ), true ) as $name => $value ) { ${ on ? 'update_option( $name, $value );' : 'delete_option( $name );' } }` )
}

async function styles( page, url, root, props = PROPS ) {
	await page.goto( cfg.url + url )
	// The injected-block loader adds its <link>s when the browser is idle.
	await page.waitForTimeout( 300 )
	await page.waitForLoadState( 'networkidle' )
	return page.evaluate( ( { root, props } ) => {
		const out = {}
		const scope = document.querySelector( root )
		if ( ! scope ) {
			return null
		}
		for ( const el of scope.querySelectorAll( '[class*="stk-"]' ) ) {
			const m = String( el.className ).match( /\bstk-[0-9a-f]{7}(-[a-z-]+)?\b/ )
			if ( ! m ) {
				continue
			}
			const key = m[ 0 ] + ' ' + el.tagName
			if ( out[ key ] ) {
				continue
			}
			const cs = getComputedStyle( el )
			out[ key ] = props.map( p => cs.getPropertyValue( p ) ).join( ';' )
		}
		return out
	}, { root, props } )
}

function differences( a, b ) {
	const keys = Object.keys( a ).filter( k => k in b )
	return {
		compared: keys.length, diff: keys.filter( k => a[ k ] !== b[ k ] ).map( k => ( {
			el: k, rendered: a[ k ], injected: b[ k ],
		} ) ),
	}
}

/**
 * Compares the styles of the Stackable elements in `root` for two requests
 * of the host page.
 *
 * @param {Object} page Playwright page.
 * @param {string} query The request to check, e.g. `stk_inject=12`.
 * @param {string} refQuery The reference request, where every style is loaded.
 * @param {string} root The element with the added blocks.
 */
async function compare( page, query, refQuery, root = '#stk-perf-injected' ) {
	const ref = await styles( page, `/?page_id=${ ids.host }&${ refQuery }`, root )
	const got = await styles( page, `/?page_id=${ ids.host }&${ query }`, root )
	expect( got, 'added markup on the page' ).toBeTruthy()
	const d = differences( ref, got )
	test.info().annotations.push( { type: 'metric', description: `${ query }: ${ d.compared } elements, ${ d.diff.length } differ ${ JSON.stringify( d.diff.slice( 0, 3 ) ).slice( 0, 600 ) }` } )
	expect( d.compared ).toBeGreaterThan( 20 )
	return d
}

// Shortcuts: markup added by a script, and blocks rendered after the footer.
const inject = ( page, id, extra = '' ) => compare( page, `${ extra }stk_inject=${ id }`, `stk_force=1&stk_inject=${ id }` )
const late = ( page, id, extra = '' ) => compare( page, `${ extra }stk_late=${ id }`, `stk_force=1&stk_late=${ id }`, '#stk-perf-late' )

test.describe.configure( { mode: 'serial' } )

test.beforeAll( async () => {
	await resetSite()
	const content = INJECT.map( f => fs.readFileSync( path.join( FIX, f ), 'utf8' ) ).join( '\n\n' )
	const tmp = path.join( require( 'os' ).tmpdir(), `stk-force-load-${ process.pid }.html` )
	fs.writeFileSync( tmp, content )
	ids.ref = createPage( 'force-ref', tmp )
	ids.host = createPage( 'force-host', 'heading.html' )
	ids.schemes = createPage( 'force-schemes', 'design-system.html' )
	ids.empty = createPage( 'force-empty', 'no-stackable.html' )
} )

test( 'with the filter, every block stylesheet loads in full, not trimmed to the page @ci', async () => {
	test.skip( cfg.isLegacyMode, 'the legacy bundle always has every block style' )
	// A page without Stackable blocks: nothing would load without the filter.
	const css = allCss( await stkStyles( ( await get( `/?page_id=${ ids.empty }&stk_force=1` ) ).text ) )
	const dir = path.join( cfg.plugin, 'dist', 'blocks' )
	const files = fs.readdirSync( dir ).filter( f => f.endsWith( '.css' ) )
	expect( files.length ).toBeGreaterThan( 20 )
	// Whole files have no color scheme marker class on the page, so the
	// printer puts the color scheme selectors back in place of the marker
	// (Stackable_Frontend_CSS_Color_Schemes::use_old_selectors()). Undo that
	// before comparing.
	const php = fs.readFileSync( path.join( cfg.plugin, 'src', 'frontend-css', 'class-color-schemes.php' ), 'utf8' )
	const schemeSelectors = php.match( /const OLD_SELECTORS = "([^"]+)"/ )[ 1 ]
	const pageCss = css.split( `:where(${ schemeSelectors })` ).join( ':where(.stk-has-scheme)' )
	const missing = files.filter( f => ! pageCss.includes( fs.readFileSync( path.join( dir, f ), 'utf8' ).trim() ) )
	expect( missing, 'block stylesheets not on the page in full' ).toEqual( [] )
} )

test( 'without the injected-block loader, injected markup misses styles (shows the test can tell)', async ( { page } ) => {
	test.skip( cfg.isLegacyMode, 'the legacy bundle always has every block style' )
	const d = await inject( page, ids.ref, 'stk_no_loader=1&' )
	expect( d.diff.length ).toBeGreaterThan( 0 )
} )

test( 'injected markup (e.g. HTML copied from another page) is styled by the injected-block loader @ci', async ( { page } ) => {
	expect( ( await inject( page, ids.ref ) ).diff ).toEqual( [] )
} )

test( 'the injected-block loader also loads the color scheme rules @ci', async ( { page } ) => {
	setSchemeOptions( true )
	try {
		expect( ( await inject( page, ids.schemes ) ).diff ).toEqual( [] )
	} finally {
		setSchemeOptions( false )
	}
} )

test( 'blocks rendered late (widgets, dynamic content) are styled', async ( { page } ) => {
	expect( ( await late( page, ids.ref ) ).diff ).toEqual( [] )
} )

test( 'content given to enqueue_frontend_assets_for_content() is styled, also without being rendered', async ( { page } ) => {
	expect( ( await compare( page, `stk_content_assets=${ ids.ref }`, `stk_force=1&stk_content_assets=${ ids.ref }`, '#stk-perf-content' ) ).diff ).toEqual( [] )
} )

test( 'with custom breakpoints, injected markup gets the responsive rules at tablet and mobile widths', async ( { page } ) => {
	wp( 'option', 'update', 'stackable_dynamic_breakpoints', '{"tablet":900,"mobile":600}', '--format=json' )
	try {
		for ( const width of [ 850, 560 ] ) {
			await page.setViewportSize( { width, height: 900 } )
			expect( ( await inject( page, ids.ref ) ).diff, `at ${ width }px` ).toEqual( [] )
		}
	} finally {
		wp( 'option', 'delete', 'stackable_dynamic_breakpoints' )
	}
} )

// The color schemes are set in the options. Markup added after load and late
// blocks must get the same colors as the same blocks rendered on their own
// page, where their color scheme CSS is printed for them. Only the colors are
// compared: spacing can differ when the blocks are in another place.
const COLOR_PROPS = [ 'color', 'background-color', 'background-image' ]
async function compareWithRenderedPage( page, query, root ) {
	const ref = await styles( page, `/?page_id=${ ids.schemes }`, 'body', COLOR_PROPS )
	const got = await styles( page, `/?page_id=${ ids.host }&${ query }`, root, COLOR_PROPS )
	const d = differences( ref, got )
	test.info().annotations.push( { type: 'metric', description: `${ query }: ${ d.compared } elements, ${ d.diff.length } differ ${ JSON.stringify( d.diff.slice( 0, 3 ) ).slice( 0, 600 ) }` } )
	expect( d.compared ).toBeGreaterThan( 20 )
	return d
}

for ( const base of [ true, false ] ) {
	for ( const force of [ true, false ] ) {
		const how = force ? 'with the filter' : 'with the injected-block loader'
		test( `${ how } and global color schemes (${ base ? 'with' : 'without' } a base scheme), added markup gets the scheme colors`, async ( { page } ) => {
			test.skip( ! force && cfg.isLegacyMode, 'no injected-block loader in the legacy mode' )
			setSchemeOptions( true, { base } )
			try {
				await page.goto( `${ cfg.url }/?page_id=${ ids.host }` )
				expect( await page.evaluate( () => document.body.classList.contains( 'stk--has-base-scheme' ) ) ).toBe( base )
				const filter = force ? 'stk_force=1&' : ''
				expect( ( await compareWithRenderedPage( page, `${ filter }stk_inject=${ ids.schemes }`, '#stk-perf-injected' ) ).diff ).toEqual( [] )
				expect( ( await compareWithRenderedPage( page, `${ filter }stk_late=${ ids.schemes }`, '#stk-perf-late' ) ).diff ).toEqual( [] )
			} finally {
				setSchemeOptions( false )
			}
		} )
	}
}

// Example: Ajax Load More appends posts that carry their own <style>. Those rules
// are scoped to the added content, so the blocks already on the page keep their
// color scheme and design system styles, as with the old single stylesheet.
test( 'CSS that comes with REST content does not restyle the blocks already on the page @ci', async ( { page } ) => {
	setSchemeOptions( true )
	try {
		await page.goto( `${ cfg.url }/?page_id=${ ids.schemes }&stk_no_loader=1` )
		const readPageBlocks = () => page.evaluate( props => {
			const values = []
			for ( const el of document.querySelectorAll( '[class*="stk-"]' ) ) {
				if ( el.closest( '#stk-added' ) ) {
					continue
				}
				const cs = getComputedStyle( el )
				values.push( props.map( prop => cs.getPropertyValue( prop ) ).join( ';' ) )
			}
			return values
		}, PROPS )
		const before = await readPageBlocks()
		const rendered = ( await ( await fetch( `${ cfg.url }/wp-json/wp/v2/pages/${ ids.schemes }` ) ).json() ).content.rendered
		await page.evaluate( html => {
			const div = document.createElement( 'div' )
			div.id = 'stk-added'
			div.innerHTML = html
			document.body.appendChild( div )
		}, rendered )
		expect( await readPageBlocks() ).toEqual( before )
	} finally {
		setSchemeOptions( false )
	}
} )
