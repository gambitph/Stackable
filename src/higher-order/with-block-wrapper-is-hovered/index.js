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

/**
 * WordPress dependencies
 */
import { useRef } from '@wordpress/element'
import { createHigherOrderComponent } from '@wordpress/compose'
import { BlockWrapper } from '~stackable/components'

const withBlockWrapperIsHovered = createHigherOrderComponent(
	 WrappedComponent => props => {
		 const ref = useRef()
		 const { showMovers, gestures } = useShowMoversGestures( { ref } )

		 const blockProps = {
			 ...gestures,
			 ref,
		 }

		 return (
			 <BlockWrapper attributes={ props.attributes } blockProps={ blockProps }>
				 <WrappedComponent { ...props } isHovered={ showMovers } />
			 </BlockWrapper>
		 )
	 },
	 'withBlockWrapperIsHovered'
)

export default withBlockWrapperIsHovered

