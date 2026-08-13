import fs from 'fs'
import path from 'path'
import {
	test,
	expect,
	assertNoBlockRecovery,
	waitForBlockEditor,
} from 'e2e/test-utils'

const POST_CONTENT = fs.readFileSync(
	path.join( __dirname, '../config/post-content.txt' ),
	'utf8'
)

test( 'Existing Stackable blocks should have no errors', async ( {
	admin,
	editor,
	requestUtils,
	stackable,
} ) => {
	test.setTimeout( 180_000 )

	// Persist fixture HTML via REST as admin (unfiltered_html). Opening the
	// editor on that saved post is the recovery path we care about, not
	// inserting blocks or setContent in an already-open editor.
	const post = await requestUtils.createPost( {
		title: 'Existing Blocks Fixture',
		status: 'publish',
		content: POST_CONTENT,
	} )
	expect( post.id ).toBeTruthy()

	try {
		const stored = await requestUtils.rest( {
			path: `/wp/v2/posts/${ post.id }`,
			params: { context: 'edit' },
		} )
		expect( stored.content?.raw ).toContain( '<!-- wp:stackable/columns' )
		expect( stored.content?.raw ).toContain( '<style>' )

		await admin.editPost( String( post.id ) )
		await stackable.dismissToursAndNotices()
		await waitForBlockEditor( editor )
		await expect(
			editor.canvas.locator( '[data-type^="stackable/"]' ).first()
		).toBeVisible( { timeout: 60_000 } )
		await assertNoBlockRecovery( editor )
	} finally {
		await requestUtils.deletePost( post.id )
	}
} )
