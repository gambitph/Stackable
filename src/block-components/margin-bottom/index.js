/**
 * Internal dependencies
 */
import { addAttributes } from './attributes'
import { Style } from './style'
import { ResizableBottomMargin } from '~stackable/components'
import { getUniqueBlockClass } from '~stackable/util'
import {
	useBlockAttributesContext, useBlockContext, useBlockContextContext,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
import { applyFilters } from '@wordpress/hooks'
import { memo } from '@wordpress/element'
import { select } from '@wordpress/data'

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

	const { isLastBlock, parentBlock } = useBlockContext( clientId )

	// Check if the parent block (like a Column block) is displaying blocks
	// horizontally, we don't want to show the margin bottom draggable
	// indicator.
	const parentInnerBlockOrientation = useBlockContextContext( context => {
		return context[ 'stackable/innerBlockOrientation' ]
	} )
	if ( parentInnerBlockOrientation === 'horizontal' ) {
		return null
	}

	// Don't show the margin bottom draggable indicator if this is in a row block.
	const isGroupBlock = parentBlock && parentBlock.name === 'core/group'
	let isRowLayout = false
	if ( isGroupBlock ) {
		const attributes = select( 'core/block-editor' ).getBlockAttributes( parentBlock.clientId )
		isRowLayout = attributes.layout?.type === 'flex' && attributes.layout?.flexWrap === 'nowrap'
	}

	if ( isGroupBlock && isRowLayout ) {
		return null
	}

	const enable = applyFilters( 'stackable.edit.margin-bottom.enable-handlers', true, parentBlock )
	if ( isLastBlock || ! enable || ! attributes.uniqueId ) {
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
