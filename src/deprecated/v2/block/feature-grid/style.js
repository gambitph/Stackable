/**
 * External dependencies
 */
import {
	appendImportantAll,
	createBackgroundStyleSet,
	createButtonStyleSet,
	createTypographyStyles,
	whiteIfDark,
	createImageStyleSet,
	marginLeftAlign,
	marginRightAlign,
	createResponsiveStyles,
	createBorderStyleSet,
	__getValue,
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
		showImage = true,
		contentAlign = '',
	} = props.attributes

	const styles = []

	if ( show.columnBackground ) {
		styles.push( {
			'.ugb-feature-grid__item': {
				borderRadius: getValue( 'borderRadius', '%spx !important' ),
			},
		} )
	}

	if ( show.border ) {
		styles.push( {
			...createBorderStyleSet( 'column%s', '.ugb-feature-grid__item', props.attributes ),
		} )
	}

	// Column Background.
	const columnBackgroundSelector = applyFilters( 'stackable.feature-grid.styles.column-background', 'ugb-feature-grid__item', props.attributes )
	if ( columnBackgroundSelector ) {
		styles.push( {
			...( show.columnBackground ? createBackgroundStyleSet( 'column%s', columnBackgroundSelector, props.attributes, {
				importantBackgroundColor: true,
			} ) : {} ),
		} )
	}

	// Container.
	const {
		columnPaddingUnit = 'px',
		tabletColumnPaddingUnit = 'px',
		mobileColumnPaddingUnit = 'px',
	} = props.attributes

	styles.push( {
		saveOnly: {
			desktopTablet: {
				'> .ugb-inner-block > .ugb-block-content > *': appendImportantAll( {
					paddingTop: getValue( 'columnPaddingTop', `%s${ columnPaddingUnit }` ),
					paddingBottom: getValue( 'columnPaddingBottom', `%s${ columnPaddingUnit }` ),
					paddingRight: getValue( 'columnPaddingRight', `%s${ columnPaddingUnit }` ),
					paddingLeft: getValue( 'columnPaddingLeft', `%s${ columnPaddingUnit }` ),
				} ),
			},
			tabletOnly: {
				'> .ugb-inner-block > .ugb-block-content > *': appendImportantAll( {
					paddingTop: getValue( 'tabletColumnPaddingTop', `%s${ tabletColumnPaddingUnit }` ),
					paddingRight: getValue( 'tabletColumnPaddingRight', `%s${ tabletColumnPaddingUnit }` ),
					paddingBottom: getValue( 'tabletColumnPaddingBottom', `%s${ tabletColumnPaddingUnit }` ),
					paddingLeft: getValue( 'tabletColumnPaddingLeft', `%s${ tabletColumnPaddingUnit }` ),
				} ),
			},
			mobile: {
				'> .ugb-inner-block > .ugb-block-content > *': appendImportantAll( {
					paddingTop: getValue( 'mobileColumnPaddingTop', `%s${ mobileColumnPaddingUnit }` ),
					paddingRight: getValue( 'mobileColumnPaddingRight', `%s${ mobileColumnPaddingUnit }` ),
					paddingBottom: getValue( 'mobileColumnPaddingBottom', `%s${ mobileColumnPaddingUnit }` ),
					paddingLeft: getValue( 'mobileColumnPaddingLeft', `%s${ mobileColumnPaddingUnit }` ),
				} ),
			},
		},
		editor: {
			desktopTablet: {
				'> .ugb-inner-block > .ugb-block-content > .ugb-feature-grid__item': appendImportantAll( {
					paddingTop: getValue( 'columnPaddingTop', `%s${ columnPaddingUnit }` ),
					paddingBottom: getValue( 'columnPaddingBottom', `%s${ columnPaddingUnit }` ),
					paddingRight: getValue( 'columnPaddingRight', `%s${ columnPaddingUnit }` ),
					paddingLeft: getValue( 'columnPaddingLeft', `%s${ columnPaddingUnit }` ),
				} ),
			},
			tabletOnly: {
				'> .ugb-inner-block > .ugb-block-content > .ugb-feature-grid__item': appendImportantAll( {
					paddingTop: getValue( 'tabletColumnPaddingTop', `%s${ tabletColumnPaddingUnit }` ),
					paddingRight: getValue( 'tabletColumnPaddingRight', `%s${ tabletColumnPaddingUnit }` ),
					paddingBottom: getValue( 'tabletColumnPaddingBottom', `%s${ tabletColumnPaddingUnit }` ),
					paddingLeft: getValue( 'tabletColumnPaddingLeft', `%s${ tabletColumnPaddingUnit }` ),
				} ),
			},
			mobile: {
				'> .ugb-inner-block > .ugb-block-content > .ugb-feature-grid__item': appendImportantAll( {
					paddingTop: getValue( 'mobileColumnPaddingTop', `%s${ mobileColumnPaddingUnit }` ),
					paddingRight: getValue( 'mobileColumnPaddingRight', `%s${ mobileColumnPaddingUnit }` ),
					paddingBottom: getValue( 'mobileColumnPaddingBottom', `%s${ mobileColumnPaddingUnit }` ),
					paddingLeft: getValue( 'mobileColumnPaddingLeft', `%s${ mobileColumnPaddingUnit }` ),
				} ),
			},
		},
	} )

	// Image.
	const {
		imageAlign = '',
		imageTabletAlign = '',
		tabletContentAlign = '',
		imageMobileAlign = '',
		mobileContentAlign = '',
	} = props.attributes
	if ( showImage ) {
		styles.push( {
			...createImageStyleSet( 'image%s', 'ugb-img', props.attributes ),
		} )

		styles.push( {
			'.ugb-img, .ugb-feature-grid__image': {
				marginLeft: imageAlign !== '' || contentAlign !== '' ? marginLeftAlign( imageAlign || contentAlign ) + ' !important' : undefined,
				marginRight: imageAlign !== '' || contentAlign !== '' ? marginRightAlign( imageAlign || contentAlign ) + ' !important' : undefined,
			},
			tablet: {
				'.ugb-img, .ugb-feature-grid__image': {
					marginLeft: imageTabletAlign !== '' || tabletContentAlign !== '' ? marginLeftAlign( imageTabletAlign || tabletContentAlign ) + ' !important' : undefined,
					marginRight: imageTabletAlign !== '' || tabletContentAlign !== '' ? marginRightAlign( imageTabletAlign || tabletContentAlign ) + ' !important' : undefined,
				},
			},
			mobile: {
				'.ugb-img, .ugb-feature-grid__image': {
					marginLeft: imageMobileAlign !== '' || mobileContentAlign !== '' ? marginLeftAlign( imageMobileAlign || mobileContentAlign ) + ' !important' : undefined,
					marginRight: imageMobileAlign !== '' || mobileContentAlign !== '' ? marginRightAlign( imageMobileAlign || mobileContentAlign ) + ' !important' : undefined,
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
		const titleColorSelector = applyFilters( 'stackable.feature-grid.styles.title.color-selector', '.ugb-feature-grid__title', props )
		styles.push( {
			[ titleColorSelector ]: {
				color: whiteIfDark( titleColor, show.columnBackground && columnBackgroundColor ),
			},
		} )

		styles.push( {
			'.ugb-feature-grid__title': {
				...createTypographyStyles( 'title%s', 'desktop', props.attributes ),
				textAlign: getValue( 'titleAlign' ) || getValue( 'contentAlign' ),
			},
			tablet: {
				'.ugb-feature-grid__title': {
					...createTypographyStyles( 'title%s', 'tablet', props.attributes ),
					textAlign: getValue( 'titleTabletAlign' ) || getValue( 'tabletContentAlign' ),
				},
			},
			mobile: {
				'.ugb-feature-grid__title': {
					...createTypographyStyles( 'title%s', 'mobile', props.attributes ),
					textAlign: getValue( 'titleMobileAlign' ) || getValue( 'mobileContentAlign' ),
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
		const colorSelector = applyFilters( 'stackable.feature-grid.styles.description.color-selector', '.ugb-feature-grid__description', props )
		styles.push( {
			[ colorSelector ]: {
				color: whiteIfDark( descriptionColor, show.columnBackground && columnBackgroundColor ),
			},
		} )
		styles.push( {
			'.ugb-feature-grid__description': {
				...createTypographyStyles( 'description%s', 'desktop', props.attributes ),
				textAlign: getValue( 'descriptionAlign' ) || getValue( 'contentAlign' ),
			},
			tablet: {
				'.ugb-feature-grid__description': {
					...createTypographyStyles( 'description%s', 'tablet', props.attributes ),
					textAlign: getValue( 'descriptionTabletAlign' ) || getValue( 'tabletContentAlign' ),
				},
			},
			mobile: {
				'.ugb-feature-grid__description': {
					...createTypographyStyles( 'description%s', 'mobile', props.attributes ),
					textAlign: getValue( 'descriptionMobileAlign' ) || getValue( 'mobileContentAlign' ),
				},
			},
		} )
	}

	// Button.
	const {
		showButton = true,
		buttonDesign = '',
	} = props.attributes
	if ( showButton ) {
		styles.push( {
			...createButtonStyleSet( `button%s`, `ugb-button`, {
				...props.attributes,
				buttonDesign: buttonDesign || 'plain',
			} ),
		} )
		styles.push( {
			'.ugb-button-container': {
				textAlign: getValue( 'buttonAlign', '%s !important' ) || getValue( 'contentAlign', '%s !important' ),
			},
			tablet: {
				'.ugb-button-container': {
					textAlign: getValue( 'buttonTabletAlign', '%s !important' ) || getValue( 'tabletContentAlign', '%s !important' ),
				},
			},
			mobile: {
				'.ugb-button-container': {
					textAlign: getValue( 'buttonMobileAlign', '%s !important' ) || getValue( 'mobileContentAlign', '%s !important' ),
				},
			},
		} )
	}

	// Spacing.
	if ( show.imageSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-feature-grid__image', 'image%sBottomMargin', 'marginBottom', '%spx', props.attributes, { important: true } ) )
	}
	if ( show.titleSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-feature-grid__title', 'title%sBottomMargin', 'marginBottom', '%spx', props.attributes, { important: true } ) )
	}
	if ( show.descriptionSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-feature-grid__description', 'description%sBottomMargin', 'marginBottom', '%spx', props.attributes, { important: true } ) )
	}
	if ( show.buttonSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-button-container', 'button%sBottomMargin', 'marginBottom', '%spx', props.attributes, { important: true } ) )
	}

	return deepmerge.all( styles )
}

export default createStyles
