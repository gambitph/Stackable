import { expect } from '@wordpress/e2e-test-utils-playwright'
import type { Page } from '@playwright/test'

export const assertNoUpsell = async ( page: Page ) => {
	await expect( page.locator( '.ugb-design-control-pro-note' ) ).toHaveCount( 0 )
	await expect( page.getByRole( 'link', { name: 'Get Premium' } ) ).toHaveCount( 0 )
}

export const openInspectorPanel = async ( page: Page, title: string ) => {
	const button = page.getByRole( 'button', { name: title, exact: true } ).first()
	await expect( button ).toBeVisible()
	const expanded = await button.getAttribute( 'aria-expanded' )
	if ( expanded !== 'true' ) {
		await button.click()
	}
}

export const openBlockStylesPopover = async ( page: Page ) => {
	const blockTab = page.getByRole( 'tab', { name: 'Block' } )
	if ( await blockTab.isVisible().catch( () => false ) ) {
		await blockTab.click()
	}

	const button = page.locator( '.ugb-block-styles-controls__block-style-button' )
	await expect( button ).toBeVisible( { timeout: 15_000 } )
	if ( ! await button.evaluate( el => el.classList.contains( 'is-opened' ) ) ) {
		await button.click()
	}
	const popover = page.locator( '.ugb-block-styles-controls__popover' )
	await expect( popover ).toBeVisible( { timeout: 15_000 } )
	return popover
}

export const closeBlockStylesPopover = async ( page: Page ) => {
	const button = page.locator( '.ugb-block-styles-controls__block-style-button' )
	if ( await button.evaluate( el => el.classList.contains( 'is-opened' ) ) ) {
		await button.click()
	}
	await expect( page.locator( '.ugb-block-styles-controls__popover' ) ).toHaveCount( 0 )
}

export const waitForWpSettingsSave = ( page: Page, timeout = 15_000 ) =>
	page.waitForResponse( response => {
		const url = decodeURIComponent( response.url() )
		return url.includes( '/wp/v2/settings' ) &&
			[ 'POST', 'PUT', 'PATCH' ].includes( response.request().method() )
	}, { timeout } )

export const saveNewBlockStyle = async ( page: Page, styleName: string, styleSlug: string ) => {
	const popover = await openBlockStylesPopover( page )
	await expect( popover.getByRole( 'button', { name: 'Save New Block Style' } ) )
		.toBeVisible( { timeout: 15_000 } )
	await popover.getByRole( 'button', { name: 'Save New Block Style' } ).click()

	const modal = page.locator( '.ugb-block-styles__new-style-modal' )
	await expect( modal ).toBeVisible()
	await expect( modal.getByRole( 'heading', { name: 'Create New Block Style' } ) ).toBeVisible()
	await modal.locator( 'input[name="name"]' ).click()
	await modal.locator( 'input[name="name"]' ).fill( styleName )
	await modal.locator( 'input[name="slug"]' ).click()
	await modal.locator( 'input[name="slug"]' ).fill( styleSlug )
	await modal.locator( 'input[name="slug"]' ).blur()

	const saved = waitForWpSettingsSave( page )
	await modal.getByRole( 'button', { name: 'Create Block Style' } ).click()
	await saved.catch( () => undefined )
	await expect( modal ).toHaveCount( 0, { timeout: 15_000 } )
	await expect( page.locator( '.ugb-block-styles-controls__block-style-button' ) )
		.toContainText( styleName, { timeout: 15_000 } )
}

export const applyBlockStyleByName = async ( page: Page, styleName: string ) => {
	const popover = await openBlockStylesPopover( page )
	await expect( popover.locator( '.ugb-block-styles-controls__list' ) )
		.toContainText( styleName )
	await popover.locator( '.ugb-block-styles-controls__list' )
		.getByRole( 'button', { name: styleName } )
		.click()
	await closeBlockStylesPopover( page )
}

export const blockStyleRow = ( page: Page, blockStyleAttr: string ) =>
	page.locator( '.ugb-global-block-styles__panel .stk-global-settings-color-picker__color-indicator-wrapper' )
		.filter( { has: page.locator( `[data-item-key="${ blockStyleAttr }"]` ) } )

export const fillInspectorRange = async ( page: Page, label: string | RegExp, value: string ) => {
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

export const copyOrPasteStyles = async (
	editor: { page: Page, showBlockToolbar?: () => Promise<void> },
	action: 'copy' | 'paste'
) => {
	if ( editor.showBlockToolbar ) {
		await editor.showBlockToolbar()
	}

	const toolbarButton = editor.page.getByLabel( 'Copy & paste styles' )
	await expect( toolbarButton ).toBeVisible()
	await toolbarButton.click()

	const menuItem = action === 'copy' ? 'Adv Copy Styles' : 'Adv Paste Styles'
	await editor.page.locator( '.stk-copy-paste-styles__menu' )
		.getByRole( 'button', { name: menuItem } )
		.click()
	await editor.page.keyboard.press( 'Escape' )
}

export const confirmUpdateBlockStyle = async ( page: Page ) => {
	const popover = await openBlockStylesPopover( page )
	const update = popover.getByRole( 'button', { name: 'Update Style' } )
	await expect( update ).toBeVisible( { timeout: 15_000 } )
	await update.click()

	const modal = page.locator( '.ugb-block-styles__new-style-modal' )
	await expect( modal ).toBeVisible()
	await expect( modal.getByRole( 'heading', { name: /Update Block Style/ } ) ).toBeVisible()

	const saved = waitForWpSettingsSave( page )
	await modal.getByRole( 'button', { name: 'Update Block Style' } ).click()
	await saved.catch( () => undefined )
	await expect( modal ).toHaveCount( 0, { timeout: 15_000 } )
	await closeBlockStylesPopover( page )
}
