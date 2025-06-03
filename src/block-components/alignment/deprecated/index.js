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
		versionDeprecated: '3.16.0',
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

		const newAttributes = {
			...attributes,
		}

		const containerHeight = getAttribute( 'containerHeight' )
		const innerBlockRowGap = getAttribute( 'innerBlockRowGap' )

		if ( typeof containerHeight === 'number' ) {
			newAttributes[ getAttrName( 'containerHeight' ) ] = String( containerHeight )
		}

		if ( typeof innerBlockRowGap === 'number' ) {
			newAttributes[ getAttrName( 'innerBlockRowGap' ) ] = String( innerBlockRowGap )
		}

		return newAttributes
	},
}

