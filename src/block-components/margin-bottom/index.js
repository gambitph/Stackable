/**
 * Internal dependencies
 */
import { addAttributes } from './attributes'
import { Style } from './style'
import { ResizableBottomMargin } from '~stackable/components'
import { getUniqueBlockClass } from '~stackable/util'
import { useBlockAttributesContext, useBlockContextContext } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
import { applyFilters } from '@wordpress/hooks'
import { memo } from '@wordpress/element'
import { useSelect } from '@wordpress/data'

export const MarginBottom = memo( props => {
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributesContext( attributes => {
		return {
			layout: attributes.layout,
			uniqueId: attributes.uniqueId,
			blockMargin: attributes.blockMargin,
			blockMarginTablet: attributes.blockMarginTablet,
			blockMarginMobile: attributes.blockMarginMobile,
			blockMarginUnit: attributes.blockMarginUnit,
			blockMarginUnitTablet: attributes.blockMarginUnitTablet,
			blockMarginUnitMobile: attributes.blockMarginUnitMobile,
		}
	} )

	const {
		isLastBlock,
		parentBlock,
		isGroupBlock,
		isRowLayout,
	} = useSelect(
		select => {
			const {
				getBlockOrder, getBlockRootClientId, getBlock,
			} = select( 'core/block-editor' )

			const rootClientId = getBlockRootClientId( clientId )
			const parentBlock = getBlock( rootClientId )
			const parentInnerBlocks = getBlockOrder( rootClientId )

			const isGroupBlock = parentBlock?.name === 'core/group'
			let isRowLayout = false
			if ( isGroupBlock ) {
				isRowLayout = parentBlock.attributes.layout?.type === 'flex' && parentBlock.attributes.layout?.flexWrap === 'nowrap'
			}

			return {
				parentBlock,
				isLastBlock: parentInnerBlocks[ parentInnerBlocks.length - 1 ] === clientId,
				isGroupBlock,
				isRowLayout,
			}
		},
		[ clientId ]
	)

	// Check if the parent block (like a Column block) is displaying blocks
	// horizontally, we don't want to show the margin bottom draggable
	// indicator.
	const parentInnerBlockOrientation = useBlockContextContext( context => {
		return context[ 'stackable/innerBlockOrientation' ]
	} )
	if ( parentInnerBlockOrientation === 'horizontal' ) {
		return null
	}

	if ( isGroupBlock && isRowLayout ) {
		return null
	}

	if ( isLastBlock || ! attributes.uniqueId ) {
		return null
	}

	const enable = applyFilters( 'stackable.edit.margin-bottom.enable-handlers', true, parentBlock )
	if ( ! enable ) {
		return null
	}

	return (
		<ResizableBottomMargin
			previewSelector={ props.previewSelector || ( attributes.uniqueId ? `.${ getUniqueBlockClass( attributes.uniqueId ) }` : undefined ) }
			attribute="blockMargin"
			responsive="all"
			{ ...attributes }
		/>
	)
} )

MarginBottom.addAttributes = addAttributes

MarginBottom.Style = Style
