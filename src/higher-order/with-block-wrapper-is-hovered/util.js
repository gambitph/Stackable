/**
 * WordPress dependencies
 */
import {
	useState, useRef, useEffect, useCallback,
} from '@wordpress/element'

const {
	clearTimeout,
	setTimeout,
} = window
const DEBOUNCE_TIMEOUT = 50

/**
 * Hook that creates a showMover state, as well as debounced show/hide callbacks.
 *
 * @param {Object}   props                       Component props.
 * @param {Object}   props.ref                   Element reference.
 * @param {boolean}  props.isFocused             Whether the component has current focus.
 */
export function useDebouncedShowMovers( {
	ref,
	isFocused,
} ) {
	const [ showMovers, setShowMovers ] = useState( false )
	const timeoutRef = useRef()

	const debouncedShowMovers = useCallback( () => {
		if ( timeoutRef.current && clearTimeout ) {
			clearTimeout( timeoutRef.current )
		}

		setShowMovers( true )
	}, [] )

	const debouncedHideMovers = useCallback( () => {
		if ( timeoutRef.current && clearTimeout ) {
			clearTimeout( timeoutRef.current )
		}

		timeoutRef.current = setTimeout( () => {
			const isHovered = ref?.current && ref.current.matches( ':hover' )
			if ( ! isFocused && ! isHovered ) {
				setShowMovers( false )
			}
		}, DEBOUNCE_TIMEOUT )
	}, [ isFocused ] )

	useEffect(
		() => () => {
			/**
			 * We need to call the change handler with `isFocused`
			 * set to false on unmount because we also clear the
			 * timeout that would handle that.
			 */
			setShowMovers( false )

			if ( timeoutRef.current && clearTimeout ) {
				clearTimeout( timeoutRef.current )
			}
		},
		[]
	)

	return {
		showMovers,
		debouncedShowMovers,
		debouncedHideMovers,
	}
}

/**
 * Hook that provides a showMovers state and gesture events for DOM elements
 * that interact with the showMovers state.
 *
 * @param {Object}   props                       Component props.
 * @param {Object}   props.ref                   Element reference.
 */
export function useShowMoversGestures( {
	ref,
} ) {
	const [ isFocused, setIsFocused ] = useState( false )
	const {
		showMovers,
		debouncedShowMovers,
		debouncedHideMovers,
	} = useDebouncedShowMovers( {
		ref, isFocused,
	} )

	const registerRef = useRef( false )

	const isFocusedWithin = () => {
		return ref?.current && ref.current.contains( document.activeElement ) // eslint-disable-line
	}

	useEffect( () => {
		const node = ref.current

		const handleOnFocus = () => {
			if ( isFocusedWithin() ) {
				setIsFocused( true )
				debouncedShowMovers()
			}
		}

		const handleOnBlur = () => {
			if ( ! isFocusedWithin() ) {
				setIsFocused( false )
				debouncedHideMovers()
			}
		}

		/**
		 * Events are added via DOM events (vs. React synthetic events),
		 * as the child React components swallow mouse events.
		 */
		if ( node && ! registerRef.current ) {
			node.addEventListener( 'focus', handleOnFocus, true )
			node.addEventListener( 'blur', handleOnBlur, true )
			registerRef.current = true
		}

		return () => {
			if ( node ) {
				node.removeEventListener( 'focus', handleOnFocus )
				node.removeEventListener( 'blur', handleOnBlur )
			}
		}
	}, [
		ref,
		registerRef,
		setIsFocused,
		debouncedShowMovers,
		debouncedHideMovers,
	] )

	return {
		showMovers,
		gestures: {
			onMouseMove: debouncedShowMovers,
			onMouseLeave: debouncedHideMovers,
		},
	}
}
