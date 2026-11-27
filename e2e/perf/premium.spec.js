/**
 * Premium: block stylesheet handles, Freemius queries and memory on the frontend.
 */
const { test, expect } = require( '@playwright/test' )
const {
	cfg, resetSite, createPage, get, metrics, stkStyles, allCss, wpEval,
} = require( './lib/site' )

test.skip( ! cfg.isPremium, 'Premium build only' )

const legacy = cfg.isLegacyMode
// The e2e license mock deletes the Freemius activation transient twice per request.
const isMockQuery = q => /_transient_fs_plugin_stackable-ultimate-gutenberg-blocks_activated|stk_e2e_simulate_dc_integration/.test( q )

test.beforeAll( async () => {
	await resetSite()
	createPage( 'card', 'card.html' )
	createPage( 'benchmark', 'benchmark.html' )
	createPage( 'dynamic-content', 'dynamic-content.html' )
	createPage( 'conditional-display', 'conditional-display.html' )
	for ( let i = 0; i < 3; i++ ) {
		await get( '/benchmark/' )
	}
} )

test( 'free blocks keep their own stylesheet handles (Premium does not override them)', async () => {
	const out = wpEval( `
		do_action( 'wp_enqueue_scripts' );
		$r = WP_Block_Type_Registry::get_instance();
		echo wp_json_encode( array(
			'heading' => $r->get_registered( 'stackable/heading' )->style_handles,
			'card' => $r->get_registered( 'stackable/card' )->style_handles,
		) );
	` )
	const h = JSON.parse( out )
	test.info().annotations.push( { type: 'metric', description: JSON.stringify( h ) } )
	if ( legacy ) {
		expect( h.heading.length ).toBeGreaterThan( 0 )
	} else {
		expect( h.heading ).toEqual( [ 'stk-block-heading' ] )
		expect( h.card ).toContain( 'stk-block-card' )
		expect( h.card.some( x => /premium/.test( x ) ) ).toBe( true )
	}
} )

test( 'card page gets the Premium card CSS, benchmark page gets no Premium CSS', async () => {
	const card = allCss( await stkStyles( ( await get( '/card/' ) ).text ) )
	const bench = allCss( await stkStyles( ( await get( '/benchmark/' ) ).text ) )
	expect( card ).toMatch( /\.stk-block-card\.is-style-horizontal/ )
	if ( ! legacy ) {
		expect( bench ).not.toMatch( /\.stk-block-card\.is-style-horizontal/ )
	}
} )

test( 'no Freemius queries on a frontend page view', async () => {
	const m = await metrics( '/benchmark/' )
	const fs = m.query_log.filter( q => /\bfs_|freemius/i.test( q ) && ! isMockQuery( q ) )
	test.info().annotations.push( { type: 'metric', description: `freemius queries: ${ fs.length } ${ fs.join( ' | ' ).slice( 0, 400 ) }` } )
	expect( fs ).toEqual( [] )
} )

test( 'Premium memory over WordPress without Stackable within +4 MB @bench', async () => {
	const a = [],
		b = []
	for ( let i = 0; i < 3; i++ ) {
		a.push( ( await metrics( '/benchmark/' ) ).peak )
		b.push( ( await metrics( '/benchmark/', { 'X-Stk-Perf-No-Stk': '1' } ) ).peak )
	}
	const med = x => x.sort( ( p, q ) => p - q )[ 1 ]
	const delta = ( med( a ) - med( b ) ) / 1048576
	test.info().annotations.push( { type: 'metric', description: `premium memory delta ${ delta.toFixed( 2 ) } MB (opcache ${ cfg.opcache })` } )
	expect( delta ).toBeLessThanOrEqual( 4 )
} )

// Dynamic content and conditional display PHP is loaded only when a block uses them (round 2).
test( 'dynamic content is still replaced in the frontend', async () => {
	const html = ( await get( '/dynamic-content/' ) ).text
	expect( html ).toContain( 'DYNA[dynamic-content]' )
	expect( html ).toContain( 'DYNB[dynamic-content]' )
	expect( html ).not.toContain( '!#stk_dynamic/' )
} )

test( 'conditional display still hides and shows blocks in the frontend', async () => {
	const html = ( await get( '/conditional-display/' ) ).text
	expect( html ).not.toContain( 'CD-LOGGED-IN-ONLY' )
	expect( html ).toContain( 'CD-LOGGED-OUT-ONLY' )
} )
