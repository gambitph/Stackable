/**
 * This is a hook that forces the component that uses it to be rerendered when a
 * `dispatchUpdateEvent` of the same name is triggered.
 */

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element'

// Creates a listener with the given name.
const useUpdateEvent = name => {
	const [ , forceRerender ] = useState()

	useEffect( () => {
		window.addEventListener( name, forceRerender ) // eslint-disable-line @wordpress/no-global-event-listener

		return () => {
			window.removeEventListener( name, forceRerender ) // eslint-disable-line @wordpress/no-global-event-listener
		}
	}, [ forceRerender ] )
}

export default useUpdateEvent

// Triggers an update for the given name.
export const dispatchUpdateEvent = name => {
	window?.dispatchEvent( new CustomEvent( name ) )
}
