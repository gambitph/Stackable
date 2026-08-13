/**
 * Playwright global setup: cookie-authenticates as the Playground blueprint
 * admin (admin / password) and persists storage state for specs + requestUtils.
 *
 * Resolves the "Existing Blocks" post ID from (in order):
 * 1. WP_TEST_POSTID env
 * 2. Blueprint-written e2e/.auth/seed-post.json
 * 3. REST search by exact title
 *
 * Writes e2e/.auth/test-env.json for existing-blocks.spec.ts.
 * In CI, missing fixture post ID fails closed so the suite cannot skip that check.
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

	let existingBlocksPostId = process.env.WP_TEST_POSTID || null

	if ( ! existingBlocksPostId ) {
		try {
			const seed = JSON.parse(
				await fs.readFile( path.join( authDir, 'seed-post.json' ), 'utf8' )
			)
			if ( seed.WP_TEST_POSTID ) {
				existingBlocksPostId = String( seed.WP_TEST_POSTID )
			}
		} catch {
			// Blueprint may not have written a seed file yet / older boots.
		}
	}

	if ( ! existingBlocksPostId ) {
		try {
			const posts = await requestUtils.rest( {
				path: '/wp/v2/posts',
				params: {
					search: 'Existing Blocks',
					status: 'publish',
					// REST query arg (WordPress API), not a JS identifier.
					// eslint-disable-next-line camelcase
					per_page: 10,
				},
			} )
			const match = ( posts || [] ).find( post => post.title?.rendered === 'Existing Blocks' )
			if ( match ) {
				existingBlocksPostId = String( match.id )
			}
		} catch ( error ) {
			// eslint-disable-next-line no-console
			console.warn( 'Could not resolve Existing Blocks post via REST:', error.message )
		}
	}

	if ( ! existingBlocksPostId && process.env.CI ) {
		throw new Error(
			'Existing Blocks fixture post ID was not seeded. Check playground-blueprint.json runPHP step.'
		)
	}

	await fs.writeFile(
		path.join( authDir, 'test-env.json' ),
		JSON.stringify( {
			WP_TEST_POSTID: existingBlocksPostId || undefined,
			STACKABLE_SLUG: process.env.STACKABLE_SLUG || 'stackable/plugin',
		}, null, 2 )
	)
}
