/**
 * Visual check for CI: the new CSS loading (flag off) must style every
 * element the same as the legacy bundle (flag on), on the same site and
 * markup, in Twenty Twenty-Five and Twenty Twenty-One, at desktop, tablet and
 * mobile widths, and with global color schemes and custom breakpoints.
 * Catches rules that a block's stylesheet has for other blocks' markup (e.g.
 * the column sizes for the columns in an accordion, the default separator
 * color) that the per-block loading would leave out.
 *
 * Compares the computed styles of every element (pixel screenshots are too
 * noisy with animations and timers).
 */
const fs = require( 'fs' ),
	path = require( 'path' )
const { test, expect } = require( '@playwright/test' )
const {
	cfg, wp, wpEval, resetSite, createPage, FIX,
} = require( './lib/site' )
const { computedStyles, diffStyles } = require( './lib/computed' )

test.skip( cfg.isLegacyMode, 'compares the new loading (flag off) against the legacy bundle' )
test.describe.configure( { mode: 'serial' } )

const PAGES = [ 'benchmark', 'heading', 'accordion', 'columns', 'color-scheme', 'tabs', 'image', 'icon-list', 'card', 'carousel', 'separator', 'design-system' ]
const WIDTHS = [ 1440, 768, 375 ]
const ROOT = 'main'

const setLegacy = on => on ? wp( 'option', 'update', 'stackable_use_legacy_frontend_css', '1' ) : wp( 'option', 'delete', 'stackable_use_legacy_frontend_css' )
function setSchemeOptions() {
	const opts = JSON.parse( fs.readFileSync( path.join( FIX, 'color-scheme-options.json' ), 'utf8' ) )
	const json = Buffer.from( JSON.stringify( opts ) ).toString( 'base64' )
	wpEval( `foreach ( json_decode( base64_decode( '${ json }' ), true ) as $name => $value ) { update_option( $name, $value ); }` )
}

const ids = {}
test.beforeAll( async () => {
	await resetSite()
	for ( const p of PAGES ) {
		ids[ p ] = createPage( `vis-${ p }`, `${ p }.html` )
	}
} )

// Captures 4 pages at a time (the test server has 4 PHP workers).
async function captureAll( browser, theme ) {
	const jobs = []
	for ( const width of WIDTHS ) {
		for ( const p of PAGES ) {
			jobs.push( { width, p } )
		}
	}
	const out = {}
	const run = async () => {
		const context = await browser.newContext()
		const page = await context.newPage()
		for ( let job = jobs.shift(); job; job = jobs.shift() ) {
			await page.setViewportSize( { width: job.width, height: 900 } )
			await page.goto( `${ cfg.url }/?page_id=${ ids[ job.p ] }` )
			await page.waitForLoadState( 'load' )
			// Animations and transitions settle.
			await page.addStyleTag( { content: '*,*::before,*::after{transition:none!important;animation:none!important}' } )
			out[ `${ theme } ${ job.width } ${ job.p }` ] = await computedStyles( page, ROOT )
		}
		await context.close()
	}
	await Promise.all( [ run(), run(), run(), run() ] )
	return out
}

const scenarios = [
	{
		name: 'defaults', themes: [ 'twentytwentyfive', 'twentytwentyone' ], setup: () => {},
	},
	{
		name: 'color schemes and custom breakpoints', themes: [ 'twentytwentyfive' ], setup: () => {
			setSchemeOptions()
			wp( 'option', 'update', 'stackable_dynamic_breakpoints', '{"tablet":900,"mobile":600}', '--format=json' )
		},
	},
]

for ( const scenario of scenarios ) {
	for ( const theme of scenario.themes ) {
		test( `${ theme }, ${ scenario.name }: same computed styles as the legacy bundle`, async ( { browser } ) => {
			wp( 'theme', 'activate', theme )
			scenario.setup()
			setLegacy( true )
			const legacy = await captureAll( browser, theme )
			setLegacy( false )
			const current = await captureAll( browser, theme )
			const failures = []
			let elements = 0
			for ( const [ key, ref ] of Object.entries( legacy ) ) {
				expect( ref, `${ key } rendered` ).toBeTruthy()
				elements += Object.keys( ref ).length
				const d = diffStyles( ref, current[ key ] || {} )
				if ( d.length ) {
					failures.push( {
						page: key, diff: d.slice( 0, 5 ), count: d.length,
					} )
				}
			}
			test.info().annotations.push( { type: 'metric', description: `${ Object.keys( legacy ).length } page captures, ${ elements } elements, ${ failures.length } pages differ` } )
			expect( failures, JSON.stringify( failures, null, 1 ).slice( 0, 4000 ) ).toEqual( [] )
		} )
	}
}
