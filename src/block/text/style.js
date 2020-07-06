/**
 * External dependencies
 */
import {
	createTypographyStyles,
	createResponsiveStyles,
	__getValue,
	appendImportant,
	appendImportantAll,
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

	// Column rule.
	const {
		showColumnRule = false,
	} = props.attributes
	if ( showColumnRule ) {
		styles.push( {
			'.ugb-text__rule': appendImportantAll( {
				background: getValue( 'columnRuleColor' ),
				width: getValue( 'columnRuleWidth', '%spx' ),
				height: getValue( 'columnRuleHeight', '%s%' ),
			} ),
		} )
	}

	// Title.
	const {
		showTitle = true,
	} = props.attributes
	if ( showTitle ) {
		styles.push( {
			'.ugb-text__title-wrapper': {
				justifyContent: appendImportant( getValue( 'titleVerticalAlign' ) ),
			},
			'.ugb-text__title': {
				color: getValue( 'titleColor' ),
				...createTypographyStyles( 'title%s', 'desktop', props.attributes ),
				textAlign: getValue( 'titleAlign' ) || getValue( 'contentAlign' ),
			},
			tablet: {
				'.ugb-text__title': {
					...createTypographyStyles( 'title%s', 'tablet', props.attributes ),
					textAlign: getValue( 'titleTabletAlign' ) || getValue( 'tabletContentAlign' ),
				},
			},
			mobile: {
				'.ugb-text__title': {
					...createTypographyStyles( 'title%s', 'mobile', props.attributes ),
					textAlign: getValue( 'titleMobileAlign' ) || getValue( 'mobileContentAlign' ),
				},
			},
		} )
	}

	// Subtitle.
	const {
		showSubtitle = true,
	} = props.attributes
	if ( showSubtitle ) {
		styles.push( {
			'.ugb-text__subtitle': {
				...createTypographyStyles( 'subtitle%s', 'desktop', props.attributes ),
				color: getValue( 'subtitleColor' ),
				textAlign: getValue( 'subtitleAlign' ),
			},
			tablet: {
				'.ugb-text__subtitle': {
					...createTypographyStyles( 'subtitle%s', 'tablet', props.attributes ),
					textAlign: getValue( 'subtitleTabletAlign' ),
				},
			},
			mobile: {
				'.ugb-text__subtitle': {
					...createTypographyStyles( 'subtitle%s', 'mobile', props.attributes ),
					textAlign: getValue( 'subtitleMobileAlign' ),
				},
			},
		} )
	}

	// Text.
	styles.push( {
		'.ugb-text__text p': {
			...createTypographyStyles( 'text%s', 'desktop', props.attributes ),
			color: getValue( 'textColor' ),
			textAlign: getValue( 'textAlign' ),
		},
		tablet: {
			'.ugb-text__text p': {
				...createTypographyStyles( 'text%s', 'tablet', props.attributes ),
				textAlign: getValue( 'textTabletAlign' ),
			},
		},
		mobile: {
			'.ugb-text__text p': {
				...createTypographyStyles( 'text%s', 'mobile', props.attributes ),
				textAlign: getValue( 'textMobileAlign' ),
			},
		},
	} )

	// Spacing.
	if ( show.titleSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-text__title', 'title%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.subtitleSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-text__subtitle', 'subtitle%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	styles.push( ...createResponsiveStyles( '.ugb-text__text', 'text%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )

	return deepmerge.all( styles )
}

export default createStyles
