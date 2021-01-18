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
	appendImportantAll,
	createImageBackgroundStyleSet,
	__getValue,
	createBorderStyleSet,
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

	if ( show.border ) {
		styles.push( {
			...createBorderStyleSet( 'column%s', '.ugb-card__item', props.attributes ),
		} )
	}

	// Column Background.
	const columnBackgroundOptions = {
		importantBackgroundColor: true,
	}
	styles.push( {
		...( show.columnBackground ? createBackgroundStyleSet( 'column%s', 'ugb-card__item', props.attributes, columnBackgroundOptions ) : {} ),
	} )

	// Container
	const {
		columnPaddingUnit = 'px',
		tabletColumnPaddingUnit = 'px',
		mobileColumnPaddingUnit = 'px',
	} = props.attributes
	styles.push( {
		desktopTablet: {
			'.ugb-card__content': appendImportantAll( {
				paddingTop: getValue( 'columnPaddingTop', `%s${ columnPaddingUnit }` ),
				paddingBottom: getValue( 'columnPaddingBottom', `%s${ columnPaddingUnit }` ),
				paddingRight: getValue( 'columnPaddingRight', `%s${ columnPaddingUnit }` ),
				paddingLeft: getValue( 'columnPaddingLeft', `%s${ columnPaddingUnit }` ),
			} ),
		},
		tabletOnly: {
			'.ugb-card__content': appendImportantAll( {
				paddingTop: getValue( 'tabletColumnPaddingTop', `%s${ tabletColumnPaddingUnit }` ),
				paddingRight: getValue( 'tabletColumnPaddingRight', `%s${ tabletColumnPaddingUnit }` ),
				paddingBottom: getValue( 'tabletColumnPaddingBottom', `%s${ tabletColumnPaddingUnit }` ),
				paddingLeft: getValue( 'tabletColumnPaddingLeft', `%s${ tabletColumnPaddingUnit }` ),
			} ),
		},
		mobile: {
			'.ugb-card__content': appendImportantAll( {
				paddingTop: getValue( 'mobileColumnPaddingTop', `%s${ mobileColumnPaddingUnit }` ),
				paddingRight: getValue( 'mobileColumnPaddingRight', `%s${ mobileColumnPaddingUnit }` ),
				paddingBottom: getValue( 'mobileColumnPaddingBottom', `%s${ mobileColumnPaddingUnit }` ),
				paddingLeft: getValue( 'mobileColumnPaddingLeft', `%s${ mobileColumnPaddingUnit }` ),
			} ),
		},
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
		styles.push( ...createResponsiveStyles( '.ugb-card__image', 'imageBackground%sHeight', 'height', '%spx', props.attributes, {
			inherit: true, inheritTabletMax: 300, inheritMobileMax: 300, important: true,
		} ) )
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
		styles.push( ...createResponsiveStyles( '.ugb-button-container', 'button%sAlign', 'textAlign', '%s', props.attributes, { important: true } ) )
	}

	// Spacing.
	if ( show.imageSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-card__image', 'image%sBottomMargin', 'marginBottom', '%spx', props.attributes, { important: true } ) )
	}
	if ( show.titleSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-card__title', 'title%sBottomMargin', 'marginBottom', '%spx', props.attributes, { important: true } ) )
	}
	if ( show.subtitleSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-card__subtitle', 'subtitle%sBottomMargin', 'marginBottom', '%spx', props.attributes, { important: true } ) )
	}
	if ( show.descriptionSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-card__description', 'description%sBottomMargin', 'marginBottom', '%spx', props.attributes, { important: true } ) )
	}
	if ( show.buttonSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-button-container', 'button%sBottomMargin', 'marginBottom', '%spx', props.attributes, { important: true } ) )
	}

	return deepmerge.all( styles )
}

export default createStyles
