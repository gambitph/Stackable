import {
	deprecateBlockBackgroundColorOpacity, deprecateContainerBackgroundColorOpacity, deprecateTypographyGradientColor,
	deprecateBlockShadowColor, deprecateContainerShadowColor,
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
			const isNotV4 = attributes.version < 2 || typeof attributes.version === 'undefined'

			return hasBlockShadow || hasContainerShadow || isNotV4
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'digit%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'label%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'message%s' )( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )

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
			const isNotV4 = attributes.version < 2 || typeof attributes.version === 'undefined'
			const hasDigitGradient = deprecateTypographyGradientColor.isEligible( 'digit%s' )( attributes )
			const hasLabelGradient = deprecateTypographyGradientColor.isEligible( 'label%s' )( attributes )
			const hasMessageGradient = deprecateTypographyGradientColor.isEligible( 'message%s' )( attributes )

			return hasContainerOpacity || hasBlockOpacity || isNotV4 || hasDigitGradient || hasLabelGradient || hasMessageGradient
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'digit%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'label%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'message%s' )( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )

			return newAttributes
		},
	},
	{
		// This deprecation entry is for the New UI where we changed how the
		// layout & containers work.
		attributes: attributes( '3.7.9' ),
		save: withVersion( '3.7.9' )( Save ),
		isEligible: attributes => {
			const isNotV4 = attributes.version < 2 || typeof attributes.version === 'undefined'

			return isNotV4
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			// Container borders while the container was turned off was allowed
			// before, now it's not allowed. Turn on the container to mimic the
			// effect. This goes first before the container paddings check below
			// because we need to set the paddings to zero for this to work.
			const hasContainerBorders = !! attributes.containerBorderType ||
				( typeof attributes.containerBorderRadius !== 'undefined' && attributes.containerBorderRadius !== '' ) ||
				!! attributes.containerShadow

			if ( ! attributes.hasContainer && hasContainerBorders ) {
				newAttributes = {
					...newAttributes,
					hasContainer: true,
					containerPadding: {
						top: 0, right: 0, bottom: 0, left: 0,
					},
					containerBackgroundColor: 'transparent',
				}
			}

			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'digit%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'label%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'message%s' )( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )

			return newAttributes
		},
	},
	// Support new margin-top/bottom classes.
	{
		attributes: attributes( '3.7.9' ),
		save: withVersion( '3.7.9' )( Save ),
		migrate: attributes => {
			let newAttributes = deprecateContainerBackgroundColorOpacity.migrate( attributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'digit%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'label%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'message%s' )( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )

			return deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
		},
	},
]
export default deprecated
