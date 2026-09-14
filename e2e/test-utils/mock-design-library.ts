/**
 * Browser-side Design Library REST mocks for Playwright.
 *
 * Complements the PHP `pre_http_request` CDN mock in
 * `e2e/config/stackable-e2e-mu-plugin.php`. Playwright routes still apply when
 * a reused local Playground was started without that MU-plugin mounted.
 */
import fs from 'fs'
import path from 'path'
import type { Page } from '@playwright/test'

const FIXTURES_DIR = path.join( __dirname, '../config/fixtures' )

const readFixture = ( name: string ) =>
	JSON.parse( fs.readFileSync( path.join( FIXTURES_DIR, name ), 'utf8' ) )

const patternsFixture = readFixture( 'design-library-patterns.json' )
const pagesFixture = readFixture( 'design-library-pages.json' )

/**
 * Intercept Design Library REST calls and fulfill with local fixtures.
 * Response shape matches PHP: `{ v4: { [id]: design } }`.
 *
 * @param page
 */
export const mockDesignLibraryRest = async ( page: Page ) => {
	await page.route( '**/stackable/v2/design_library/**', async route => {
		const url = decodeURIComponent( route.request().url() )
		const isPages = /\/design_library\/pages(?:\/|$|\?)/.test( url )
		const body = {
			v4: isPages ? pagesFixture : patternsFixture,
		}

		await route.fulfill( {
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify( body ),
		} )
	} )
}
