import { Save } from './save'
import { attributes } from './schema'

import { withVersion } from '~stackable/higher-order'
import {
	deprecateBlockBackgroundColorOpacity, deprecateButtonGradientColor,
	deprecateContainerBackgroundColorOpacity, deprecateShadowColor,
	deprecateContainerShadowColor, deprecateBlockShadowColor,
	deprecateTypographyFontSize, deprecateBlockHeight,
} from '~stackable/block-components'

const deprecated = [
	{
		// Handle the migration of shadow attributes with the change of type in 3.15.3
		attributes: attributes( '3.16.2' ),
		save: withVersion( '3.16.2' )( Save ),
		isEligible: attributes => {
			const hasBlockShadow = deprecateBlockShadowColor.isEligible( attributes )
			const hasContainerShadow = deprecateContainerShadowColor.isEligible( attributes )
			const hasButtonShadow = deprecateShadowColor.isEligible( 'button%s' )( attributes )

			return hasBlockShadow || hasContainerShadow || hasButtonShadow
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'button%s' )( newAttributes )
			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateButtonGradientColor.migrate( 'button%s' )( newAttributes )
			newAttributes = deprecateTypographyFontSize.migrate( '%s' )( newAttributes )
			newAttributes = deprecateBlockHeight.migrate( newAttributes )

			return newAttributes
		},
	},
	{
		// Support the change of type for fontSize
		attributes: attributes( '3.15.3' ),
		save: withVersion( '3.15.3' )( Save ),
		isEligible: attributes => {
			const hasNumberFontSize = deprecateTypographyFontSize.isEligible( '%s' )( attributes )
			const hasNumberBlockHeight = deprecateBlockHeight.isEligible( attributes )
			return hasNumberFontSize || hasNumberBlockHeight
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'button%s' )( newAttributes )
			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateButtonGradientColor.migrate( 'button%s' )( newAttributes )
			newAttributes = deprecateTypographyFontSize.migrate( '%s' )( newAttributes )
			newAttributes = deprecateBlockHeight.migrate( newAttributes )

			return newAttributes
		},
	},
	{
		// Support the new shadow color.
		attributes: attributes( '3.12.11' ),
		save: withVersion( '3.12.11' )( Save ),
		isEligible: attributes => {
			if ( ( typeof attributes?.fontSize === 'string' ||
				typeof attributes?.fontSizeTablet === 'string' ||
				typeof attributes?.fontSizeMobile === 'string' ||
				typeof attributes?.blockHeight === 'string' ||
				typeof attributes?.blockHeightTablet === 'string' ||
				typeof attributes?.blockHeightMobile === 'string' )
			) {
				return false
			}

			const hasBlockShadow = deprecateBlockShadowColor.isEligible( attributes )
			const hasContainerShadow = deprecateContainerShadowColor.isEligible( attributes )
			const hasButtonShadow = deprecateShadowColor.isEligible( 'button%s' )( attributes )

			return hasBlockShadow || hasContainerShadow || hasButtonShadow
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'button%s' )( newAttributes )
			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateButtonGradientColor.migrate( 'button%s' )( newAttributes )

			return newAttributes
		},
	},
	{
		// Support the new combined opacity and color.
		attributes: attributes( '3.11.9' ),
		save: withVersion( '3.11.9' )( Save ),
		isEligible: attributes => {
			const hasContainerOpacity = deprecateContainerBackgroundColorOpacity.isEligible( attributes )
			const hasBlockOpacity = deprecateBlockBackgroundColorOpacity.isEligible( attributes )
			const hasButtonGradient = deprecateButtonGradientColor.isEligible( 'button%s' )( attributes )

			return hasContainerOpacity || hasBlockOpacity || hasButtonGradient
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateButtonGradientColor.migrate( 'button%s' )( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'button%s' )( newAttributes )

			return newAttributes
		},
	},
	// Support new margin-top/bottom classes.
	{
		attributes: attributes( '3.7.9' ),
		save: withVersion( '3.7.9' )( Save ),
		migrate: attributes => {
			let newAttributes = deprecateContainerBackgroundColorOpacity.migrate( attributes )
			newAttributes = deprecateButtonGradientColor.migrate( 'button%s' )( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'button%s' )( newAttributes )
			return deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
		},
	},
]
export default deprecated
