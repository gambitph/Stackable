/**
 * Which Stackable stylesheets get loaded for which page.
 *
 * New behavior (legacy flag off): only the CSS of the blocks on the page,
 * color scheme CSS only when a scheme is used, design system CSS only when the
 * global design system is set, the theme compatibility CSS of the active
 * theme, and CSS for blocks rendered late or over AJAX.
 *
 * Legacy flag on / old release: the single frontend_blocks.css bundle.
 */
const { test, expect } = require( '@playwright/test' )
const { cfg, resetSite, createPage, get, stkStyles, allCss, MARK, wp } = require( './lib/site' )

const legacy = cfg.isLegacyMode
const ids = {}

test.beforeAll( async () => {
	await resetSite()
	ids.heading = createPage( 'heading', 'heading.html' )
	ids.benchmark = createPage( 'benchmark', 'benchmark.html' )
	ids.accordion = createPage( 'accordion', 'accordion.html' )
	ids.columns = createPage( 'columns', 'columns.html' )
	ids.scheme = createPage( 'scheme', 'color-scheme.html' )
	ids.none = createPage( 'none', 'no-stackable.html' )
	ids.tabs = createPage( 'tabs-late', 'tabs.html', [ '--post_status=draft' ] )
} )

test.describe( 'assets per scenario', () => {
	test( 'page without Stackable blocks loads no Stackable CSS', async () => {
		const styles = await stkStyles( ( await get( '/none/' ) ).text )
		expect( styles.map( s => s.id ) ).toEqual( [] )
	} )

	test( 'heading only: heading CSS + shared CSS, no other block CSS', async () => {
		const styles = await stkStyles( ( await get( '/heading/' ) ).text )
		const css = allCss( styles )
		expect( css ).toMatch( MARK.heading )
		expect( css ).toMatch( MARK.core )
		if ( legacy ) {
			expect( styles.find( s => s.tag === 'link' && /dist\/frontend_blocks\.css$/.test( s.href ) ) ).toBeTruthy()
			expect( css ).toMatch( MARK.accordion )
		} else {
			expect( css ).not.toMatch( MARK.accordion )
			expect( css ).not.toMatch( MARK.tabs )
			expect( styles.find( s => s.tag === 'link' && /frontend_blocks\.css/.test( s.href || '' ) ) ).toBeFalsy()
		}
		// Everything we print for the blocks in the content is in the head.
		expect( styles.every( s => s.inHead ) ).toBe( true )
	} )

	test( 'accordion page gets the accordion CSS', async () => {
		const css = allCss( await stkStyles( ( await get( '/accordion/' ) ).text ) )
		expect( css ).toMatch( MARK.accordion )
	} )

	test( 'color scheme CSS only when a scheme is used', async () => {
		const none = allCss( await stkStyles( ( await get( '/benchmark/' ) ).text ) )
		const used = allCss( await stkStyles( ( await get( '/scheme/' ) ).text ) )
		expect( used ).toMatch( MARK.schemes )
		// The generated CSS of the scheme the block uses.
		expect( used ).toMatch( /stk--background-scheme--scheme-default-3/ )
		if ( legacy ) {
			expect( none ).toMatch( MARK.schemes )
		} else {
			// Fresh install: a default scheme exists but nothing on the page uses it.
			expect( none ).not.toMatch( MARK.schemes )
			expect( none ).not.toMatch( /stk--background-scheme--scheme-default-3/ )
		}
	} )

	test( 'design system CSS only when the global design system is set', async () => {
		const before = allCss( await stkStyles( ( await get( '/benchmark/' ) ).text ) )
		wp( 'option', 'update', 'stackable_global_spacing_and_borders', '{"container-padding":{"desktop":{"top":36,"right":32,"bottom":36,"left":32}}}', '--format=json' )
		try {
			const after = allCss( await stkStyles( ( await get( '/benchmark/' ) ).text ) )
			expect( after ).toMatch( MARK.designSystem )
			if ( ! legacy ) {
				expect( before ).not.toMatch( MARK.designSystem )
			}
		} finally {
			wp( 'option', 'delete', 'stackable_global_spacing_and_borders' )
		}
	} )

	test( 'theme compatibility CSS of the active theme only', async () => {
		const css = allCss( await stkStyles( ( await get( '/benchmark/' ) ).text ) )
		expect( css ).toMatch( MARK.themeTT5 )
		if ( ! legacy ) {
			expect( css ).not.toMatch( /stk--is-blocksy-theme|stk--is-astra-theme/ )
		}
	} )

	test( 'blocks rendered after the footer scripts still get their CSS (new behavior)', async () => {
		const html = ( await get( `/heading/?stk_late=${ ids.tabs }` ) ).text
		const late = html.slice( html.indexOf( 'id="stk-perf-late"' ) )
		expect( late.length ).toBeGreaterThan( 50 )
		const styles = await stkStyles( html )
		const css = allCss( styles )
		if ( legacy ) {
			// The old behavior didn't load CSS for blocks rendered this late.
			expect( css ).not.toMatch( MARK.tabs )
		} else {
			expect( css ).toMatch( MARK.tabs )
		}
	} )

	test( 'blocks rendered over admin-ajax carry their CSS (new behavior)', async () => {
		const html = ( await get( `/wp-admin/admin-ajax.php?action=stk_perf_ajax&post=${ ids.accordion }` ) ).text
		expect( html ).toContain( 'stk-block-accordion' )
		const css = allCss( await stkStyles( html ) )
		if ( legacy ) {
			expect( css ).toBe( '' )
		} else {
			expect( css ).toMatch( MARK.accordion )
			expect( css ).toMatch( MARK.core )
		}
	} )

	test( 'stackable_force_css_load loads the CSS of all blocks', async () => {
		const css = allCss( await stkStyles( ( await get( '/none/?stk_force=1' ) ).text ) )
		expect( css ).toMatch( MARK.accordion )
		expect( css ).toMatch( MARK.tabs )
		expect( css ).toMatch( MARK.columns )
	} )
} )
