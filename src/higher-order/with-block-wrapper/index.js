/**
 * This HOC replaces the main wrapper of the block, and should be used by all
 * Stackable blocks.
 *
 * In order to use this, the block.json should define: "apiVersion": 3
 *
 * If the block is using `withIsHovered`, use `withBlockWrapperIsHovered`
 * instead.
 */

/**
 * Internal dependencies
 */
import { BlockWrapper } from '~stackable/components'
import { useBlockContext, useBlockHoverState } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose'
import { useEffect, useState } from '@wordpress/element'

const EMPTY_OBJ = {}

const withBlockWrapper = createHigherOrderComponent(
	WrappedComponent => props => {
		const { wrapperProps = EMPTY_OBJ } = props
		const isDisplayed = useDevicePreviewOptimization( props )
		const [ blockState, blockHoverClass ] = useBlockHoverState()

		return (
			<BlockWrapper
				align={ props.attributes.align }
				className={ props.attributes.className }
				blockHoverClass={ blockHoverClass }
				{ ...wrapperProps }
			>
				{ isDisplayed && (
					<WrappedComponent
						{ ...props }
						blockState={ blockState }
						blockHoverClass={ blockHoverClass }
					/>
				) }
			</BlockWrapper>
		)
	},
	'withBlockWrapper'
)

export default withBlockWrapper

// Did the editor load for the first time
let firstLoad = true
// Holds the clientId of the current selected block, no hooks, just keep it here
// for speed.
let selectedBlock = null

/**
 * This optimizes the preview device switching. Without this, there will be a
 * 4-5 second delay when switching preview devices. With this, it's
 * instantaneous.
 *
 * When the preview device switches from Desktop to Tablet/Mobile, the editor
 * lags because a lot of processes are being made with rebuilding the editor in
 * an iframe. As a workaround to make our blocks fast, when ours blocks are
 * first rendered (on mount), add a short delay on when to render the root
 * blocks.
 *
 * The delay on mounting works because the preview device switches, the editor
 * is rebuilt inside an iframe - everything is unmounted and mounted again.
 *
 * @param {Object} blockProps Block props
 */
export const useDevicePreviewOptimization = blockProps => {
	const { clientId, isSelected } = blockProps
	const { rootBlockClientId } = useBlockContext()

	// Remember the selected block.
	if ( isSelected ) {
		selectedBlock = rootBlockClientId
	}

	// Is this block a nested block, or at the root.
	const isRootBlock = rootBlockClientId === clientId

	// When the editor first loads, load everything normally. Let's give it 1
	// second of first loading, then afterwards we do the delayed loading.
	if ( firstLoad ) {
		setTimeout( () => {
			firstLoad = false
		}, 1000 )
	}

	// If this block is selected, then always display it because it will get a
	// block error when switching from tablet to desktop.  Also, always display
	// the block if it's nested (not a root block), since if we delay the
	// display, it will look like the blocks are slowly loading.
	const displayedByDefault = ! isRootBlock || selectedBlock === clientId || firstLoad

	const [ isDisplayed, setIsDisplayed ] = useState( displayedByDefault )

	// If the block isn't displayed, display it after a delay, this trick
	// apparently makes Desktop -> Tablet/Mobile previews fast.
	useEffect( () => {
		if ( ! isDisplayed ) {
			const t = setTimeout( () => {
				setIsDisplayed( true )
			}, 300 )
			return () => clearTimeout( t )
		}
	}, [ isDisplayed ] )

	return isDisplayed
}
