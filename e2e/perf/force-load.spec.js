/**
 * The stackable_force_css_load filter: all block styles load and the rule
 * trimming is off, so Stackable markup added by scripts after load (which PHP
 * never saw) is styled the same as the same blocks rendered normally.
 *
 * Each case compares the computed styles of every Stackable element (keyed by
 * its unique id class) with the same request using the legacy bundle, which
 * has every rule (the styling before the CSS was split per block).
 */
const { test, expect } = require( '@playwright/test' )
const fs = require( 'fs' ), path = require( 'path' )
const { cfg, wp, wpEval, resetSite, createPage, FIX } = require( './lib/site' )

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

async function styles( page, url, root ) {
	await page.goto( cfg.url + url )
	// The injected-block loader adds its <link>s when the browser is idle.
	await page.waitForTimeout( 300 )
	await page.waitForLoadState( 'networkidle' )
	return page.evaluate( ( { root, PROPS } ) => {
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
			out[ key ] = PROPS.map( p => cs.getPropertyValue( p ) ).join( ';' )
		}
		return out
	}, { root, PROPS } )
}

function differences( a, b ) {
	const keys = Object.keys( a ).filter( k => k in b )
	return { compared: keys.length, diff: keys.filter( k => a[ k ] !== b[ k ] ).map( k => ( { el: k, rendered: a[ k ], injected: b[ k ] } ) ) }
}

const setLegacy = on => on ? wp( 'option', 'update', 'stackable_use_legacy_frontend_css', '1' ) : wp( 'option', 'delete', 'stackable_use_legacy_frontend_css' )

// Reference for injected markup: the same request with the legacy bundle.
async function legacyRef( page, query, root ) {
	if ( cfg.isLegacyMode ) {
		return styles( page, `/?page_id=${ ids.host }&${ query }`, root )
	}
	setLegacy( true )
	try {
		return await styles( page, `/?page_id=${ ids.host }&${ query }`, root )
	} finally {
		setLegacy( false )
	}
}

async function compare( page, query, { lateRoot } = {} ) {
	const root = lateRoot || '#stk-perf-injected'
	const ref = await legacyRef( page, query, root )
	const got = await styles( page, `/?page_id=${ ids.host }&${ query }`, root )
	expect( got, 'injected markup on the page' ).toBeTruthy()
	const d = differences( ref, got )
	test.info().annotations.push( { type: 'metric', description: `${ query }: ${ d.compared } elements, ${ d.diff.length } differ ${ JSON.stringify( d.diff.slice( 0, 3 ) ).slice( 0, 600 ) }` } )
	expect( d.compared ).toBeGreaterThan( 20 )
	return d
}

test.describe.configure( { mode: 'serial' } )

test.beforeAll( async () => {
	await resetSite()
	const content = INJECT.map( f => fs.readFileSync( path.join( FIX, f ), 'utf8' ) ).join( '\n\n' )
	const tmp = path.join( require( 'os' ).tmpdir(), `stk-force-load-${ process.pid }.html` )
	fs.writeFileSync( tmp, content )
	ids.ref = createPage( 'force-ref', tmp )
	ids.host = createPage( 'force-host', 'heading.html' )
	ids.schemes = createPage( 'force-schemes', 'design-system.html' )
} )

test( 'without the injected-block loader, injected markup misses styles (shows the test can tell)', async ( { page } ) => {
	test.skip( cfg.isLegacyMode, 'the legacy bundle always has every block style' )
	const d = await compare( page, `stk_no_loader=1&stk_inject=${ ids.ref }` )
	expect( d.diff.length ).toBeGreaterThan( 0 )
} )

test( 'injected markup (e.g. HTML copied from another page) is styled by the injected-block loader @ci', async ( { page } ) => {
	const d = await compare( page, `stk_inject=${ ids.ref }` )
	expect( d.diff ).toEqual( [] )
} )

test( 'the injected-block loader also loads the color scheme rules @ci', async ( { page } ) => {
	setSchemeOptions( true )
	try {
		const d = await compare( page, `stk_inject=${ ids.schemes }` )
		expect( d.diff ).toEqual( [] )
	} finally {
		setSchemeOptions( false )
	}
} )

test( 'with the filter, injected markup is styled', async ( { page } ) => {
	const d = await compare( page, `stk_force=1&stk_inject=${ ids.ref }` )
	expect( d.diff ).toEqual( [] )
} )

test( 'with the filter, blocks rendered late (widgets, dynamic content) are styled', async ( { page } ) => {
	const d = await compare( page, `stk_force=1&stk_late=${ ids.ref }`, { lateRoot: '#stk-perf-late' } )
	expect( d.diff ).toEqual( [] )
} )

test( 'with the filter and custom breakpoints, responsive rules match at tablet and mobile widths', async ( { page } ) => {
	wp( 'option', 'update', 'stackable_dynamic_breakpoints', '{"tablet":900,"mobile":600}', '--format=json' )
	try {
		for ( const width of [ 850, 560 ] ) {
			await page.setViewportSize( { width, height: 900 } )
			const d = await compare( page, `stk_force=1&stk_inject=${ ids.ref }` )
			expect( d.diff, `at ${ width }px` ).toEqual( [] )
		}
	} finally {
		wp( 'option', 'delete', 'stackable_dynamic_breakpoints' )
	}
} )

for ( const base of [ true, false ] ) {
	test( `with the filter and global color schemes (${ base ? 'with' : 'without' } a base scheme), injected markup gets the scheme colors`, async ( { page } ) => {
		setSchemeOptions( true, { base } )
		try {
			await page.goto( `${ cfg.url }/?page_id=${ ids.host }` )
			expect( await page.evaluate( () => document.body.classList.contains( 'stk--has-base-scheme' ) ) ).toBe( base )
			const d = await compare( page, `stk_force=1&stk_inject=${ ids.schemes }` )
			expect( d.diff ).toEqual( [] )
			const late = await compare( page, `stk_force=1&stk_late=${ ids.schemes }`, { lateRoot: '#stk-perf-late' } )
			expect( late.diff ).toEqual( [] )
		} finally {
			setSchemeOptions( false )
		}
	} )
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
