// We defined this import path in the tsconfig.json.
import { test, expect } from '@wordpress/e2e-test-utils-playwright'
// import { test, expect } from './test-utils'

test.describe( 'New editor state', () => {
	test( 'content should load, making the post dirty', async ( {
		page,
		admin,
		editor,
	} ) => {
		await admin.visitAdminPage( 'post-new.php', 'gutenberg-demo' )

		// await admin.visitAdminPage( 'plugins.php' )
		// await admin.visitAdminPage( '/' )

		await expect( page ).toHaveTitle( /Stackable/ )

		// await editor.setPreferences( 'core/edit-site', {
		// 	welcomeGuide: false,
		// 	fullscreenMode: false,
		// } );

		// const isDirty = await page.evaluate( () => {
		// 	return window.wp.data.select( 'core/editor' ).isEditedPostDirty();
		// } );
		// expect( isDirty ).toBe( true );

		// await expect(
		// 	page
		// 		.getByRole( 'region', { name: 'Editor top bar' } )
		// 		.getByRole( 'button', { name: 'Save draft' } )
		// ).toBeEnabled();
	} )
} )
