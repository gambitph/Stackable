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
