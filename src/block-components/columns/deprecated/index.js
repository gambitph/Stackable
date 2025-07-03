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
		const columnSpacingTablet = getAttribute( 'columnSpacingTablet' )
		const columnSpacingMobile = getAttribute( 'columnSpacingMobile' )

		const columnGap = getAttribute( 'columnGap' )
		const columnGapTablet = getAttribute( 'columnGapTablet' )
		const columnGapMobile = getAttribute( 'columnGapMobile' )

		const rowGap = getAttribute( 'rowGap' )
		const rowGapTablet = getAttribute( 'rowGapTablet' )
		const rowGapMobile = getAttribute( 'rowGapMobile' )

		return (
			typeof columnSpacing === 'number' ||
			typeof columnSpacingTablet === 'number' ||
			typeof columnSpacingMobile === 'number' ||
			typeof columnGap === 'number' ||
			typeof columnGapTablet === 'number' ||
			typeof columnGapMobile === 'number' ||
			typeof rowGap === 'number' ||
			typeof rowGapTablet === 'number' ||
			typeof rowGapMobile === 'number'
		)
	},

	migrate: attrNameTemplate => attributes => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		const getAttribute = _attrName => attributes[ getAttrName( _attrName ) ]

		const newAttributes = { ...attributes }

		const columnSpacing = getAttribute( 'columnSpacing' )
		const columnSpacingTablet = getAttribute( 'columnSpacingTablet' )
		const columnSpacingMobile = getAttribute( 'columnSpacingMobile' )

		const columnGap = getAttribute( 'columnGap' )
		const columnGapTablet = getAttribute( 'columnGapTablet' )
		const columnGapMobile = getAttribute( 'columnGapMobile' )

		const rowGap = getAttribute( 'rowGap' )
		const rowGapTablet = getAttribute( 'rowGapTablet' )
		const rowGapMobile = getAttribute( 'rowGapMobile' )

		if ( typeof columnSpacing === 'number' ) {
			newAttributes[ getAttrName( 'columnSpacing' ) ] = String( columnSpacing )
		}
		if ( typeof columnSpacingTablet === 'number' ) {
			newAttributes[ getAttrName( 'columnSpacingTablet' ) ] = String( columnSpacingTablet )
		}
		if ( typeof columnSpacingMobile === 'number' ) {
			newAttributes[ getAttrName( 'columnSpacingMobile' ) ] = String( columnSpacingMobile )
		}

		if ( typeof columnGap === 'number' ) {
			newAttributes[ getAttrName( 'columnGap' ) ] = String( columnGap )
		}
		if ( typeof columnGapTablet === 'number' ) {
			newAttributes[ getAttrName( 'columnGapTablet' ) ] = String( columnGapTablet )
		}
		if ( typeof columnGapMobile === 'number' ) {
			newAttributes[ getAttrName( 'columnGapMobile' ) ] = String( columnGapMobile )
		}

		if ( typeof rowGap === 'number' ) {
			newAttributes[ getAttrName( 'rowGap' ) ] = String( rowGap )
		}
		if ( typeof rowGapTablet === 'number' ) {
			newAttributes[ getAttrName( 'rowGapTablet' ) ] = String( rowGapTablet )
		}
		if ( typeof rowGapMobile === 'number' ) {
			newAttributes[ getAttrName( 'rowGapMobile' ) ] = String( rowGapMobile )
		}

		return newAttributes
	},
}
