import { Locator, Page } from '@playwright/test'
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

const sidebar = ( page: Page ) => page.locator( '.interface-interface-skeleton__sidebar' )
const styleGuide = ( page: Page ) => page.locator( '.ugb-style-guide-popover' )

const expandSidebarPanel = async ( page: Page, name: string ) => {
	const button = sidebar( page ).getByRole( 'button', { name, exact: true } )
	await expect( button ).toBeVisible()
	if ( await button.getAttribute( 'aria-expanded' ) !== 'true' ) {
		await button.click()
	}
}

const openStyleGuide = async ( page: Page ) => {
	await page.getByLabel( 'Stackable Design System' ).click()
	await page.getByRole( 'button', { name: 'Preview Design System' } ).click()

	const preview = styleGuide( page )
	await expect( preview ).toBeVisible()
	await expect( preview.getByRole( 'heading', { name: 'Design System Style Guide' } ) ).toBeVisible()
	await expect( preview.getByText( 'Loading style guide' ) ).toHaveCount( 0, { timeout: 20_000 } )
	await expect( preview.locator( '.ugb-style-guide' ) ).toBeVisible( { timeout: 20_000 } )
	return preview
}

const fillHexColor = async ( page: Page, hex: string ) => {
	const input = page.getByLabel( 'Hex color' )
	await expect( input ).toBeVisible()
	await input.fill( hex )
	await input.blur()
	// Dismiss the picker without using Escape, which can close the style guide.
	await styleGuide( page ).getByRole( 'heading', { name: 'Design System Style Guide' } ).click()
	await expect( page.getByLabel( 'Hex color' ) ).toHaveCount( 0 )
}

