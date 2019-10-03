/**
 * External dependencies
 */
import {
	createBackgroundStyleSet,
	createButtonStyleSet,
	createTypographyStyles,
	whiteIfDark,
	createImageStyleSet,
	createResponsiveStyles,
} from '~stackable/util'

/**
 * Internal dependencies
 */
import { showOptions } from './util'
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

	const show = showOptions( props )

	const {
		design = 'plain',
		columnBackgroundColor = '',
		invert = false,
	} = props.attributes

	const styles = []

	// General.
	const computeGridFraction2 = ( percentage, rightColumn = true ) => {
		const right = 2 * ( ( typeof percentage !== 'number' ? 50 : percentage ) / 100 )
		const left = 2 - right
		if ( rightColumn ) {
			return `${ left.toFixed( 2 ) }fr ${ right.toFixed( 2 ) }fr`
		}
		return `${ right.toFixed( 2 ) }fr ${ left.toFixed( 2 ) }fr`
	}
	if ( show.imageColumnWidth ) {
		styles.push( {
			'.ugb-feature__item': {
				gridTemplateColumns: props.attributes.imageColumnWidth !== '' ? computeGridFraction2( props.attributes.imageColumnWidth, ! invert ) + ' !important' : undefined,
			},
			tablet: {
				'.ugb-feature__item': {
					gridTemplateColumns: props.attributes.imageColumnTabletWidth !== '' ? computeGridFraction2( props.attributes.imageColumnTabletWidth, ! invert ) + ' !important' : undefined,
				},
			},
			mobile: {
				'.ugb-feature__item': {
					gridTemplateColumns: props.attributes.imageColumnMobileWidth !== '' ? computeGridFraction2( props.attributes.imageColumnMobileWidth, ! invert ) + ' !important' : undefined,
				},
			},
		} )
	}
	if ( show.borderRadius ) {
		// The border radius is applied on the item.
		const selector = design === 'basic' || design === 'half' ? '.ugb-feature__item' : '.ugb-feature__content'
		styles.push( {
			[ selector ]: {
				borderRadius: getValue( 'borderRadius', '%spx !important' ),
			},
		} )
	}

	// Background.
	if ( show.columnBackground ) {
		const selector = design === 'basic' ? 'ugb-feature__item' : 'ugb-feature__content'
		styles.push( {
			...( show.columnBackground ? createBackgroundStyleSet( 'column%s', selector, props.attributes, {
				importantBackgroundColor: true,
			} ) : {} ),
		} )
	}

	// Image.
	if ( ! show.featuredImageAsBackground ) {
		styles.push( {
			...( ! show.featuredImageAsBackground ? createImageStyleSet( 'image%s', 'ugb-img', props.attributes ) : {} ),
		} )
	} else {
		styles.push( {
			'.ugb-feature__image': {
				backgroundImage: getValue( 'imageUrl', `url(%s)` ),
				backgroundPosition: getValue( 'imageBackgroundPosition' ),
			},
		} )
		styles.push( {
			'.ugb-feature__item': {
				height: getValue( 'imageBackgroundHeight', '%spx !important' ),
			},
			tablet: {
				'.ugb-feature__item': {
					height: getValue( 'imageBackgroundTabletHeight', '%spx !important' ),
				},
			},
			mobile: {
				'.ugb-feature__item': {
					height: getValue( 'imageBackgroundMobileHeight', '%spx !important' ),
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
			'.ugb-feature__title': {
				...createTypographyStyles( 'title%s', 'desktop', props.attributes ),
				color: whiteIfDark( titleColor, show.columnBackground && columnBackgroundColor ),
				textAlign: getValue( 'titleAlign' ),
			},
			tablet: {
				'.ugb-feature__title': {
					...createTypographyStyles( 'title%s', 'tablet', props.attributes ),
					textAlign: getValue( 'titleTabletAlign' ),
				},
			},
			mobile: {
				'.ugb-feature__title': {
					...createTypographyStyles( 'title%s', 'mobile', props.attributes ),
					textAlign: getValue( 'titleMobileAlign' ),
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
			'.ugb-feature__description': {
				...createTypographyStyles( 'description%s', 'desktop', props.attributes ),
				color: whiteIfDark( descriptionColor, show.columnBackground && columnBackgroundColor ),
				textAlign: getValue( 'descriptionAlign' ),
			},
			tablet: {
				'.ugb-feature__description': {
					...createTypographyStyles( 'description%s', 'tablet', props.attributes ),
					textAlign: getValue( 'descriptionTabletAlign' ),
				},
			},
			mobile: {
				'.ugb-feature__description': {
					...createTypographyStyles( 'description%s', 'mobile', props.attributes ),
					textAlign: getValue( 'descriptionMobileAlign' ),
				},
			},
		} )
	}

	// Button.
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

	// Spacing.
	if ( show.titleSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-feature__title', 'title%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.descriptionSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-feature__description', 'description%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.buttonSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-button-container', 'button%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}

	return deepmerge.all( styles )
}

export default createStyles
