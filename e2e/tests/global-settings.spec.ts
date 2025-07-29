import { test, expect } from 'e2e/test-utils'

test.describe( 'Global Settings', () => {
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
		await page.getByLabel( 'Stackable Design System' ).click()
		await page.getByRole( 'button', { name: 'Global Color Palette' } ).click()

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

		// For WP 6.7 and below, the label for colors has a prefix `Color: `
		// For WP 6.8 the prefix was removed.
		const regex = new RegExp( `^(?:Color:\\s*)?Custom Color ${ count }$` )

		await expect( page.getByLabel( regex ) ).toBeVisible()

		// Verify the color value
		await page.getByLabel( regex ).click()
		await expect( page.getByLabel( 'Hex color' ) ).toHaveValue( hexValue )

		// Click on the color picker button to close the popup
		await page.locator( '.stk-color-palette-control .stk-control-content > .components-dropdown > .components-button' ).first().click()

		// Delete added Global Color
		await page.getByLabel( 'Stackable Design System' ).click()

		page.on( 'dialog', async dialog => await dialog.accept() )
		const deleteRequest = page.waitForResponse( response => response.url().includes( 'wp/v2/settings' ) && response.request().method() === 'POST' )

		await globalColors.getByLabel( 'Delete' ).nth( count - 1 ).click()

		await deleteRequest
		const _count = ( await globalColors.evaluate( node => Array.from( node.childNodes ) ) ).length
		expect( _count ).toBeLessThan( count )
	} )

	test( 'Global Typography Styles should be applied when adding a heading', async ( {
		page,
		editor,
	} ) => {
		await page.getByLabel( 'Stackable Design System' ).click()
		await page.getByRole( 'button', { name: 'Global Typography' } ).click()

		// Set Global Typography Styles of Heading 2 to have a text-transform uppercase
		await page.locator( '.ugb-global-settings-typography-control' ).nth( 1 ).locator( '.components-base-control__field > .ugb-button-icon-control__wrapper > .components-button' ).click()
		await page.locator( '.stk-popover .components-base-control:nth-of-type(4)', { hasText: /Transform/ } ).getByRole( 'listbox' ).selectOption( 'uppercase' )
		await page.locator( '.ugb-global-settings-typography-control' ).nth( 1 ).locator( '.components-base-control__field > .ugb-button-icon-control__wrapper > .components-button' ).click()

		// Verify if the Heading 2 in Global Typography Styles has correct text-transform
		await expect( page.getByRole( 'heading', { name: 'Heading 2' } ) ).toHaveCSS( 'text-transform', 'uppercase' )

		// Open Block Settings
		await page.getByLabel( 'Settings', { exact: true } ).click()

		// Check if the added Stackable Heading Block has a text-transform uppercase
		editor.insertBlock( {
			name: 'stackable/heading',
			attributes: {
				text: 'test',
			},
		} )

		await expect( editor.canvas.locator( '[data-type="stackable/heading"] > .stk-block-heading > h2[role="textbox"]' ) ).toHaveCSS( 'text-transform', 'uppercase' )

		// Reset Global Typography Styles
		await page.getByLabel( 'Stackable Design System' ).click()

		const resetButton = page.locator( '.ugb-global-settings-typography-control' ).nth( 1 ).getByLabel( 'Reset' )
		const deleteRequest = page.waitForResponse( response => response.url().includes( 'wp/v2/settings' ) && response.request().method() === 'POST' )
		await resetButton.click()

		await deleteRequest
		await expect( resetButton ).not.toBeVisible()
	} )

	test( 'When a default block is created, adding the block should have the default block\'s attributes', async ( {
		page,
		editor,
	} ) => {
		await page.getByLabel( 'Stackable Design System' ).click()
		await page.getByRole( 'button', { name: 'Block Defaults' } ).click()

		// Open the Default Text Block Editor
		const defaultBlockPagePromise = page.waitForEvent( 'popup' )

		// Reset the block defaults first if it has been edited
		const resetButton = page.locator( '.components-panel__body', { hasText: 'Block Defaults' } ).locator( '.stk-block-default-control', { hasText: /^Text$/ } ).first().getByLabel( 'Reset' )

		if ( await resetButton.isVisible() ) {
			await resetButton.click()
		}

		const textBlock = page.locator( '.components-panel__body', { hasText: 'Block Defaults' } ).locator( '.stk-block-default-control', { hasText: /^Text$/ } ).first().getByLabel( 'Edit' )
		await textBlock.click()
		const defaultBlockPage = await defaultBlockPagePromise

		// Set a color for the default Text Block
		await defaultBlockPage.locator( '.stk-color-palette-control .stk-control-content > .components-dropdown > .components-button' ).first().click()
		await defaultBlockPage.getByLabel( 'Hex color' ).fill( 'ff0000' )
		await defaultBlockPage.locator( '.stk-color-palette-control .stk-control-content > .components-dropdown > .components-button' ).first().click()

		// The default timeout is 30s, extend it to 90s
		const updateRequest = defaultBlockPage.waitForResponse( response => response.url().includes( 'update_block_style' ) && response.request().method() === 'POST', { timeout: 90_000 } )

		// In older WP versions, the button text is 'Update' instead of 'Save'
		if ( await defaultBlockPage.getByRole( 'button', {
			name: 'Save', exact: true, disabled: false,
		} ).isVisible() ) {
			await defaultBlockPage.getByRole( 'button', { name: 'Save', exact: true } ).click()
		} else if ( await defaultBlockPage.getByRole( 'button', { name: 'Update', disabled: false } ).isVisible() ) {
			await defaultBlockPage.getByRole( 'button', { name: 'Update' } ).click()
		}

		// Make sure default block has been updated
		await ( await updateRequest ).finished()

		// Insert a Stackable Text Block, and check if the color is the same as the one set in the default block
		const timeouts = [ 1_000, 5_000, 30_000 ]
		for ( const timeout of timeouts ) {
			try {
				await page.reload()
				await editor.insertBlock( {
					name: 'stackable/text',
					attributes: {
						text: 'test',
					},
				} )

				await expect( editor.canvas.locator( '[data-type="stackable/text"] > .stk-block-text > p[role="textbox"]' ) ).toHaveCSS( 'color', 'rgb(255, 0, 0)' )
				break
			} catch ( e ) {
				// Ignore the error and try again because the default block might not be updated yet
				await page.waitForTimeout( timeout )
			}
		}

		// Reset Default Block
		await page.getByLabel( 'Stackable Design System' ).click()
		await page.getByRole( 'button', { name: 'Block Defaults' } ).click()
		await page.locator( '.components-panel__body', { hasText: 'Block Defaults' } ).locator( '.stk-block-default-control', { hasText: /^Text$/ } ).first().getByLabel( 'Reset' ).click()
	} )
} )
