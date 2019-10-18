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
	createResponsiveStyles,
	createSocialButtonStyleSet,
	whiteIfDarkBlackIfLight,
	appendImportant,
	createImageBackgroundStyleSet,
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
import { applyFilters } from '@wordpress/hooks'
import { sprintf } from '@wordpress/i18n'

export const createStyles = props => {
	const getValue = ( attrName, format = '' ) => {
		const value = typeof props.attributes[ attrName ] === 'undefined' ? '' : props.attributes[ attrName ]
		return value !== '' ? ( format ? sprintf( format, value ) : value ) : undefined
	}

	const show = showOptions( props )

	const {
		columns = 3,
		columnBackgroundColor = '',
		showImage = true,
		contentAlign = '',
	} = props.attributes

	const styles = []

	if ( show.columnBackground ) {
		styles.push( {
			'.ugb-team-member__item': {
				borderRadius: getValue( 'borderRadius', '%spx !important' ),
			},
		} )
	}

	// Column Background.
	const columnBackgroundSelector = applyFilters( 'stackable.team-member.styles.column-background', 'ugb-team-member__item', props.attributes )
	styles.push( {
		...( show.columnBackground ? createBackgroundStyleSet( 'column%s', columnBackgroundSelector, props.attributes, {
			importantBackgroundColor: true,
		} ) : {} ),
	} )

	// Image.
	const {
		imageAlign = '',
		imageTabletAlign = '',
		contentTabletAlign = '',
		imageMobileAlign = '',
		contentMobileAlign = '',
	} = props.attributes
	if ( ! show.imageAsBackground && showImage ) {
		styles.push( {
			...createImageStyleSet( 'image%s', 'ugb-img', props.attributes ),
		} )
		styles.push( ...createResponsiveStyles( '.ugb-team-member__image', 'image%sWidth', 'width', '%spx', props.attributes, true ) )

		styles.push( {
			'.ugb-img, .ugb-team-member__image': {
				marginLeft: imageAlign !== '' || contentAlign !== '' ? marginLeftAlign( imageAlign || contentAlign ) + ' !important' : undefined,
				marginRight: imageAlign !== '' || contentAlign !== '' ? marginRightAlign( imageAlign || contentAlign ) + ' !important' : undefined,
			},
			tablet: {
				'.ugb-img, .ugb-team-member__image': {
					marginLeft: imageTabletAlign !== '' || contentTabletAlign !== '' ? marginLeftAlign( imageTabletAlign || contentTabletAlign ) + ' !important' : undefined,
					marginRight: imageTabletAlign !== '' || contentTabletAlign !== '' ? marginRightAlign( imageTabletAlign || contentTabletAlign ) + ' !important' : undefined,
				},
			},
			mobile: {
				'.ugb-img, .ugb-team-member__image': {
					marginLeft: imageMobileAlign !== '' || contentMobileAlign !== '' ? marginLeftAlign( imageMobileAlign || contentMobileAlign ) + ' !important' : undefined,
					marginRight: imageMobileAlign !== '' || contentMobileAlign !== '' ? marginRightAlign( imageMobileAlign || contentMobileAlign ) + ' !important' : undefined,
				},
			},
		} )
	} else if ( showImage ) {
		styles.push( {
			...createImageBackgroundStyleSet( 'image%s', 'ugb-team-member__image', props.attributes ),
		} )

		range( 1, columns + 1 ).forEach( i => {
			styles.push( {
				[ `.ugb-team-member__item.ugb-team-member__item${ i } .ugb-team-member__image` ]: {
					backgroundImage: getValue( `image${ i }Url`, 'url(%s)' ),
				},
			} )
		} )
	}

	// Title.
	const {
		nameColor = '',
		showName = true,
	} = props.attributes
	if ( showName ) {
		styles.push( {
			'.ugb-team-member__name': {
				color: whiteIfDarkBlackIfLight( nameColor, show.columnBackground && columnBackgroundColor ),
			},
		} )

		styles.push( {
			'.ugb-team-member__name': {
				...createTypographyStyles( 'name%s', 'desktop', props.attributes ),
				textAlign: getValue( 'nameAlign' ) || getValue( 'contentAlign' ),
			},
			tablet: {
				'.ugb-team-member__name': {
					...createTypographyStyles( 'name%s', 'tablet', props.attributes ),
					textAlign: getValue( 'nameTabletAlign' ) || getValue( 'contentTabletAlign' ),
				},
			},
			mobile: {
				'.ugb-team-member__name': {
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
			'.ugb-team-member__position': {
				color: whiteIfDarkBlackIfLight( positionColor, show.columnBackground && columnBackgroundColor ),
			},
		} )

		styles.push( {
			'.ugb-team-member__position': {
				...createTypographyStyles( 'position%s', 'desktop', props.attributes ),
				textAlign: getValue( 'positionAlign' ) || getValue( 'contentAlign' ),
			},
			tablet: {
				'.ugb-team-member__position': {
					...createTypographyStyles( 'position%s', 'tablet', props.attributes ),
					textAlign: getValue( 'positionTabletAlign' ) || getValue( 'contentTabletAlign' ),
				},
			},
			mobile: {
				'.ugb-team-member__position': {
					...createTypographyStyles( 'position%s', 'mobile', props.attributes ),
					textAlign: getValue( 'positionMobileAlign' ) || getValue( 'contentMobileAlign' ),
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
			'.ugb-team-member__description': {
				color: whiteIfDarkBlackIfLight( descriptionColor, show.columnBackground && columnBackgroundColor ),
			},
		} )

		styles.push( {
			'.ugb-team-member__description': {
				...createTypographyStyles( 'description%s', 'desktop', props.attributes ),
				textAlign: getValue( 'descriptionAlign' ) || getValue( 'contentAlign' ),
			},
			tablet: {
				'.ugb-team-member__description': {
					...createTypographyStyles( 'description%s', 'tablet', props.attributes ),
					textAlign: getValue( 'descriptionTabletAlign' ) || getValue( 'contentTabletAlign' ),
				},
			},
			mobile: {
				'.ugb-team-member__description': {
					...createTypographyStyles( 'description%s', 'mobile', props.attributes ),
					textAlign: getValue( 'descriptionMobileAlign' ) || getValue( 'contentMobileAlign' ),
				},
			},
		} )
	}

	// Button.
	const {
		showSocial = true,
		socialDesign = '',
	} = props.attributes
	if ( showSocial ) {
		styles.push( {
			...createSocialButtonStyleSet( `social%s`, `ugb-button`, {
				...props.attributes,
				buttonDesign: socialDesign,
			} ),
		} )
		styles.push( {
			'.ugb-team-member__buttons': {
				textAlign: appendImportant( getValue( 'socialAlign' ) || getValue( 'contentAlign' ) ),
			},
			tablet: {
				'.ugb-team-member__buttons': {
					textAlign: appendImportant( getValue( 'socialTabletAlign' ) || getValue( 'contentTabletAlign' ) ),
				},
			},
			mobile: {
				'.ugb-team-member__buttons': {
					textAlign: appendImportant( getValue( 'socialMobileAlign' ) || getValue( 'contentMobileAlign' ) ),
				},
			},
		} )
	}

	// Spacing.
	if ( show.imageSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-team-member__image', 'image%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.nameSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-team-member__name', 'name%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.positionSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-team-member__position', 'position%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.descriptionSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-team-member__description', 'description%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.socialSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-button-container', 'social%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
		styles.push( ...createResponsiveStyles( '.ugb-button', 'social%sGap', 'marginLeft', '%spx', props.attributes, true ) )
		styles.push( ...createResponsiveStyles( '.ugb-button', 'social%sGap', 'marginRight', '%spx', props.attributes, true ) )
	}

	// Advanced image.
	if ( showImage ) {
		range( 1, columns + 1 ).forEach( i => {
			if ( props.attributes[ `image${ i }Shape` ] ) {
				styles.push( {
					[ `.ugb-team-member__item${ i } .ugb-img` ]: createImageMask( `image${ i }%s`, props.attributes ),
				} )
			}
		} )
	}

	return deepmerge.all( styles )
}

export default createStyles
