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

const deprecated = [
	{
		attributes: attributes( '3.12.8' ),
		save: withVersion( '3.12.8' )( Save ),
		migrate: ( attributes, innerBlocks ) => {
			const {
				text, icons, ...newAttributes
			} = { ...attributes }

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
