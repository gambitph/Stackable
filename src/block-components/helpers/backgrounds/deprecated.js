import { getAttrNameFunction } from '~stackable/util'

export const deprecatedAddAttributes = ( attrObject, attrNameTemplate = '%s' ) => {
	attrObject.add( {
		attributes: {
			backgroundColorOpacity: {
				stkHover: true,
				type: 'number',
				default: '',
			},
		},
		attrNameTemplate,
		versionAdded: '3.0.0',
		versionDeprecated: '3.11.0',
	} )
}

// TODO: all deprecations should be combined into just one large deprecation for all.
export const deprecationBackgrounColorOpacity = {
	isEligible: attrNameTemplate => attributes => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		const getAttribute = _attrName => attributes[ getAttrName( _attrName ) ]

		// For single color, move
		if ( ! getAttribute( 'backgroundColorType' ) ) {
			if ( ( getAttribute( 'backgroundColorOpacity' ) || getAttribute( 'backgroundColorOpacity' ) === 0 ) ||
			     ( getAttribute( 'backgroundColorOpacityHover' ) || getAttribute( 'backgroundColorOpacityHover' ) === 0 ) ||
			     ( getAttribute( 'backgroundColorOpacityParentHover' ) || getAttribute( 'backgroundColorOpacityParentHover' ) === 0 )
			) {
				return true
			}
		}
		return false
	},
	migrate: attrNameTemplate => attributes => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		const getAttribute = _attrName => attributes[ getAttrName( _attrName ) ]

		const newAttributes = {
			...attributes,
			[ getAttrName( 'backgroundColorOpacity' ) ]: undefined,
			[ getAttrName( 'backgroundColorOpacityHover' ) ]: undefined,
			[ getAttrName( 'backgroundColorOpacityParentHover' ) ]: undefined,
		}

		const backgroundColor = getAttribute( 'backgroundColor' )
		const backgroundColorHover = getAttribute( 'backgroundColorHover' ) || backgroundColor
		const backgroundColorParentHover = getAttribute( 'backgroundColorParentHover' ) || backgroundColorHover

		if ( getAttribute( 'backgroundColorOpacity' ) || getAttribute( 'backgroundColorOpacity' ) === 0 ) {
			newAttributes[ getAttrName( 'backgroundColor' ) ] = colorOpacityToHexAplha( backgroundColor, getAttribute( 'backgroundColorOpacity' ) )
		}

		if ( getAttribute( 'backgroundColorOpacityHover' ) || getAttribute( 'backgroundColorOpacityHover' ) === 0 ) {
			newAttributes[ getAttrName( 'backgroundColorHover' ) ] = colorOpacityToHexAplha( backgroundColorHover, getAttribute( 'backgroundColorOpacityHover' ) )
		}

		if ( getAttribute( 'backgroundColorOpacityParentHover' ) || getAttribute( 'backgroundColorOpacityParentHover' ) === 0 ) {
			newAttributes[ getAttrName( 'backgroundColorParentHover' ) ] = colorOpacityToHexAplha( backgroundColorParentHover, getAttribute( 'backgroundColorOpacityParentHover' ) )
		}

		return newAttributes
	},
}

/**
 * Combines a hex or var() color with an opacity value to a hex color with alpha
 * #RRGGBBAA format.
 *
 * When deprecating the opacity, if the color is a normal hex value, deprecate
 * to:
 *
 * color: #abcdef opacity: 0.1 new color: #abcdef1a
 *
 * formula: Math.ceil((0.42 * 255)).toString(16).padStart(2, '0')
 *
 * color: var(--stk-global-color-10793, #00ffe1) opacity: 0.4 new color:
 * color-mix(in srgb, var(--stk-global-color-10793, #00ffe1) 40%, transparent)
 *
 * @param {string} color color in hex or var() format
 * @param {float} opacity opacity 0.0-1.0
 * @return {string} color in #RRGGBBAA format
 */
export const colorOpacityToHexAplha = ( color, opacity ) => {
	if ( color.startsWith( '#' ) ) {
		// Get the first 6 hex digits.
		const hex = color.slice( 0, 7 )
		return hex + Math.ceil( ( opacity * 255 ) ).toString( 16 ).padStart( 2, '0' )
	} else if ( color.includes( 'var(' ) ) {
		return `color-mix(in srgb, ${ color } ${ opacity * 100 }%, transparent)`
	}
	return color
}
