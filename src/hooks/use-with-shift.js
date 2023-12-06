/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element'

const useWithShift = () => {
	const [ isShiftKey, setIsShiftKey ] = useState( false )

	useEffect( () => {
		const handleShiftKeyToggle = event => {
			setIsShiftKey( !! event.shiftKey )
		}

		window.addEventListener( 'keydown', handleShiftKeyToggle ) // eslint-disable-line @wordpress/no-global-event-listener
		window.addEventListener( 'keyup', handleShiftKeyToggle ) // eslint-disable-line @wordpress/no-global-event-listener

		// This ensures to toggle the shift key when the iframe is in focus.
		const iframe = document?.querySelector( 'iframe[name="editor-canvas"]' )
		if ( iframe ) {
			const doc = iframe.contentDocument || iframe.contentWindow.document
			doc.addEventListener( 'keyup', handleShiftKeyToggle )
		}

		return () => {
			window.removeEventListener( 'keydown', handleShiftKeyToggle ) // eslint-disable-line @wordpress/no-global-event-listener
			window.removeEventListener( 'keyup', handleShiftKeyToggle ) // eslint-disable-line @wordpress/no-global-event-listener

			const iframe = document?.querySelector( 'iframe[name="editor-canvas"]' )
			if ( iframe ) {
				const doc = iframe.contentDocument || iframe.contentWindow.document
				doc.removeEventListener( 'keyup', handleShiftKeyToggle )
			}
		}
	}, [] )

	return isShiftKey
}

export default useWithShift
