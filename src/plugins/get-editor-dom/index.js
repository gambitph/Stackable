/**
 * Internal dependencies
 */
import './store'
import { useDeviceType } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import {
	useState, useEffect, useMemo, useRef,
} from '@wordpress/element'
import { dispatch, useSelect } from '@wordpress/data'

/**
 * Gets the editor wrapper DOM element. This should be the way if you need to do
 * a querySelector and to get the raw DOM element of a block. This handles
 * iframe Tablet and Mobile previews introduced in WP 5.9.
 *
 * Take note that this can produce a `null` value if the editor is still
 * transitioning from Desktop to Tablet or Mobile previews.
 *
 * This is done here so that this costly operation is only done once when the
 * editor changes preview modes.
 *
 * @return {DomElement} This can be null when the editor is transitioning from
 * one device size to another.
 */
export const EditorDom = () => {
	const deviceType = useDeviceType()
	const [ iframeForceUpdate, setIframeForceUpdate ] = useState( 0 )
	const timeout = useRef( null )
	const interval = useRef( null )

	// If in FSE, switching templates will recreate the editor.
	const editedSitePostId = useSelect( select => {
		return select( 'core/edit-site' )?.getEditedPostId?.()
	} )

	useEffect( () => {
		if ( deviceType === 'Desktop' ) {
			// We have to wait for the editor area to load (e.g. FSE iframe takes a long time to load)
			interval.current = setInterval( () => {
				const editorEl = document.querySelector( `.editor-styles-wrapper, iframe[name="editor-canvas"]` )
				if ( editorEl ) {
					clearInterval( interval.current )
					clearTimeout( timeout.current )
					setIframeForceUpdate( v => v + 1 )
					// There's a chance that the editor STILL isn't ready, try again.
					setTimeout( () => {
						setIframeForceUpdate( v => v + 1 )
					}, 200 )
				}
			}, 200 )
		} else { // Tablet or Mobile.
			const iframeEl = document.querySelector( `iframe[name="editor-canvas"]` )
			if ( iframeEl ) {
				const body = iframeEl.contentDocument.body
				if ( body && body.querySelector( '.block-editor-block-list__layout' ) ) {
					clearInterval( interval.current )
					setIframeForceUpdate( v => v + 1 )
				} else {
					clearTimeout( timeout.current )
					timeout.current = setTimeout( () => {
						const body = iframeEl.contentDocument.body
						if ( body && body.querySelector( '.block-editor-block-list__layout' ) ) {
							setIframeForceUpdate( v => v + 1 )
						}
					}, 200 )
					iframeEl.onload = () => {
						clearTimeout( timeout.current )
						const body = iframeEl.contentDocument.body
						if ( body && body.querySelector( '.block-editor-block-list__layout' ) ) {
							setIframeForceUpdate( v => v + 1 )
						} else {
							setTimeout( () => {
								setIframeForceUpdate( v => v + 1 )
							}, 200 )
						}
					}
				}
			}
		}

		return () => {
			clearInterval( interval.current )
			clearTimeout( timeout.current )
		}
	}, [ deviceType, editedSitePostId ] )

	useMemo( () => {
		const iframeEl = document.querySelector( `iframe[name="editor-canvas"]` )
		if ( iframeEl ) {
			dispatch( 'stackable/editor-dom' ).updateEditorDom( iframeEl.contentDocument.body )
		} else {
			dispatch( 'stackable/editor-dom' ).updateEditorDom( document.querySelector( `.editor-styles-wrapper` ) )
		}
	}, [ iframeForceUpdate, deviceType ] )

	// Don't render anything.
	return null
}
