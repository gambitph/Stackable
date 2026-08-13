/**
 * Auth-only global setup for the upgrade suite.
 * Does not require the Existing Blocks fixture post.
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

	const authDir = path.dirname( storageStatePath || path.join( __dirname, '../.auth/admin.upgrade.json' ) )
	await fs.mkdir( authDir, { recursive: true } )
}
