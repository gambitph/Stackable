import {
	createBackgroundStyleSet,
	createTypographyStyles,
	whiteIfDark,
	createButtonStyleSet,
} from '@stackable/util'
import deepmerge from 'deepmerge'
import { showOptions } from '.'
import { sprintf } from '@wordpress/i18n'

export const createStyles = props => {
	const getValue = ( attrName, format = '' ) => {
		const value = typeof props.attributes[ attrName ] === 'undefined' ? '' : props.attributes[ attrName ]
		return value !== '' ? ( format ? sprintf( format, value ) : value ) : undefined
	}

	const show = showOptions( props )

	const {
		columnBackgroundColor = '',
	} = props.attributes

	const styles = []

	if ( show.columnBackground ) {
		styles.push( {
			'.ugb-header__item': {
				borderRadius: show.borderRadius ? getValue( 'borderRadius', '%spx !important' ) : undefined,
			},
		} )
	}

	// Column Background.
	styles.push( {
		...( show.columnBackground ? createBackgroundStyleSet( 'column%s', 'ugb-header__item', props.attributes, {
			importantBackgroundColor: true,
		} ) : {} ),
	} )

	const {
		titleColor = '',
		showTitle = true,
	} = props.attributes
	if ( showTitle ) {
		styles.push( {
			'.ugb-header__title': {
				...createTypographyStyles( 'title%s', 'desktop', props.attributes ),
				color: whiteIfDark( titleColor, show.columnBackground && columnBackgroundColor ),
				textAlign: getValue( 'titleAlign' ),
			},
			tablet: {
				'.ugb-header__title': {
					...createTypographyStyles( 'title%s', 'tablet', props.attributes ),
					textAlign: getValue( 'titleTabletAlign' ),
				},
			},
			mobile: {
				'.ugb-header__title': {
					...createTypographyStyles( 'title%s', 'mobile', props.attributes ),
					textAlign: getValue( 'titleMobileAlign' ),
				},
			},
		} )
	}

	const {
		subtitleColor = '',
		showSubtitle = true,
	} = props.attributes
	if ( showSubtitle ) {
		styles.push( {
			'.ugb-header__subtitle': {
				...createTypographyStyles( 'subtitle%s', 'desktop', props.attributes ),
				color: whiteIfDark( subtitleColor, show.columnBackground && columnBackgroundColor ),
				textAlign: getValue( 'subtitleAlign' ),
			},
			tablet: {
				'.ugb-header__subtitle': {
					...createTypographyStyles( 'subtitle%s', 'tablet', props.attributes ),
					textAlign: getValue( 'subtitleTabletAlign' ),
				},
			},
			mobile: {
				'.ugb-header__subtitle': {
					...createTypographyStyles( 'subtitle%s', 'mobile', props.attributes ),
					textAlign: getValue( 'subtitleMobileAlign' ),
				},
			},
		} )
	}

	if ( showButton || showButton2 ) {
		styles.push( {
			'.ugb-header__buttons': {
				justifyContent: getValue( 'contentAlign' ) === 'left' ? 'flex-start' :
					getValue( 'contentAlign' ) === 'right' ? 'flex-end' :
						undefined,
			},
			tablet: {
				'.ugb-header__buttons': {
					justifyContent: getValue( 'tabletContentAlign' ) === 'left' ? 'flex-start' :
						getValue( 'tabletContentAlign' ) === 'right' ? 'flex-end' :
							undefined,
				},
			},
			mobile: {
				'.ugb-header__buttons': {
					justifyContent: getValue( 'mobileContentAlign' ) === 'left' ? 'flex-start' :
						getValue( 'mobileContentAlign' ) === 'right' ? 'flex-end' :
							undefined,
				},
			},
		} )
	}

	const {
		showButton = false,
		showButton2 = true,
	} = props.attributes

	if ( showButton ) {
		styles.push( {
			...createButtonStyleSet( 'button%s', 'ugb-button1', props.attributes ),
		} )
	}
	if ( showButton2 ) {
		styles.push( {
			...createButtonStyleSet( 'button2%s', 'ugb-button2', props.attributes ),
		} )
	}

	// Spacing.
	if ( show.titleSpacing ) {
		styles.push( {
			'.ugb-header__title': {
				marginBottom: getValue( 'titleBottomMargin', '%spx !important' ),
			},
			tablet: {
				'.ugb-header__title': {
					marginBottom: getValue( 'titleTabletBottomMargin', '%spx !important' ),
				},
			},
			mobile: {
				'.ugb-header__title': {
					marginBottom: getValue( 'titleMobileBottomMargin', '%spx !important' ),
				},
			},
		} )
	}
	if ( show.subtitleSpacing ) {
		styles.push( {
			'.ugb-header__subtitle': {
				marginBottom: getValue( 'subtitleBottomMargin', '%spx !important' ),
			},
			tablet: {
				'.ugb-header__subtitle': {
					marginBottom: getValue( 'subtitleTabletBottomMargin', '%spx !important' ),
				},
			},
			mobile: {
				'.ugb-header__subtitle': {
					marginBottom: getValue( 'subtitleMobileBottomMargin', '%spx !important' ),
				},
			},
		} )
	}
	if ( show.buttonGap ) {
		styles.push( {
			'.ugb-button1': {
				marginRight: getValue( 'buttonGap', '%spx !important' ),
			},
			tablet: {
				'.ugb-button1': {
					marginRight: getValue( 'buttonGapTablet', '%spx !important' ),
				},
			},
			mobile: {
				'.ugb-button1': {
					marginRight: getValue( 'buttonGapMobile', '%spx !important' ),
				},
			},
		} )
	}

	return deepmerge.all( styles )
}

export default createStyles
