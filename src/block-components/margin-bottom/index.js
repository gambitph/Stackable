import { addAttributes } from './attributes'
import { Style } from './style'

import { ResizableBottomMargin } from '~stackable/components'
import { getUniqueBlockClass } from '~stackable/util'

import { useBlockEditContext } from '@wordpress/block-editor'
import { useDispatch, select } from '@wordpress/data'

export const MarginBottom = () => {
	const { clientId } = useBlockEditContext()
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const attributes = select( 'core/block-editor' ).getBlockAttributes( clientId )

	return (
		<ResizableBottomMargin
			previewSelector={ `.${ getUniqueBlockClass( attributes.uniqueId ) }` }
			valueDesktop={ attributes.blockMarginBottom }
			valueTablet={ attributes.blockMarginBottomTablet }
			valueMobile={ attributes.blockMarginBottomMobile }
			onChangeDesktop={ value => updateBlockAttributes( clientId, { blockMarginBottom: value } ) }
			onChangeTablet={ value => updateBlockAttributes( clientId, { blockMarginBottomTablet: value } ) }
			onChangeMobile={ value => updateBlockAttributes( clientId, { blockMarginBottomMobile: value } ) }
		/>
	)
}

MarginBottom.addAttributes = addAttributes

MarginBottom.Style = Style
