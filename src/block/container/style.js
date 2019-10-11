/**
 * External dependencies
 */
import {
	appendImportant,
	createBackgroundStyleSet,
	whiteIfDarkBlackIfLight,
} from '~stackable/util'
import deepmerge from 'deepmerge'

/**
 * Internal dependencies
 */
import { showOptions } from './util'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

export const createStyles = props => {
	const getValue = ( attrName, format = '', defaultValue = undefined ) => {
		const value = typeof props.attributes[ attrName ] === 'undefined' ? '' : props.attributes[ attrName ]
		return value !== '' ? ( format ? sprintf( format, value ) : value ) : defaultValue
	}

	const styles = []

	const {
		align = '',
	} = props.attributes

	const show = showOptions( props )

	if ( show.borderRadius && align !== 'full' ) {
		styles.push( {
			'.ugb-container__wrapper': {
				borderRadius: getValue( 'borderRadius', '%spx !important' ),
			},
		} )
	}

	// Height.
	const {
		height = '',
		tabletHeight = '',
		mobileHeight = '',
	} = props.attributes
	styles.push( {
		'.ugb-container__side': {
			paddingTop: height === 'short' ? '35px !important' :
				height === 'tall' ? '120px !important' :
					undefined,
			paddingBottom: height === 'short' ? '35px !important' :
				height === 'tall' ? '120px !important' :
					undefined,
		},
		'.ugb-container__wrapper': {
			minHeight: height === 'half' ? '50vh' :
				height === 'full' ? '100vh' :
					undefined,
			// Remove top/bottom padding for the short/tall height to display properly.
			paddingTop: height === 'short' || height === 'tall' ? '0 !important' : undefined,
			paddingBottom: height === 'short' || height === 'tall' ? '0 !important' : undefined,
		},
		tablet: {
			'.ugb-container__side': {
				paddingTop: tabletHeight === 'short' ? '35px !important' :
					tabletHeight === 'tall' ? '120px !important' :
						undefined,
				paddingBottom: tabletHeight === 'short' ? '35px !important' :
					tabletHeight === 'tall' ? '120px !important' :
						undefined,
			},
			'.ugb-container__wrapper': {
				minHeight: tabletHeight === 'half' ? '50vh' :
					tabletHeight === 'full' ? '100vh' :
						undefined,
				// Remove top/bottom padding for the short/tall height to display properly.
				paddingTop: tabletHeight === 'short' || tabletHeight === 'tall' ? '0 !important' : undefined,
				paddingBottom: tabletHeight === 'short' || tabletHeight === 'tall' ? '0 !important' : undefined,
			},
		},
		mobile: {
			'.ugb-container__side': {
				paddingTop: mobileHeight === 'short' ? '35px !important' :
					mobileHeight === 'tall' ? '120px !important' :
						undefined,
				paddingBottom: mobileHeight === 'short' ? '35px !important' :
					mobileHeight === 'tall' ? '120px !important' :
						undefined,
			},
			'.ugb-container__wrapper': {
				minHeight: mobileHeight === 'half' ? '50vh' :
					mobileHeight === 'full' ? '100vh' :
						undefined,
				// Remove top/bottom padding for the short/tall height to display properly.
				paddingTop: mobileHeight === 'short' || mobileHeight === 'tall' ? '0 !important' : undefined,
				paddingBottom: mobileHeight === 'short' || mobileHeight === 'tall' ? '0 !important' : undefined,
			},
		},
	} )

	// Vertical align
	const wrapperHasHeight = height && ( height === 'half' || height === 'full' )
	const wrapperTabletHasHeight = tabletHeight && ( tabletHeight === 'half' || tabletHeight === 'full' )
	const wrapperMobileHasHeight = mobileHeight && ( mobileHeight === 'half' || mobileHeight === 'full' )
	if ( wrapperHasHeight ) {
		styles.push( {
			'.ugb-container__side': {
				justifyContent: getValue( 'contentVerticalAlign' ),
			},
		} )
	}
	if ( wrapperHasHeight || wrapperTabletHasHeight ) {
		styles.push( {
			tablet: {
				'.ugb-container__side': {
					justifyContent: getValue( 'contentTabletVerticalAlign' ),
				},
			},
		} )
	}
	if ( wrapperHasHeight || wrapperTabletHasHeight || wrapperMobileHasHeight ) {
		styles.push( {
			mobile: {
				'.ugb-container__side': {
					justifyContent: getValue( 'contentMobileVerticalAlign' ),
				},
			},
		} )
	}

	// Content width.
	// If the width is small, we need to use a 70% width in smaller screens to make the width be manageable if not smaller widths are used.
	// We do the responsiveness here since doing it in style.scss is a headache with the !important rules.
	const isSmallWidth = getValue( 'contentWidth' ) ? parseInt( getValue( 'contentWidth' ), 10 ) <= 50 : false
	styles.push( {
		'.ugb-container__content-wrapper': {
			width: appendImportant( getValue( 'contentWidth', '%s%%' ) ),
		},
		tablet: {
			'.ugb-container__content-wrapper': {
				width: appendImportant( getValue( 'contentTabletWidth', '%s%%', isSmallWidth ? '70%' : undefined ) ),
			},
		},
		mobile: {
			'.ugb-container__content-wrapper': {
				width: appendImportant( getValue( 'contentMobileWidth', '%s%%', getValue( 'contentTabletWidth', '%s%%', isSmallWidth ? '70%' : undefined ) ) ),
			},
		},
	} )

	// Content horizontal align.
	styles.push( {
		'.ugb-container__side': {
			alignItems: appendImportant( getValue( 'contentHorizontalAlign' ) ),
		},
		tablet: {
			'.ugb-container__side': {
				alignItems: appendImportant( getValue( 'contentTabletHorizontalAlign' ) ),
			},
		},
		mobile: {
			'.ugb-container__side': {
				alignItems: appendImportant( getValue( 'contentMobileHorizontalAlign' ) ),
			},
		},
	} )

	// Column Background.
	const columnBackgroundOptions = {
		importantBackgroundColor: true,
	}
	styles.push( {
		...( show.columnBackground ? createBackgroundStyleSet( 'column%s', 'ugb-container__wrapper', props.attributes, columnBackgroundOptions ) : {} ),
	} )

	// Text Colors.
	const {
		columnBackgroundColor = '',
		headingColor = '',
		bodyTextColor = '',
	} = props.attributes
	styles.push( {
		[ '.ugb-container__content-wrapper h1, ' +
		  '.ugb-container__content-wrapper h2, ' +
		  '.ugb-container__content-wrapper h3, ' +
		  '.ugb-container__content-wrapper h4, ' +
		  '.ugb-container__content-wrapper h5, ' +
		  '.ugb-container__content-wrapper h6' ]: {
			color: whiteIfDarkBlackIfLight( headingColor, show.columnBackground && columnBackgroundColor ),
		},
		[ '.ugb-container__content-wrapper, ' +
		  '.ugb-container__content-wrapper p, ' +
		  '.ugb-container__content-wrapper li' ]: {
			color: whiteIfDarkBlackIfLight( bodyTextColor, show.columnBackground && columnBackgroundColor ),
		},
		[ '.ugb-container__content-wrapper a, ' +
		  '.ugb-container__content-wrapper a:visited, ' +
		  '.ugb-container__content-wrapper a:focus' ]: {
			color: getValue( 'linkColor' ),
		},
		'.ugb-container__content-wrapper a:hover': {
			color: getValue( 'linkHoverColor' ),
		},
	} )

	return deepmerge.all( styles )
}

export default createStyles
