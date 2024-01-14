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

// Get base font size
const getBaseFontSize = () => {
	let baseFontSize
	try {
		// get font size defined in :root
		const root = window.getComputedStyle( document.documentElement )
			.getPropertyValue( '--wp--preset--font-size--normal' )

		// create dummy element with editor-styles-wrapper class
		const dummyElement = document.createElement( 'div' )
		dummyElement.className = 'editor-styles-wrapper'
		document.body.appendChild( dummyElement )

		// Get font-size of editor-styles-wrapper class
		// which is defined as var(--wp--preset--font-size--medium)
		const fontsize = window.getComputedStyle( dummyElement ).getPropertyValue( '--wp--preset--font-size--medium' )

		// note that root is in px while fontsize is in rem
		baseFontSize = parseFloat( root ) * parseFloat( fontsize )
	} catch ( e ) {
		baseFontSize = 16.8
	}

	return baseFontSize
}

// Convert font size in ordered list to pixels
const getEquivalentFontSize = iconSize => {
	return getBaseFontSize() * parseFloat( iconSize )
}

// Rounds off the value to the nearest x.5 or x.0
const getRoundedValue = value => {
	return Math.round( value * 2 ) / 2
}

// Convert actual icon size in unordered list
const getEquivalentIconSize = iconSize => {
	const baseFontSize = getBaseFontSize()

	// Actual size of icon is rounded off to the nearest x.5 or x.0
	const unroundedValue = baseFontSize * parseFloat( iconSize )
	return getRoundedValue( unroundedValue / 2.067 )
}

const deprecated = [
	{
		attributes: attributes( '3.12.8' ),
		save: withVersion( '3.12.8' )( Save ),
		migrate: ( attributes, innerBlocks ) => {
			let newAttributes = { ...attributes }
			const {
				text, icons, iconSize, ordered,
			} = attributes

			const _iconSize = iconSize ? iconSize : 1

			newAttributes = {
				...newAttributes,
				iconSize: ordered
					? getEquivalentFontSize( _iconSize )
					: getEquivalentIconSize( _iconSize ),
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
