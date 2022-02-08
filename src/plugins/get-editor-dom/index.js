/**
 * Internal dependencies
 */
import './store'
import { useDeviceType } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import {
	useState, useEffect, useMemo,
} from '@wordpress/element'
import { dispatch } from '@wordpress/data'

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
	const [ timeoutCache, setTimeoutCache ] = useState( null )

	useEffect( () => {
		if ( deviceType === 'Desktop' ) {
			// Need to force an update because it takes some time for the iframe to disappear.
			clearTimeout( timeoutCache )
			const timeout = setTimeout( () => {
				setIframeForceUpdate( iframeForceUpdate + 1 )
			}, 200 )
			setTimeoutCache( timeout )
		} else { // Tablet or Mobile.
			const iframeEl = document.querySelector( `iframe[name="editor-canvas"]` )
			if ( iframeEl ) {
				const body = iframeEl.contentDocument.body
				if ( body && body.querySelector( '.block-editor-block-list__layout' ) ) {
					setIframeForceUpdate( iframeForceUpdate + 1 )
				} else {
					clearTimeout( timeoutCache )
					const timeout = setTimeout( () => {
						const body = iframeEl.contentDocument.body
						if ( body && body.querySelector( '.block-editor-block-list__layout' ) ) {
							setIframeForceUpdate( iframeForceUpdate + 1 )
						}
					}, 200 )
					setTimeoutCache( timeout )
					iframeEl.onload = () => {
						clearTimeout( timeoutCache )
						const body = iframeEl.contentDocument.body
						if ( body && body.querySelector( '.block-editor-block-list__layout' ) ) {
							setIframeForceUpdate( iframeForceUpdate + 1 )
						} else {
							setTimeout( () => {
								setIframeForceUpdate( iframeForceUpdate + 1 )
							}, 200 )
						}
					}
				}
			}
		}
	}, [ deviceType ] )

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
