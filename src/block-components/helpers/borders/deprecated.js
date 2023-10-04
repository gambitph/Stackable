import { addFilter } from '@wordpress/hooks'
import { dispatch } from '@wordpress/data'

addFilter( 'stackable.block-component.helpers.borders', 'borders', ( output, getAttribute, updateAttributes ) => {
	const borderRadius = getAttribute( 'borderRadius' )
	const borderRadiusTablet = getAttribute( 'borderRadiusTablet' )
	const borderRadiusMobile = getAttribute( 'borderRadiusMobile' )
	if ( borderRadius || borderRadiusTablet || borderRadiusMobile ) {
		dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
		updateAttributes( {
			borderRadius2: borderRadius ? {
				top: borderRadius,
				right: borderRadius,
				left: borderRadius,
				bottom: borderRadius,
			} : undefined,
			borderRadius2Tablet: borderRadiusTablet ? {
				top: borderRadiusTablet,
				right: borderRadiusTablet,
				left: borderRadiusTablet,
				bottom: borderRadiusTablet,
			} : undefined,
			borderRadius2Mobile: borderRadiusMobile ? {
				top: borderRadiusMobile,
				right: borderRadiusMobile,
				left: borderRadiusMobile,
				bottom: borderRadiusMobile,
			} : undefined,
			borderRadius: borderRadius ? '' : undefined,
			borderRadiusTablet: borderRadiusTablet ? '' : undefined,
			borderRadiusMobile: borderRadiusMobile ? '' : undefined,
		} )
	}
} )
