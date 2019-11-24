/**
 * External dependencies
 */
import {
	createTypographyStyles,
	createResponsiveStyles,
	__getValue,
	appendImportant,
} from '~stackable/util'

/**
 * Internal dependencies
 */
// import { showOptions } from './util'
import deepmerge from 'deepmerge'

export const createStyles = props => {
	const getValue = __getValue( props.attributes )

	const styles = []

	// Title.
	const {
		showTitle = true,
	} = props.attributes
	if ( showTitle ) {
		styles.push( {
			'.ugb-expand__title': {
				...createTypographyStyles( 'title%s', 'desktop', props.attributes ),
				color: getValue( 'titleColor' ),
				textAlign: getValue( 'titleAlign' ),
			},
			tablet: {
				'.ugb-expand__title': {
					...createTypographyStyles( 'title%s', 'tablet', props.attributes ),
					textAlign: getValue( 'titleTabletAlign' ),
				},
			},
			mobile: {
				'.ugb-expand__title': {
					...createTypographyStyles( 'title%s', 'mobile', props.attributes ),
					textAlign: getValue( 'titleMobileAlign' ),
				},
			},
		} )
	}

	// Text.
	styles.push( {
		'.ugb-expand__less-text, .ugb-expand__more-text': {
			...createTypographyStyles( 'text%s', 'desktop', props.attributes ),
			color: getValue( 'textColor' ),
			textAlign: getValue( 'textAlign' ),
		},
		tablet: {
			'.ugb-expand__less-text, .ugb-expand__more-text': {
				...createTypographyStyles( 'text%s', 'tablet', props.attributes ),
				textAlign: getValue( 'textTabletAlign' ),
			},
		},
		mobile: {
			'.ugb-expand__less-text, .ugb-expand__more-text': {
				...createTypographyStyles( 'text%s', 'mobile', props.attributes ),
				textAlign: getValue( 'textMobileAlign' ),
			},
		},
	} )

	// Link.
	styles.push( {
		'.ugb-expand__toggle-wrapper': {
			textAlign: appendImportant( getValue( 'linkAlign' ) ),
		},
		'.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text': {
			...createTypographyStyles( 'link%s', 'desktop', props.attributes ),
			color: getValue( 'linkColor' ),
		},
		tablet: {
			'.ugb-expand__toggle-wrapper': {
				textAlign: appendImportant( getValue( 'linkTabletAlign' ) ),
			},
			'.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text': {
				...createTypographyStyles( 'link%s', 'tablet', props.attributes ),
			},
		},
		mobile: {
			'.ugb-expand__toggle-wrapper': {
				textAlign: appendImportant( getValue( 'linkMobileAlign' ) ),
			},
			'.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text': {
				...createTypographyStyles( 'link%s', 'mobile', props.attributes ),
			},
		},
	} )

	// Spacing.
	if ( showTitle ) {
		styles.push( ...createResponsiveStyles( '.ugb-expand__title', 'title%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	styles.push( ...createResponsiveStyles( '.ugb-expand__less-text, .ugb-expand__more-text', 'text%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	styles.push( ...createResponsiveStyles( '.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text', 'link%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )

	return deepmerge.all( styles )
}

export default createStyles
