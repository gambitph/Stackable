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
				if ( ( request.url().includes( 'stackable/v3/settings' ) || request.url().includes( 'stackable%2Fv3%2Fsettings' ) ) && request.method() === 'GET' ) {
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
				if ( ( request.url().includes( 'stackable/v3/settings' ) || request.url().includes( 'stackable%2Fv3%2Fsettings' ) ) && request.method() === 'GET' ) {
					cleanup()
					throw Error( 'Failed to get Stackable settings' )
				}
			}

			this.page.on( 'requestfinished', finishedCallback )
			this.page.on( 'requestfailed', failedCallback )
		} )
	}
}
