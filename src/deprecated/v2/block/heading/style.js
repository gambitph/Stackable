/**
 * External dependencies
 */
import {
	createTypographyStyles,
	whiteIfDark,
	createResponsiveStyles,
	appendImportantAll,
	__getValue,
	createResponsiveMarginAlign,
} from '~stackable/util'

/**
 * Internal dependencies
 */
import { showOptions } from './util'
import deepmerge from 'deepmerge'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const createStyles = props => {
	const getValue = __getValue( props.attributes )

	const show = showOptions( props )

	const {
		columnBackgroundColor = '',
	} = props.attributes

	const styles = []

	// Title.
	const {
		titleColor = '',
		showTitle = true,
	} = props.attributes
	if ( showTitle ) {
		const titleColorSelector = applyFilters( 'stackable.heading.styles.title.color-selector', '.ugb-heading__title', props )
		styles.push( {
			[ titleColorSelector ]: {
				color: whiteIfDark( titleColor, show.columnBackground && columnBackgroundColor ),
			},
		} )

		styles.push( {
			'.ugb-heading__title': {
				...createTypographyStyles( 'title%s', 'desktop', props.attributes ),
				textAlign: getValue( 'titleAlign' ) || getValue( 'contentAlign' ),
			},
			tablet: {
				'.ugb-heading__title': {
					...createTypographyStyles( 'title%s', 'tablet', props.attributes ),
					textAlign: getValue( 'titleTabletAlign' ) || getValue( 'tabletContentAlign' ),
				},
			},
			mobile: {
				'.ugb-heading__title': {
					...createTypographyStyles( 'title%s', 'mobile', props.attributes ),
					textAlign: getValue( 'titleMobileAlign' ) || getValue( 'mobileContentAlign' ),
				},
			},
		} )
	}

	// Subtitle.
	const {
		subtitleColor = '',
		showSubtitle = true,
	} = props.attributes
	if ( showSubtitle ) {
		styles.push( {
			'.ugb-heading__subtitle': {
				...createTypographyStyles( 'subtitle%s', 'desktop', props.attributes ),
				color: whiteIfDark( subtitleColor, show.columnBackground && columnBackgroundColor ),
				textAlign: getValue( 'subtitleAlign' ),
			},
			tablet: {
				'.ugb-heading__subtitle': {
					...createTypographyStyles( 'subtitle%s', 'tablet', props.attributes ),
					textAlign: getValue( 'subtitleTabletAlign' ),
				},
			},
			mobile: {
				'.ugb-heading__subtitle': {
					...createTypographyStyles( 'subtitle%s', 'mobile', props.attributes ),
					textAlign: getValue( 'subtitleMobileAlign' ),
				},
			},
		} )
	}

	// Top line.
	const {
		showTopLine = false,
	} = props.attributes
	if ( showTopLine ) {
		styles.push( {
			'.ugb-heading__top-line': appendImportantAll( {
				backgroundColor: getValue( 'topLineColor' ),
				height: getValue( 'topLineHeight', '%spx' ),
				width: getValue( 'topLineWidth', `%s${ getValue( 'topLineWidthUnit' ) || 'px' }` ),
			} ),
		} )
		styles.push( ...createResponsiveMarginAlign( '.ugb-heading__top-line', 'topLine%sAlign', props.attributes ) )
	}

	// Bottom line.
	const {
		showBottomLine = false,
	} = props.attributes
	if ( showBottomLine ) {
		styles.push( {
			'.ugb-heading__bottom-line': appendImportantAll( {
				backgroundColor: getValue( 'bottomLineColor' ),
				height: getValue( 'bottomLineHeight', '%spx' ),
				width: getValue( 'bottomLineWidth', `%s${ getValue( 'bottomLineWidthUnit' ) || 'px' }` ),
			} ),
		} )
		styles.push( ...createResponsiveMarginAlign( '.ugb-heading__bottom-line', 'bottomLine%sAlign', props.attributes ) )
	}

	// Spacing.
	styles.push( ...createResponsiveStyles( '.ugb-heading__title', 'title%sBottomMargin', 'marginBottom', '%spx', props.attributes, { important: true } ) )
	if ( show.subtitleSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-heading__subtitle', 'subtitle%sBottomMargin', 'marginBottom', '%spx', props.attributes, { important: true } ) )
	}
	if ( show.topLineSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-heading__top-line', 'topLine%sBottomMargin', 'marginBottom', '%spx', props.attributes, { important: true } ) )
	}
	if ( show.bottomLineSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-heading__bottom-line', 'bottomLine%sBottomMargin', 'marginBottom', '%spx', props.attributes, { important: true } ) )
	}

	return deepmerge.all( styles )
}

export default createStyles
