import { colorOpacityToHexAplha, getAttrNameFunction } from '~stackable/util'

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
		versionDeprecated: '3.12.0',
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
