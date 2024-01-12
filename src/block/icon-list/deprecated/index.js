import { Save } from './save'
import { attributes } from '../schema'

import { withVersion } from '~stackable/higher-order'
import {
	deprecateBlockBackgroundColorOpacity, deprecateContainerBackgroundColorOpacity, deprecateTypographyGradientColor,
} from '~stackable/block-components'

import { createBlock } from '@wordpress/blocks'

const textToArray = text => {
	const liTags = Array.from( text.matchAll( /<li>(.*?)<\/li>/gs ) )
	const contents = liTags.map( tag => tag[ 1 ] )
	return contents
}

const getUniqueIcon = ( icons, index ) => {
	if ( ! icons ) {
		return
	}
	const key = `ul li:nth-child(${ index + 1 })`
	if ( ! ( key in icons ) ) {
		return
	}
	return icons[ key ]
}

const getEquivalentIconSize = iconSize => {
	// Old icon list sets iconSize to fontSize
	// but the actual size of the icons are smaller by ~2.067 times.
	const actualSize = parseFloat( iconSize ) / 2.067
	// return value rounded to the nearest 0.1
	return Math.round( actualSize * 10 ) / 10
}

const deprecated = [
	{
		attributes: attributes( '3.12.8' ),
		save: withVersion( '3.12.8' )( Save ),
		migrate: ( attributes, innerBlocks ) => {
			let newAttributes = { ...attributes }
			const {
				text, icons, iconSize,
			} = attributes

			if ( iconSize ) {
				newAttributes = { ...newAttributes, iconSize: getEquivalentIconSize( iconSize ) }
			}

			if ( ! text ) {
				const block = createBlock( 'stackable/icon-list-item' )
				innerBlocks = [ block ]
			} else {
				const contents = textToArray( text )
				const blocks = contents.map( ( content, index ) => {
					return createBlock( 'stackable/icon-list-item', {
						text: content,
						icon: getUniqueIcon( icons, index ),
					} )
				} )
				innerBlocks = blocks
			}

			return [ newAttributes, innerBlocks ]
		},
	},
	// Support the new combined opacity and color.
	{
		attributes: attributes( '3.11.9' ),
		save: withVersion( '3.11.9' )( Save ),
		isEligible: attributes => {
			const hasContainerOpacity = deprecateContainerBackgroundColorOpacity.isEligible( attributes )
			const hasBlockOpacity = deprecateBlockBackgroundColorOpacity.isEligible( attributes )
			const hasTextGradient = deprecateTypographyGradientColor.isEligible( '%s' )( attributes )

			return hasContainerOpacity || hasBlockOpacity || hasTextGradient
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( '%s' )( newAttributes )

			return newAttributes
		},
	},
	// Support new margin-top/bottom classes.
	{
		attributes: attributes( '3.7.9' ),
		save: withVersion( '3.7.9' )( Save ),
		migrate: attributes => {
			let newAttributes = deprecateContainerBackgroundColorOpacity.migrate( attributes )
			newAttributes = deprecateTypographyGradientColor.migrate( '%s' )( newAttributes )

			return deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
		},
	},
]
export default deprecated
