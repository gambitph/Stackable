/* eslint-disable jest/no-disabled-tests */
import { test, expect } from 'e2e/test-utils'

test.skip( process.env.WP_TEST_POSTID === undefined, 'For existing test page only' )

test( 'Existing Stackable blocks should have no errors', async ( {
	admin,
	editor,
} ) => {
	// Start listening on console errors for block validation
	const blockErrors = editor.getBlockErrors()

	await admin.editPost( process.env.WP_TEST_POSTID )

	expect( blockErrors ).toHaveLength( 0 )
} )
