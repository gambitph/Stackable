import { Editor as BaseEditor } from '@wordpress/e2e-test-utils-playwright'

class ExtendedEditor extends BaseEditor {
	getBlockAttributes = async function( clientId : String ) {
		await this.page.waitForFunction(
			() => window?.wp?.blocks && window?.wp?.data
		)

		const attributes = await this.page.evaluate( async ( [ _clientId ] ) => {
			return await window.wp.data.select( 'core/block-editor' ).getBlockAttributes( _clientId )
		}, [ clientId ] )

		return attributes
	}
}

export { ExtendedEditor }
