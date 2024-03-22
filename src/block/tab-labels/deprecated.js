import {
	deprecateBlockBackgroundColorOpacity, deprecateButtonGradientColor, deprecateContainerBackgroundColorOpacity, deprecateTypographyGradientColor,
	deprecateBlockShadowColor, deprecateContainerShadowColor, deprecateShadowColor, deprecateTypographyShadowColor,
} from '~stackable/block-components'
import { Save } from './save'
import { attributes } from './schema'

import { withVersion } from '~stackable/higher-order'

const deprecated = [
	{
		// Support the new shadow color.
		attributes: attributes( '3.12.11' ),
		save: withVersion( '3.12.11' )( Save ),
		isEligible: attributes => {
			const hasBlockShadow = deprecateBlockShadowColor.isEligible( attributes )
			const hasContainerShadow = deprecateContainerShadowColor.isEligible( attributes )
			const hasTabButtonShadow = deprecateShadowColor.isEligible( 'tab%s' )( attributes )
			const hasActiveTabButtonShadow = deprecateShadowColor.isEligible( 'activeTab%s' )( attributes )
			const hasTextShadow = deprecateTypographyShadowColor.isEligible( 'tab%s' )( attributes )

			return hasBlockShadow || hasContainerShadow || hasTextShadow || hasTabButtonShadow || hasActiveTabButtonShadow
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'tab%s' )( newAttributes )
			newAttributes = deprecateButtonGradientColor.migrate( 'tab%s' )( newAttributes )
			newAttributes = deprecateButtonGradientColor.migrate( 'activeTab%s' )( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateTypographyShadowColor.migrate( '%s' )( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'tab%s' )( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'activeTab%s' )( newAttributes )

			return newAttributes
		},
	},
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
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateTypographyShadowColor.migrate( '%s' )( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'tab%s' )( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'activeTab%s' )( newAttributes )

			return newAttributes
		},
	},
]
export default deprecated
