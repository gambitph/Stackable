/**
 * Benchmark budget, DynamicWP method (https://dynamicwp.co/performance-of-third-party-blocks-and-core-compared/):
 * the "Test Page" (container, heading, text, button) built with Stackable,
 * compared with the same page built with core blocks on WordPress without
 * Stackable. Twenty Twenty-Five, fresh install, logged out.
 *
 * - Page size: decoded bytes of every request (DevTools "resources"), cache off.
 * - DOM nodes: document.getElementsByTagName('*').length
 * - Queries and peak memory: from the stk-perf mu-plugin (logged out). Run the
 *   server with STK_PERF_OPCACHE=0 for the article-comparable memory numbers.
 *
 * Budgets are the round-2 targets for Stackable Pro: page +6 kB, queries +2,
 * DOM +10, memory +4 MB.
 */
const { test, expect } = require( '@playwright/test' )
const { cfg, resetSite, createPage, get, metrics } = require( './lib/site' )

const BUDGET = {
	pageKB: parseFloat( process.env.STK_PERF_BUDGET_PAGE || '6' ),
	queries: parseFloat( process.env.STK_PERF_BUDGET_QUERIES || '2' ),
	dom: parseFloat( process.env.STK_PERF_BUDGET_DOM || '10' ),
	memMB: parseFloat( process.env.STK_PERF_BUDGET_MEM || '4' ),
}
const MOCK_QUERIES = cfg.isPremium && cfg.premiumMock ? 3 : 0
const RUNS = 3
const median = a => a.slice().sort( ( x, y ) => x - y )[ Math.floor( a.length / 2 ) ]
const results = {}

async function netRun( browser, p, headers ) {
	const ctx = await browser.newContext( { viewport: { width: 1440, height: 900 }, extraHTTPHeaders: headers } )
	const page = await ctx.newPage()
	const cdp = await ctx.newCDPSession( page )
	await cdp.send( 'Network.enable' )
	await cdp.send( 'Network.setCacheDisabled', { cacheDisabled: true } )
	const R = {}
	cdp.on( 'Network.requestWillBeSent', e => {
		R[ e.requestId ] = { url: e.request.url, decoded: 0 }
	} )
	cdp.on( 'Network.dataReceived', e => {
		if ( R[ e.requestId ] ) {
			R[ e.requestId ].decoded += e.dataLength
		}
	} )
	await page.goto( cfg.url + p, { waitUntil: 'load' } )
	await page.waitForLoadState( 'networkidle' )
	await page.waitForTimeout( 300 )
	const dom = await page.evaluate( () => document.getElementsByTagName( '*' ).length )
	await ctx.close()
	const res = Object.values( R ).filter( r => ! /favicon\.ico|w-logo-blue-white-bg\.png/.test( r.url ) )
	return { dom, decoded: res.reduce( ( a, r ) => a + r.decoded, 0 ) }
}

// A failed test restarts the worker and runs beforeAll again; reuse the
// measurements of this run instead of measuring again.
const CACHE = process.env.STK_PERF_RUN_ID ? require( 'path' ).join( require( 'os' ).tmpdir(), `stk-perf-bench-${ process.env.STK_PERF_RUN_ID }.json` ) : ''

test.beforeAll( async ( { browser } ) => {
	if ( CACHE && require( 'fs' ).existsSync( CACHE ) ) {
		Object.assign( results, JSON.parse( require( 'fs' ).readFileSync( CACHE, 'utf8' ) ) )
		return
	}
	await resetSite()
	createPage( 'test-page', 'benchmark.html' )
	createPage( 'core-test-page', 'core.html' )
	const noStk = { 'X-Stk-Perf-No-Stk': '1' }
	for ( let i = 0; i < 3; i++ ) {
		await get( '/test-page/' )
		await get( '/core-test-page/', noStk )
	}
	const s = { page: [], dom: [], q: [], mem: [] }
	const c = { page: [], dom: [], q: [], mem: [] }
	for ( let i = 0; i < RUNS; i++ ) {
		const a = await netRun( browser, '/test-page/', {} )
		const b = await netRun( browser, '/core-test-page/', noStk )
		s.page.push( a.decoded ); s.dom.push( a.dom ); c.page.push( b.decoded ); c.dom.push( b.dom )
		const ma = await metrics( '/test-page/' ), mb = await metrics( '/core-test-page/', noStk )
		s.q.push( ma.queries ); s.mem.push( ma.peak ); c.q.push( mb.queries ); c.mem.push( mb.peak )
	}
	results.pageKB = ( median( s.page ) - median( c.page ) ) / 1000
	results.dom = median( s.dom ) - median( c.dom )
	results.queries = median( s.q ) - median( c.q ) - MOCK_QUERIES
	results.memMB = ( median( s.mem ) - median( c.mem ) ) / 1048576
	results.raw = { stk: s, core: c, opcache: cfg.opcache, mockQueries: MOCK_QUERIES }
	console.log( 'benchmark deltas', JSON.stringify( results ) )
	if ( CACHE ) {
		require( 'fs' ).writeFileSync( CACHE, JSON.stringify( results ) )
	}
} )

test( `page size within +${ BUDGET.pageKB } kB @bench`, async () => {
	test.info().annotations.push( { type: 'metric', description: `page delta ${ results.pageKB.toFixed( 1 ) } kB` } )
	expect( results.pageKB ).toBeLessThanOrEqual( BUDGET.pageKB )
} )
test( `queries within +${ BUDGET.queries } @bench`, async () => {
	test.info().annotations.push( { type: 'metric', description: `queries delta ${ results.queries }` } )
	expect( results.queries ).toBeLessThanOrEqual( BUDGET.queries )
} )
test( `DOM nodes within +${ BUDGET.dom } @bench`, async () => {
	test.info().annotations.push( { type: 'metric', description: `dom delta ${ results.dom }` } )
	expect( results.dom ).toBeLessThanOrEqual( BUDGET.dom )
} )
test( `peak memory within +${ BUDGET.memMB } MB @bench`, async () => {
	test.info().annotations.push( { type: 'metric', description: `memory delta ${ results.memMB.toFixed( 2 ) } MB (opcache ${ cfg.opcache })` } )
	expect( results.memMB ).toBeLessThanOrEqual( BUDGET.memMB )
} )
