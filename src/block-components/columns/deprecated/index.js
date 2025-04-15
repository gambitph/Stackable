import { getAttrNameFunction } from '~stackable/util'

export const deprecatedAddAttributes = ( attrObject, attrNameTemplate = '%s' ) => {
	attrObject.add( {
		attributes: {
			columnGap: {
				stkResponsive: true,
				type: 'number',
				default: '',
			},
			rowGap: {
				stkResponsive: true,
				type: 'number',
				default: '',
			},
		},
		attrNameTemplate,
		versionAdded: '3.0.0',
		versionDeprecated: '3.15.3',
	} )
}

export const deprecateColumnAndRowGap = {
	isEligible: attrNameTemplate => attributes => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		const getAttribute = _attrName => attributes[ getAttrName( _attrName ) ]

		const columnGap = getAttribute( 'columnGap' )
		const rowGap = getAttribute( 'rowGap' )

		return typeof columnGap === 'number' || typeof rowGap === 'number'
	},
	migrate: attrNameTemplate => attributes => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		const getAttribute = _attrName => attributes[ getAttrName( _attrName ) ]

		const columnGap = getAttribute( 'columnGap' )
		const rowGap = getAttribute( 'rowGap' )

		const newAttributes = {
			...attributes,
			[ getAttrName( 'columnGap' ) ]: String( columnGap ),
			[ getAttrName( 'rowGap' ) ]: String( rowGap ),
		}

		return newAttributes
	},
}
