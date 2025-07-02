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
		const containerHeightTablet = getAttribute( 'containerHeightTablet' )
		const containerHeightMobile = getAttribute( 'containerHeightMobile' )
		const innerBlockRowGap = getAttribute( 'innerBlockRowGap' )
		const innerBlockRowGapTablet = getAttribute( 'innerBlockRowGapTablet' )
		const innerBlockRowGapMobile = getAttribute( 'innerBlockRowGapMobile' )

		return typeof containerHeight === 'number' || typeof innerBlockRowGap === 'number' ||
			typeof containerHeightTablet === 'number' || typeof innerBlockRowGapTablet === 'number' ||
			typeof containerHeightMobile === 'number' || typeof innerBlockRowGapMobile === 'number'
	},
	migrate: attrNameTemplate => attributes => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		const getAttribute = _attrName => attributes[ getAttrName( _attrName ) ]

		const newAttributes = {
			...attributes,
		}

		const containerHeight = getAttribute( 'containerHeight' )
		const containerHeightTablet = getAttribute( 'containerHeightTablet' )
		const containerHeightMobile = getAttribute( 'containerHeightMobile' )
		const innerBlockRowGap = getAttribute( 'innerBlockRowGap' )
		const innerBlockRowGapTablet = getAttribute( 'innerBlockRowGapTablet' )
		const innerBlockRowGapMobile = getAttribute( 'innerBlockRowGapMobile' )

		if ( typeof containerHeight === 'number' ) {
			newAttributes[ getAttrName( 'containerHeight' ) ] = String( containerHeight )
		}

		if ( typeof containerHeightTablet === 'number' ) {
			newAttributes[ getAttrName( 'containerHeightTablet' ) ] = String( containerHeightTablet )
		}

		if ( typeof containerHeightMobile === 'number' ) {
			newAttributes[ getAttrName( 'containerHeightMobile' ) ] = String( containerHeightMobile )
		}

		if ( typeof innerBlockRowGap === 'number' ) {
			newAttributes[ getAttrName( 'innerBlockRowGap' ) ] = String( innerBlockRowGap )
		}

		if ( typeof innerBlockRowGapTablet === 'number' ) {
			newAttributes[ getAttrName( 'innerBlockRowGapTablet' ) ] = String( innerBlockRowGapTablet )
		}

		if ( typeof innerBlockRowGapMobile === 'number' ) {
			newAttributes[ getAttrName( 'innerBlockRowGapMobile' ) ] = String( innerBlockRowGapMobile )
		}

		return newAttributes
	},
}

