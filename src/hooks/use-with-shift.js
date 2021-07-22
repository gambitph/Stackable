/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element'

const useWithShift = () => {
	const [ isShiftKey, setIsShiftKey ] = useState( false )

	useEffect( () => {
		const handleShiftKeyToggle = event => {
			setIsShiftKey( event.shiftKey )
		}

		window.addEventListener( 'keydown', handleShiftKeyToggle ) // eslint-disable-line @wordpress/no-global-event-listener
		window.addEventListener( 'keyup', handleShiftKeyToggle ) // eslint-disable-line @wordpress/no-global-event-listener

		return () => {
			window.removeEventListener( 'keydown', handleShiftKeyToggle ) // eslint-disable-line @wordpress/no-global-event-listener
			window.removeEventListener( 'keyup', handleShiftKeyToggle ) // eslint-disable-line @wordpress/no-global-event-listener
		}
	}, [] )

	return isShiftKey
}

export default useWithShift
