/**
 * External dependencies
 */
import { find, isEqual } from 'lodash'
import rgba from 'color-rgba'

/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data'

/**
 * Function used to update an attribute based on the matched
 * custom css global property in attributes object.
 *
 * @param {string} attributes the attributes object of the block.
 * @param {Array} colorsBeforeReset set of colors before clicking reset button.
 * @param {Object} options additional function options
 *
 * @return {string} generated modified stringified attributes object.
 */
export const replaceGlobalColorAttributes = ( attributes = {}, colorsBeforeReset = [], options = {} ) => {
	if ( ! Array.isArray( colorsBeforeReset ) ) {
		return attributes
	}
	const {
		includeSlugNames = false,
		includeColorVar = true,
	} = options
	let updatedStringifiedAttributes = JSON.stringify( attributes )

	if ( includeColorVar ) {
		colorsBeforeReset.forEach( colorBeforeReset => {
			if ( colorBeforeReset.slug.match( /^stk-global-color/ ) ) {
				updatedStringifiedAttributes = updatedStringifiedAttributes.replace( new RegExp( `var\\(--${ colorBeforeReset.slug }, ${ colorBeforeReset.color.replace( ')', '\\)' ).replace( '(', '\\(' ) }\\)`, 'g' ), colorAttribute => {
					// Retain the color.
					return colorBeforeReset ? colorBeforeReset.color || '#000000' : colorAttribute
				} )
			}
		} )
	}

	if ( includeSlugNames ) {
		const stackableSlugNames = colorsBeforeReset.filter( color => color.slug && color.slug.match( /^stk-global-color/ ) ).map( color => color.slug )
		stackableSlugNames.forEach( stackableSlugName => {
			const foundColorBeforeReset = find( colorsBeforeReset, color => color.slug === stackableSlugName )
			updatedStringifiedAttributes = updatedStringifiedAttributes.replace( new RegExp( `"${ stackableSlugName }"`, 'g' ), foundColorBeforeReset ? `"${ foundColorBeforeReset.color }"` || '"#000000"' : '"#000000"' )
		} )
	}

	return JSON.parse( updatedStringifiedAttributes )
}

export const resetBlockColorAttributes = ( block, colorObjects ) => {
	const { clientId, name } = block
	const { updateBlockAttributes } = dispatch( 'core/block-editor' )

	if ( name.includes( 'ugb/' ) ) {
		//
		/**
		 * For stackable blocks.
		 * We are retaining the color of blocks that uses
		 * the deleted global color. Otherwise, reset its color
		 * as well.
		 */
		const updatedAttributes = replaceGlobalColorAttributes( block.attributes, colorObjects )

		// Update the block attributes.
		if ( ! isEqual( updatedAttributes, block.attributes ) ) {
			updateBlockAttributes( clientId, updatedAttributes )
		}
	} else if ( name.includes( 'core/' ) ) {
		//
		/**
		 * For core blocks.
		 * If a core block uses a color palette included in the theme,
		 * it uses the slug name as its attribute (e.g. textColor: "accent").
		 * Otherwise, textColor will be undefined and instead will add a style attribute
		 * (e.g. core/heading style: { color: "#123abc"}).
		 */
		if ( name.includes( 'heading' ) || name.includes( 'paragraph' ) ) {
			const newAttributes = { style: { color: {}, ...block.attributes.style } }
			const { backgroundColor, textColor } = block.attributes
			if ( backgroundColor ) {
				if ( backgroundColor.includes( 'stk-global-color-' ) ) {
					// Retain the color
					const colorVarMatch = backgroundColor.match( /stk-global-color-(\S*)/ )
					if ( colorVarMatch && Array.isArray( colorVarMatch ) && colorVarMatch.length >= 2 ) {
						const colorVarID = colorVarMatch[ 1 ]
						newAttributes.backgroundColor = undefined
						const appliedColor = find( colorObjects, color => color.slug === `stk-global-color-${ colorVarID }` )
						newAttributes.style.color.background = appliedColor ? appliedColor.color || '#000000' : '#000000'
					}
				}
			}

			if ( textColor ) {
				if ( textColor.includes( 'stk-global-color-' ) ) {
					// Retain the color
					const colorVarMatch = textColor.match( /stk-global-color-(\S*)/ )
					if ( colorVarMatch && Array.isArray( colorVarMatch ) && colorVarMatch.length >= 2 ) {
						const colorVarID = colorVarMatch[ 1 ]
						newAttributes.textColor = undefined
						const appliedColor = find( colorObjects, color => color.slug === `stk-global-color-${ colorVarID }` )
						newAttributes.style.color.text = appliedColor ? appliedColor.color || '#000000' : '#000000'
					}
				}
			}

			// Update the block attributes.
			updateBlockAttributes( clientId, newAttributes )
		}
	}
}

/**
 * Function used for updating the fallback values of
 * blocks in the editor using global colors.
 *
 * @param {{color: string, slug: string, name: string, colorVar: ?string, rgb: ?string}[]} updatedColors
 */
export const updateFallbackBlockAttributes = updatedColors => {
	const { updateBlockAttributes } = dispatch( 'core/block-editor' )

	const updateFallbackAttributesRecursive = blocks => {
		blocks.forEach( block => {
			const { clientId, name } = block
			if ( name.match( /^ugb\// ) ) {
				const newAttributes = updateFallbackColorAttributes( block.attributes, updatedColors )
				if ( ! isEqual( newAttributes, block.attributes ) ) {
					updateBlockAttributes( clientId, newAttributes )
				}
			}

			// Also adjust the inner blocks.
			if ( block.innerBlocks && block.innerBlocks.length ) {
				updateFallbackAttributesRecursive( block.innerBlocks )
			}
		} )
	}

	updateFallbackAttributesRecursive( select( 'core/block-editor' ).getBlocks() )
}

/**
 * Used to update the fallback values in attributes object
 *
 * @param {Object} attributes
 * @param {Array} colors
 *
 * @return {Object} modified attribute
 */
export const updateFallbackColorAttributes = ( attributes = {}, colors = [] ) => {
	if ( ! Array.isArray( colors ) ) {
		return attributes
	}

	let updatedStringifiedAttributes = JSON.stringify( attributes )

	const colorVars = colors.filter( color => color.slug.match( /^stk-global-color/ ) ).map( color => `--${ color.slug }` )
	colorVars.forEach( colorVar => {
		const colorVarRegExp = new RegExp( `var\\(${ colorVar },(.?)#(.*?(?=\\)))\\)`, 'g' )
		updatedStringifiedAttributes = updatedStringifiedAttributes.replace( colorVarRegExp, colorAttribute => {
			const newColor = find( colors, updatedColor => `--${ updatedColor.slug }` === colorVar )
			if ( newColor ) {
				return `var(${ colorVar }, ${ newColor.color })`
			}

			return colorAttribute
		} )
	} )

	return JSON.parse( updatedStringifiedAttributes )
}

export const createColor = () => {
	return `#${ ( ( 1 << 24 ) * Math.random() | 0 ).toString( 16 ) }` // eslint-disable-line no-bitwise
}

export const getRgb = hex => {
	const rgbColor = rgba( hex.match( /^#/ ) ? hex : `#${ hex }` )
	rgbColor.splice( 3, 1 )
	return rgbColor.join( ', ' )
}
