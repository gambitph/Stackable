import { Editor as BaseEditor } from '@wordpress/e2e-test-utils-playwright'

class ExtendedEditor extends BaseEditor {
	blockErrors: Array<String> = []

	getBlockAttributes = async function( clientId : String ) {
		await this.page.waitForFunction(
			() => window?.wp?.blocks && window?.wp?.data
		)

		const attributes = await this.page.evaluate( async ( [ _clientId ] ) => {
			return await window.wp.data.select( 'core/block-editor' ).getBlockAttributes( _clientId )
		}, [ clientId ] )

		return attributes
	}

	getBlockErrors() :Array<String> {
		this.blockErrors = []
		this.page.on( 'console', msg => {
			if ( msg.type() === 'error' && msg.text().startsWith( 'Block validation' ) ) {
				this.blockErrors.push( msg.text() )
			}
		} )

		return this.blockErrors
	}
}

export { ExtendedEditor }
