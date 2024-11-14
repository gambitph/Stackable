/**
 * WordPress dependencies
 */
import { useDispatch } from '@wordpress/data'
import { pasteHandler } from '@wordpress/blocks'
import { store as blockEditorStore } from '@wordpress/block-editor'
import { useCallback } from '@wordpress/element'

export const useOnPaste = clientId => {
	const { replaceBlocks } = useDispatch( blockEditorStore )

	return useCallback( event => {
		event.preventDefault()
		// Get the raw HTML from the clipboard
		const html = event.clipboardData?.getData( 'text/html' ) || ''
		const plain = event.clipboardData?.getData( 'text/plain' ) || ''

		const blocks = pasteHandler( {
			HTML: html,
			plainText: plain,
			mode: 'BLOCKS',
		} )

		if ( blocks ) {
			event.preventDefault()
			// Replace the current custom block with the parsed block(s)
			replaceBlocks( clientId, blocks )
		}
	}, [ clientId ] )
}
