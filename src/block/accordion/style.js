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
} from '~stackable/util'
import deepmerge from 'deepmerge'

/**
 * Internal dependencies
 */
import { showOptions } from './util'

export const createStyles = props => {
	const getValue = __getValue( props.attributes )

	const {
		design = 'basic',
		reverseArrow = false,
	} = props.attributes

	const show = showOptions( props )

	const styles = []

	styles.push( {
		'.ugb-accordion__heading': {
			flexDirection: reverseArrow ? 'row-reverse' : undefined,
		},
	} )

	if ( show.borderRadius && design === 'basic' ) {
		styles.push( {
			'.ugb-accordion__heading': {
				borderRadius: getValue( 'borderRadius', '%spx !important' ),
			},
		} )
	}

	// Column Background.
	const columnBackgroundOptions = {
		importantBackgroundColor: true,
	}
	styles.push( {
		...( show.headerBackground ? createBackgroundStyleSet( 'container%s', 'ugb-accordion__heading', props.attributes, columnBackgroundOptions ) : {} ),
	} )

	// Title.
	const {
		titleColor = '',
		showTitle = true,
	} = props.attributes
	if ( showTitle ) {
		styles.push( {
			'.ugb-accordion__title': {
				...createTypographyStyles( 'title%s', 'desktop', props.attributes, { importantSize: true } ),
				textAlign: getValue( 'titleAlign', '%s !important' ),
			},
			tablet: {
				'.ugb-accordion__title': {
					...createTypographyStyles( 'title%s', 'tablet', props.attributes, { importantSize: true } ),
					textAlign: getValue( 'titleTabletAlign', '%s !important' ),
				},
			},
			mobile: {
				'.ugb-accordion__title': {
					...createTypographyStyles( 'title%s', 'mobile', props.attributes, { importantSize: true } ),
					textAlign: getValue( 'titleMobileAlign', '%s !important' ),
				},
			},
		} )
	}

	const {
		containerBackgroundColor = '',
	} = props.attributes
	if ( design === 'basic' || design === 'plain' ) {
		styles.push( {
			'.ugb-accordion__title': {
				color: whiteIfDark( titleColor, show.headerBackground && containerBackgroundColor ),
			},
		} )
	}

	// Arrow.
	const {
		showArrow = true,
		arrowColor = '',
	} = props.attributes
	if ( showArrow ) {
		styles.push( {
			'.ugb-accordion__arrow': {
				width: appendImportant( getValue( 'arrowSize', '%spx' ) ),
				height: appendImportant( getValue( 'arrowSize', '%spx' ) ),
			},
		} )
	}
	if ( showArrow && ( design === 'basic' || design === 'plain' ) ) {
		styles.push( {
			'.ugb-accordion__arrow': {
				fill: whiteIfDark( arrowColor, show.headerBackground && containerBackgroundColor ),
			},
		} )
	}

	// Border.
	const {
		showBorder = true,
	} = props.attributes
	if ( show.border && ! showBorder ) {
		styles.push( {
			'.ugb-accordion__item': {
				border: 'none !important',
			},
		} )
	}
	if ( show.border && showBorder ) {
		styles.push( {
			'.ugb-accordion__item': {
				borderWidth: appendImportant( getValue( 'borderSize', '%spx' ) ),
				borderColor: appendImportant( getValue( 'borderColor' ) ),
			},
		} )
	}

	// Spacing.
	if ( show.headerBackground ) {
		styles.push( {
			'.ugb-accordion__heading': {
				paddingTop: appendImportant( getValue( 'containerPaddingTop', '%spx' ) ),
				paddingRight: appendImportant( getValue( 'containerPaddingRight', '%spx' ) ),
				paddingBottom: appendImportant( getValue( 'containerPaddingBottom', '%spx' ) ),
				paddingLeft: appendImportant( getValue( 'containerPaddingLeft', '%spx' ) ),
			},
		} )
	}
	if ( show.titleSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-accordion.ugb-accordion--open .ugb-accordion__heading', 'title%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}

	return deepmerge.all( styles )
}

export default createStyles
