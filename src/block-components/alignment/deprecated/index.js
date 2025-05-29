import { getAttrNameFunction } from '~stackable/util'

export const deprecatedAddAttributes = ( attrObject, attrNameTemplate = '%s' ) => {
	attrObject.add( {
		attributes: {
			innerBlockRowGap: {
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

export const deprecateInnerBlockRowGapAndContainerHeight = {
	isEligible: attrNameTemplate => attributes => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		const getAttribute = _attrName => attributes[ getAttrName( _attrName ) ]

		const containerHeight = getAttribute( 'containerHeight' )
		const innerBlockRowGap = getAttribute( 'innerBlockRowGap' )

		return typeof containerHeight === 'number' || typeof innerBlockRowGap === 'number'
	},
	migrate: attrNameTemplate => attributes => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		const getAttribute = _attrName => attributes[ getAttrName( _attrName ) ]

		const containerHeight = getAttribute( 'containerHeight' )
		const innerBlockRowGap = getAttribute( 'innerBlockRowGap' )

		const newAttributes = {
			...attributes,
			[ getAttrName( 'containerHeight' ) ]: String( containerHeight ),
			[ getAttrName( 'innerBlockRowGap' ) ]: String( innerBlockRowGap ),
		}

		return newAttributes
	},
}

