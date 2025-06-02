import { Save } from './save'
import { attributes } from './schema'

import { withVersion } from '~stackable/higher-order'
import {
	deprecateBlockShadowColor, deprecateContainerShadowColor, deprecateTypographyFontSize, deprecateBlockHeight,
} from '~stackable/block-components'

const deprecated = [
	{
		// Support the change of type for fontSize and blockHeight
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
			const hasBlockShadow = deprecateBlockShadowColor.isEligible( attributes )
			const hasContainerShadow = deprecateContainerShadowColor.isEligible( attributes )

			return hasBlockShadow || hasContainerShadow
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )

			return newAttributes
		},
	},
]
export default deprecated
