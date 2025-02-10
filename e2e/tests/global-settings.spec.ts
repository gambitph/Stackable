import { test, expect } from 'e2e/test-utils'
import { createColor, getRgb } from '~stackable/plugins/global-settings/colors/util'

test.describe( 'Global Settigs', () => {
	let pid = null

	// Create Posts for testing
	test.beforeEach( async ( { editor, admin } ) => {
		await admin.createNewPost( { title: 'Global Settings Test' } )
		await editor.saveDraft()
		const postQuery = new URL( editor.page.url() ).search
		pid = new URLSearchParams( postQuery ).get( 'post' )
	} )

	// Delete created post
	test.afterEach( async ( { requestUtils } ) => {
		await requestUtils.deletePost( pid )
	} )

	test( 'When a color is added in the Global Colors, it should be present in the color picker', async ( {
		page,
		editor,
	} ) => {
		await page.getByLabel( 'Stackable Settings' ).click()

		// Add a new Global Color
		const panel = page.locator( '.ugb-global-settings-color-picker ' ).filter( { hasText: 'Global Colors' } )
		await panel.locator( 'button.ugb-global-settings-color-picker__add-button' ).click()

		const globalColors = panel.locator( '.ugb-global-settings-color-picker__color-indicators > div' )
		const count = ( await globalColors.evaluate( node => Array.from( node.childNodes ) ) ).length

		// Verify if a new color is added to the list
		const newColor = globalColors.getByRole( 'button', { name: `Custom Color ${ count } ` } )
		await expect( newColor ).toBeVisible()

		// Get the value of the new global color
		await newColor.click()
		const hexValue = await page.getByLabel( 'Hex color' ).inputValue()

		await page.getByLabel( 'Settings', { exact: true } ).click()
		editor.insertBlock( {
			name: 'stackable/text',
			attributes: {
				text: 'test',
			},
		} )

		// Open the color picker
		await page.locator( '.stk-color-palette-control .stk-control-content > .components-dropdown > .components-button' ).first().click()

		// Verify the newly added global color is in the color picker
		await expect( page.getByRole( 'heading', { name: 'Global Colors' } ) ).toBeVisible()
		await expect( page.getByLabel( `Color: Custom Color ${ count }` ) ).toBeVisible()

		// Verify the color value
		await page.getByLabel( `Color: Custom Color ${ count }` ).click()
		await expect( page.getByLabel( 'Hex color' ) ).toHaveValue( hexValue )

		// Click on the color picker button to close the popup
		await page.locator( '.stk-color-palette-control .stk-control-content > .components-dropdown > .components-button' ).first().click()

		// Delete added Global Color
		await page.getByLabel( 'Stackable Settings' ).click()
		await panel.locator( `.ugb-global-settings-color-picker__color-indicators > div > div:nth-child(${ count }) > button.stk-global-settings-color-picker__delete-button` ).click()
	} )

	test( 'Global Typography Styles should be applied when adding a heading', async ( {
		page,
		editor,
	} ) => {
		await page.getByLabel( 'Stackable Settings' ).click()
		await page.getByRole( 'button', { name: 'Global Typography' } ).click()

		// Set Global Typography Styles of Heading 2 to have a font-size of 32
		await page.locator( '.ugb-global-settings-typography-control' ).nth( 1 ).locator( '.components-base-control__field > .ugb-button-icon-control__wrapper > .components-button' ).click()
		await page.locator( '.stk-popover .components-base-control:nth-of-type(2)', { hasText: /Size/ } ).getByRole( 'textbox' ).fill( '32' )
		await page.locator( '.ugb-global-settings-typography-control' ).nth( 1 ).locator( '.components-base-control__field > .ugb-button-icon-control__wrapper > .components-button' ).click()

		// Verify if the Heading 2 in Global Typography Styles has correct font size
		await expect( page.getByRole( 'heading', { name: 'Heading 2' } ) ).toHaveCSS( 'font-size', '32px' )

		// Open Block Settings
		await page.getByLabel( 'Settings', { exact: true } ).click()

		// Check if the added Stackable Heading Block has a font-size of 32
		editor.insertBlock( {
			name: 'stackable/heading',
			attributes: {
				text: 'test',
			},
		} )

		await expect( editor.canvas.locator( '[data-type="stackable/heading"] > .stk-block-heading > h2[role="textbox"]' ) ).toHaveCSS( 'font-size', '32px' )

		 // Reset Global Typography Styles
		 await page.getByLabel( 'Stackable Settings' ).click()
		 await page.locator( '.ugb-global-settings-typography-control' ).nth( 1 ).getByRole( 'button', { name: 'Reset' } ).click()
	} )

	test( 'When a default block is created, adding the block should have the default block\'s attributes', async ( {
		page,
		editor,
	} ) => {
		// Generate a color
		const color = createColor()

		await page.getByLabel( 'Stackable Settings' ).click()
		await page.getByRole( 'button', { name: 'Block Defaults' } ).click()

		// Open the Default Text Block Editor
		const defaultBlockPagePromise = page.waitForEvent( 'popup' )
		const textBlock = page.locator( '.components-panel__body', { hasText: 'Block Defaults' } ).locator( '.stk-block-default-control', { hasText: /^Text$/ } ).first().getByLabel( 'Edit' )
		await textBlock.click()
		const defaultBlockPage = await defaultBlockPagePromise

		// Set a color for the default Text Block
		await defaultBlockPage.locator( '.stk-color-palette-control .stk-control-content > .components-dropdown > .components-button' ).first().click()
		await defaultBlockPage.getByLabel( 'Hex color' ).fill( color )
		await defaultBlockPage.locator( '.stk-color-palette-control .stk-control-content > .components-dropdown > .components-button' ).first().click()

		// In older WP versions, the button text is 'Update' instead of 'Save'
		if ( await defaultBlockPage.getByRole( 'button', { name: 'Save', exact: true } ).isVisible() ) {
			await defaultBlockPage.getByRole( 'button', { name: 'Save', exact: true } ).click()
		} else {
			await defaultBlockPage.getByRole( 'button', { name: 'Update' } ).click()
		}

		await defaultBlockPage.close()

		// Insert a Stackable Text Block, and check if the color is the same as the one set in the default block
		await page.reload()
		await editor.insertBlock( {
			name: 'stackable/text',
			attributes: {
				text: 'test',
			},
		} )

		await expect( editor.canvas.locator( '[data-type="stackable/text"] > .stk-block-text > p[role="textbox"]' ) ).toHaveCSS( 'color', `rgb(${ getRgb( color ) })` )

		// Reset Default Block
		await page.getByLabel( 'Stackable Settings' ).click()
		await page.getByRole( 'button', { name: 'Block Defaults' } ).click()
		await page.locator( '.components-panel__body', { hasText: 'Block Defaults' } ).locator( '.stk-block-default-control', { hasText: /^Text$/ } ).first().getByLabel( 'Reset' ).click()
	} )
} )

