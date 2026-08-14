/**
 * Playwright global setup: cookie-authenticates as the Playground blueprint
 * admin (admin / password) and persists storage state for specs + requestUtils.
 *
 * Writes e2e/.auth/test-env.json with STACKABLE_SLUG.
 */
const fs = require( 'fs/promises' )
const path = require( 'path' )
const { RequestUtils } = require( '@wordpress/e2e-test-utils-playwright' )

module.exports = async function globalSetup() {
	const storageStatePath = process.env.STORAGE_STATE_PATH
	const requestUtils = await RequestUtils.setup( {
		user: {
			username: process.env.WP_USERNAME || 'admin',
			password: process.env.WP_PASSWORD || 'password',
		},
		storageStatePath,
		baseURL: process.env.WP_BASE_URL,
	} )

	await requestUtils.setupRest()

	const authDir = path.dirname( storageStatePath || path.join( __dirname, '../.auth/admin.json' ) )
	await fs.mkdir( authDir, { recursive: true } )

	await fs.writeFile(
		path.join( authDir, 'test-env.json' ),
		JSON.stringify( {
			STACKABLE_SLUG: process.env.STACKABLE_SLUG || 'stackable/plugin',
		}, null, 2 )
	)
}
