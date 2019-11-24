/**
 * External dependencies
 */
import {
	createBackgroundStyleSet,
	createButtonStyleSet,
	createResponsiveStyles,
	createTypographyStyles,
	whiteIfDark,
	__getValue,
	appendImportant,
} from '~stackable/util'
import deepmerge from 'deepmerge'

/**
 * Internal dependencies
 */
import { showOptions } from './util'

export const createStyles = props => {
	const getValue = __getValue( props.attributes )

	const {
		columnBackgroundColor = '',
		columnBackgroundColorOpacity = 1,
	} = props.attributes

	const show = showOptions( props )

	const styles = []

	styles.push( {
		'.ugb-cta__title, .ugb-cta__description, .ugb-button-container': {
			textAlign: appendImportant( getValue( 'contentAlign' ) ),
		},
		tablet: {
			'.ugb-cta__title, .ugb-cta__description, .ugb-button-container': {
				textAlign: getValue( 'tabletContentAlign' ),
			},
		},
		mobile: {
			'.ugb-cta__title, .ugb-cta__description, .ugb-button-container': {
				textAlign: getValue( 'mobileContentAlign' ),
			},
		},
	} )

	if ( show.borderRadius ) {
		styles.push( {
			'.ugb-cta__item': {
				borderRadius: getValue( 'borderRadius', '%spx !important' ),
			},
		} )
	}

	// Column Background.
	const columnBackgroundOptions = {
		importantBackgroundColor: true,
	}
	styles.push( {
		...( show.columnBackground ? createBackgroundStyleSet( 'column%s', 'ugb-cta__item', props.attributes, columnBackgroundOptions ) : {} ),
	} )

	// Spacing.
	if ( show.titleSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-cta__title', 'title%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.descriptionSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-cta__description', 'description%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.buttonSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-button-container', 'button%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}

	const {
		titleColor = '',
		showTitle = true,
	} = props.attributes
	if ( showTitle ) {
		styles.push( {
			'.ugb-cta__title': {
				...createTypographyStyles( 'title%s', 'desktop', props.attributes, { importantSize: true } ),
				color: whiteIfDark( titleColor, columnBackgroundColorOpacity !== 0 ? columnBackgroundColor : null ),
				textAlign: getValue( 'titleAlign', '%s !important' ),
			},
			tablet: {
				'.ugb-cta__title': {
					...createTypographyStyles( 'title%s', 'tablet', props.attributes, { importantSize: true } ),
					textAlign: getValue( 'titleTabletAlign', '%s !important' ),
				},
			},
			mobile: {
				'.ugb-cta__title': {
					...createTypographyStyles( 'title%s', 'mobile', props.attributes, { importantSize: true } ),
					textAlign: getValue( 'titleMobileAlign', '%s !important' ),
				},
			},
		} )
	}

	const {
		descriptionColor = '',
		showDescription = true,
	} = props.attributes
	if ( showDescription ) {
		styles.push( {
			'.ugb-cta__description': {
				...createTypographyStyles( 'description%s', 'desktop', props.attributes ),
				color: whiteIfDark( descriptionColor, columnBackgroundColorOpacity !== 0 ? columnBackgroundColor : null ),
				textAlign: getValue( 'descriptionAlign', '%s !important' ),
			},
			tablet: {
				'.ugb-cta__description': {
					...createTypographyStyles( 'description%s', 'tablet', props.attributes ),
					textAlign: getValue( 'descriptionTabletAlign', '%s !important' ),
				},
			},
			mobile: {
				'.ugb-cta__description': {
					...createTypographyStyles( 'description%s', 'mobile', props.attributes ),
					textAlign: getValue( 'descriptionMobileAlign', '%s !important' ),
				},
			},
		} )
	}

	const {
		showButton = true,
	} = props.attributes
	if ( showButton ) {
		styles.push( {
			...createButtonStyleSet( 'button%s', 'ugb-button', props.attributes ),
		} )
		styles.push( {
			'.ugb-button-container': {
				textAlign: getValue( 'buttonAlign', '%s !important' ),
			},
			tablet: {
				'.ugb-button-container': {
					textAlign: getValue( 'buttonTabletAlign', '%s !important' ),
				},
			},
			mobile: {
				'.ugb-button-container': {
					textAlign: getValue( 'buttonMobileAlign', '%s !important' ),
				},
			},
		} )
	}

	return deepmerge.all( styles )
}

export default createStyles
