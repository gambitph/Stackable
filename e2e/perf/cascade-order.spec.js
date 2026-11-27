/**
 * Cascade order of the split frontend CSS on real pages (block and classic
 * themes, late and AJAX rendered blocks): whatever subset of rules a page
 * gets, the rules keep the order they have in the canonical stylesheet order.
 * Only for the new behavior; with the legacy flag on, the page must use the
 * old bundle (see legacy-identical.spec.js).
 */
const { test, expect } = require( '@playwright/test' )
const { cfg, resetSite, createPage, get, stkStyles, allCss, wp } = require( './lib/site' )
const { canonical, check } = require( './lib/cascade' )

test.skip( cfg.isLegacyMode, 'new behavior only' )

const PAGES = [ 'benchmark', 'heading', 'accordion', 'columns', 'scheme', 'tabs', 'image', 'icon-list' ]
const FIXTURE = { scheme: 'color-scheme.html' }
const ids = {}

test.beforeAll( async () => {
	await resetSite()
	for ( const p of PAGES ) {
		ids[ p ] = createPage( p, FIXTURE[ p ] || `${ p }.html` )
	}
	wp( 'option', 'update', 'stackable_global_spacing_and_borders', '{"container-padding":{"desktop":{"top":36,"right":32,"bottom":36,"left":32}}}', '--format=json' )
} )

for ( const theme of [ 'twentytwentyfive', 'twentytwentyone' ] ) {
	test.describe( theme, () => {
		let canon
		test.beforeAll( () => {
			wp( 'theme', 'activate', theme )
			canon = canonical( cfg.plugin, { theme } )
		} )
		for ( const p of PAGES ) {
			test( `${ p } keeps the canonical rule order`, async () => {
				const css = allCss( await stkStyles( ( await get( `/${ p }/` ) ).text ) )
				const r = check( css, canon )
				test.info().annotations.push( { type: 'metric', description: `known=${ r.known } unknown=${ r.unknown } inversions=${ r.inversions.length }` } )
				expect( r.known ).toBeGreaterThan( 0 )
				expect( r.inversions ).toEqual( [] )
			} )
		}
		test( 'late rendered blocks keep the canonical rule order', async () => {
			const css = allCss( await stkStyles( ( await get( `/heading/?stk_late=${ ids.tabs }` ) ).text ) )
			expect( check( css, canon ).inversions ).toEqual( [] )
		} )
	} )
}
