import {
	deprecateBlockBackgroundColorOpacity, deprecateContainerBackgroundColorOpacity,
	deprecateBlockShadowColor, deprecateContainerShadowColor, deprecateBlockHeight,
	deprecateColumnAndRowGap,
} from '~stackable/block-components'
import { Save } from './save'
import { attributes } from './schema'

import { withVersion } from '~stackable/higher-order'

const deprecated = [
	{
		// Handle the migration of shadow attributes with the change of type in 3.15.3
		attributes: attributes( '3.16.2' ),
		save: withVersion( '3.16.2' )( Save ),
		isEligible: attributes => {
			const hasBlockShadow = deprecateBlockShadowColor.isEligible( attributes )
			const hasContainerShadow = deprecateContainerShadowColor.isEligible( attributes )

			return hasBlockShadow || hasContainerShadow
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateBlockHeight.migrate( newAttributes )
			newAttributes = deprecateColumnAndRowGap.migrate( '%s' )( newAttributes )

			return newAttributes
		},
	},
	{
		// Support the change of type for block height and gaps
		attributes: attributes( '3.15.3' ),
		save: withVersion( '3.15.3' )( Save ),
		isEligible: attributes => {
			const hasNumberBlockHeight = deprecateBlockHeight.isEligible( attributes )
			const hasNumberGaps = deprecateColumnAndRowGap.isEligible( '%s' )( attributes )
			return hasNumberBlockHeight || hasNumberGaps
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateBlockHeight.migrate( newAttributes )
			newAttributes = deprecateColumnAndRowGap.migrate( '%s' )( newAttributes )

			return newAttributes
		},
	},
	{
		// Support the new shadow color.
		attributes: attributes( '3.12.11' ),
		save: withVersion( '3.12.11' )( Save ),
		isEligible: attributes => {
			if (
				typeof attributes?.blockHeight === 'string' ||
				typeof attributes?.blockHeightTablet === 'string' ||
				typeof attributes?.blockHeightMobile === 'string' ||
				typeof attributes?.columnSpacing === 'string' ||
				typeof attributes?.columnSpacingTablet === 'string' ||
				typeof attributes?.columnSpacingMobile === 'string' ||
				typeof attributes?.columnGap === 'string' ||
				typeof attributes?.columnGapTablet === 'string' ||
				typeof attributes?.columnGapMobile === 'string' ||
				typeof attributes?.rowGap === 'string' ||
				typeof attributes?.rowGapTablet === 'string' ||
				typeof attributes?.rowGapMobile === 'string'
			) {
				return false
			}

			const hasBlockShadow = deprecateBlockShadowColor.isEligible( attributes )
			const hasContainerShadow = deprecateContainerShadowColor.isEligible( attributes )

			return hasBlockShadow || hasContainerShadow
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
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

			return hasContainerOpacity || hasBlockOpacity
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )

			return newAttributes
		},
	},
]
export default deprecated
