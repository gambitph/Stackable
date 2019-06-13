import {
	createBackgroundStyleSet,
	createTypographyStyles,
	whiteIfDark,
} from '@stackable/util'
import { applyFilters } from '@wordpress/hooks'
import deepmerge from 'deepmerge'
import { sprintf } from '@wordpress/i18n'

export const createStyles = props => {
	const getValue = ( attrName, format = '' ) => {
		const value = typeof props.attributes[ attrName ] === 'undefined' ? '' : props.attributes[ attrName ]
		return value !== '' ? ( format ? sprintf( format, value ) : value ) : undefined
	}

	const show = applyFilters( 'stackable.count-up.show', {
		columnBackground: false,
	}, props.attributes.design, props )

	const styles = []
	styles.push( {
		'.ugb-countup__icon, .ugb-countup__counter, .ugb-countup__title, .ugb-countup__description': {
			textAlign: getValue( 'contentAlign' ),
		},
		tablet: {
			'.ugb-countup__icon, .ugb-countup__counter, .ugb-countup__title, .ugb-countup__description': {
				textAlign: getValue( 'contentTabletAlign' ),
			},
		},
		mobile: {
			'.ugb-countup__icon, .ugb-countup__counter, .ugb-countup__title, .ugb-countup__description': {
				textAlign: getValue( 'contentMobileAlign' ),
			},
		},
	} )

	if ( show.columnBackground ) {
		styles.push( {
			'.ugb-countup__item': {
				borderRadius: getValue( 'borderRadius', '%spx' ),
			},
		} )
	}

	// Column Background.
	styles.push( {
		...( show.columnBackground ? createBackgroundStyleSet( 'column%s', 'ugb-countup__item', props.attributes ) : {} ),
	} )

	// Number spacing.
	const {
		showIcon = false,
		showNumber = true,
		showTitle = true,
	} = props.attributes
	if ( showIcon ) {
		styles.push( {
			'.ugb-countup__icon': {
				marginBottom: getValue( 'iconBottomMargin', '%spx' ),
			},
			tablet: {
				'.ugb-countup__icon': {
					marginBottom: getValue( 'iconTabletBottomMargin', '%spx' ),
				},
			},
			mobile: {
				'.ugb-countup__icon': {
					marginBottom: getValue( 'iconMobileBottomMargin', '%spx' ),
				},
			},
		} )
	}
	if ( showNumber ) {
		styles.push( {
			'.ugb-countup__counter': {
				marginBottom: getValue( 'numberBottomMargin', '%spx' ),
			},
			tablet: {
				'.ugb-countup__counter': {
					marginBottom: getValue( 'numberTabletBottomMargin', '%spx' ),
				},
			},
			mobile: {
				'.ugb-countup__counter': {
					marginBottom: getValue( 'numberMobileBottomMargin', '%spx' ),
				},
			},
		} )
	}
	if ( showTitle ) {
		styles.push( {
			'.ugb-countup__title': {
				marginBottom: getValue( 'titleBottomMargin', '%spx' ),
			},
			tablet: {
				'.ugb-countup__title': {
					marginBottom: getValue( 'titleTabletBottomMargin', '%spx' ),
				},
			},
			mobile: {
				'.ugb-countup__title': {
					marginBottom: getValue( 'titleMobileBottomMargin', '%spx' ),
				},
			},
		} )
	}

	// Icon
	const {
		iconColor = '',
		columnBackgroundColor = '',
		showBlockBackground = false,
		blockBackgroundBackgroundColor = '',
	} = props.attributes
	if ( showIcon ) {
		styles.push( {
			'.ugb-countup__icon': {
				textAlign: getValue( 'iconAlign' ),
			},
			'.ugb-countup__icon svg': {
				color: whiteIfDark( iconColor, show.columnBackground ? columnBackgroundColor : ( showBlockBackground ? blockBackgroundBackgroundColor : '' ) ),
				height: getValue( 'iconSize', '%spx' ),
				width: getValue( 'iconSize', '%spx' ),
			},
			tablet: {
				'.ugb-countup__icon svg': {
					height: getValue( 'iconTabletSize', '%spx' ),
					width: getValue( 'iconTabletSize', '%spx' ),
				},
			},
			mobile: {
				'.ugb-countup__icon svg': {
					height: getValue( 'iconMobileSize', '%spx' ),
					width: getValue( 'iconMobileSize', '%spx' ),
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
				...createTypographyStyles( 'number%s', 'desktop', props.attributes ),
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
		showDescription = true,
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
