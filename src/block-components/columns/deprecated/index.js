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
			columnSpacing: {
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

export const deprecateColumnAndRowGap = {
	isEligible: attrNameTemplate => attributes => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		const getAttribute = _attrName => attributes[ getAttrName( _attrName ) ]

		const columnSpacing = getAttribute( 'columnSpacing' )
		const columnGap = getAttribute( 'columnGap' )
		const rowGap = getAttribute( 'rowGap' )

		return typeof columnSpacing === 'number' || typeof columnGap === 'number' || typeof rowGap === 'number'
	},
	migrate: attrNameTemplate => attributes => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		const getAttribute = _attrName => attributes[ getAttrName( _attrName ) ]

		const newAttributes = {
			...attributes,
		}

		const columnSpacing = getAttribute( 'columnSpacing' )
		const columnGap = getAttribute( 'columnGap' )
		const rowGap = getAttribute( 'rowGap' )

		if ( typeof columnSpacing === 'number' ) {
			newAttributes[ getAttrName( 'columnSpacing' ) ] = String( columnSpacing )
		}

		if ( typeof columnGap === 'number' ) {
			newAttributes[ getAttrName( 'columnGap' ) ] = String( columnGap )
		}

		if ( typeof rowGap === 'number' ) {
			newAttributes[ getAttrName( 'rowGap' ) ] = String( rowGap )
		}

		return newAttributes
	},
}