const computedStyle = async ( locator: Locator, property: string ) => {
	return locator.evaluate( ( el, prop ) => {
		return getComputedStyle( el )[ prop as 'color' ]
	}, property )
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
		await editor.insertBlock( {
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
		test.setTimeout( 180_000 )

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
		await editor.insertBlock( {
			name: 'stackable/heading',
			attributes: {
				text: 'test',
			},
		} )

		await expect(
			editor.canvas.locator( '[data-type="stackable/heading"] > .stk-block-heading > h2[role="textbox"]' )
		).toHaveCSS( 'text-transform', 'uppercase', { timeout: 30_000 } )

		// Reset Global Typography Styles
		await page.getByLabel( 'Stackable Design System' ).click()
		await expandSidebarPanel( page, 'Global Typography' )

		const heading2Control = page.locator( '.ugb-global-settings-typography-control' ).nth( 1 )
		await expect( heading2Control ).toBeVisible( { timeout: 15_000 } )
		await heading2Control.scrollIntoViewIfNeeded()

		const resetButton = heading2Control.getByLabel( 'Reset' )
		await expect( resetButton ).toBeVisible( { timeout: 15_000 } )
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

	test( 'Preview Design System opens a style guide with current values and a website preview', async ( {
		page,
	} ) => {
		const preview = await openStyleGuide( page )

		await expect( preview.getByText( /live preview of your design system/i ) ).toBeVisible()
		await expect( preview.getByRole( 'button', { name: 'Export as Image' } ) ).toBeVisible()
		await expect( preview.getByRole( 'button', { name: 'Close', exact: true } ) ).toBeVisible()
		await expect( page.getByRole( 'button', { name: 'Close Preview' } ) ).toBeVisible()

		await expect( preview.getByRole( 'heading', { name: 'Colors', exact: true } ) ).toBeVisible()
		await expect( preview.getByRole( 'heading', { name: 'Color Schemes' } ) ).toBeVisible()
		await expect( preview.locator( '.ugb-style-guide__color-scheme' ).first() ).toBeVisible()
		await expect( preview.locator( '.ugb-style-guide__color-scheme__colors' ).first() ).toContainText( 'Background Color' )
		await expect( preview.locator( '.ugb-style-guide__color-scheme__colors' ).first() ).toContainText( 'Heading Color' )

		await expect( preview.getByRole( 'heading', { name: 'Typography' } ) ).toBeVisible()
		await expect( preview.locator( '.ugb-style-guide__typography-preview' ).first() ).toBeVisible()

		await expect( preview.getByRole( 'heading', { name: 'Web Elements' } ) ).toBeVisible()
		await expect( preview.getByRole( 'heading', { name: 'Buttons' } ) ).toBeVisible()
		await expect( preview.locator( '.ugb-style-guide__elements__buttons .stk-button' ).first() ).toBeVisible()

		await expect( preview.getByRole( 'heading', { name: 'Example Website Preview' } ) ).toBeVisible()
		await expect( preview.locator( '.ugb-style-guide__preview-mock-browser' ) ).toBeVisible()
		await expect( preview.getByRole( 'heading', { name: 'Professional Solutions for Businesses' } ) ).toBeVisible()
		await expect( preview.getByRole( 'heading', { name: 'Our Services' } ) ).toBeVisible()

		await page.getByRole( 'button', { name: 'Close Preview' } ).click()
		await expect( preview ).toHaveCount( 0 )
	} )

	test( 'Preview Design System updates live when design system values change', async ( {
		page,
	} ) => {
		test.setTimeout( 120_000 )
		page.on( 'dialog', async dialog => await dialog.accept() )

		const preview = await openStyleGuide( page )
		const inspector = sidebar( page )

		try {
			await expandSidebarPanel( page, 'Global Color Schemes' )
			await inspector.locator( '[data-item-key="scheme-default-1"]' ).click()
			await inspector.locator( '.stk-color-scheme__heading-color .stk-control-content > .components-dropdown > .components-button' ).click()
			await fillHexColor( page, 'ff0000' )

			const schemeHeading = preview.locator( '.ugb-style-guide__color-scheme__heading' ).first()
			await expect.poll( async () => computedStyle( schemeHeading, 'color' ) ).toBe( 'rgb(255, 0, 0)' )
			await expect( preview.locator( '.ugb-style-guide__color-scheme__colors' ).first() ).toContainText( /Heading Color:.*#ff0000/i )

			await inspector.locator( '.stk-inspector-sub-header .components-button' ).first().click()

			await expandSidebarPanel( page, 'Global Color Palette' )
			const colorPanel = inspector.locator( '.ugb-global-settings-color-picker' ).filter( { hasText: 'Global Colors' } )
			await colorPanel.locator( 'button.ugb-global-settings-color-picker__add-button' ).click()
			await fillHexColor( page, '22aa66' )

			const palette = preview.locator( '.ugb-style-guide__colors' )
			await expect( palette ).toBeVisible()
			await expect( palette ).toContainText( 'Custom Color' )
			await expect.poll( async () => {
				return computedStyle( palette.locator( '.ugb-style-guide__color-container' ).last(), 'backgroundColor' )
			} ).toBe( 'rgb(34, 170, 102)' )

			await expandSidebarPanel( page, 'Global Typography' )
			await inspector.getByText( 'DM Serif Display' ).click()
			await expect( preview.locator( '.ugb-style-guide__typography-headings .ugb-style-guide__typography-label' ).first() )
				.toContainText( 'DM Serif Display' )
			await expect.poll( async () => {
				return computedStyle(
					preview.locator( 'h1.ugb-style-guide__typography-preview[data-device="desktop"]' ).first(),
					'fontFamily'
				)
			} ).toMatch( /DM Serif Display/ )

			await expandSidebarPanel( page, 'Global Spacing & Borders' )
			await fillRangeControl( page, 'Block Margin Bottom', '56' )
			await expect.poll( async () => {
				return computedStyle(
					preview.locator( '.ugb-style-guide__preview .stk-block' ).first(),
					'marginBottom'
				)
			} ).toBe( '56px' )

			await expandSidebarPanel( page, 'Global Buttons & Icons' )
			await fillRangeControl( page, 'Min. Button Height', '64' )
			await expect.poll( async () => {
				return computedStyle(
					preview.locator( '.ugb-style-guide__elements__buttons .stk-button' ).first(),
					'minHeight'
				)
			} ).toBe( '64px' )
		} finally {
			try {
				const inspector = sidebar( page )

				if ( await inspector.locator( '.stk-inspector-sub-header' ).isVisible().catch( () => false ) ) {
					const resetScheme = inspector.locator( '.stk-inspector-sub-header__reset' )
					if ( await resetScheme.isVisible().catch( () => false ) ) {
						await resetScheme.click()
					}
					await inspector.locator( '.stk-inspector-sub-header .components-button' ).first().click()
				} else {
					await expandSidebarPanel( page, 'Global Color Schemes' )
					await inspector.locator( '[data-item-key="scheme-default-1"]' ).click()
					const resetScheme = inspector.locator( '.stk-inspector-sub-header__reset' )
					if ( await resetScheme.isVisible().catch( () => false ) ) {
						await resetScheme.click()
					}
					await inspector.locator( '.stk-inspector-sub-header .components-button' ).first().click()
				}

				await expandSidebarPanel( page, 'Global Color Palette' )
				const colorPanel = inspector.locator( '.ugb-global-settings-color-picker' ).filter( { hasText: 'Global Colors' } )
				const deleteButtons = colorPanel.getByLabel( 'Delete' )
				const deleteCount = await deleteButtons.count()
				for ( let i = 0; i < deleteCount; i++ ) {
					await colorPanel.getByLabel( 'Delete' ).last().click()
				}

				await expandSidebarPanel( page, 'Global Typography' )
				await inspector.getByText( 'Default Heading' ).click()

				await expandSidebarPanel( page, 'Global Spacing & Borders' )
				const spacingReset = inspector.getByRole( 'button', { name: 'Reset All' } ).first()
				if ( await spacingReset.isEnabled() ) {
					await spacingReset.click()
				}

				await expandSidebarPanel( page, 'Global Buttons & Icons' )
				const buttonsReset = inspector.getByRole( 'button', { name: 'Reset All' } ).last()
				if ( await buttonsReset.isEnabled() ) {
					await buttonsReset.click()
				}
			} catch {
				// Best-effort cleanup so a failed assertion is not hidden by reset errors.
			}
		}
	} )
} )
