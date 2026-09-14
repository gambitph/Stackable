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

	/**
	 * Persist the current editor document as a draft.
	 *
	 * Gutenberg's helper clicks the "Save draft" top-bar button. After autosave
	 * or a reload of an already-saved draft that button is named "Saved" and
	 * the click waits until the test timeout closes the page.
	 */
	saveDraft = async function() {
		await this.page.waitForFunction(
			() => window?.wp?.data?.select?.( 'core/editor' ) && window?.wp?.data?.dispatch?.( 'core/editor' )
		)

		await this.page.waitForFunction( () => {
			return ! window.wp.data.select( 'core/editor' ).isSavingPost()
		}, null, { timeout: 60_000 } )

		const needsSave = await this.page.evaluate( () => {
			const editor = window.wp.data.select( 'core/editor' )
			return editor.isEditedPostNew() || editor.isEditedPostDirty()
		} )

		if ( needsSave ) {
			await this.page.evaluate( async () => {
				await window.wp.data.dispatch( 'core/editor' ).savePost()
			} )

			await this.page.waitForFunction( () => {
				return ! window.wp.data.select( 'core/editor' ).isSavingPost()
			}, null, { timeout: 60_000 } )

			const saveFailed = await this.page.evaluate( () => {
				return window.wp.data.select( 'core/editor' ).didPostSaveRequestFail()
			} )
			if ( saveFailed ) {
				throw new Error( 'Editor saveDraft failed to persist the post' )
			}
		}

		await this.page.waitForFunction( () => {
			return !! new URLSearchParams( window.location.search ).get( 'post' )
		} )
	}
}

export { ExtendedEditor }
