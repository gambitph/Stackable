import { Save } from './save'
import { attributes } from './schema'

import { withVersion } from '~stackable/higher-order'
import {
	deprecateBlockBackgroundColorOpacity, deprecateContainerBackgroundColorOpacity,
	deprecateBlockShadowColor, deprecateContainerShadowColor,
} from '~stackable/block-components'

const deprecated = [
	{
		attributes: attributes( '3.13.1' ),
		save: withVersion( '3.13.1' )( Save ),
		isEligible: ( attributes, innerBlocks ) => {
			if ( innerBlocks[ 0 ]?.name !== 'stackable/icon' ) {
				return false
			}

			const iconBlockAttributes = innerBlocks[ 0 ].attributes
			const hasIconSize = iconBlockAttributes.iconSize || iconBlockAttributes.iconSizeTablet || iconBlockAttributes.iconSizeMobile ? true : false
			const hasIconGap = attributes.iconGap || attributes.iconGapTablet || attributes.iconGapMobile ? true : false
			const hasIconGap2 = attributes.iconGap2 || attributes.iconGap2Tablet || attributes.iconGap2Mobile ? true : false
			return hasIconGap || ( hasIconSize && ! hasIconGap2 )
		},
		migrate: ( attributes, innerBlocks ) => {
			const newAttributes = { ...attributes }

			const {
				iconGap, iconGapTablet, iconGapMobile,
			} = attributes

			const iconBlockAttributes = innerBlocks[ 0 ].attributes
			const {
				iconSize, iconSizeTablet, iconSizeMobile,
			} = iconBlockAttributes

			const _iconSize = iconSize ? iconSize : 36
			const _iconSizeTablet = iconSizeTablet ? iconSizeTablet : _iconSize
			const _iconSizeMobile = iconSizeMobile ? iconSizeMobile : _iconSizeTablet

			const _iconGap = iconGap ? iconGap : 64
			const _iconGapTablet = iconGapTablet ? iconGapTablet : _iconGap
			const _iconGapMobile = iconGapMobile ? iconGapMobile : _iconGapTablet

			const newIconGap = _iconGap - _iconSize >= 0 ? _iconGap - _iconSize : 0
			const newIconGapTablet = _iconGapTablet - _iconSizeTablet >= 0 ? _iconGapTablet - _iconSizeTablet : 0
			const newIconGapMobile = _iconGapMobile - _iconSizeMobile >= 0 ? _iconGapMobile - _iconSizeMobile : 0

			newAttributes.iconGap2 = newIconGap === 28 ? '' : newIconGap
			newAttributes.iconGap2Tablet = newIconGapTablet === 28 ? '' : newIconGapTablet
			newAttributes.iconGap2Mobile = newIconGapMobile === 28 ? '' : newIconGapMobile

			newAttributes.iconGap = ''
			newAttributes.iconGapTablet = ''
			newAttributes.iconGapMobile = ''

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
	// Support new margin-top/bottom classes.
	{
		attributes: attributes( '3.7.9' ),
		save: withVersion( '3.7.9' )( Save ),
		migrate: attributes => {
			let newAttributes = deprecateContainerBackgroundColorOpacity.migrate( attributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			return deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
		},
	},
]
export default deprecated
