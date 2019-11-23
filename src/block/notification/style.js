/**
 * External dependencies
 */
import {
	createBackgroundStyleSet,
	createTypographyStyles,
	marginLeftAlign,
	marginRightAlign,
	whiteIfDarkBlackIfLight,
	createButtonStyleSet,
	createResponsiveStyles,
	appendImportant,
	__getValue,
} from '~stackable/util'
import deepmerge from 'deepmerge'

/**
 * Internal dependencies
 */
import { showOptions } from './util'

const NOTIFY_TEXT_COLORS = {
	success: '#ffffff',
	error: '#ffffff',
	info: '#ffffff',
	warning: '#424242',
}

export const createStyles = props => {
	const getValue = __getValue( props.attributes )

	const styles = []

	const {
		contentAlign = '',
		tabletContentAlign = '',
		mobileContentAlign = '',
		notifType,
		design = 'basic',
		columnBackgroundColor = '',
	} = props.attributes

	const show = showOptions( props )

	// General.
	styles.push( {
		'.ugb-notification__item': {
			borderRadius: design !== 'plain' ? getValue( 'borderRadius', '%spx !important' ) : undefined,
		},
	} )

	// Column Background.
	styles.push( {
		...( show.columnBackground ? createBackgroundStyleSet( 'column%s', 'ugb-notification__item', props.attributes, {
			importantBackgroundColor: true,
		} ) : {} ),
	} )

	// Dismissible.
	const {
		dismissible = false,
		dismissibleIconSize = '',
		dismissibleIconTabletSize = '',
		dismissibleIconMobileSize = '',
		dismissibleIconColor = '',
	} = props.attributes
	if ( dismissible ) {
		styles.push( {
			'.ugb-notification__item': {
				paddingRight: dismissibleIconSize && dismissibleIconSize > 40 ? '100px !important' : undefined,
			},
			'.ugb-notification__close-button': {
				width: dismissibleIconSize ? `${ dismissibleIconSize }px` : undefined,
				height: dismissibleIconSize ? `${ dismissibleIconSize }px` : undefined,
			},
			'.ugb-notification__close-button svg': {
				fill: dismissibleIconColor ? `${ dismissibleIconColor } !important` : undefined,
			},
			tablet: {
				'.ugb-notification__close-button': {
					width: dismissibleIconTabletSize ? `${ dismissibleIconTabletSize }px` : undefined,
					height: dismissibleIconTabletSize ? `${ dismissibleIconTabletSize }px` : undefined,
				},
			},
			mobile: {
				'.ugb-notification__close-button': {
					width: dismissibleIconMobileSize ? `${ dismissibleIconMobileSize }px` : undefined,
					height: dismissibleIconMobileSize ? `${ dismissibleIconMobileSize }px` : undefined,
				},
			},
		} )
	}

	// Icon.
	const {
		showIcon = false,
		iconColor = '',
		iconAlign = '',
		iconTabletAlign = '',
		iconMobileAlign = '',
	} = props.attributes
	if ( showIcon ) {
		const color = whiteIfDarkBlackIfLight( iconColor, show.columnBackground && columnBackgroundColor )
		styles.push( {
			'.ugb-notification__icon': {
				marginLeft: iconAlign !== '' || contentAlign !== '' ? appendImportant( marginLeftAlign( iconAlign || contentAlign ) ) : undefined,
				marginRight: iconAlign !== '' || contentAlign !== '' ? appendImportant( marginRightAlign( iconAlign || contentAlign ) ) : undefined,
				color: color ? `${ color } !important` : undefined,
				height: getValue( 'iconSize', '%spx !important' ),
				width: getValue( 'iconSize', '%spx !important' ),
				opacity: getValue( 'iconOpacity', '%s !important' ),
				transform: getValue( 'iconRotation', 'rotate(%sdeg) !important' ),
			},
			tablet: {
				'.ugb-notification__icon': {
					marginLeft: iconTabletAlign !== '' || tabletContentAlign !== '' ? marginLeftAlign( iconTabletAlign || tabletContentAlign ) : undefined,
					marginRight: iconTabletAlign !== '' || tabletContentAlign !== '' ? marginRightAlign( iconTabletAlign || tabletContentAlign ) : undefined,
					height: getValue( 'iconTabletSize', '%spx !important' ),
					width: getValue( 'iconTabletSize', '%spx !important' ),
				},
			},
			mobile: {
				'.ugb-notification__icon': {
					marginLeft: iconMobileAlign !== '' || mobileContentAlign !== '' ? marginLeftAlign( iconMobileAlign || mobileContentAlign ) : undefined,
					marginRight: iconMobileAlign !== '' || mobileContentAlign !== '' ? marginRightAlign( iconMobileAlign || mobileContentAlign ) : undefined,
					height: getValue( 'iconMobileSize', '%spx !important' ),
					width: getValue( 'iconMobileSize', '%spx !important' ),
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
		const color = whiteIfDarkBlackIfLight( titleColor, show.columnBackground && columnBackgroundColor )
		styles.push( {
			'.ugb-notification__title': {
				...createTypographyStyles( 'title%s', 'desktop', props.attributes, { importantSize: true } ),
				color: color ? `${ color } !important` : undefined,
				textAlign: getValue( 'titleAlign', '%s !important' ),
			},
			tablet: {
				'.ugb-notification__title': {
					...createTypographyStyles( 'title%s', 'tablet', props.attributes, { importantSize: true } ),
					textAlign: getValue( 'titleTabletAlign', '%s !important' ),
				},
			},
			mobile: {
				'.ugb-notification__title': {
					...createTypographyStyles( 'title%s', 'mobile', props.attributes, { importantSize: true } ),
					textAlign: getValue( 'titleMobileAlign', '%s !important' ),
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
		const color = whiteIfDarkBlackIfLight( descriptionColor, show.columnBackground && columnBackgroundColor )
		styles.push( {
			'.ugb-notification__description': {
				...createTypographyStyles( 'description%s', 'desktop', props.attributes ),
				color: color ? `${ color } !important` : undefined,
				textAlign: getValue( 'descriptionAlign', '%s !important' ),
			},
			tablet: {
				'.ugb-notification__description': {
					...createTypographyStyles( 'description%s', 'tablet', props.attributes ),
					textAlign: getValue( 'descriptionTabletAlign', '%s !important' ),
				},
			},
			mobile: {
				'.ugb-notification__description': {
					...createTypographyStyles( 'description%s', 'mobile', props.attributes ),
					textAlign: getValue( 'descriptionMobileAlign', '%s !important' ),
				},
			},
		} )
	}

	// Button.
	const {
		showButton = false,
		buttonDesign = 'ghost',
		buttonBackgroundColor = '',
	} = props.attributes
	if ( showButton ) {
		styles.push( {
			...createButtonStyleSet( 'button%s', 'ugb-button', props.attributes ),
		} )

		// Default button color.
		// if ( ! show.columnBackground || ! columnBackgroundColor ) {
		if ( ! buttonBackgroundColor && show.columnBackground ) {
			const color = columnBackgroundColor ? whiteIfDarkBlackIfLight( buttonBackgroundColor, columnBackgroundColor, '#ffffff', '#424242' ) :
				design === 'bordered' ? '#424242' :
					NOTIFY_TEXT_COLORS[ notifType ]
			const colorOpposite = ! color ? undefined : ( color === '#ffffff' ? '#424242' : '#ffffff' )
			if ( buttonDesign === 'basic' || buttonDesign === '' ) {
				styles.push( {
					[ `.ugb-button` ]: {
						backgroundColor: color ? color : undefined,
					},
					[ `.ugb-button .ugb-button--inner, .ugb-button.ugb-button--has-icon.ugb-button--has-icon svg` ]: {
						color: colorOpposite ? colorOpposite : undefined,
					},
					[ `.ugb-button:hover .ugb-button--inner, .ugb-button:hover svg` ]: {
						color: colorOpposite ? colorOpposite : undefined,
					},
				} )
			} else {
				styles.push( {
					[ `.ugb-button` ]: {
						borderColor: color ? color : undefined,
					},
					[ `.ugb-button .ugb-button--inner, .ugb-button.ugb-button--has-icon.ugb-button--has-icon svg` ]: {
						color: color ? color : undefined,
					},
					[ `.ugb-button:hover .ugb-button--inner, .ugb-button:hover svg` ]: {
						color: color ? color : undefined,
					},
				} )
			}
		}
		// } else if ( ! buttonBackgroundColor && ( design === 'basic' || design === 'large-icon' ) ) {
		// 	const color = whiteIfDarkBlackIfLight( buttonBackgroundColor, show.columnBackground && columnBackgroundColor, '#ffffff', '#424242' )
		// 	const colorOpposite = whiteIfDarkBlackIfLight( buttonBackgroundColor, show.columnBackground && columnBackgroundColor, '#424242', '#ffffff' )
		// 	if ( buttonDesign === 'basic' || buttonDesign === '' ) {
		// 		styles.push( {
		// 			[ `.ugb-button` ]: {
		// 				backgroundColor: color ? color : undefined,
		// 			},
		// 			[ `.ugb-button .ugb-button--inner, .ugb-button.ugb-button--has-icon.ugb-button--has-icon svg` ]: {
		// 				color: colorOpposite ? colorOpposite : undefined,
		// 			},
		// 			[ `.ugb-button:hover .ugb-button--inner, .ugb-button:hover svg` ]: {
		// 				color: colorOpposite ? colorOpposite : undefined,
		// 			},
		// 		} )
		// 	} else {
		// 		styles.push( {
		// 			[ `.ugb-button` ]: {
		// 				borderColor: color ? color : undefined,
		// 			},
		// 			[ `.ugb-button .ugb-button--inner, .ugb-button.ugb-button--has-icon.ugb-button--has-icon svg` ]: {
		// 				color: color ? color : undefined,
		// 			},
		// 			[ `.ugb-button:hover .ugb-button--inner, .ugb-button:hover svg` ]: {
		// 				color: color ? color : undefined,
		// 			},
		// 		} )
		// 	}
		// }

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
	if ( show.iconSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-notification__icon', 'icon%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.titleSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-notification__title', 'title%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.descriptionSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-notification__description', 'description%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.buttonSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-button-container', 'button%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}

	// return deepmerge.all( applyFilters( 'stackable.notification.styles', styles, props, show ) )
	return deepmerge.all( styles )
}

export default createStyles
