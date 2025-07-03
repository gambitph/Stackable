import { getAttrNameFunction } from '~stackable/util'

export const deprecatedAddAttributes = ( attrObject, attrNameTemplate = '%s' ) => {
	attrObject.add( {
		attributes: {
			height: {
				stkResponsive: true,
				stkUnits: 'px',
				type: 'number',
				default: '',
			},
		},
		attrNameTemplate,
		versionAdded: '3.0.0',
		versionDeprecated: '3.16.0',
	} )
}

export const deprecateSizeControlHeight = {
	isEligible: attrNameTemplate => attributes => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		const getAttribute = _attrName => attributes[ getAttrName( _attrName ) ]

		const height = getAttribute( 'height' )
		const heightTablet = getAttribute( 'heightTablet' )
		const heightMobile = getAttribute( 'heightMobile' )

		return typeof height === 'number' ||
			typeof heightTablet === 'number' ||
			typeof heightMobile === 'number'
	},
	migrate: attrNameTemplate => attributes => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		const getAttribute = _attrName => attributes[ getAttrName( _attrName ) ]

		const newAttributes = {
			...attributes,
		}

		const height = getAttribute( 'height' )
		const heightTablet = getAttribute( 'heightTablet' )
		const heightMobile = getAttribute( 'heightMobile' )

		if ( typeof height === 'number' ) {
			newAttributes[ getAttrName( 'height' ) ] = String( height )
		}

		if ( typeof heightTablet === 'number' ) {
			newAttributes[ getAttrName( 'heightTablet' ) ] = String( heightTablet )
		}

		if ( typeof heightMobile === 'number' ) {
			newAttributes[ getAttrName( 'heightMobile' ) ] = String( heightMobile )
		}

		return newAttributes
	},
}
