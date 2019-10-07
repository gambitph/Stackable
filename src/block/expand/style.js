/**
 * External dependencies
 */
import {
	createTypographyStyles,
	createResponsiveStyles,
} from '~stackable/util'

/**
 * Internal dependencies
 */
// import { showOptions } from './util'
import deepmerge from 'deepmerge'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

export const createStyles = props => {
	const getValue = ( attrName, format = '' ) => {
		const value = typeof props.attributes[ attrName ] === 'undefined' ? '' : props.attributes[ attrName ]
		return value !== '' ? ( format ? sprintf( format, value ) : value ) : undefined
	}

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
		'.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text': {
			...createTypographyStyles( 'link%s', 'desktop', props.attributes ),
			color: getValue( 'linkColor' ),
			textAlign: getValue( 'linkAlign' ),
		},
		tablet: {
			'.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text': {
				...createTypographyStyles( 'link%s', 'tablet', props.attributes ),
				textAlign: getValue( 'linkTabletAlign' ),
			},
		},
		mobile: {
			'.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text': {
				...createTypographyStyles( 'link%s', 'mobile', props.attributes ),
				textAlign: getValue( 'linkMobileAlign' ),
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
