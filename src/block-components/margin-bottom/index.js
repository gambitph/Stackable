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

export const MarginBottom = props => {
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributesContext()
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
	if ( isLastBlock || ! enable ) {
		return null
	}

	return (
		<ResizableBottomMargin
			previewSelector={ props.previewSelector || ( attributes.uniqueId ? `.${ getUniqueBlockClass( attributes.uniqueId ) }` : undefined ) }
			attribute="blockMargin"
			responsive="all"
		/>
	)
}

MarginBottom.addAttributes = addAttributes

MarginBottom.Style = Style
