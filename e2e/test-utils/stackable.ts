import { Page, Request } from '@playwright/test'
import { expect } from '@wordpress/e2e-test-utils-playwright'
import { test } from './test'

export class StackableFixture {
	page: Page;

	constructor( page: Page ) {
	  this.page = page
	}

	// Wait for Stackable Settings to be fetched
	async waitForSettings(): Promise<void> {
		return new Promise( ( resolve, reject ) => {
			const cleanup = () => {
				this.page.off( 'requestfinished', finishedCallback )
				this.page.off( 'requestfinished', failedCallback )
			}

			const finishedCallback = async ( request: Request ) => {
				if ( decodeURIComponent( request.url() ).includes( 'stackable/v3/settings' ) && request.method() === 'GET' ) {
					try {
						let settings = null
						await test.step( 'Wait for Stackable settings to load', async () => {
							const response = await request.response()
							settings = await response.body()
						} )

						if ( settings ) {
							cleanup()
							resolve()
						} else {
							throw Error( 'Failed to get Stackable settings' )
						}
					} catch ( error ) {
						cleanup()
						reject( `Error: ${ error.message }` )
					}
				}
			}
			const failedCallback = async ( request: Request ) => {
				if ( decodeURIComponent( request.url() ).includes( 'stackable/v3/settings' ) && request.method() === 'GET' ) {
					cleanup()
					throw Error( 'Failed to get Stackable settings' )
				}
			}

			this.page.on( 'requestfinished', finishedCallback )
			this.page.on( 'requestfailed', failedCallback )
		} )
	}

	// Wait for Stackable Settings to be saved via the WordPress REST API.
	// Call this before clicking "Save Changes".
	waitForSettingsSave(): Promise<void> {
		return this.page.waitForResponse( response => {
			const url = decodeURIComponent( response.url() )
			const method = response.request().method()
			return url.includes( '/wp/v2/settings' ) &&
				( method === 'POST' || method === 'PUT' || method === 'PATCH' ) &&
				response.ok()
		} ).then( () => undefined )
	}

	async openBlockSettings() {
		// Scope to the editor chrome. Column Arrangement (and similar inspector
		// controls) also expose a "Settings" button that would otherwise match.
		const settings = this.page
			.getByRole( 'region', { name: 'Editor top bar' } )
			.getByRole( 'button', { name: 'Settings', exact: true } )
		if ( await settings.isVisible() && await settings.getAttribute( 'aria-pressed' ) === 'false' ) {
			await settings.click()
		}
	}

	async openInspectorTab( tab: 'Layout' | 'Style' | 'Advanced' ) {
		await this.openBlockSettings()
		await this.page.getByLabel( `${ tab } Tab` ).click()
	}

	async openDesignSystem() {
		const button = this.page.getByLabel( 'Stackable Design System' )
		await button.click()
	}

	async dismissToursAndNotices() {
		const tourClose = this.page.locator( '.ugb-tour-modal .components-modal__header button' ).first()
		if ( await tourClose.isVisible().catch( () => false ) ) {
			await tourClose.click()
		}

		const skip = this.page.getByRole( 'link', { name: 'Skip', exact: true } )
		if ( await skip.isVisible().catch( () => false ) ) {
			await skip.click()
		}
	}

	async pickLayout( editor, index = 0 ) {
		const variations = editor.canvas
			.locator( '.stk-variation-picker .block-editor-block-variation-picker__variation' )
		try {
			await variations.first().waitFor( { state: 'visible', timeout: 10_000 } )
		} catch {
			return
		}
		await variations.nth( index ).click()
		await expect( editor.canvas.locator( '.stk-variation-picker' ) ).toBeHidden()
	}

	async pickDefaultLayout( editor ) {
		return this.pickLayout( editor, 0 )
	}

	async selectBlockByName( editor, name: string ) {
		const block = editor.canvas.locator( `[data-type="${ name }"]` ).first()
		await expect( block ).toBeVisible()
		await this.selectBlockByClientId( await block.getAttribute( 'data-block' ) )
	}

	async selectBlockByClientId( clientId: string ) {
		await this.page.evaluate( id => {
			window.wp.data.dispatch( 'core/block-editor' ).selectBlock( id )
		}, clientId )
		await expect.poll( async () => {
			return this.page.evaluate( () =>
				window.wp.data.select( 'core/block-editor' ).getSelectedBlockClientId()
			)
		} ).toBe( clientId )
	}
}
