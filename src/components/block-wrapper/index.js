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
 * External dependencies
 */
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor'

const BlockWrapper = props => {
	const {
		align = undefined,
		className: blockClassName = '',
	} = props
	const blockHoverClass = useBlockHoverClass()

	const className = classnames(
		blockHoverClass,
		{
			[ `align${ align }` ]: align, // Add an alignment here to support some themes.
		}
	)

	const blockProps = useBlockProps( {
		...( props.blockProps || {} ),
		className,
		// We force-removed the block alignment wrapper div (see src/blocks.js),
		// so we need to add our own data-align attribute.
		'data-align': align,
	} )

	// Remove the custom CSS names here because we will be adding it in the BlockDiv component, we need to do this for our current styles to work.
	blockProps.className = blockProps.className.replace( blockClassName, '' ).trim()

	return <div { ...blockProps } >
		{ props.children }
	</div>
}

BlockWrapper.defaultProps = {
	blockProps: null,
}

export default BlockWrapper
