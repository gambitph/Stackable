/**
 * External dependencies
 */
import {
	createBackgroundStyleSet,
	createTypographyStyles,
	createImageStyleSet,
	marginLeftAlign,
	marginRightAlign,
	createImageMask,
	appendImportant,
	createResponsiveStyles,
	whiteIfDarkBlackIfLight,
} from '~stackable/util'
import { range } from 'lodash'

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
		design = 'basic',
		columns = 3,
		columnBackgroundColor = '',
		showImage = true,
		imageAlign = '',
		contentAlign = '',
		imageTabletAlign = '',
		contentTabletAlign = '',
		imageMobileAlign = '',
		contentMobileAlign = '',
	} = props.attributes

	const styles = []

	if ( show.columnBackground ) {
		styles.push( {
			'.ugb-testimonial__item': {
				borderRadius: getValue( 'borderRadius', '%spx !important' ),
			},
		} )
	}

	// Column Background.
	styles.push( {
		...( show.columnBackground ? createBackgroundStyleSet( 'column%s', 'ugb-testimonial__item', props.attributes, {
			importantBackgroundColor: true,
		} ) : {} ),
	} )

	// Testimonial.
	const {
		testimonialColor = '',
		showTestimonial = true,
	} = props.attributes
	if ( showTestimonial ) {
		styles.push( {
			'.ugb-testimonial__body': {
				...createTypographyStyles( 'testimonial%s', 'desktop', props.attributes, { important: true } ),
				color: appendImportant( whiteIfDarkBlackIfLight( testimonialColor, ( show.columnBackground || design === 'background' ) && columnBackgroundColor ) ),
				textAlign: appendImportant( getValue( 'testimonialAlign' ) || getValue( 'contentAlign' ) ),
			},
			tablet: {
				'.ugb-testimonial__body': {
					...createTypographyStyles( 'testimonial%s', 'tablet', props.attributes ),
					textAlign: appendImportant( getValue( 'testimonialTabletAlign' ) || getValue( 'contentTabletAlign' ) ),
				},
			},
			mobile: {
				'.ugb-testimonial__body': {
					...createTypographyStyles( 'testimonial%s', 'mobile', props.attributes ),
					textAlign: appendImportant( getValue( 'testimonialMobileAlign' ) || getValue( 'contentMobileAlign' ) ),
				},
			},
		} )
	}

	// Image.
	if ( ! show.imageAsBackground && showImage ) {
		styles.push( {
			...createImageStyleSet( 'image%s', 'ugb-img', props.attributes ),
		} )
		styles.push( ...createResponsiveStyles( '.ugb-testimonial__image', 'image%sWidth', 'width', '%spx', props.attributes, true ) )

		styles.push( {
			'.ugb-img, .ugb-testimonial__image': {
				marginLeft: imageAlign !== '' || contentAlign !== '' ? marginLeftAlign( imageAlign || contentAlign ) + ' !important' : undefined,
				marginRight: imageAlign !== '' || contentAlign !== '' ? marginRightAlign( imageAlign || contentAlign ) + ' !important' : undefined,
			},
			tablet: {
				'.ugb-img, .ugb-testimonial__image': {
					marginLeft: imageTabletAlign !== '' || contentTabletAlign !== '' ? marginLeftAlign( imageTabletAlign || contentTabletAlign ) + ' !important' : undefined,
					marginRight: imageTabletAlign !== '' || contentTabletAlign !== '' ? marginRightAlign( imageTabletAlign || contentTabletAlign ) + ' !important' : undefined,
				},
			},
			mobile: {
				'.ugb-img, .ugb-testimonial__image': {
					marginLeft: imageMobileAlign !== '' || contentMobileAlign !== '' ? marginLeftAlign( imageMobileAlign || contentMobileAlign ) + ' !important' : undefined,
					marginRight: imageMobileAlign !== '' || contentMobileAlign !== '' ? marginRightAlign( imageMobileAlign || contentMobileAlign ) + ' !important' : undefined,
				},
			},
		} )
	} else if ( showImage ) {
		range( 1, columns + 1 ).forEach( i => {
			styles.push( {
				[ `.ugb-testimonial__item.ugb-testimonial__item${ i } .ugb-testimonial__image` ]: {
					backgroundImage: getValue( `image${ i }Url`, 'url(%s)' ),
				},
			} )
		} )
	}

	// Name.
	const {
		nameColor = '',
		showName = true,
	} = props.attributes
	if ( showName ) {
		styles.push( {
			'.ugb-testimonial__name': {
				...createTypographyStyles( 'name%s', 'desktop', props.attributes ),
				color: appendImportant( whiteIfDarkBlackIfLight( nameColor, ( show.columnBackground || design === 'background' ) && columnBackgroundColor ) ),
				textAlign: getValue( 'nameAlign' ) || getValue( 'contentAlign' ),
			},
			tablet: {
				'.ugb-testimonial__name': {
					...createTypographyStyles( 'name%s', 'tablet', props.attributes ),
					textAlign: getValue( 'nameTabletAlign' ) || getValue( 'contentTabletAlign' ),
				},
			},
			mobile: {
				'.ugb-testimonial__name': {
					...createTypographyStyles( 'name%s', 'mobile', props.attributes ),
					textAlign: getValue( 'nameMobileAlign' ) || getValue( 'contentMobileAlign' ),
				},
			},
		} )
	}

	// Position.
	const {
		positionColor = '',
		showPosition = true,
	} = props.attributes
	if ( showPosition ) {
		styles.push( {
			'.ugb-testimonial__position': {
				...createTypographyStyles( 'position%s', 'desktop', props.attributes ),
				color: appendImportant( whiteIfDarkBlackIfLight( positionColor, ( show.columnBackground || design === 'background' ) && columnBackgroundColor ) ),
				textAlign: getValue( 'positionAlign' ) || getValue( 'contentAlign' ),
			},
			tablet: {
				'.ugb-testimonial__position': {
					...createTypographyStyles( 'position%s', 'tablet', props.attributes ),
					textAlign: getValue( 'positionTabletAlign' ) || getValue( 'contentTabletAlign' ),
				},
			},
			mobile: {
				'.ugb-testimonial__position': {
					...createTypographyStyles( 'position%s', 'mobile', props.attributes ),
					textAlign: getValue( 'positionMobileAlign' ) || getValue( 'contentMobileAlign' ),
				},
			},
		} )
	}

	// Spacing.
	if ( show.testimonialSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-testimonial__body', 'testimonial%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.imageSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-testimonial__image', 'image%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.nameSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-testimonial__name', 'name%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.positionSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-testimonial__position', 'position%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}

	// Advanced image.
	if ( ! show.imageAsBackground && showImage ) {
		range( 1, columns + 1 ).forEach( i => {
			if ( props.attributes[ `image${ i }Shape` ] ) {
				styles.push( {
					[ `.ugb-testimonial__item${ i } .ugb-img` ]: createImageMask( `image${ i }%s`, props.attributes ),
				} )
			}
		} )
	}

	return deepmerge.all( styles )
}

export default createStyles
