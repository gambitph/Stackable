import { Page } from '@playwright/test'
import { test, expect } from 'e2e/test-utils'

/**
 * Size-preset (mark) mode is the default for Global Spacing / Buttons range
 * controls. That mode hides the number field until Custom is toggled, and the
 * custom field is a text input, not a spinbutton.
 */
const fillRangeControl = async ( page: Page, label: string, value: string ) => {
	const control = page.locator( '.stk-control' ).filter( {
		has: page.locator( '.stk-control-label', { hasText: label } ),
	} ).first()
	await expect( control ).toBeVisible()

	const numberInput = control.locator( 'input[type="text"], input[type="number"]' )
	if ( await numberInput.count() === 0 ) {
		await control.locator( '.stk-range-control__custom-button' ).click()
	}

	await expect( numberInput.first() ).toBeVisible()
	await numberInput.first().fill( value )
}

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

	test( 'Global Spacing & Borders and Buttons & Icons panels apply on the canvas', async ( {
		page,
		editor,
	} ) => {
		await editor.insertBlock( {
			name: 'stackable/text',
			attributes: { text: 'spacing token' },
		} )
		await editor.insertBlock( {
			name: 'stackable/button-group',
		} )

		await page.getByLabel( 'Stackable Design System' ).click()
		await page.getByRole( 'button', { name: 'Global Spacing & Borders' } ).click()
		await expect( page.getByText( 'Block Margin Bottom' ) ).toBeVisible()
		await fillRangeControl( page, 'Block Margin Bottom', '40' )

		await page.getByRole( 'button', { name: 'Global Buttons & Icons' } ).click()
		await expect( page.getByText( 'Min. Button Height' ) ).toBeVisible()
		await fillRangeControl( page, 'Min. Button Height', '48' )

		const textBlock = editor.canvas.locator( '[data-type="stackable/text"] .stk-block' ).first()
		await expect.poll( async () => {
			return textBlock.evaluate( el => getComputedStyle( el ).marginBottom )
		} ).toBe( '40px' )

		const button = editor.canvas.locator( '[data-type="stackable/button"] .stk-button' ).first()
		await expect.poll( async () => {
			return button.evaluate( el => getComputedStyle( el ).minHeight )
		} ).toBe( '48px' )
	} )

	test( 'Preview Design System opens', async ( {
		page,
	} ) => {
		await page.getByLabel( 'Stackable Design System' ).click()
		await page.getByRole( 'button', { name: 'Preview Design System' } ).click()
		await expect( page.getByRole( 'button', { name: 'Close Preview' } ) ).toBeVisible()
		await page.getByRole( 'button', { name: 'Close Preview' } ).click()
	} )
} )
