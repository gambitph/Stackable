/**
 * External dependencies
 */
import { getAttrNameFunction, __getValue } from '~stackable/util'

/**
 * Internal dependencies
 */

export const addBorderStyles = ( styles, attributes, options = {} ) => {
	const {
		selector = '',
		attrNameTemplate = '%s',
	} = options

	const getAttrName = getAttrNameFunction( attrNameTemplate )
	const getValue = __getValue( attributes, getAttrName )

	styles.add( {
		style: {
			[ selector ]: {
				borderRadius: getValue( 'borderRadius', '%spx' ),
				boxShadow: getValue( 'shadow' ),
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	if ( getValue( 'BorderType' ) ) {
		styles.add( {
			style: {
				[ selector ]: {
					borderRadius: getValue( 'borderRadius', '%spx' ),
					borderStyle: getValue( 'BorderType' ),
					borderColor: getValue( 'BorderColor' ) || '#000000',
					borderTopWidth: getValue( 'BorderWidthTop', '%spx' ) || '1px',
					borderRightWidth: getValue( 'BorderWidthRight', '%spx' ) || '1px',
					borderBottomWidth: getValue( 'BorderWidthBottom', '%spx' ) || '1px',
					borderLeftWidth: getValue( 'BorderWidthLeft', '%spx' ) || '1px',
				},
				tablet: {
					[ selector ]: {
						borderTopWidth: getValue( 'BorderWidthTopTablet', '%spx' ),
						borderRightWidth: getValue( 'BorderWidthRightTablet', '%spx' ),
						borderBottomWidth: getValue( 'BorderWidthBottomTablet', '%spx' ),
						borderLeftWidth: getValue( 'BorderWidthLeftTablet', '%spx' ),
					},
				},
				mobile: {
					[ selector ]: {
						borderTopWidth: getValue( 'BorderWidthTopMobile', '%spx' ),
						borderRightWidth: getValue( 'BorderWidthRightMobile', '%spx' ),
						borderBottomWidth: getValue( 'BorderWidthBottomMobile', '%spx' ),
						borderLeftWidth: getValue( 'BorderWidthLeftMobile', '%spx' ),
					},
				},
			},
			versionAdded: '3.0.0',
			versionDeprecated: '',
			// dependencies: [ getAttrName ],
		} )
	}
}

// borderRadius
// BorderType
// BorderColor
// BorderWidthTop
// BorderWidthRight
// BorderWidthBottom
// BorderWidthLeft
// BorderWidthTopTablet
// BorderWidthRightTablet
// BorderWidthBottomTablet
// BorderWidthLeftTablet
// BorderWidthTopMobile
// BorderWidthRightMobile
// BorderWidthBottomMobile
// BorderWidthLeftMobile
