import { Page } from '@playwright/test'
import { test, expect } from 'e2e/test-utils'

test.describe( 'Block Editor', () => {
	let pid = null

	// Create Posts for testing
	test.beforeEach( async ( { editor, admin } ) => {
		await admin.createNewPost( { title: 'Block Editor Test' } )
		await editor.saveDraft()
		const postQuery = new URL( editor.page.url() ).search
		pid = new URLSearchParams( postQuery ).get( 'post' )
	} )

	// Delete created post
	test.afterEach( async ( { requestUtils } ) => {
		await requestUtils.deletePost( pid )
	} )

	test( 'Stackable blocks can be added in the editor', async ( {
		page,

		editor,
	} ) => {
		// Insert Stackable Text Block through block inserter
		// Also checks if Stackable Block is in the list of blocks in the Editor
		if ( await page.getByLabel( 'Toggle block inserter' ).isVisible() ) {
			// For WP version 6.7 and below
			await page.getByLabel( 'Toggle block inserter' ).click()
		} else {
			// For WP version 6.8
			await page.getByLabel( 'Block Inserter' ).click()
		}

		await page.locator( '.editor-block-list-item-stackable-text' ).click()

		await expect( editor.canvas.getByLabel( 'Block: Text' ) ).toBeVisible()
	} )

	test( 'Stackable Inspector Controls should show up upon clicking a Stackable block', async ( {
		page,
		editor,
	} ) => {
		await editor.insertBlock( {
			name: 'stackable/text',
		} )

		await editor.selectBlocks( editor.canvas.getByLabel( 'Block: Text' ) )

		const settings = page.getByLabel( 'Settings', { exact: true } )

		if ( await settings.getAttribute( 'aria-pressed' ) === 'false' ) {
			await settings.click()
		}

		await expect( page.getByLabel( 'Layout Tab' ) ).toBeVisible()
		await expect( page.getByLabel( 'Style Tab' ) ).toBeVisible()
		await expect( page.getByLabel( 'Advanced Tab' ) ).toBeVisible()
	} )

	test( 'A Stackable block\'s attributes should update when settings are changed in the Inspector Controls.', async ( {
		page,
		editor,
	} ) => {
		await editor.insertBlock( {
			name: 'stackable/text',
		} )

		const settings = page.getByLabel( 'Settings', { exact: true } )

		if ( await settings.getAttribute( 'aria-pressed' ) === 'false' ) {
			await settings.click()
		}

		// Add content and color to Stackable Text Block
		await editor.canvas.locator( '[data-type="stackable/text"] > .stk-block-text > p[role="textbox"]' ).fill( 'test' )
		await page.locator( '.stk-color-palette-control .stk-control-content > .components-dropdown > .components-button' ).first().click()
		await page.getByLabel( 'Hex color' ).fill( 'ff0000' )

		// Click on the body to close the Color Picker popup
		await editor.canvas.locator( 'body' ).click()

		// Verify if Text block contains correct content and color
		await expect( editor.canvas.locator( '[data-type="stackable/text"]' ) ).toContainText( 'test' )
		await expect( editor.canvas.locator( '[data-type="stackable/text"] > .stk-block-text > p[role="textbox"]' ) ).toHaveCSS( 'color', 'rgb(255, 0, 0)' )

		await editor.saveDraft()

		// Verify block attributes
		const clientId = await editor.canvas.getByLabel( 'Block: Text' ).getAttribute( 'data-block' )

		// Block attributes may not update immediately
		await expect( async () => {
			const attributes = await editor.getBlockAttributes( clientId )

			expect( attributes ).toHaveProperty( 'textColor1', '#ff0000' )
			expect( attributes ).toHaveProperty( 'text', 'test' )
		} ).toPass( { intervals: [ 1_000, 2_000, 5_000 ] } )
	} )

	test( 'The Stackable block added in the editor should be visible in the frontend', async ( {
		page, editor, admin,
	} ) => {
		await editor.insertBlock( {
			name: 'stackable/text',
		} )

		const settings = page.getByLabel( 'Settings', { exact: true } )

		if ( await settings.getAttribute( 'aria-pressed' ) === 'false' ) {
			await settings.click()
		}

		// Add content and color to Stackable Text Block
		await editor.canvas.locator( '[data-type="stackable/text"] > .stk-block-text > p[role="textbox"]' ).fill( 'test' )
		await page.locator( '.stk-color-palette-control .stk-control-content > .components-dropdown > .components-button' ).first().click()
		await page.getByLabel( 'Hex color' ).fill( 'ff0000' )

		// Click on the body to close the Color Picker popup
		await editor.canvas.locator( 'body' ).click()

		const clientId = await editor.canvas.getByLabel( 'Block: Text' ).getAttribute( 'data-block' )
		const uniqueId = ( await editor.getBlockAttributes( clientId ) ).uniqueId

		await editor.saveDraft()

		let preview : Page

		// openPreviewPage() from WordPress may fail as it relies on a button with a attribute name of 'view'
		// https://github.com/WordPress/gutenberg/blob/trunk/packages/e2e-test-utils-playwright/src/editor/preview.ts
		// Older versions of WordPress uses 'Preview' as the label for the Preview Button
		if ( await page.getByLabel( 'View', { exact: true } ).isVisible() ) {
			preview = await editor.openPreviewPage()
		} else {
			await page.getByLabel( 'Preview' ).click()
			const previewPromise = page.waitForEvent( 'popup' )
			await page.getByRole( 'menuitem', { name: 'Preview in new tab' } ).click()
			preview = await previewPromise
		}

		await expect( preview.locator( `[data-block-id="${ uniqueId }"]` ) ).toBeVisible()
		await expect( preview.locator( `[data-block-id="${ uniqueId }"]` ) ).toContainText( 'test' )
		await expect( preview.locator( `[data-block-id="${ uniqueId }"] p` ) ).toHaveCSS( 'color', 'rgb(255, 0, 0)' )

		// There should be no PHP errors on frontend
		const pageError = await admin.getPageError()
		expect( pageError ).toBeNull()
	} )
} )
