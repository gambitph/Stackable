/**
 * External dependencies
 */
import {
	createTypographyStyles,
	createResponsiveStyles,
	__getValue,
	createIconStyleSet,
	appendImportantAll,
	leftRightToFlex,
} from '~stackable/util'

/**
 * Internal dependencies
 */
import { showOptions } from './util'
import deepmerge from 'deepmerge'

export const createStyles = props => {
	const getValue = __getValue( props.attributes )

	const show = showOptions( props )

	const styles = []

	// Content Align
	styles.push( {
		'': appendImportantAll( {
			justifyContent: leftRightToFlex( getValue( 'contentAlign' ) ),
		} ),
		tablet: {
			'': appendImportantAll( {
				justifyContent: leftRightToFlex( getValue( 'tabletContentAlign' ) ),
			} ),
		},
		mobile: {
			'': appendImportantAll( {
				justifyContent: leftRightToFlex( getValue( 'mobileContentAlign' ) ),
			} ),
		},
	} )

	// Icon.
	styles.push( { ...createIconStyleSet( 'icon%s', 'ugb-icon__icon', props.attributes ) } )
	if ( show.iconAlign ) {
		styles.push( {
			'.ugb-icon__icon': appendImportantAll( {
				alignSelf: leftRightToFlex( getValue( 'iconAlign' ) ),
			} ),
			tablet: {
				'.ugb-icon__icon': appendImportantAll( {
					alignSelf: leftRightToFlex( getValue( 'tabletIconAlign' ) ),
				} ),
			},
			mobile: {
				'.ugb-icon__icon': appendImportantAll( {
					alignSelf: leftRightToFlex( getValue( 'mobileIconAlign' ) ),
				} ),
			},
		} )
	}

	// Title.
	const {
		showTitle = true,
	} = props.attributes
	if ( showTitle ) {
		styles.push( {
			'.ugb-icon__title': {
				color: getValue( 'titleColor' ),
				...createTypographyStyles( 'title%s', 'desktop', props.attributes ),
				textAlign: getValue( 'titleAlign' ) || getValue( 'contentAlign' ),
			},
			tablet: {
				'.ugb-icon__title': {
					...createTypographyStyles( 'title%s', 'tablet', props.attributes ),
					textAlign: getValue( 'titleTabletAlign' ) || getValue( 'tabletContentAlign' ),
				},
			},
			mobile: {
				'.ugb-icon__title': {
					...createTypographyStyles( 'title%s', 'mobile', props.attributes ),
					textAlign: getValue( 'titleMobileAlign' ) || getValue( 'mobileContentAlign' ),
				},
			},
		} )
	}

	// Spacing.
	styles.push( ...createResponsiveStyles( '.ugb-icon__icon', 'icon%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	if ( show.titleSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-icon__title', 'title%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}

	// Advanced Column Gap
	styles.push( ...createResponsiveStyles( '.ugb-icon__content-wrapper', '%scolumnGap', 'columnGap', '%spx', props.attributes, { important: true } ) )

	return deepmerge.all( styles )
}

export default createStyles
