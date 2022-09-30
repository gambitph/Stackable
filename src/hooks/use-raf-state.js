/**
 * Like useState but only updates the state on RequestAnimationFrame.
 *
 * Based from https://github.com/streamich/react-use/blob/master/src/useRafState.ts
 */
import {
	useRef, useState, useCallback, useEffect,
} from '@wordpress/element'

export const useRafState = initialState => {
	const frame = useRef( 0 )
	const [ state, setState ] = useState( initialState )

	const setRafState = useCallback( value => {
	  cancelAnimationFrame( frame.current )

	  frame.current = requestAnimationFrame( () => {
			setState( value )
	  } )
	}, [] )

	useEffect( () => {
		return () => {
			cancelAnimationFrame( frame.current )
		}
	}, [] )

	return [ state, setRafState ]
}
