/**
 * Like useEffect but only runs the effect on RequestAnimationFrame.
 */
import { useEffect, useRef } from '@wordpress/element'

export const useRafEffect = ( callback, deps ) => {
	const frame = useRef( 0 )

	useEffect( () => {
		cancelAnimationFrame( frame.current )
		frame.current = requestAnimationFrame( callback )
		return () => cancelAnimationFrame( frame.current )
	}, deps )
}
