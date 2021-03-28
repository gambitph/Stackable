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
					marginTop: getValue( 'marginTop', `%s${ getValue( 'marginUnit' ) || 'px' }` ),
					marginBottom: getValue( 'marginBottom', `%s${ getValue( 'marginUnit' ) || 'px' }` ),
					marginRight: getValue( 'marginRight', `%s${ getValue( 'marginUnit' ) || 'px' }` ),
					marginLeft: getValue( 'marginLeft', `%s${ getValue( 'marginUnit' ) || 'px' }` ),
					paddingTop: getValue( 'paddingTop', `%s${ getValue( 'paddingUnit' ) || 'px' }` ),
					paddingBottom: getValue( 'paddingBottom', `%s${ getValue( 'paddingUnit' ) || 'px' }` ),
					paddingRight: getValue( 'paddingRight', `%s${ getValue( 'paddingUnit' ) || 'px' }` ),
					paddingLeft: getValue( 'paddingLeft', `%s${ getValue( 'paddingUnit' ) || 'px' }` ),
				},
			},
			tabletOnly: {
				[ selector ]: {
					marginTop: getValue( 'marginTopTablet', `%s${ getValue( 'marginUnitTablet' ) || 'px' }` ),
					marginBottom: getValue( 'marginBottomTablet', `%s${ getValue( 'marginUnitTablet' ) || 'px' }` ),
					marginRight: getValue( 'marginRightTablet', `%s${ getValue( 'marginUnitTablet' ) || 'px' }` ),
					marginLeft: getValue( 'marginLeftTablet', `%s${ getValue( 'marginUnitTablet' ) || 'px' }` ),
					paddingTop: getValue( 'paddingTopTablet', `%s${ getValue( 'paddingUnitTablet' ) || 'px' }` ),
					paddingBottom: getValue( 'paddingBottomTablet', `%s${ getValue( 'paddingUnitTablet' ) || 'px' }` ),
					paddingRight: getValue( 'paddingRightTablet', `%s${ getValue( 'paddingUnitTablet' ) || 'px' }` ),
					paddingLeft: getValue( 'paddingLeftTablet', `%s${ getValue( 'paddingUnitTablet' ) || 'px' }` ),
				},
			},
			mobile: {
				[ selector ]: {
					marginTop: getValue( 'marginTopMobile', `%s${ getValue( 'marginUnitMobile' ) || 'px' }` ),
					marginBottom: getValue( 'marginBottomMobile', `%s${ getValue( 'marginUnitMobile' ) || 'px' }` ),
					marginRight: getValue( 'marginRightMobile', `%s${ getValue( 'marginUnitMobile' ) || 'px' }` ),
					marginLeft: getValue( 'marginLeftMobile', `%s${ getValue( 'marginUnitMobile' ) || 'px' }` ),
					paddingTop: getValue( 'paddingTopMobile', `%s${ getValue( 'paddingUnitMobile' ) || 'px' }` ),
					paddingBottom: getValue( 'paddingBottomMobile', `%s${ getValue( 'paddingUnitMobile' ) || 'px' }` ),
					paddingRight: getValue( 'paddingRightMobile', `%s${ getValue( 'paddingUnitMobile' ) || 'px' }` ),
					paddingLeft: getValue( 'paddingLeftMobile', `%s${ getValue( 'paddingUnitMobile' ) || 'px' }` ),
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
