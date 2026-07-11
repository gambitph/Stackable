/**
 * Internal dependencies
 */
import './store'
import { useDeviceType } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { useLayoutEffect, useRef } from '@wordpress/element'
import { dispatch, useSelect } from '@wordpress/data'

const resolveEditorDom = () => {
	const iframeEl = document.querySelector( 'iframe[name="editor-canvas"]' )
	const iframeBody = iframeEl?.contentDocument?.body
	if ( iframeBody?.querySelector( '.block-editor-block-list__layout' ) ) {
		return iframeBody
	}

	return document.querySelector( '.editor-styles-wrapper' ) || null
}

/**
 * Gets the editor wrapper DOM element. This should be the way if you need to do
 * a querySelector and to get the raw DOM element of a block. This handles
 * iframe Tablet and Mobile previews introduced in WP 5.9.
 *
 * This is done here so that this costly operation is only done once when the
 * editor changes preview modes.
 */
export const EditorDom = () => {
	const deviceType = useDeviceType()
	const cancelledRef = useRef( false )
	const rafRef = useRef( 0 )

	// If in FSE, switching templates will recreate the editor.
	const editedSitePostId = useSelect( select => {
		return select( 'core/edit-site' )?.getEditedPostId?.()
	} )

	// If in FSE, switching between the editor canvas and the navigation recreates the editor.
	const currentPage = useSelect( select => {
		return select( 'core/edit-site' )?.getPage?.()
	} )

	// When switching between visual editor and code editor, the editor is recreated
	const editorMode = useSelect( select => {
		return select( 'core/edit-site' )?.getEditorMode() || select( 'core/edit-post' )?.getEditorMode()
	} )

	useLayoutEffect( () => {
		cancelledRef.current = false

		const commitEditorDom = dom => {
			if ( cancelledRef.current || ! dom ) {
				return false
			}

			dispatch( 'stackable/editor-dom' ).updateEditorDom( dom )
			return true
		}

		if ( commitEditorDom( resolveEditorDom() ) ) {
			return () => {
				cancelledRef.current = true
			}
		}

		const tryResolve = () => {
			return commitEditorDom( resolveEditorDom() )
		}

		const iframeEl = document.querySelector( 'iframe[name="editor-canvas"]' )
		const onIframeLoad = () => {
			tryResolve()
		}
		iframeEl?.addEventListener( 'load', onIframeLoad )

		const observer = new MutationObserver( () => {
			tryResolve()
		} )
		observer.observe( document.body, { childList: true, subtree: true } )

		const poll = () => {
			if ( cancelledRef.current || tryResolve() ) {
				return
			}
			rafRef.current = requestAnimationFrame( poll )
		}
		rafRef.current = requestAnimationFrame( poll )

		return () => {
			cancelledRef.current = true
			cancelAnimationFrame( rafRef.current )
			iframeEl?.removeEventListener( 'load', onIframeLoad )
			observer.disconnect()
		}
	}, [ deviceType, editorMode, editedSitePostId, currentPage ] )

	// Don't render anything.
	return null
}
