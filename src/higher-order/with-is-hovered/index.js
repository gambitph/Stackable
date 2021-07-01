/**
 * Internal dependencies
 */
import { useShowMoversGestures } from './util'

/**
 * WordPress dependencies
 */
import { useRef } from '@wordpress/element'
import { createHigherOrderComponent } from '@wordpress/compose'

const withIsHovered = createHigherOrderComponent(
	WrappedComponent => props => {
		const ref = useRef()
		const { showMovers, gestures } = useShowMoversGestures( { ref } )
		return (
			<div
				{ ...gestures }
				ref={ ref }
			>
				<WrappedComponent { ...props } isHovered={ showMovers } />
			</div>
		)
	},
	'withIsHovered'
)

export default withIsHovered
