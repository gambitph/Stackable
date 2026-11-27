/**
 * The legacy frontend CSS flag (stackable_use_legacy_frontend_css) and the
 * cost of Stackable's options on a page view.
 *
 * - Fresh install: new behavior, and the flag is stored (autoloaded) so reading
 *   it doesn't cost a query.
 * - Upgrade from 3.20.x: the flag turns on in the first request, autoloaded.
 * - Turning the flag off sticks.
 * - Query count on a simple page stays within a small budget over WordPress
 *   without Stackable (missing options must not cost one query each).
 */
const { test, expect } = require( '@playwright/test' )
const {
	cfg, resetSite, createPage, get, metrics, stkStyles, wp,
} = require( './lib/site' )

// The e2e Freemius license mock (Premium only) reads 1 option and deletes a
// transient twice per request; those queries aren't Stackable's.
const MOCK_QUERIES = cfg.isPremium && cfg.premiumMock ? 3 : 0
const QUERY_BUDGET = cfg.isPremium ? 3 : 2

const optionRow = name => {
	const out = wp( 'option', 'list', `--search=${ name }`, '--fields=option_name,option_value,autoload', '--format=json' )
	const rows = JSON.parse( out || '[]' )
	return rows.find( r => r.option_name === name ) || null
}
const isAutoload = a => [ 'yes', 'on', 'auto', 'auto-on' ].includes( String( a ) )
const usesBundle = styles => !! styles.find( s => s.tag === 'link' && /dist\/frontend_blocks\.css$/.test( s.href ) )

test.describe( 'legacy flag gating', () => {
	test.skip( cfg.legacy === 'release', 'the old release has no legacy flag' )

	test( 'fresh install uses the new behavior and stores the flag autoloaded', async () => {
		await resetSite( { legacy: 'off' } )
		createPage( 'benchmark', 'benchmark.html' )
		const styles = await stkStyles( ( await get( '/benchmark/' ) ).text )
		expect( usesBundle( styles ) ).toBe( false )
		const row = optionRow( 'stackable_use_legacy_frontend_css' )
		expect( row, 'flag stored on fresh install' ).not.toBeNull()
		expect( [ '', '0' ] ).toContain( row.option_value )
		expect( isAutoload( row.autoload ), `autoload=${ row.autoload }` ).toBe( true )
	} )

	test( 'upgrade from 3.20.3 turns the flag on (autoloaded) and keeps the old CSS', async () => {
		await resetSite( { legacy: 'off', upgradeFrom: '3.20.3' } )
		createPage( 'benchmark', 'benchmark.html' )
		const first = await stkStyles( ( await get( '/benchmark/' ) ).text )
		expect( usesBundle( first ), 'old behavior already in the first request' ).toBe( true )
		const row = optionRow( 'stackable_use_legacy_frontend_css' )
		expect( row ).not.toBeNull()
		expect( row.option_value ).toBe( '1' )
		expect( isAutoload( row.autoload ), `autoload=${ row.autoload }` ).toBe( true )
		expect( usesBundle( await stkStyles( ( await get( '/benchmark/' ) ).text ) ) ).toBe( true )
	} )

	test( 'turning the flag off after an upgrade sticks', async () => {
		await resetSite( { legacy: 'off', upgradeFrom: '3.20.3' } )
		createPage( 'benchmark', 'benchmark.html' )
		await get( '/benchmark/' )
		wp( 'option', 'update', 'stackable_use_legacy_frontend_css', '' )
		expect( usesBundle( await stkStyles( ( await get( '/benchmark/' ) ).text ) ) ).toBe( false )
		expect( usesBundle( await stkStyles( ( await get( '/benchmark/' ) ).text ) ) ).toBe( false )
		expect( optionRow( 'stackable_use_legacy_frontend_css' ).option_value ).toBe( '' )
	} )
} )

test.describe( 'options and queries', () => {
	test.beforeAll( async () => {
		await resetSite()
		createPage( 'benchmark', 'benchmark.html' )
		createPage( 'accordion', 'accordion.html' )
		// Warm up (first requests write generated CSS caches etc).
		for ( let i = 0; i < 3; i++ ) {
			await get( '/benchmark/' )
			await get( '/accordion/' )
		}
	} )

	test( `Stackable adds at most ${ QUERY_BUDGET } queries to a simple page`, async () => {
		const withStk = await metrics( '/benchmark/' )
		const without = await metrics( '/benchmark/', { 'X-Stk-Perf-No-Stk': '1' } )
		const delta = withStk.queries - without.queries - MOCK_QUERIES
		test.info().annotations.push( { type: 'metric', description: `queries with=${ withStk.queries } without=${ without.queries } mock=${ MOCK_QUERIES } delta=${ delta }` } )
		expect( delta ).toBeLessThanOrEqual( QUERY_BUDGET )
	} )

	test( 'more block types on the page do not add queries', async () => {
		const a = await metrics( '/benchmark/' )
		const b = await metrics( '/accordion/' )
		test.info().annotations.push( { type: 'metric', description: `benchmark=${ a.queries } accordion=${ b.queries }` } )
		expect( b.queries ).toBeLessThanOrEqual( a.queries + 1 )
	} )

	test( 'Stackable options read on the frontend are autoloaded or primed', async () => {
		// Every stackable_* option that exists must be autoloaded, except the
		// ones only used in the admin.
		const ADMIN_ONLY = [ 'stackable_activation_date', 'stackable_pro_notice_start_date', 'stackable_global_color_schemes_backup' ]
		const rows = JSON.parse( wp( 'option', 'list', '--search=stackable_*', '--fields=option_name,autoload', '--format=json' ) )
		const notAuto = rows.filter( r => ! isAutoload( r.autoload ) && ! ADMIN_ONLY.includes( r.option_name ) )
		expect( notAuto.map( r => r.option_name ) ).toEqual( [] )
	} )
} )
