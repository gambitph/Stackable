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
		await page.getByLabel( 'Toggle block inserter' ).click()

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

		// Add content and color to Stackable Text Block
		await editor.canvas.locator( '[data-type="stackable/text"] > .stk-block-text > p[role="textbox"]' ).fill( 'test' )
		await page.locator( '.stk-color-palette-control .stk-control-content > .components-dropdown > .components-button' ).first().click()
		await page.getByLabel( 'Hex color' ).fill( 'ff0000' )
		await editor.canvas.locator( 'body' ).click()

		await expect( editor.canvas.locator( '[data-type="stackable/text"]' ) ).toContainText( 'test' )
		await expect( editor.canvas.locator( '[data-type="stackable/text"] > .stk-block-text > p[role="textbox"]' ) ).toHaveCSS( 'color', 'rgb(255, 0, 0)' )

		await editor.saveDraft()

		await page.waitForFunction(
			() => window?.wp?.blocks && window?.wp?.data
		)

		const clientId = await editor.canvas.getByLabel( 'Block: Text' ).getAttribute( 'data-block' )

		const attributes = await page.evaluate( async ( [ _clientId ] ) => {
			return await window.wp.data.select( 'core/block-editor' ).getBlockAttributes( _clientId )
		}, [ clientId ] )

		expect( attributes ).toHaveAttribute( 'textColor1', '#ff0000' )
		expect( attributes ).toHaveAttribute( 'text', 'test' )
	} )

	test( 'The Stackable block added in the editor should be visible in the frontend', async ( {
		page, editor,
	} ) => {
		await editor.insertBlock( {
			name: 'stackable/text',
			attributes: {
				text: 'test',
				textColor1: '#ff0000',
			},
		} )

		await page.waitForFunction(
			() => window?.wp?.blocks && window?.wp?.data
		)

		const clientId = await editor.canvas.getByLabel( 'Block: Text' ).getAttribute( 'data-block' )

		const attributes = await page.evaluate( async ( [ _clientId ] ) => {
			return await window.wp.data.select( 'core/block-editor' ).getBlockAttributes( _clientId )
		}, [ clientId ] )

		const uniqueId = attributes.uniqueId

		await editor.saveDraft()

		const preview = await editor.openPreviewPage()

		await expect( preview.locator( `[data-block-id="${ uniqueId }"]` ) ).toBeVisible()
		await expect( preview.locator( `[data-block-id="${ uniqueId }"]` ) ).toContainText( 'test' )
		await expect( preview.locator( `[data-block-id="${ uniqueId }"] p` ) ).toHaveCSS( 'color', 'rgb(255, 0, 0)' )
	} )
} )

