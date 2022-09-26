/**
 * This HOC replaces the main wrapper of the block, and should be used by all
 * Stackable blocks.
 *
 * In order to use this, the block.json should define: "apiVersion": 2
 *
 * If the block is NOT using `withIsHovered`, use `withBlockWrapper` instead.
 */

/**
 * Internal dependencies
 */
import { useShowMoversGestures } from './util'
import { useBlockHoverClass } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { useRef } from '@wordpress/element'
import { createHigherOrderComponent } from '@wordpress/compose'
import { useBlockProps } from '@wordpress/block-editor'

const withBlockWrapperIsHovered = createHigherOrderComponent(
	WrappedComponent => props => {
		const ref = useRef()
		const { showMovers, gestures } = useShowMoversGestures( { ref } )

		const blockHoverClass = useBlockHoverClass()
		const blockProps = useBlockProps( {
			...( props.blockProps || {} ),
			className: blockHoverClass,
			...gestures,
			ref,
		} )

		return (
			<div { ...blockProps } >
				<WrappedComponent { ...props } isHovered={ showMovers } />
			</div>
		)
	},
	'withBlockWrapperIsHovered'
)

export default withBlockWrapperIsHovered
