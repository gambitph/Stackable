/**
 * External dependencies
 */
import {
	createBackgroundStyleSet,
	createButtonStyleSet,
	createResponsiveStyles,
	createTypographyStyles,
	whiteIfDarkBlackIfLight,
	appendImportant,
	createImageBackgroundStyleSet,
	__getValue,
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
	} = props.attributes

	const show = showOptions( props )

	const styles = []

	styles.push( {
		'.ugb-card__title, .ugb-card__subtitle, .ugb-card__description, .ugb-button-container': {
			textAlign: getValue( 'contentAlign' ),
		},
		tablet: {
			'.ugb-card__title, .ugb-card__subtitle, .ugb-card__description, .ugb-button-container': {
				textAlign: getValue( 'tabletContentAlign' ),
			},
		},
		mobile: {
			'.ugb-card__title, .ugb-card__subtitle, .ugb-card__description, .ugb-button-container': {
				textAlign: getValue( 'mobileContentAlign' ),
			},
		},
	} )

	if ( show.borderRadius ) {
		const selector = show.columnBackground ? '.ugb-card__item' : '.ugb-card__image'
		styles.push( {
			[ selector ]: {
				borderRadius: getValue( 'borderRadius', '%spx !important' ),
			},
		} )
	}

	// Column Background.
	const columnBackgroundOptions = {
		importantBackgroundColor: true,
	}
	styles.push( {
		...( show.columnBackground ? createBackgroundStyleSet( 'column%s', 'ugb-card__item', props.attributes, columnBackgroundOptions ) : {} ),
	} )

	// Image.
	styles.push( {
		'.ugb-card__item1 .ugb-card__image': {
			backgroundImage: getValue( 'image1Url', `url(%s)` ),
		},
		'.ugb-card__item2 .ugb-card__image': {
			backgroundImage: getValue( 'image2Url', `url(%s)` ),
		},
		'.ugb-card__item3 .ugb-card__image': {
			backgroundImage: getValue( 'image3Url', `url(%s)` ),
		},
	} )
	styles.push( {
		...createImageBackgroundStyleSet( 'image%s', 'ugb-card__image', props.attributes ),
	} )
	if ( show.imageHeight ) {
		styles.push( ...createResponsiveStyles( '.ugb-card__image', 'imageBackground%sHeight', 'height', '%spx', props.attributes, true ) )
	}
	if ( show.imageWidth ) {
		styles.push( {
			'.ugb-card__image': {
				width: getValue( 'imageBackgroundWidth' ) ? appendImportant( getValue( 'imageBackgroundWidth' ) + getValue( 'imageBackgroundWidthUnit', '%s', '%' ) ) : undefined,
			},
			tablet: {
				'.ugb-card__image': {
					width: getValue( 'imageBackgroundTabletWidth' ) ? appendImportant( getValue( 'imageBackgroundTabletWidth' ) + getValue( 'imageBackgroundTabletWidthUnit', '%s', '%' ) ) : undefined,
				},
			},
			mobile: {
				'.ugb-card__image': {
					width: getValue( 'imageBackgroundMobileWidth' ) ? appendImportant( getValue( 'imageBackgroundMobileWidth' ) + getValue( 'imageBackgroundMobileWidthUnit', '%s', '%' ) ) : undefined,
				},
			},
		} )
	}

	// Title.
	const {
		titleColor = '',
		showTitle = true,
	} = props.attributes
	if ( showTitle ) {
		styles.push( {
			'.ugb-card__title': {
				...createTypographyStyles( 'title%s', 'desktop', props.attributes, { importantSize: true } ),
				color: appendImportant( whiteIfDarkBlackIfLight( titleColor, show.columnBackground && columnBackgroundColor ) ),
				textAlign: getValue( 'titleAlign', '%s !important' ),
			},
			tablet: {
				'.ugb-card__title': {
					...createTypographyStyles( 'title%s', 'tablet', props.attributes, { importantSize: true } ),
					textAlign: getValue( 'titleTabletAlign', '%s !important' ),
				},
			},
			mobile: {
				'.ugb-card__title': {
					...createTypographyStyles( 'title%s', 'mobile', props.attributes, { importantSize: true } ),
					textAlign: getValue( 'titleMobileAlign', '%s !important' ),
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
			'.ugb-card__subtitle': {
				...createTypographyStyles( 'subtitle%s', 'desktop', props.attributes, { importantSize: true } ),
				color: appendImportant( whiteIfDarkBlackIfLight( subtitleColor, show.columnBackground && columnBackgroundColor ) ),
				textAlign: getValue( 'subtitleAlign', '%s !important' ),
			},
			tablet: {
				'.ugb-card__subtitle': {
					...createTypographyStyles( 'subtitle%s', 'tablet', props.attributes, { importantSize: true } ),
					textAlign: getValue( 'subtitleTabletAlign', '%s !important' ),
				},
			},
			mobile: {
				'.ugb-card__subtitle': {
					...createTypographyStyles( 'subtitle%s', 'mobile', props.attributes, { importantSize: true } ),
					textAlign: getValue( 'subtitleMobileAlign', '%s !important' ),
				},
			},
		} )
	}

	// Description.
	const {
		descriptionColor = '',
		showDescription = true,
	} = props.attributes
	if ( showDescription ) {
		styles.push( {
			'.ugb-card__description': {
				...createTypographyStyles( 'description%s', 'desktop', props.attributes, { importantSize: true } ),
				color: appendImportant( whiteIfDarkBlackIfLight( descriptionColor, show.columnBackground && columnBackgroundColor ) ),
				textAlign: getValue( 'descriptionAlign', '%s !important' ),
			},
			tablet: {
				'.ugb-card__description': {
					...createTypographyStyles( 'description%s', 'tablet', props.attributes, { importantSize: true } ),
					textAlign: getValue( 'descriptionTabletAlign', '%s !important' ),
				},
			},
			mobile: {
				'.ugb-card__description': {
					...createTypographyStyles( 'description%s', 'mobile', props.attributes, { importantSize: true } ),
					textAlign: getValue( 'descriptionMobileAlign', '%s !important' ),
				},
			},
		} )
	}

	// Button
	const {
		showButton = true,
	} = props.attributes
	if ( showButton ) {
		styles.push( {
			...createButtonStyleSet( 'button%s', 'ugb-button', props.attributes ),
		} )
		styles.push( ...createResponsiveStyles( '.ugb-button-container', 'button%sAlign', 'textAlign', '%s', props.attributes, true ) )
	}

	// Spacing.
	if ( show.imageSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-card__image', 'image%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.titleSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-card__title', 'title%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.subtitleSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-card__subtitle', 'subtitle%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.descriptionSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-card__description', 'description%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.buttonSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-button-container', 'button%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}

	return deepmerge.all( styles )
}

export default createStyles
