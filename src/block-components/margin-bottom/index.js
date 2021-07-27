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

export const MarginBottom = () => {
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )
	const { isLastBlock } = useBlockContext()

	if ( isLastBlock ) {
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
