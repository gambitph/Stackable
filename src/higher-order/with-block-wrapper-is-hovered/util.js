/**
 * External dependencies
 */
import { debounce } from 'lodash'

/**
 * WordPress dependencies
 */
import {
	useState, useRef, useEffect,
} from '@wordpress/element'

const DEBOUNCE_TIMEOUT = 250

/**
 * Hook that provides a showMovers state and gesture events for DOM elements
 * that interact with the showMovers state.
 *
 * @param {Object} ref Element reference.
 * @return {boolean} isHovered
 */
export function useIsHovered( ref ) {
	const [ isHovered, setIsHovered ] = useState( false )
	const registerRef = useRef( false )

	useEffect( () => {
		const node = ref.current

		const handleOnEnter = debounce( () => {
			setIsHovered( true )
		}, DEBOUNCE_TIMEOUT )

		const handleOnLeave = debounce( () => {
			setIsHovered( false )
		}, DEBOUNCE_TIMEOUT )

		/**
		 * Events are added via DOM events (vs. React synthetic events),
		 * as the child React components swallow mouse events.
		 */
		if ( node && ! registerRef.current ) {
			node.addEventListener( 'mouseenter', handleOnEnter, true )
			node.addEventListener( 'mouseleave', handleOnLeave, true )
			registerRef.current = true
		}

		return () => {
			if ( node ) {
				node.removeEventListener( 'mouseenter', handleOnEnter )
				node.removeEventListener( 'mouseleave', handleOnLeave )
			}
		}
	}, [
		ref,
		registerRef,
	] )

	return isHovered
}

// Dev note: the old method above was to listen on mousemove, then check for:
// ref?.current && ref.current.matches( ':hover' )
