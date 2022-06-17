/**
 * Hook for getting the current editor frame (if any), useful if you need the
 * editor document (e.g. to add global styles on), this also works with 5.9+
 * where the editor becomes an iframe when previewing in tablet and mobile.
 */

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element'

export const useEditorFrame = callback => {
	// const deviceType = useDeviceType()
	const [ editor, setEditor ] = useState( null )
	const [ editorFrame, setEditorFrame ] = useState( null )

	// Wait for the Gutenberg editor to load.
	useEffect( () => {
		const isEditorFrameLoaded = setInterval( () => {
			// Check is the current page Gutenberg editor or Full Site Editor
			const editorPage = document.querySelector( '.edit-post-visual-editor__content-area' ) || document.querySelector( '.edit-site-visual-editor' )
			if ( editorPage ) {
				setEditor( editorPage )
				clearInterval( isEditorFrameLoaded )
			}
		}, 250 )
		return () => clearInterval( isEditorFrameLoaded )
	}, [] )

	// Listen to changes on the editor whether an editor canvas gets loaded / if
	// the device type was changed.
	useEffect( () => {
		// When this is first called, then the editor is in Desktop mode and the
		// main document is where the editor is.
		if ( ! editor ) {
			setEditorFrame( document )
			return
		}

		const observer = new MutationObserver( () => {
			const editorFrame = editor.querySelector( 'iframe[name="editor-canvas"]' )

			if ( editorFrame ) {
				setEditorFrame( editorFrame.contentDocument )
			} else {
				setEditorFrame( document )
			}
		} )

		observer.observe(
			editor,
			{
				subtree: true,
				childList: true,
			},
		)

		return () => observer.disconnect()
	}, [ editor ] )

	// If the editor frame changed, then call the callback.
	useEffect( () => {
		if ( editorFrame ) {
			const cleanup = callback( editorFrame )
			return () => {
				if ( cleanup ) {
					cleanup()
				}
			}
		}
	}, [ editorFrame ] )
}
