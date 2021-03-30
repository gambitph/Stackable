import { addAttributes } from './attributes'
import { addStyles } from './style'
import { getUniqueBlockClass } from '../block-div'

import { ResizableBottomMargin } from '~stackable/components'
import { useBlockAttributes } from '~stackable/hooks'

import { useBlockEditContext } from '@wordpress/block-editor'
import { useDispatch } from '@wordpress/data'

export const MarginBottom = () => {
	const { clientId } = useBlockEditContext()
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const attributes = useBlockAttributes( clientId )

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

MarginBottom.addStyles = addStyles
