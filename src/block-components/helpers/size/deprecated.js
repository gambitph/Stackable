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
		versionDeprecated: '3.15.3',
	} )
}

export const deprecateSizeControlHeight = {
	isEligible: attrNameTemplate => attributes => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		const getAttribute = _attrName => attributes[ getAttrName( _attrName ) ]

		const height = getAttribute( 'height' )

		return typeof height === 'number'
	},
	migrate: attrNameTemplate => attributes => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		const getAttribute = _attrName => attributes[ getAttrName( _attrName ) ]

		const height = getAttribute( 'height' )

		const newAttributes = {
			...attributes,
			[ getAttrName( 'height' ) ]: String( height ),
		}

		return newAttributes
	},
}
