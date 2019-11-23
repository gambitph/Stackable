/**
 * External dependencies
 */
import {
	createBackgroundStyleSet,
	createTypographyStyles,
	createResponsiveStyles,
	marginLeftAlign,
	marginRightAlign,
	whiteIfDark,
	whiteIfDarkBlackIfLight,
	appendImportant,
	__getValue,
} from '~stackable/util'

/**
 * Internal dependencies
 */
import { showOptions } from './util'
import deepmerge from 'deepmerge'

export const createStyles = props => {
	const getValue = __getValue( props.attributes )

	const styles = []

	const {
		design = 'basic',
		columnBackgroundColor = '',
	} = props.attributes

	const show = showOptions( props )

	// General.
	styles.push( {
		'.ugb-number-box__item': {
			borderRadius: design !== 'plain' ? getValue( 'borderRadius', '%spx !important' ) : undefined,
		},
	} )

	// Column Background.
	const columnBackgroundOptions = {
		importantBackgroundColor: true,
	}
	styles.push( {
		...( show.columnBackground ? createBackgroundStyleSet( 'column%s', 'ugb-number-box__item', props.attributes, columnBackgroundOptions ) : {} ),
	} )

	// Number
	const {
		contentAlign = '',
		tabletContentAlign = '',
		mobileContentAlign = '',
		numberBGColor = '',
		numberColor = '',
		numberAlign = '',
		numberTabletAlign = '',
		numberMobileAlign = '',
		numberLineHeight = '',
		numberTabletLineHeight = '',
		numberMobileLineHeight = '',
		numberLineHeightUnit = 'em',
		numberTabletLineHeightUnit = 'em',
		numberMobileLineHeightUnit = 'em',
		showNumber = true,
	} = props.attributes

	if ( showNumber ) {
		styles.push( {
			'.ugb-number-box__number': {
				...createTypographyStyles( 'number%s', 'desktop', props.attributes, { important: true } ),
				backgroundColor: show.numberBGColor ? appendImportant( getValue( 'numberBGColor' ) ) : undefined,
				height: show.numberBGColor ? appendImportant( getValue( 'numberPadding', '%sem' ) ) : undefined,
				width: show.numberBGColor ? appendImportant( getValue( 'numberPadding', '%sem' ) ) : undefined,
				lineHeight: appendImportant( show.numberBGColor && numberLineHeight === '' ? getValue( 'numberPadding', '%sem' ) : getValue( 'numberLineHeight', `%s${ numberLineHeightUnit }` ) ),
				marginLeft: numberAlign !== '' || contentAlign !== '' ? appendImportant( marginLeftAlign( numberAlign || contentAlign ) ) : undefined,
				marginRight: numberAlign !== '' || contentAlign !== '' ? appendImportant( marginRightAlign( numberAlign || contentAlign ) ) : undefined,
				textAlign: appendImportant( show.numberBGColor ? undefined : ( getValue( 'numberAlign' ) || getValue( 'contentAlign' ) ) ),
				color: appendImportant( whiteIfDarkBlackIfLight( numberColor, show.numberBGColor && numberBGColor ) ),
				opacity: getValue( 'numberOpacity' ),
				// Special case for centering the text with letter-spacing.
				textIndent: ( design === 'basic' || design === 'plain' ) ? getValue( 'numberLetterSpacing', '%spx' ) : undefined,
			},
			tablet: {
				'.ugb-number-box__number': {
					height: show.numberBGColor ? appendImportant( getValue( 'numberTabletPadding', '%sem' ) ) : undefined,
					width: show.numberBGColor ? appendImportant( getValue( 'numberTabletPadding', '%sem' ) ) : undefined,
					lineHeight: appendImportant( show.numberBGColor && numberTabletLineHeight === '' ? getValue( 'numberTabletPadding', '%sem' ) : getValue( 'numberTabletLineHeight', `%s${ numberTabletLineHeightUnit }` ) ),
					marginLeft: numberTabletAlign !== '' && tabletContentAlign !== '' ? appendImportant( marginLeftAlign( numberTabletAlign || tabletContentAlign ) ) : undefined,
					marginRight: numberTabletAlign !== '' && tabletContentAlign !== '' ? appendImportant( marginRightAlign( numberTabletAlign || tabletContentAlign ) ) : undefined,
					textAlign: show.numberBGColor ? undefined : ( getValue( 'numberTabletAlign' ) || getValue( 'tabletContentAlign' ) ),
				},
			},
			mobile: {
				'.ugb-number-box__number': {
					height: show.numberBGColor ? appendImportant( getValue( 'numberMobilePadding', '%sem' ) ) : undefined,
					width: show.numberBGColor ? appendImportant( getValue( 'numberMobilePadding', '%sem' ) ) : undefined,
					lineHeight: appendImportant( show.numberBGColor && numberMobileLineHeight === '' ? getValue( 'numberMobilePadding', '%sem' ) : getValue( 'numberMobileLineHeight', `%s${ numberMobileLineHeightUnit }` ) ),
					marginLeft: numberMobileAlign !== '' && mobileContentAlign !== '' ? appendImportant( marginLeftAlign( numberMobileAlign || mobileContentAlign ) ) : undefined,
					marginRight: numberMobileAlign !== '' && mobileContentAlign !== '' ? appendImportant( marginRightAlign( numberMobileAlign || mobileContentAlign ) ) : undefined,
					textAlign: show.numberBGColor ? undefined : ( getValue( 'numberMobileAlign' ) || getValue( 'mobileContentAlign' ) ),
				},
			},
		} )
	}

	const {
		titleColor = '',
		showTitle = true,
	} = props.attributes
	if ( showTitle ) {
		styles.push( {
			'.ugb-number-box__title': {
				...createTypographyStyles( 'title%s', 'desktop', props.attributes ),
				color: whiteIfDark( titleColor, show.columnBackground && columnBackgroundColor ),
				textAlign: getValue( 'titleAlign' ),
			},
			tablet: {
				'.ugb-number-box__title': {
					...createTypographyStyles( 'title%s', 'tablet', props.attributes ),
					textAlign: getValue( 'titleTabletAlign' ),
				},
			},
			mobile: {
				'.ugb-number-box__title': {
					...createTypographyStyles( 'title%s', 'mobile', props.attributes ),
					textAlign: getValue( 'titleMobileAlign' ),
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
			'.ugb-number-box__description': {
				...createTypographyStyles( 'description%s', 'desktop', props.attributes ),
				color: whiteIfDark( descriptionColor, show.columnBackground && columnBackgroundColor ),
				textAlign: getValue( 'descriptionAlign' ),
			},
			tablet: {
				'.ugb-number-box__description': {
					...createTypographyStyles( 'description%s', 'tablet', props.attributes ),
					textAlign: getValue( 'descriptionTabletAlign' ),
				},
			},
			mobile: {
				'.ugb-number-box__description': {
					...createTypographyStyles( 'description%s', 'mobile', props.attributes ),
					textAlign: getValue( 'descriptionMobileAlign' ),
				},
			},
		} )
	}

	// Number spacing.
	if ( show.numberSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-number-box__number', 'number%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.titleSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-number-box__title', 'title%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.descriptionSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-number-box__description', 'description%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}

	return deepmerge.all( styles )
}

export default createStyles
