/* eslint-disable jest/no-disabled-tests */
import fs from 'fs'
import path from 'path'
import { test, expect } from 'e2e/test-utils'

const readSeededPostId = () => {
	if ( process.env.WP_TEST_POSTID ) {
		return process.env.WP_TEST_POSTID
	}
	try {
		const envPath = path.join( __dirname, '../.auth/test-env.json' )
		const env = JSON.parse( fs.readFileSync( envPath, 'utf8' ) )
		return env.WP_TEST_POSTID
	} catch {
		return undefined
	}
}

const postId = readSeededPostId()

test.skip( postId === undefined, 'Existing Blocks post not seeded by Playground blueprint' )

test( 'Existing Stackable blocks should have no errors', async ( {
	admin,
	editor,
} ) => {
	// Start listening on console errors for block validation
	const blockErrors = editor.getBlockErrors()

	await admin.editPost( postId )

	expect( blockErrors ).toHaveLength( 0 )
} )
