/**
 * How many Stackable <link>/<style> tags the benchmark page prints.
 */
const { test, expect } = require( '@playwright/test' )
const {
	cfg, resetSite, createPage, get, stkTags,
} = require( './lib/site' )

const legacy = cfg.isLegacyMode

test.beforeAll( async () => {
	await resetSite()
	createPage( 'benchmark', 'benchmark.html' )
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
