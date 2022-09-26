/**
 * This HOC replaces the main wrapper of the block, and should be used by all
 * Stackable blocks.
 *
 * In order to use this, the block.json should define: "apiVersion": 2
 *
 * If the block is using `withIsHovered`, use `withBlockWrapperIsHovered`
 * instead.
 */

/**
 * Internal dependencies
 */
import { BlockWrapper } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose'

const withBlockWrapper = createHigherOrderComponent(
	WrappedComponent => props => {
		return (
			<BlockWrapper>
				<WrappedComponent { ...props } />
			</BlockWrapper>
		)
	},
	'withBlockWrapper'
)

export default withBlockWrapper
