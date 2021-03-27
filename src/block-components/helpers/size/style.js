/**
 * External dependencies
 */
import { getAttrNameFunction, __getValue } from '~stackable/util'

/**
 * Internal dependencies
 */

export const addSizeStyles = ( styles, attributes, options = {} ) => {
	const {
		selector = '',
		attrNameTemplate = '%s',
	} = options

	const getAttrName = getAttrNameFunction( attrNameTemplate )
	const getValue = __getValue( attributes, getAttrName )

	// Paddings and margins.
	styles.add( {
		style: {
			desktopTablet: {
				[ selector ]: {
					marginTop: getValue( 'marginTop', `%s${ getValue( 'marginUnit' ) }` ),
					marginBottom: getValue( 'marginBottom', `%s${ getValue( 'marginUnit' ) }` ),
					marginRight: getValue( 'marginRight', `%s${ getValue( 'marginUnit' ) }` ),
					marginLeft: getValue( 'marginLeft', `%s${ getValue( 'marginUnit' ) }` ),
					paddingTop: getValue( 'paddingTop', `%s${ getValue( 'paddingUnit' ) }` ),
					paddingBottom: getValue( 'paddingBottom', `%s${ getValue( 'paddingUnit' ) }` ),
					paddingRight: getValue( 'paddingRight', `%s${ getValue( 'paddingUnit' ) }` ),
					paddingLeft: getValue( 'paddingLeft', `%s${ getValue( 'paddingUnit' ) }` ),
				},
			},
			tabletOnly: {
				[ selector ]: {
					marginTop: getValue( 'marginTopTablet', `%s${ getValue( 'marginUnitTablet' ) }` ),
					marginBottom: getValue( 'marginBottomTablet', `%s${ getValue( 'marginUnitTablet' ) }` ),
					marginRight: getValue( 'marginRightTablet', `%s${ getValue( 'marginUnitTablet' ) }` ),
					marginLeft: getValue( 'marginLeftTablet', `%s${ getValue( 'marginUnitTablet' ) }` ),
					paddingTop: getValue( 'paddingTopTablet', `%s${ getValue( 'paddingUnitTablet' ) }` ),
					paddingBottom: getValue( 'paddingBottomTablet', `%s${ getValue( 'paddingUnitTablet' ) }` ),
					paddingRight: getValue( 'paddingRightTablet', `%s${ getValue( 'paddingUnitTablet' ) }` ),
					paddingLeft: getValue( 'paddingLeftTablet', `%s${ getValue( 'paddingUnitTablet' ) }` ),
				},
			},
			mobile: {
				[ selector ]: {
					marginTop: getValue( 'marginTopMobile', `%s${ getValue( 'marginUnitMobile' ) }` ),
					marginBottom: getValue( 'marginBottomMobile', `%s${ getValue( 'marginUnitMobile' ) }` ),
					marginRight: getValue( 'marginRightMobile', `%s${ getValue( 'marginUnitMobile' ) }` ),
					marginLeft: getValue( 'marginLeftMobile', `%s${ getValue( 'marginUnitMobile' ) }` ),
					paddingTop: getValue( 'paddingTopMobile', `%s${ getValue( 'paddingUnitMobile' ) }` ),
					paddingBottom: getValue( 'paddingBottomMobile', `%s${ getValue( 'paddingUnitMobile' ) }` ),
					paddingRight: getValue( 'paddingRightMobile', `%s${ getValue( 'paddingUnitMobile' ) }` ),
					paddingLeft: getValue( 'paddingLeftMobile', `%s${ getValue( 'paddingUnitMobile' ) }` ),
				},
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	styles.add( {
		style: {
			[ selector ]: {
				minHeight: getValue( 'height', `%s${ getValue( 'heightUnit' ) || 'px' }` ),
				justifyContent: getValue( 'horizontalAlign' ),
				alignItems: getValue( 'verticalAlign' ),
				maxWidth: getValue( 'width', `%s${ getValue( 'widthUnit' ) || 'px' }` ),
				minWidth: getValue( 'width' ) ? 'auto' : undefined, // Some themes can limit min-width, preventing block width.
			},
			tablet: {
				[ selector ]: {
					minHeight: getValue( 'heightTablet', `%s${ getValue( 'heightUnitTablet' ) || 'px' }` ),
					justifyContent: getValue( 'horizontalAlignTablet' ),
					alignItems: getValue( 'verticalAlignTablet' ),
					maxWidth: getValue( 'widthTablet', `%s${ getValue( 'widthUnitTablet' ) || 'px' }` ),
					minWidth: getValue( 'widthTablet' ) ? 'auto' : undefined, // Some themes can limit min-width, preventing block width.
				},
			},
			mobile: {
				[ selector ]: {
					minHeight: getValue( 'heightMobile', `%s${ getValue( 'heightUnitMobile' ) || 'px' }` ),
					justifyContent: getValue( 'horizontalAlignMobile' ),
					alignItems: getValue( 'verticalAlignMobile' ),
					maxWidth: getValue( 'widthMobile', `%s${ getValue( 'widthUnitMobile' ) || 'px' }` ),
					minWidth: getValue( 'widthMobile' ) ? 'auto' : undefined, // Some themes can limit min-width, preventing block width.
				},
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
