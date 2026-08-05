import { Page, Request } from '@playwright/test'
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
}
