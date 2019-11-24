/**
 * External dependencies
 */
import {
	createBackgroundStyleSet,
	createResponsiveStyles,
	createTypographyStyles,
	whiteIfDark,
	appendImportant,
	__getValue,
	marginLeftAlign,
	marginRightAlign,
} from '~stackable/util'

/**
 * Internal dependencies
 */
import { showOptions } from './util'
import deepmerge from 'deepmerge'

export const createStyles = props => {
	const getValue = __getValue( props.attributes )

	const show = showOptions( props )

	const styles = []
	styles.push( {
		'.ugb-countup__icon, .ugb-countup__counter, .ugb-countup__title, .ugb-countup__description': {
			textAlign: getValue( 'contentAlign' ),
		},
		tablet: {
			'.ugb-countup__icon, .ugb-countup__counter, .ugb-countup__title, .ugb-countup__description': {
				textAlign: getValue( 'tabletContentAlign' ),
			},
		},
		mobile: {
			'.ugb-countup__icon, .ugb-countup__counter, .ugb-countup__title, .ugb-countup__description': {
				textAlign: getValue( 'mobileContentAlign' ),
			},
		},
	} )

	if ( show.columnBackground ) {
		styles.push( {
			'.ugb-countup__item': {
				borderRadius: getValue( 'borderRadius', '%spx !important' ),
			},
		} )
	}

	// Column Background.
	const columnBackgroundOptions = {
		importantBackgroundColor: true,
	}
	styles.push( {
		...( show.columnBackground ? createBackgroundStyleSet( 'column%s', 'ugb-countup__item', props.attributes, columnBackgroundOptions ) : {} ),
	} )

	// Spacing.
	const {
		showIcon = false,
		showNumber = true,
		showTitle = true,
		showDescription = true,
	} = props.attributes
	if ( showIcon ) {
		styles.push( ...createResponsiveStyles( '.ugb-countup__icon', 'icon%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( showNumber ) {
		styles.push( ...createResponsiveStyles( '.ugb-countup__counter', 'number%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( showTitle ) {
		styles.push( ...createResponsiveStyles( '.ugb-countup__title', 'title%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( showDescription ) {
		styles.push( ...createResponsiveStyles( '.ugb-countup__description', 'description%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}

	// Icon
	const {
		iconColor = '',
		columnBackgroundColor = '',
		showBlockBackground = false,
		blockBackgroundBackgroundColor = '',
		iconAlign = '',
		contentAlign = '',
		iconTabletAlign = '',
		tabletContentAlign = '',
		iconMobileAlign = '',
		mobileContentAlign = '',
	} = props.attributes
	if ( showIcon ) {
		styles.push( {
			'.ugb-countup__icon': {
				textAlign: appendImportant( getValue( 'iconAlign' ) ),
			},
			'.ugb-countup__icon svg': {
				color: whiteIfDark( iconColor, show.columnBackground ? columnBackgroundColor : ( showBlockBackground ? blockBackgroundBackgroundColor : '' ) ),
				height: appendImportant( getValue( 'iconSize', '%spx' ) ),
				width: appendImportant( getValue( 'iconSize', '%spx' ) ),
				marginLeft: iconAlign !== '' || contentAlign !== '' ? appendImportant( marginLeftAlign( iconAlign || contentAlign ) ) : undefined,
				marginRight: iconAlign !== '' || contentAlign !== '' ? appendImportant( marginRightAlign( iconAlign || contentAlign ) ) : undefined,
			},
			tablet: {
				'.ugb-countup__icon': {
					textAlign: appendImportant( iconTabletAlign ),
				},
				'.ugb-countup__icon svg': {
					height: getValue( 'iconTabletSize', '%spx' ),
					width: getValue( 'iconTabletSize', '%spx' ),
					marginLeft: iconTabletAlign !== '' || tabletContentAlign !== '' ? appendImportant( marginLeftAlign( iconTabletAlign || tabletContentAlign ) ) : undefined,
					marginRight: iconTabletAlign !== '' || tabletContentAlign !== '' ? appendImportant( marginRightAlign( iconTabletAlign || tabletContentAlign ) ) : undefined,
				},
			},
			mobile: {
				'.ugb-countup__icon': {
					textAlign: appendImportant( iconMobileAlign ),
				},
				'.ugb-countup__icon svg': {
					height: getValue( 'iconMobileSize', '%spx' ),
					width: getValue( 'iconMobileSize', '%spx' ),
					marginLeft: iconMobileAlign !== '' || mobileContentAlign !== '' ? appendImportant( marginLeftAlign( iconMobileAlign || mobileContentAlign ) ) : undefined,
					marginRight: iconMobileAlign !== '' || mobileContentAlign !== '' ? appendImportant( marginRightAlign( iconMobileAlign || mobileContentAlign ) ) : undefined,
				},
			},
		} )
	}

	// Title.
	const {
		titleColor = '',
	} = props.attributes
	if ( showTitle ) {
		styles.push( {
			'.ugb-countup__title': {
				...createTypographyStyles( 'title%s', 'desktop', props.attributes ),
				color: whiteIfDark( titleColor, show.columnBackground ? columnBackgroundColor : ( showBlockBackground ? blockBackgroundBackgroundColor : '' ) ),
				textAlign: getValue( 'titleAlign' ),
			},
			tablet: {
				'.ugb-countup__title': {
					...createTypographyStyles( 'title%s', 'tablet', props.attributes ),
					textAlign: getValue( 'titleTabletAlign' ),
				},
			},
			mobile: {
				'.ugb-countup__title': {
					...createTypographyStyles( 'title%s', 'mobile', props.attributes ),
					textAlign: getValue( 'titleMobileAlign' ),
				},
			},
		} )
	}

	// Number.
	const {
		numberColor = '',
	} = props.attributes
	if ( showNumber ) {
		styles.push( {
			'.ugb-countup__counter': {
				...createTypographyStyles( 'number%s', 'desktop', props.attributes, { importantSize: true } ),
				color: whiteIfDark( numberColor, show.columnBackground ? columnBackgroundColor : ( showBlockBackground ? blockBackgroundBackgroundColor : '' ) ),
				textAlign: getValue( 'numberAlign' ),
			},
			tablet: {
				'.ugb-countup__counter': {
					...createTypographyStyles( 'number%s', 'tablet', props.attributes ),
					textAlign: getValue( 'numberTabletAlign' ),
				},
			},
			mobile: {
				'.ugb-countup__counter': {
					...createTypographyStyles( 'number%s', 'mobile', props.attributes ),
					textAlign: getValue( 'numberMobileAlign' ),
				},
			},
		} )
	}

	// Description.
	const {
		descriptionColor = '',
	} = props.attributes
	if ( showDescription ) {
		styles.push( {
			'.ugb-countup__description': {
				...createTypographyStyles( 'description%s', 'desktop', props.attributes ),
				color: whiteIfDark( descriptionColor, show.columnBackground ? columnBackgroundColor : ( showBlockBackground ? blockBackgroundBackgroundColor : '' ) ),
				textAlign: getValue( 'descriptionAlign' ),
			},
			tablet: {
				'.ugb-countup__description': {
					...createTypographyStyles( 'description%s', 'tablet', props.attributes ),
					textAlign: getValue( 'descriptionTabletAlign' ),
				},
			},
			mobile: {
				'.ugb-countup__description': {
					...createTypographyStyles( 'description%s', 'mobile', props.attributes ),
					textAlign: getValue( 'descriptionMobileAlign' ),
				},
			},
		} )
	}

	return deepmerge.all( styles )
	// return {
	// 	'.ugb-icon-list li': {
	// 		...createTypographyStyles( 'listText%s', 'desktop', props.attributes ),
	// 		color: whiteIfDark( listTextColor, showBlockBackground && blockBackgroundBackgroundColor ),
	// 		'--icon': 'url(\'data:image/svg+xml;base64,' + iconSVGString + '\')',
	// 		'--icon-size': iconSize ? `${ iconSize }px` : undefined,
	// 		'--gap': gap ? `${ gap }px` : undefined,
	// 	},
	// }
}

export default createStyles
