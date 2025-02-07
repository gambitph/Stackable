// import { test, expect } from 'e2e/test-utils'

// test.describe( 'Site Editor', () => {
// 	let pid = null
// 	let postContentBlock = null

// 	test.beforeEach( async ( {
// 		page, admin, editor,
// 	} ) => {
// 		await admin.createNewPost( { title: 'Site Editor Test', postType: 'page' } )
// 		await editor.saveDraft()
// 		const postQuery = new URL( editor.page.url() ).search
// 		pid = new URLSearchParams( postQuery ).get( 'post' )

// 		await admin.visitSiteEditor( {
// 			canvas: 'edit', postType: 'page', postId: pid, showWelcomeGuide: false,
// 	   } )

// 	   if ( await page.getByRole( 'heading', { name: 'Choose a pattern' } ).isVisible() ) {
// 		   await page.getByLabel( 'Close', { exact: true } ).click()
// 	   }

// 		postContentBlock = ( await editor.getBlocks( { full: true } ) )
// 			.filter( block => block.attributes?.tagName === 'main' )[ 0 ].innerBlocks
// 			.filter( block => block.name === 'core/post-content' )[ 0 ]
// 	} )

// 	test.afterEach( async ( { requestUtils } ) => {
// 		await requestUtils.deletePost( pid, 'pages' )
// 	} )

// 	test( 'Stackable blocks can be added in the site editor', async ( {
// 		page,
// 		editor,
// 	} ) => {
// 		await page.getByLabel( 'Toggle block inserterx' ).click()
// 		await page.locator( '.editor-block-list-item-stackable-text' ).click()

// 		const blocks = await editor.getBlocks( { clientId: postContentBlock.clientId } )

// 		expect( blocks.find( block => block.name === 'stackable/text' ) ).toBeTruthy()
// 	} )

// 	test( 'Stackable Inspector Controls should show up upon clicking a Stackable block', async ( {
// 		page,
// 		editor,
// 	} ) => {
// 		await editor.insertBlock( {
// 			name: 'stackable/text',
// 		}, { clientId: postContentBlock.clientId } )

// 		await editor.selectBlocks( editor.canvas.getByLabel( 'Block: Text' ) )
// 		await expect( page.getByLabel( 'Layout Tabx' ) ).toBeVisible()
// 		await expect( page.getByLabel( 'Style Tab' ) ).toBeVisible()
// 		await expect( page.getByLabel( 'Advanced Tab' ) ).toBeVisible()
// 	} )

// 	test( 'A Stackable block\'s attributes should update when settings are changed in the Inspector Controls.', async ( {
// 		page,
// 		editor,
// 	} ) => {
// 		await editor.insertBlock( {
// 			name: 'stackable/text',
// 		}, { clientId: postContentBlock.clientId } )
// 		await editor.canvas.getByLabel( 'Type / to choose a block' ).fill( 'test' )
// 		await expect( page.locator( '#inspector-textarea-control-0' ) ).toContainText( 'test' )
// 		await page.locator( '.stk-color-palette-control .stk-control-content > .components-dropdown > .components-button' ).first().click()
// 		await page.getByLabel( 'Hex color' ).fill( 'ff0000' )
// 		await editor.canvas.locator( 'body' ).click()

// 		await expect( editor.canvas.locator( '[data-type="stackable/text"]' ) ).toContainText( 'test' )
// 		await expect( editor.canvas.locator( '[data-type="stackable/text"] > .stk-block-text > p[role="textbox"]' ) ).toHaveCSS( 'color', 'rgb(255, 0, 0)' )

// 		await editor.saveDraft()

// 		const blocks = await editor.getBlocks( { clientId: postContentBlock.clientId } )
// 		const textBlock = blocks.find( block => block.name === 'stackable/text' )
// 		expect( textBlock.attributes.text ).toBe( 'test' )
// 		expect( textBlock.attributes.textColor1 ).toBe( '#ff0000' )
// 	} )

// 	test( 'The Stackable block added in the site editor should be visible in the frontend', async ( {
// 		editor,
// 	} ) => {
// 		await editor.insertBlock( {
// 			name: 'stackable/text',
// 			attributes: {
// 				text: 'test',
// 				textColor1: '#ff0000',
// 			},
// 		}, { clientId: postContentBlock.clientId } )

// 		const blocks = await editor.getBlocks( { clientId: postContentBlock.clientId } )
// 		const uniqueId = blocks.find( block => block.name === 'stackable/text' ).attributes.uniqueId

// 		await editor.saveDraft()

// 		const preview = await editor.openPreviewPage()

// 		await expect( preview.locator( `[data-block-id="${ uniqueId }"]` ) ).toBeVisible()
// 		await expect( preview.locator( `[data-block-id="${ uniqueId }"]` ) ).toContainText( 'test' )
// 		await expect( preview.locator( `[data-block-id="${ uniqueId }"] p` ) ).toHaveCSS( 'color', 'rgb(255, 0, 0)' )
// 	} )
// } )

