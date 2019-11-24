/**
 * External dependencies
 */
import {
	createBackgroundStyleSet,
	createButtonStyleSet,
	createTypographyStyles,
	createResponsiveStyles,
	hexToRgba,
	whiteIfDark,
	appendImportant,
	__getValue,
} from '~stackable/util'
import deepmerge from 'deepmerge'

/**
 * Internal dependencies
 */
import { showOptions } from './util'

export const createStyles = props => {
	const getValue = __getValue( props.attributes )

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
		...( show.columnBackground ? createBackgroundStyleSet( 'column%s', 'ugb-header__item', {
			...props.attributes,
			columnBackgroundColor: props.attributes.columnBackgroundColor || '#000000',
		}, {
			importantBackgroundColor: true,
		} ) : {} ),
	} )

	// Overlay background.
	const {
		overlayColor = '',
		overlayOpacity = '0.4',
	} = props.attributes
	if ( show.overlayBackground && ( overlayColor || overlayOpacity ) ) {
		styles.push( {
			'.ugb-content-wrapper, .ugb-content-wrapper:after': {
				background: hexToRgba( overlayColor || '#000000', overlayOpacity === '' ? 0.4 : overlayOpacity ) + ' !important',
			},
		} )
	}

	const {
		titleColor = '',
		showTitle = true,
	} = props.attributes
	if ( showTitle ) {
		styles.push( {
			'.ugb-header__title': {
				...createTypographyStyles( 'title%s', 'desktop', props.attributes ),
				color: whiteIfDark( titleColor, show.columnBackground && columnBackgroundColor ),
				textAlign: appendImportant( getValue( 'contentAlign' ) || getValue( 'titleAlign' ) ),
			},
			tablet: {
				'.ugb-header__title': {
					...createTypographyStyles( 'title%s', 'tablet', props.attributes ),
					textAlign: appendImportant( getValue( 'tabletContentAlign' ) || getValue( 'titleTabletAlign' ) ),
				},
			},
			mobile: {
				'.ugb-header__title': {
					...createTypographyStyles( 'title%s', 'mobile', props.attributes ),
					textAlign: appendImportant( getValue( 'mobileContentAlign' ) || getValue( 'titleMobileAlign' ) ),
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

	const {
		showButton = false,
		showButton2 = true,
	} = props.attributes
	if ( showButton || showButton2 ) {
		styles.push( {
			'.ugb-header__buttons': {
				justifyContent: appendImportant( getValue( 'contentAlign' ) === 'left' ? 'flex-start' :
					getValue( 'contentAlign' ) === 'right' ? 'flex-end' :
						getValue( 'contentAlign' ) === 'center' ? 'center' :
							undefined ),
			},
			tablet: {
				'.ugb-header__buttons': {
					justifyContent: appendImportant( getValue( 'tabletContentAlign' ) === 'left' ? 'flex-start' :
						getValue( 'tabletContentAlign' ) === 'right' ? 'flex-end' :
							getValue( 'tabletContentAlign' ) === 'center' ? 'center' :
								undefined ),
				},
			},
			mobile: {
				'.ugb-header__buttons': {
					justifyContent: appendImportant( getValue( 'mobileContentAlign' ) === 'left' ? 'flex-start' :
						getValue( 'mobileContentAlign' ) === 'right' ? 'flex-end' :
							getValue( 'mobileContentAlign' ) === 'center' ? 'center' :
								undefined ),
				},
			},
		} )

		// Override button alignments.
		if ( getValue( 'buttonAlign' ) ) {
			styles.push( {
				'.ugb-header__buttons': {
					justifyContent: appendImportant( getValue( 'buttonAlign' ) === 'left' ? 'flex-start' :
						getValue( 'buttonAlign' ) === 'right' ? 'flex-end' :
							getValue( 'buttonAlign' ) === 'center' ? 'center' :
								undefined ),
				},
			} )
		}
		if ( getValue( 'buttonTabletAlign' ) ) {
			styles.push( {
				tablet: {
					'.ugb-header__buttons': {
						justifyContent: appendImportant( getValue( 'buttonTabletAlign' ) === 'left' ? 'flex-start' :
							getValue( 'buttonTabletAlign' ) === 'right' ? 'flex-end' :
								getValue( 'buttonTabletAlign' ) === 'center' ? 'center' :
									undefined ),
					},
				},
			} )
		}
		if ( getValue( 'buttonMobileAlign' ) ) {
			styles.push( {
				mobile: {
					'.ugb-header__buttons': {
						justifyContent: appendImportant( getValue( 'buttonMobileAlign' ) === 'left' ? 'flex-start' :
							getValue( 'buttonMobileAlign' ) === 'right' ? 'flex-end' :
								getValue( 'buttonMobileAlign' ) === 'center' ? 'center' :
									undefined ),
					},
				},
			} )
		}
	}

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
		styles.push( ...createResponsiveStyles( '.ugb-header__title', 'title%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.subtitleSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-header__subtitle', 'subtitle%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.buttonSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-button-container', 'button%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.buttonGap ) {
		styles.push( ...createResponsiveStyles( '.ugb-button1', 'buttonGap%s', 'marginRight', '%spx', props.attributes, true ) )
	}

	return deepmerge.all( styles )
}

export default createStyles
