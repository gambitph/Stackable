import { test, expect } from 'e2e/test-utils'
import {
	assertNoBlockRecovery,
	insertStackableCatalog,
	publishAndVisitFrontend,
	TOP_LEVEL_BLOCKS,
	getEditorPostId,
} from 'e2e/test-utils'

test.describe( 'Block catalog', () => {
	let pid = null

	test.afterEach( async ( { requestUtils } ) => {
		if ( ! pid ) {
			return
		}
		try {
			await requestUtils.deletePost( pid )
		} catch {
			// Best-effort cleanup.
		}
	} )

	test( 'every top-level Stackable block inserts, reloads, and renders without recovery UI', async ( {
		page,
		admin,
		editor,
		requestUtils,
	} ) => {
		test.setTimeout( 300_000 )
		await admin.createNewPost( { title: 'Block Catalog' } )
		await insertStackableCatalog( editor, TOP_LEVEL_BLOCKS )
		await editor.saveDraft()
		pid = getEditorPostId( editor.page )

		await page.reload()
		await expect(
			editor.canvas.locator( '[data-type^="stackable/"]' ).first()
		).toBeVisible( { timeout: 60_000 } )

		for ( const name of TOP_LEVEL_BLOCKS ) {
			await expect(
				editor.canvas.locator( `[data-type="${ name }"]` ).first()
			).toBeVisible()
		}

		await assertNoBlockRecovery( editor )
		await publishAndVisitFrontend( page, editor, requestUtils, admin )
		await expect( page.locator( '.stk-block' ).first() ).toBeVisible()
	} )
} )
