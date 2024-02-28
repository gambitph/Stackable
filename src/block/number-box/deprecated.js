import { Save } from './save'
import { attributes } from './schema'

import { withVersion } from '~stackable/higher-order'
import {
	deprecateBlockBackgroundColorOpacity, deprecateTypographyGradientColor, deprecationBackgrounColorOpacity,
	deprecateBlockShadowColor, deprecateContainerShadowColor, deprecateShadowColor,
} from '~stackable/block-components'

const deprecated = [
	{
		// Support the new shadow color.
		attributes: attributes( '3.12.11' ),
		save: withVersion( '3.12.11' )( Save ),
		isEligible: attributes => {
			const hasBlockShadow = deprecateBlockShadowColor.isEligible( attributes )
			const hasContainerShadow = deprecateContainerShadowColor.isEligible( attributes )
			const hasShapeShadow = deprecateShadowColor.isEligible( 'shape%s' )( attributes )

			return hasBlockShadow || hasContainerShadow || hasShapeShadow
		},
		migrate: attributes => {
			let newAttributes = deprecateBlockBackgroundColorOpacity.migrate( attributes )
			newAttributes = deprecationBackgrounColorOpacity.migrate( 'shape%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( '%s' )( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'shape%s' )( newAttributes )

			return newAttributes
		},
	},
	// Support the new combined opacity and color.
	{
		attributes: attributes( '3.11.9' ),
		save: withVersion( '3.11.9' )( Save ),
		isEligible: attributes => {
			return deprecateBlockBackgroundColorOpacity.isEligible( attributes ) ||
				deprecationBackgrounColorOpacity.isEligible( 'shape%s' )( attributes ) ||
				deprecateTypographyGradientColor.isEligible( '%s' )( attributes )
		},
		migrate: attributes => {
			let newAttributes = deprecateBlockBackgroundColorOpacity.migrate( attributes )
			newAttributes = deprecationBackgrounColorOpacity.migrate( 'shape%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( '%s' )( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'shape%s' )( newAttributes )
			return newAttributes
		},
	},
	// Support new margin-top/bottom classes.
	// Support the new combined opacity and color.
	{
		attributes: attributes( '3.7.9' ),
		save: withVersion( '3.7.9' )( Save ),
		migrate: attributes => {
			let newAttributes = deprecateBlockBackgroundColorOpacity.migrate( attributes )
			newAttributes = deprecationBackgrounColorOpacity.migrate( 'shape%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( '%s' )( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'shape%s' )( newAttributes )
			return newAttributes
		},
	},
]
export default deprecated
