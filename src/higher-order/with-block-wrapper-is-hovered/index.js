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
import { useIsHovered } from './util'
import { useDevicePreviewOptimization } from '../with-block-wrapper'
import { useBlockHoverState } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose'
import { BlockWrapper } from '~stackable/components'

const withBlockWrapperIsHovered = createHigherOrderComponent(
	WrappedComponent => props => {
		const { isHovered, ...gestures } = useIsHovered()
		const [ blockState, blockHoverClass ] = useBlockHoverState()
		const isDisplayed = useDevicePreviewOptimization( props )

		return (
			<BlockWrapper
				align={ props.attributes.align }
				className={ props.attributes.className }
				blockHoverClass={ blockHoverClass }
				{ ...gestures }
			>
				{ isDisplayed && (
					<WrappedComponent { ...props }
						isHovered={ isHovered }
						blockState={ blockState }
						blockHoverClass={ blockHoverClass }
					/>
				) }
			</BlockWrapper>
		)
	},
	'withBlockWrapperIsHovered'
)

export default withBlockWrapperIsHovered
