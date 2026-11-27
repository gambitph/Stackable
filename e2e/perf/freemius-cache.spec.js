/**
 * Premium: the frontend Freemius license cache follows license changes made
 * in the admin right away (no waiting for the 1-day TTL).
 */
const { test, expect } = require( '@playwright/test' )
const { cfg, wp, resetSite, get } = require( './lib/site' )

test.skip( ! cfg.isPremium || ! cfg.premiumMock, 'Premium build with the e2e license mock only' )
test.describe.configure( { mode: 'serial' } )

async function frontendLicense() {
	const html = ( await get( '/', { 'X-Stk-Perf-License': '1' } ) ).text
	const m = html.match( /<!-- stk-license (\{.*?\}) -->/ )
	expect( m, 'license probe printed' ).toBeTruthy()
	return JSON.parse( m[ 1 ] )
}

async function adminPage( headers = {} ) {
	const r = await fetch( cfg.url + '/wp-admin/index.php', { headers: { 'X-Stk-Perf-Admin': '1', ...headers }, redirect: 'manual' } )
	await r.text()
	expect( r.status ).toBeLessThan( 400 )
}

const cache = () => {
	try {
		return JSON.parse( wp( 'option', 'get', 'stackable_freemius_frontend_cache', '--format=json' ) )
	} catch ( e ) {
		return null
	}
}

test.beforeAll( async () => {
	await resetSite()
	wp( 'option', 'update', 'stk_perf_license_off', '1' )
	await adminPage() // Warm the cache with no license.
} )

test( 'starts from the cache, with no license', async () => {
	expect( cache().can_use_premium_code ).toBe( false )
	const l = await frontendLicense()
	expect( l ).toEqual( { stub: true, can_use: false } )
} )

test( 'activating the license (Freemius after_license_activation) updates the frontend on the next request', async () => {
	wp( 'option', 'delete', 'stk_perf_license_off' )
	await adminPage( { 'X-Stk-Perf-Fs-Action': 'after_license_activation' } )
	expect( await frontendLicense() ).toEqual( { stub: true, can_use: true } )
} )

test( 'deactivating the license (after_license_deactivation) updates the frontend on the next request', async () => {
	wp( 'option', 'update', 'stk_perf_license_off', '1' )
	await adminPage( { 'X-Stk-Perf-Fs-Action': 'after_license_deactivation' } )
	expect( await frontendLicense() ).toEqual( { stub: true, can_use: false } )
} )

test( 'a plain admin page load refreshes the cache (license changed elsewhere)', async () => {
	wp( 'option', 'delete', 'stk_perf_license_off' )
	expect( ( await frontendLicense() ).can_use ).toBe( false ) // Not seen until the SDK loads.
	await adminPage()
	expect( cache().can_use_premium_code ).toBe( true )
	expect( await frontendLicense() ).toEqual( { stub: true, can_use: true } )
} )
