/**
 * useMemo but only perform it on RequestAnimationFrame.
 * Based on https://github.com/streamich/react-use/blob/master/src/useRafState.ts
 */

import {
	useRef, useState, useEffect,
} from '@wordpress/element'

export const useRafMemo = ( callback, deps ) => {
	const frame = useRef( 0 )
	const [ value, setValue ] = useState( '' )

	useEffect( () => {
		cancelAnimationFrame( frame.current )
		frame.current = requestAnimationFrame( () => {
			setValue( callback )
		} )
		return () => cancelAnimationFrame( frame.current )
	}, deps )

	return value
}
