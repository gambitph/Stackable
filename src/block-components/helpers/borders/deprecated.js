import { __, _x } from '@wordpress/i18n'
import { addFilter } from '@wordpress/hooks'
import { dispatch } from '@wordpress/data'

addFilter( 'stackable.block-component.helpers', 'borders', ( output, getAttribute, updateAttribute, updateAttributes ) => {
	const borderRadius = getAttribute( 'borderRadius' )
	const borderRadiusTablet = getAttribute( 'borderRadiusTablet' )
	const borderRadiusMobile = getAttribute( 'borderRadiusMobile' )
	dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()

	if ( borderRadius ) {
		updateAttributes( {
			borderRadius2: {
				top: borderRadius,
				right: borderRadius,
				left: borderRadius,
				bottom: borderRadius,
			},
			borderRadius: '',
		} )
	}
	if ( borderRadiusTablet ) {
		updateAttributes( {
			borderRadius2Tablet: {
				top: borderRadiusTablet,
				right: borderRadiusTablet,
				left: borderRadiusTablet,
				bottom: borderRadiusTablet,
			},
			borderRadiusTablet: '',
		} )
	}
	if ( borderRadiusMobile ) {
		updateAttributes( {
			borderRadius2Mobile: {
				top: borderRadiusMobile,
				right: borderRadiusMobile,
				left: borderRadiusMobile,
				bottom: borderRadiusMobile,
			},
			borderRadiusMobile: '',
		} )
	}
} )
