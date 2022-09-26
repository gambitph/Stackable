/**
 * This component replaces the main wrapper of the block, and should be used by
 * all Stackable blocks.
 *
 * In order to use this, the block.json should define: "apiVersion": 2
 */

/**
 * Internal dependencies
 */
import { useBlockHoverClass } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor'

const BlockWrapper = props => {
	const blockHoverClass = useBlockHoverClass()
	const blockProps = useBlockProps( {
		...( props.blockProps || {} ),
		className: blockHoverClass,
	} )

	return <div { ...blockProps } >
		{ props.children }
	</div>
}

BlockWrapper.defaultProps = {
	blockProps: null,
}

export default BlockWrapper
