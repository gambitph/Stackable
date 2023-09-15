import {
	deprecateBlockBackgroundColorOpacity, deprecateButtonGradientColor, deprecateContainerBackgroundColorOpacity, deprecateTypographyGradientColor,
} from '~stackable/block-components'
import { Save } from './save'
import { attributes } from './schema'

import { withVersion } from '~stackable/higher-order'

const deprecated = [
	// Support the new combined opacity and color.
	{
		attributes: attributes( '3.11.9' ),
		save: withVersion( '3.11.9' )( Save ),
		isEligible: attributes => {
			const hasContainerOpacity = deprecateContainerBackgroundColorOpacity.isEligible( attributes )
			const hasBlockOpacity = deprecateBlockBackgroundColorOpacity.isEligible( attributes )
			const hasTextGradient = deprecateTypographyGradientColor.isEligible( 'tab%s' )( attributes )
			const hasTabButtonGradient = deprecateButtonGradientColor.isEligible( 'tab%s' )( attributes )
			const hasActiveTabButtonGradient = deprecateButtonGradientColor.isEligible( 'activeTab%s' )( attributes )

			return hasContainerOpacity || hasBlockOpacity || hasTextGradient || hasTabButtonGradient || hasActiveTabButtonGradient
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'tab%s' )( newAttributes )
			newAttributes = deprecateButtonGradientColor.migrate( 'tab%s' )( newAttributes )
			newAttributes = deprecateButtonGradientColor.migrate( 'activeTab%s' )( newAttributes )

			return newAttributes
		},
	},
]
export default deprecated
