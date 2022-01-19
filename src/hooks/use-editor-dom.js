/**
 * Internal dependencies
 */
import { useDeviceType } from '.'

/**
 * WordPress dependencies
 */
import {
	useState, useEffect, useMemo,
} from '@wordpress/element'

/**
 * Gets the editor wrapper DOM element. This should be the way if you need to do
 * a querySelector and to get the raw DOM element of a block. This handles
 * iframe Tablet and Mobile previews introduced in WP 5.9.
 *
 * Take note that this can produce a `null` value if the editor is still
 * transitioning from Desktop to Tablet or Mobile previews.
 *
 * @return {DomElement} This can be null when the editor is transitioning from
 * one device size to another.
 */
export const useEditorDom = () => {
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
				if ( iframeEl.contentDocument.body ) {
					setIframeForceUpdate( iframeForceUpdate + 1 )
				} else {
					clearTimeout( timeoutCache )
					const timeout = setTimeout( () => {
						if ( iframeEl.contentDocument.body ) {
							setIframeForceUpdate( iframeForceUpdate + 1 )
						}
					}, 200 )
					setTimeoutCache( timeout )
					iframeEl.onload = () => {
						clearTimeout( timeoutCache )
						setIframeForceUpdate( iframeForceUpdate + 1 )
					}
				}
			}
		}
	}, [ deviceType ] )

	return useMemo( () => {
		const iframeEl = document.querySelector( `iframe[name="editor-canvas"]` )
		if ( iframeEl ) {
			return iframeEl.contentDocument.body
		}
		return document.querySelector( `.editor-styles-wrapper` )
	}, [ iframeForceUpdate, deviceType ] )
}
