import {
	extractRgba, rgbaToHexAlpha, getAttrNameFunction,
} from '~stackable/util'

export const deprecatedAddAttributes = ( attrObject, options ) => {
	const {
		attrNameTemplate = '%s',
	} = options

	attrObject.add( {
		attributes: {
			textColor2: {
				type: 'string',
				default: '',
			},
			textGradientDirection: {
				type: 'number',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '3.12.0',
		attrNameTemplate,
	} )

	attrObject.add( {
		attributes: {
			fontSize: {
				stkResponsive: true,
				type: 'number',
				default: '',
				stkUnits: 'px',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '3.16.0',
		attrNameTemplate,
	} )
}

export const deprecateTypographyGradientColor = {
	isEligible: attrNameTemplate => attributes => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		const getAttribute = _attrName => attributes[ getAttrName( _attrName ) ]

		return getAttribute( 'textColorType' ) === 'gradient' && getAttribute( 'textColor2' )
	},
	migrate: attrNameTemplate => attributes => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		const getAttribute = _attrName => attributes[ getAttrName( _attrName ) ]

		const newAttributes = {
			...attributes,
			[ getAttrName( 'textColor2' ) ]: undefined,
			[ getAttrName( 'textGradientDirection' ) ]: undefined,
		}

		if ( getAttribute( 'textColorType' ) === 'gradient' && getAttribute( 'textColor2' ) ) {
			const textColor1 = getAttribute( 'textColor1' ) || getAttribute( 'textColor2' )
			const textColor2 = getAttribute( 'textColor2' ) || getAttribute( 'textColor1' )

			const isTextColor1Gradient = textColor1 && textColor1.includes( '-gradient' )
			const isTextColor2Gradient = textColor2 && textColor2.includes( '-gradient' )

			if ( ! isTextColor1Gradient && ! isTextColor2Gradient ) {
				const textGradientDirection = getAttribute( 'textGradientDirection' ) || getAttribute( 'textGradientDirection' ) === 0 ? getAttribute( 'textGradientDirection' ) : 180
				newAttributes[ getAttrName( 'textColor1' ) ] = `linear-gradient(${ textGradientDirection }deg, ${ textColor1 } 0%, ${ textColor2 } 100%)`
			}
		}

		return newAttributes
	},
}

export const deprecateTypographyShadowColor = {
	isEligible: attrNameTemplate => attributes => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		const getAttribute = _attrName => attributes[ getAttrName( _attrName ) ]

		if ( getAttribute( 'textShadow' ) || getAttribute( 'textShadowHover' ) || getAttribute( 'textShadowParentHover' ) ) {
			return true
		}

		return false
	},
	migrate: attrNameTemplate => attributes => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		const getAttribute = _attrName => attributes[ getAttrName( _attrName ) ]

		const newAttributes = {
			...attributes,
		}

		const shadow = getAttribute( 'textShadow' )
		const shadowHover = getAttribute( 'textShadowHover' ) || shadow
		const shadowParentHover = getAttribute( 'textShadowParentHover' ) || shadowHover

		if ( getAttribute( 'textShadow' ) && getAttribute( 'textShadow' ).indexOf( 'rgba' ) !== -1 ) {
			const { options, color } = extractRgba( shadowHover )
			const hex = rgbaToHexAlpha( color )
			newAttributes[ getAttrName( 'textShadow' ) ] = `${ options } ${ hex }`
		}

		if ( getAttribute( 'textShadowHover' ) && getAttribute( 'textShadowHover' ).indexOf( 'rgba' ) !== -1 ) {
			const { options, color } = extractRgba( shadowHover )
			const hex = rgbaToHexAlpha( color )
			newAttributes[ getAttrName( 'textShadowHover' ) ] = `${ options } ${ hex }`
		}

		if ( getAttribute( 'textShadowParentHover' ) && getAttribute( 'textShadowParentHover' ).indexOf( 'rgba' ) !== -1 ) {
			const { options, color } = extractRgba( shadowParentHover )
			const hex = rgbaToHexAlpha( color )
			newAttributes[ getAttrName( 'textShadowParentHover' ) ] = `${ options } ${ hex }`
		}

		return newAttributes
	},
}

export const deprecateTypographyFontSize = {
	isEligible: attrNameTemplate => attributes => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		const getAttribute = _attrName => attributes[ getAttrName( _attrName ) ]

		const fontSize = getAttribute( 'fontSize' )

		return typeof fontSize === 'number'
	},
	migrate: attrNameTemplate => attributes => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		const getAttribute = _attrName => attributes[ getAttrName( _attrName ) ]

		const newAttributes = {
			...attributes,
		}

		const fontSize = getAttribute( 'fontSize' )

		if ( typeof fontSize === 'number' ) {
			newAttributes[ getAttrName( 'fontSize' ) ] = String( fontSize )
		}

		return newAttributes
	},
}
