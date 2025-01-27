import { test, expect } from '@wordpress/e2e-test-utils-playwright'

test( 'Stackable blocks can be added in the editor', async ( {
	page,
	admin,
	editor,
} ) => {
	await admin.createNewPost()
	await page.getByLabel( 'Toggle block inserter' ).click()

	await page.locator( '.editor-block-list-item-stackable-text' ).click()

	const blocks = await editor.getBlocks()

	expect( blocks[ 0 ].name ).toContain( 'stackable/text' )
} )

test( 'Stackable Inspector Controls should show up upon clicking a Stackable block', async ( {
	page,
	admin,
	editor,
} ) => {
	await admin.createNewPost()

	await editor.insertBlock( {
		name: 'stackable/text',
	} )

	await editor.selectBlocks( page.locator( 'iframe[name="editor-canvas"]' ).contentFrame().getByLabel( 'Block: Text' ) )
	await expect( page.getByLabel( 'Layout Tab' ) ).toBeVisible()
	await expect( page.getByLabel( 'Style Tab' ) ).toBeVisible()
	await expect( page.getByLabel( 'Advanced Tab' ) ).toBeVisible()
} )

test( 'A Stackable block\'s attributes should update when settings are changed in the Inspector Controls.', async ( {
	page,
	admin,
	editor,
} ) => {
	await admin.createNewPost()

	await editor.insertBlock( {
		name: 'stackable/text',
	} )

	const editorCanvas = page.locator( 'iframe[name="editor-canvas"]' ).contentFrame()
	await editorCanvas.locator( '[data-type="stackable/text"] > .stk-block-text > p[role="textbox"]' ).fill( 'test' )
	await page.locator( '.stk-color-palette-control .stk-control-content > .components-dropdown > .components-button' ).first().click()
	await page.getByLabel( 'Hex color' ).fill( 'ff0000' )
	await editorCanvas.locator( 'body' ).click()

	await expect( editorCanvas.locator( '[data-type="stackable/text"]' ) ).toContainText( 'test' )
	await expect( editorCanvas.locator( '[data-type="stackable/text"] > .stk-block-text > p[role="textbox"]' ) ).toHaveCSS( 'color', 'rgb(255, 0, 0)' )

	await editor.saveDraft()

	const blocks = await editor.getBlocks()
	const attributes = blocks[ 0 ].attributes

	expect( attributes.textColor1 ).toBe( '#ff0000' )
	expect( attributes.text ).toBe( 'test' )
} )

test( 'The Stackable block added in the editor should be visible in the frontend', async ( {
	admin,
	editor,
} ) => {
	await admin.createNewPost()

	await editor.insertBlock( {
		name: 'stackable/text',
		attributes: {
			text: 'test',
			textColor1: '#ff0000',
		},
	} )

	const blocks = await editor.getBlocks()
	const uniqueId = blocks[ 0 ].attributes.uniqueId

	await editor.saveDraft()

	const preview = await editor.openPreviewPage()

	await expect( preview.locator( `[data-block-id="${ uniqueId }"]` ) ).toBeVisible()
	await expect( preview.locator( `[data-block-id="${ uniqueId }"]` ) ).toContainText( 'test' )
	await expect( preview.locator( `[data-block-id="${ uniqueId }"] p` ) ).toHaveCSS( 'color', 'rgb(255, 0, 0)' )
} )
