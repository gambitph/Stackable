import { Save } from './save'
import { attributes } from './schema'

import { withVersion } from '~stackable/higher-order'
import {
	deprecateBlockBackgroundColorOpacity, deprecateContainerBackgroundColorOpacity, deprecateTypographyGradientColor,
	deprecateBlockShadowColor, deprecateContainerShadowColor,
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
		// create dummy element with editor-styles-wrapper class
		const dummyElement = document.createElement( 'div' )
		dummyElement.className = 'editor-styles-wrapper'
		dummyElement.classList.add( 'stk-dummy-element' )
		document.body.appendChild( dummyElement )

		// Get font-size of editor-styles-wrapper class
		const fontsize = window.getComputedStyle( dummyElement ).getPropertyValue( 'font-size' )
		baseFontSize = parseFloat( fontsize )
		dummyElement.remove()
	} catch ( e ) {
		baseFontSize = 16
	}

	return baseFontSize
}

// Convert font size in ordered list to pixels
const getEquivalentFontSize = iconSize => {
	return getBaseFontSize() * parseFloat( iconSize )
}

// Rounds off the value to the nearest x.25, x.5, x.75 or x.0
const getRoundedValue = value => {
	return Math.round( value * 4 ) / 4
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
		// Support the new shadow color.
		attributes: attributes( '3.12.11' ),
		save: withVersion( '3.12.11' )( Save ),
		isEligible: attributes => {
			const hasBlockShadow = deprecateBlockShadowColor.isEligible( attributes )
			const hasContainerShadow = deprecateContainerShadowColor.isEligible( attributes )

			return hasBlockShadow || hasContainerShadow
		},
		supports: {
			anchor: true,
			spacing: true,
			__unstablePasteTextInline: true,
			__experimentalSelector: 'ol,ul',
			__experimentalOnMerge: true,
		},
		migrate: ( attributes, innerBlocks ) => {
			let newAttributes = { ...attributes }
			const {
				text, icons, iconSize, ordered, iconGap,
			} = attributes

			const _iconSize = iconSize ? iconSize : 1
			const _iconGap = iconGap ? iconGap : 0

			newAttributes = {
				...newAttributes,
				listFullWidth: false,
				iconVerticalAlignment: 'baseline',
				iconGap: _iconGap + 4, // Our gap is smaller now.
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

			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( '%s' )( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )

			return [ newAttributes, innerBlocks ]
		},
	},
	{
		attributes: attributes( '3.12.8' ),
		save: withVersion( '3.12.8' )( Save ),
		supports: {
			anchor: true,
			spacing: true,
			__unstablePasteTextInline: true,
			__experimentalSelector: 'ol,ul',
			__experimentalOnMerge: true,
		},
		migrate: ( attributes, innerBlocks ) => {
			let newAttributes = { ...attributes }
			const {
				text, icons, iconSize, ordered, iconGap,
			} = attributes

			const _iconSize = iconSize ? iconSize : 1
			const _iconGap = iconGap ? iconGap : 0

			newAttributes = {
				...newAttributes,
				listFullWidth: false,
				iconVerticalAlignment: 'baseline',
				iconGap: _iconGap + 4, // Our gap is smaller now.
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

			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( '%s' )( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )

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
			newAttributes = deprecateTypographyGradientColor.migrate( '%s' )( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )

			return deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
		},
	},
]
export default deprecated
