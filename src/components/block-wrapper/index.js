/**
 * This component replaces the main wrapper of the block, and should be used by
 * all Stackable blocks.
 *
 * In order to use this, the block.json should define: "apiVersion": 2
 */

/**
 * External dependencies
 */
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor'
import { memo } from '@wordpress/element'

const BlockWrapper = memo( props => {
	const {
		align = undefined,
		className: blockClassName = '',
		blockHoverClass = '',
		children,
		hoverRef,
		...propsToPass
	} = props

	const className = classnames(
		blockHoverClass,
		{
			[ `align${ align }` ]: align, // Add an alignment here to support some themes.
		}
	)

	const blockProps = useBlockProps( {
		...( propsToPass || {} ),
		ref: hoverRef,
		className,
		// We force-removed the block alignment wrapper div (see src/blocks.js),
		// so we need to add our own data-align attribute.
		'data-align': align,
	} )

	// Remove the custom CSS names here because we will be adding it in the BlockDiv component, we need to do this for our current styles to work.
	blockProps.className = blockProps.className.replace( blockClassName, '' ).trim()

	return <div { ...blockProps } >
		{ children }
	</div>
} )

BlockWrapper.displayName = 'BlockWrapper'

export default BlockWrapper
