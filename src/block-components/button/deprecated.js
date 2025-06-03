import { getAttrNameFunction } from '~stackable/util'

export const deprecatedAddAttributes = ( attrObject, options ) => {
	const {
		attrNameTemplate = 'button%s',
	} = options

	attrObject.add( {
		attributes: {
			backgroundColor2: {
				stkHover: true,
				type: 'string',
				default: '',
			},
			backgroundGradientDirection: {
				stkHover: true,
				type: 'number',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '3.12.0',
		attrNameTemplate,
	} )
}

export const deprecateButtonGradientColor = {
	isEligible: attrNameTemplate => attributes => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		const getAttribute = _attrName => attributes[ getAttrName( _attrName ) ]

		return getAttribute( 'backgroundColorType' ) === 'gradient' && getAttribute( 'backgroundColor2' )
	},
	migrate: attrNameTemplate => attributes => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		const getAttribute = _attrName => attributes[ getAttrName( _attrName ) ]

		const newAttributes = {
			...attributes,
			[ getAttrName( 'backgroundColor2' ) ]: undefined,
			[ getAttrName( 'backgroundGradientDirection' ) ]: undefined,
		}

		if ( getAttribute( 'backgroundColorType' ) === 'gradient' ) {
			const color1 = getAttribute( 'backgroundColor' )
			const color2 = getAttribute( 'backgroundColor2' ) || getAttribute( 'backgroundColor' )
			const gradientDirection = getAttribute( 'backgroundGradientDirection' ) || getAttribute( 'backgroundGradientDirection' ) === 0 ? getAttribute( 'backgroundGradientDirection' ) : 90

			const color1Hover = getAttribute( 'backgroundColorHover' ) || undefined
			const color2Hover = getAttribute( 'backgroundColor2Hover' ) || color1Hover
			const gradientDirectionHover = getAttribute( 'backgroundGradientDirectionHover' ) || getAttribute( 'backgroundGradientDirectionHover' ) === 0 ? getAttribute( 'backgroundGradientDirectionHover' ) : 90

			const color1ParentHover = getAttribute( 'backgroundColorParentHover' ) || undefined
			const color2ParentHover = getAttribute( 'backgroundColor2ParentHover' ) || color1ParentHover
			const gradientDirectionParentHover = getAttribute( 'backgroundGradientDirectionParentHover' ) || getAttribute( 'backgroundGradientDirectionParentHover' ) === 0 ? getAttribute( 'backgroundGradientDirectionParentHover' ) : 90

			const isColor1Gradient = color1 && color1.includes( 'linear-gradient' )
			const isColor2Gradient = color2 && color2.includes( 'linear-gradient' )
			if ( color1 && color2 && ! isColor1Gradient && ! isColor2Gradient ) {
				newAttributes[ getAttrName( 'backgroundColor' ) ] = `linear-gradient(${ gradientDirection }deg, ${ color1 } 0%, ${ color2 } 100%)`
			}

			const isColor1HoverGradient = color1Hover && color1Hover.includes( 'linear-gradient' )
			const isColor2HoverGradient = color2Hover && color2Hover.includes( 'linear-gradient' )
			if ( color1Hover && color2Hover && ! isColor1HoverGradient && ! isColor2HoverGradient ) {
				newAttributes[ getAttrName( 'backgroundColorHover' ) ] = `linear-gradient(${ gradientDirectionHover }deg, ${ color1Hover } 0%, ${ color2Hover } 100%)`
			}

			const isColor1ParentHoverGradient = color1ParentHover && color1ParentHover.includes( 'linear-gradient' )
			const isColor2ParentHoverGradient = color2ParentHover && color2ParentHover.includes( 'linear-gradient' )
			if ( color1ParentHover && color2ParentHover && ! isColor1ParentHoverGradient && ! isColor2ParentHoverGradient ) {
				newAttributes[ getAttrName( 'backgroundColorParentHover' ) ] = `linear-gradient(${ gradientDirectionParentHover }deg, ${ color1ParentHover } 0%, ${ color2ParentHover } 100%)`
			}
		}

		return newAttributes
	},
}
