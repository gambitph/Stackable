import { Page, Request } from '@playwright/test'
import { test } from './test'

export class StackableFixture {
	page: Page;

	constructor( page: Page ) {
	  this.page = page
	}

	// When loading the Stackable settings in the Admin, there are 4 requests to wp/v2/settings
	// This function waits for all 4 requests to finish to ensure Stackable settings are loaded and reflected on the page
	async waitForSettings(): Promise<void> {
		return new Promise( ( resolve, reject ) => {
			let responseCount = 0

			const cleanup = () => {
				this.page.off( 'requestfinished', finishedCallback )
				this.page.off( 'requestfinished', failedCallback )
			}

			const finishedCallback = async ( request: Request ) => {
				if ( request.url().includes( 'wp/v2/settings' ) && request.method() === 'GET' ) {
					try {
						let settings = null
						await test.step( 'Wait for Stackable settings to load', async () => {
							const response = await request.response()
							settings = await response.body()
						} )

						if ( settings ) {
							responseCount++
						} else {
							throw Error( 'Failed to get Stackable settings' )
						}

						if ( responseCount === 4 ) {
							cleanup()
							resolve()
						}
					} catch ( error ) {
						cleanup()
						reject( `Error: ${ error.message }` )
					}
				}
			}
			const failedCallback = async ( request: Request ) => {
				if ( request.url().includes( 'wp/v2/settings' ) && request.method() === 'GET' ) {
					cleanup()
					throw Error( 'Failed to get Stackable settings' )
				}
			}

			this.page.on( 'requestfinished', finishedCallback )
			this.page.on( 'requestfailed', failedCallback )
		} )
	}
}
