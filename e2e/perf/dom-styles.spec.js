/**
 * DOM cost of Stackable's CSS on the DynamicWP benchmark page: the number of
 * <link>/<style> tags Stackable prints, and the total DOM node count over
 * WordPress without Stackable (DynamicWP counts document.getElementsByTagName('*')).
 */
const { test, expect } = require( '@playwright/test' )
const { cfg, resetSite, createPage, get, stkTags } = require( './lib/site' )

const legacy = cfg.isLegacyMode

test.beforeAll( async () => {
	await resetSite()
	createPage( 'benchmark', 'benchmark.html' )
	createPage( 'core-page', 'core.html' )
} )

test( 'Stackable style tags on the benchmark page', async () => {
	const html = ( await get( '/benchmark/' ) ).text
	const tags = stkTags( html ).filter( t => t.tag !== 'script' )
	test.info().annotations.push( { type: 'metric', description: `stk style tags: ${ tags.length } (${ tags.map( t => t.id ).join( ', ' ) })` } )
	if ( legacy ) {
		// Same as 3.20.3: the bundle, the responsive bundle and 2 inline style
		// tags (and the Premium bundle).
		expect( tags.length ).toBe( cfg.isPremium ? 5 : 4 )
	} else {
		// All of Stackable's static CSS in one tag.
		expect( tags.length ).toBeLessThanOrEqual( 1 )
	}
	expect( tags.every( t => t.inHead ) ).toBe( true )
} )

test( 'DOM nodes over core (DynamicWP method) @bench', async ( { browser } ) => {
	const count = async ( p, headers = {} ) => {
		const ctx = await browser.newContext( { extraHTTPHeaders: headers } )
		const page = await ctx.newPage()
		await page.goto( cfg.url + p, { waitUntil: 'load' } )
		const n = await page.evaluate( () => document.getElementsByTagName( '*' ).length )
		await ctx.close()
		return n
	}
	const stk = await count( '/benchmark/' )
	const core = await count( '/core-page/', { 'X-Stk-Perf-No-Stk': '1' } )
	test.info().annotations.push( { type: 'metric', description: `dom stk=${ stk } core=${ core } delta=${ stk - core }` } )
	// 3.20.3 is +10; the target is to not be worse than that.
	expect( stk - core ).toBeLessThanOrEqual( 10 )
} )
