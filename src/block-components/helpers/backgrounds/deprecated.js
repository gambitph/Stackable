import { colorOpacityToHexAplha, getAttrNameFunction } from '~stackable/util'

export const deprecatedAddAttributes = ( attrObject, attrNameTemplate = '%s' ) => {
	attrObject.add( {
		attributes: {
			backgroundColorOpacity: {
				stkHover: true,
				type: 'number',
				default: '',
			},

			// Gradient attributes.
			backgroundColor2: {
				type: 'string',
				default: '',
			},
			backgroundGradientDirection: {
				type: 'number',
				default: '',
			},
			backgroundGradientLocation1: {
				type: 'number',
				default: '',
			},
			backgroundGradientLocation2: {
				type: 'number',
				default: '',
			},
		},
		attrNameTemplate,
		versionAdded: '3.0.0',
		versionDeprecated: '3.12.0',
	} )
}

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

		// Gradient background color.
		if ( getAttribute( 'backgroundColorType' ) === 'gradient' && ! getAttribute( 'backgroundColor' )?.includes( '-gradient' ) ) {
			return true
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
			[ getAttrName( 'backgroundColor2' ) ]: undefined,
			[ getAttrName( 'backgroundGradientDirection' ) ]: undefined,
			[ getAttrName( 'backgroundGradientLocation1' ) ]: undefined,
			[ getAttrName( 'backgroundGradientLocation2' ) ]: undefined,
		}

		if ( ! getAttribute( 'backgroundColorType' ) ) {
			if ( ( getAttribute( 'backgroundColorOpacity' ) || getAttribute( 'backgroundColorOpacity' ) === 0 ) ||
			     ( getAttribute( 'backgroundColorOpacityHover' ) || getAttribute( 'backgroundColorOpacityHover' ) === 0 ) ||
			     ( getAttribute( 'backgroundColorOpacityParentHover' ) || getAttribute( 'backgroundColorOpacityParentHover' ) === 0 )
			) {
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
			}
		}

		// Gradient.
		if ( getAttribute( 'backgroundColorType' ) === 'gradient' && ! getAttribute( 'backgroundColor' )?.includes( '-gradient' ) ) {
			const backgroundColor = newAttributes[ getAttrName( 'backgroundColor' ) ]
			const backgroundColor2 = getAttribute( 'backgroundColor2' ) || 'rgba(0,0,0,0)'

			const direction = getAttribute( 'backgroundGradientDirection' ) || getAttribute( 'backgroundGradientDirection' ) === 0 ? getAttribute( 'backgroundGradientDirection' ) : 90
			const location1 = getAttribute( 'backgroundGradientLocation1' ) || 0
			const location2 = getAttribute( 'backgroundGradientLocation2' ) || 100

			newAttributes[ getAttrName( 'backgroundColor' ) ] = `linear-gradient(${ direction }deg, ${ backgroundColor } ${ location1 }%, ${ backgroundColor2 } ${ location2 }%)`
		}

		return newAttributes
	},
}
