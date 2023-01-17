/**
 * Internal dependencies
 */
import { addAttributes } from './attributes'
import { Style } from './style'
import { ResizableBottomMargin } from '~stackable/components'
import { getUniqueBlockClass } from '~stackable/util'
import { useBlockAttributesContext, useBlockContext } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
import { applyFilters } from '@wordpress/hooks'
import { memo } from '@wordpress/element'

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

	// Don't show the margin bottom draggable indicator if this is in a row block.
	const isRowBlock = parentBlock &&
		parentBlock.name === 'core/group' &&
		parentBlock.attributes.layout?.type === 'flex' &&
		parentBlock.attributes.layout?.flexWrap === 'nowrap'

	if ( isRowBlock ) {
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
