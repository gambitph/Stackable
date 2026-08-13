import { test, expect } from 'e2e/test-utils'
import {
	assertNoBlockRecovery,
	insertStackableCatalog,
	publishAndVisitFrontend,
	TOP_LEVEL_BLOCKS,
} from 'e2e/test-utils'
import {
	CURRENT_PLUGIN_SLUG,
	OLD_PLUGIN_SLUG,
	UPGRADE_FROM_VERSION,
} from '../config/upgrade-from.js'

test.describe( `Upgrade from Stackable ${ UPGRADE_FROM_VERSION }`, () => {
	test( 'blocks saved on the old version open without recovery UI', async ( {
		page,
		admin,
		editor,
		requestUtils,
		stackable,
	} ) => {
		test.setTimeout( 300_000 )
		await stackable.dismissToursAndNotices()

		await admin.createNewPost( { title: `Upgrade from ${ UPGRADE_FROM_VERSION }` } )
		await insertStackableCatalog( editor, TOP_LEVEL_BLOCKS )
		await editor.saveDraft()

		const postQuery = new URL( editor.page.url() ).search
		const postId = new URLSearchParams( postQuery ).get( 'post' )
		expect( postId ).toBeTruthy()

		await requestUtils.deactivatePlugin( OLD_PLUGIN_SLUG )
		await requestUtils.activatePlugin( CURRENT_PLUGIN_SLUG )

		// Activation may consume a one-shot Getting Started redirect.
		await admin.visitAdminPage( 'index.php' )
		await stackable.dismissToursAndNotices()

		await admin.editPost( postId )
		await stackable.dismissToursAndNotices()

		for ( const name of TOP_LEVEL_BLOCKS ) {
			await expect(
				editor.canvas.locator( `[data-type="${ name }"]` ).first()
			).toBeVisible( { timeout: 60_000 } )
		}

		await assertNoBlockRecovery( editor )

		await publishAndVisitFrontend( page, editor, requestUtils, admin )
		await expect( page.locator( '.stk-block' ).first() ).toBeVisible()
	} )
} )
