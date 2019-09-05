/**
 * External dependencies
 */
import {
	createBackgroundStyleSet,
	createButtonStyleSet,
	createTypographyStyles,
	whiteIfDark,
	createImageStyleSet,
} from '~stackable/util'

/**
 * Internal dependencies
 */
import { showOptions } from '.'
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
	} = props.attributes

	const styles = []

	// General.
	const computeGridFraction2 = percentage => {
		const right = 2 * ( percentage / 100 )
		const left = 2 - right
		return `${ left.toFixed( 2 ) }fr ${ right.toFixed( 2 ) }fr`
	}
	if ( show.imageColumnWidth ) {
		styles.push( {
			'.ugb-feature__item': {
				gridTemplateColumns: props.attributes.imageColumnWidth !== '' ? computeGridFraction2( props.attributes.imageColumnWidth ) + ' !important' : undefined,
			},
			tablet: {
				'.ugb-feature__item': {
					gridTemplateColumns: props.attributes.imageColumnTabletWidth !== '' ? computeGridFraction2( props.attributes.imageColumnTabletWidth ) + ' !important' : undefined,
				},
			},
			mobile: {
				'.ugb-feature__item': {
					gridTemplateColumns: props.attributes.imageColumnMobileWidth !== '' ? computeGridFraction2( props.attributes.imageColumnMobileWidth ) + ' !important' : undefined,
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
		const selector = design === 'basic' || design === 'half' ? 'ugb-feature__item' : 'ugb-feature__content'
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
		styles.push( {
			'.ugb-feature__title': {
				marginBottom: getValue( 'titleBottomMargin', '%spx !important' ),
			},
			tablet: {
				'.ugb-feature__title': {
					marginBottom: getValue( 'titleTabletBottomMargin', '%spx !important' ),
				},
			},
			mobile: {
				'.ugb-feature__title': {
					marginBottom: getValue( 'titleMobileBottomMargin', '%spx !important' ),
				},
			},
		} )
	}
	if ( show.descriptionSpacing ) {
		styles.push( {
			'.ugb-feature__description': {
				marginBottom: getValue( 'descriptionBottomMargin', '%spx !important' ),
			},
			tablet: {
				'.ugb-feature__description': {
					marginBottom: getValue( 'descriptionTabletBottomMargin', '%spx !important' ),
				},
			},
			mobile: {
				'.ugb-feature__description': {
					marginBottom: getValue( 'descriptionMobileBottomMargin', '%spx !important' ),
				},
			},
		} )
	}

	return deepmerge.all( styles )
}

export default createStyles
