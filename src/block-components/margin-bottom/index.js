/**
 * Internal dependencies
 */
import { addAttributes } from './attributes'
import { Style } from './style'
import { ResizableBottomMargin } from '~stackable/components'
import { getUniqueBlockClass } from '~stackable/util'
import { useBlockAttributes, useBlockContext } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
import { applyFilters } from '@wordpress/hooks'

export const MarginBottom = () => {
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )
	const { isLastBlock, parentBlock } = useBlockContext( clientId )

	const enable = applyFilters( 'stackable.edit.margin-bottom.enable-handlers', true, parentBlock )
	if ( isLastBlock || ! enable ) {
		return null
	}

	return (
		<ResizableBottomMargin
			previewSelector={ `.${ getUniqueBlockClass( attributes.uniqueId ) }` }
			attribute="blockMargin"
			responsive="all"
		/>
	)
}

MarginBottom.addAttributes = addAttributes

MarginBottom.Style = Style
