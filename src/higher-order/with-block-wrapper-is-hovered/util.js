/**
 * WordPress dependencies
 */
import { useState, useCallback } from '@wordpress/element'

/**
 * Hook that provides a showMovers state and gesture events for DOM elements
 * that interact with the showMovers state.
 *
 * @return {boolean} isHovered
 */
export function useIsHovered() {
	const [ isHovered, setIsHovered ] = useState( false )

	const onMouseEnter = useCallback( () => setIsHovered( true ), [] )
	const onMouseLeave = useCallback( () => setIsHovered( false ), [] )

	return {
		isHovered,
		onMouseEnter,
		onMouseLeave,
	}
}
