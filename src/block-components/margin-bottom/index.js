import { attributes } from './attributes'
import { addStyles } from './style'

import { useBlockEditContext } from '@wordpress/block-editor'
import { useSelect, useDispatch } from '@wordpress/data'
import { ResizableBottomMargin } from '~stackable/components'
import { getUniqueBlockClass } from '../block-div'

export const MarginBottom = () => {
	const { clientId } = useBlockEditContext()
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )

	const { attributes } = useSelect(
		select => {
			const { getBlockAttributes } = select( 'core/block-editor' )
			return {
				attributes: getBlockAttributes( clientId ),
			}
		},
		[ clientId ]
	)

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

MarginBottom.attributes = attributes

MarginBottom.addStyles = addStyles
