/**
 * External dependencies
 */
import {
	createBackgroundStyleSet,
	createTypographyStyles,
	createImageStyleSet,
	marginLeftAlign,
	marginRightAlign,
	appendImportant,
	createResponsiveStyles,
	whiteIfDarkBlackIfLight,
	__getValue,
} from '~stackable/util'
import { range } from 'lodash'

/**
 * Internal dependencies
 */
import { showOptions } from './util'
import deepmerge from 'deepmerge'

export const createStyles = props => {
	const getValue = __getValue( props.attributes )

	const show = showOptions( props )

	const {
		design = 'basic',
		columns = 3,
		columnBackgroundColor = '',
		showImage = true,
		imageAlign = '',
		contentAlign = '',
		imageTabletAlign = '',
		mobileTabletAlign = '',
		imageMobileAlign = '',
		mobileContentAlign = '',
	} = props.attributes

	const styles = []

	if ( show.borderRadius ) {
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
					textAlign: appendImportant( getValue( 'testimonialTabletAlign' ) || getValue( 'mobileTabletAlign' ) ),
				},
			},
			mobile: {
				'.ugb-testimonial__body': {
					...createTypographyStyles( 'testimonial%s', 'mobile', props.attributes ),
					textAlign: appendImportant( getValue( 'testimonialMobileAlign' ) || getValue( 'mobileContentAlign' ) ),
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
					marginLeft: imageTabletAlign !== '' || mobileTabletAlign !== '' ? marginLeftAlign( imageTabletAlign || mobileTabletAlign ) + ' !important' : undefined,
					marginRight: imageTabletAlign !== '' || mobileTabletAlign !== '' ? marginRightAlign( imageTabletAlign || mobileTabletAlign ) + ' !important' : undefined,
				},
			},
			mobile: {
				'.ugb-img, .ugb-testimonial__image': {
					marginLeft: imageMobileAlign !== '' || mobileContentAlign !== '' ? marginLeftAlign( imageMobileAlign || mobileContentAlign ) + ' !important' : undefined,
					marginRight: imageMobileAlign !== '' || mobileContentAlign !== '' ? marginRightAlign( imageMobileAlign || mobileContentAlign ) + ' !important' : undefined,
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
					textAlign: getValue( 'nameTabletAlign' ) || getValue( 'mobileTabletAlign' ),
				},
			},
			mobile: {
				'.ugb-testimonial__name': {
					...createTypographyStyles( 'name%s', 'mobile', props.attributes ),
					textAlign: getValue( 'nameMobileAlign' ) || getValue( 'mobileContentAlign' ),
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
					textAlign: getValue( 'positionTabletAlign' ) || getValue( 'mobileTabletAlign' ),
				},
			},
			mobile: {
				'.ugb-testimonial__position': {
					...createTypographyStyles( 'position%s', 'mobile', props.attributes ),
					textAlign: getValue( 'positionMobileAlign' ) || getValue( 'mobileContentAlign' ),
				},
			},
		} )
	}

	// Spacing.
	if ( show.testimonialSpacing ) {
		if ( design !== 'bubble' ) {
			styles.push( ...createResponsiveStyles( '.ugb-testimonial__body', 'testimonial%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
		} else {
			styles.push( ...createResponsiveStyles( '.ugb-testimonial__body-wrapper', 'testimonial%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
		}
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

	return deepmerge.all( styles )
}

export default createStyles
