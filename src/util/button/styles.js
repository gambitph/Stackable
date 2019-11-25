/**
 * Internal dependencies
 */
import { appendImportant } from '../'

/**
 * External dependencies
 */
import {
	createTypographyStyles,
	whiteIfDarkBlackIfLight,
	__getValue,
} from '~stackable/util'
import { camelCase } from 'lodash'
import deepmerge from 'deepmerge'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

export const createButtonStyleSet = ( attrNameTemplate = '%s', mainClassName = '', blockAttributes = {} ) => {
	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = __getValue( blockAttributes, getAttrName, '' )

	const styles = []

	styles.push( {
		[ `.${ mainClassName } .ugb-button--inner` ]: {
			...createTypographyStyles( attrNameTemplate, 'desktop', blockAttributes ),
		},
	} )

	// The default color is the same as the other one but transparent. Same so that there won't be a weird transition to transparent.
	const defaultColor1 = getValue( 'BackgroundColor2' )
	const defaultColor2 = getValue( 'BackgroundColor' )

	// Our button's default hover effect is a slight transparency effect, if a button is assigned a
	// hover color, cancel this faded effect.
	let cancelHoverOpacity = false

	// Basic design.
	if ( getValue( 'Design' ) === '' || getValue( 'Design' ) === 'basic' ) {
		styles.push( {
			[ `.${ mainClassName }` ]: {
				backgroundColor: getValue( 'BackgroundColor' ) !== '' ? getValue( 'BackgroundColor' ) : undefined,
				backgroundImage: getValue( 'BackgroundColorType' ) === 'gradient' ?
					`linear-gradient(${ blockAttributes[ getAttrName( 'BackgroundGradientDirection' ) ] !== '' ? getValue( 'BackgroundGradientDirection', '%sdeg', '90deg' ) : '90deg' }, ${ getValue( 'BackgroundColor' ) || defaultColor1 }, ${ getValue( 'BackgroundColor2' ) || defaultColor2 })` :
					undefined,
				paddingTop: getValue( 'PaddingTop' ) !== '' ? `${ getValue( 'PaddingTop' ) }px` : undefined,
				paddingRight: getValue( 'PaddingRight' ) !== '' ? `${ getValue( 'PaddingRight' ) }px` : undefined,
				paddingBottom: getValue( 'PaddingBottom' ) !== '' ? `${ getValue( 'PaddingBottom' ) }px` : undefined,
				paddingLeft: getValue( 'PaddingLeft' ) !== '' ? `${ getValue( 'PaddingLeft' ) }px` : undefined,
			},
			[ `.${ mainClassName } .ugb-button--inner, .${ mainClassName } svg` ]: {
				color: whiteIfDarkBlackIfLight( getValue( 'TextColor' ), getValue( 'BackgroundColor' ) ),
			},
			[ `.${ mainClassName }:hover .ugb-button--inner, .${ mainClassName }:hover svg` ]: {
				color: whiteIfDarkBlackIfLight( getValue( 'HoverTextColor' ), getValue( 'HoverBackgroundColor' ) ),
			},
			[ `.${ mainClassName }:hover` ]: {
				backgroundColor: getValue( 'HoverBackgroundColor' ) !== '' ? getValue( 'HoverBackgroundColor' ) : undefined,
			},
		} )

		cancelHoverOpacity = getValue( 'HoverBackgroundColor' ) !== ''

		// Hover gradient.
		const hasHoverGradientEffect = getValue( 'BackgroundColorType' ) === 'gradient' && ( getValue( 'HoverBackgroundColor' ) || getValue( 'HoverBackgroundColor2' ) || getValue( 'HoverBackgroundGradientDirection' ) )
		styles.push( {
			[ `.${ mainClassName }:before` ]: {
				content: hasHoverGradientEffect ? '""' : undefined,
				backgroundImage: hasHoverGradientEffect ?
					`linear-gradient(${ getValue( 'HoverBackgroundGradientDirection', '%sdeg' ) || getValue( 'BackgroundGradientDirection', '%sdeg', '90deg' ) }, ${ getValue( 'HoverBackgroundColor' ) || getValue( 'BackgroundColor' ) || defaultColor1 }, ${ getValue( 'HoverBackgroundColor2' ) || getValue( 'BackgroundColor2' ) || defaultColor2 })` :
					undefined,
			},
		} )

		cancelHoverOpacity = cancelHoverOpacity || hasHoverGradientEffect || getValue( 'HoverTextColor' ) !== ''
	}

	// Ghost design.
	if ( getValue( 'Design' ) === 'ghost' ) {
		styles.push( {
			[ `.${ mainClassName }` ]: {
				borderColor: getValue( 'BackgroundColor' ) !== '' ? getValue( 'BackgroundColor' ) : undefined,
				borderWidth: getValue( 'BorderWidth' ) !== '' ? `${ getValue( 'BorderWidth' ) }px` : undefined,
				paddingTop: getValue( 'PaddingTop' ) !== '' ? `${ getValue( 'PaddingTop' ) }px` : undefined,
				paddingRight: getValue( 'PaddingRight' ) !== '' ? `${ getValue( 'PaddingRight' ) }px` : undefined,
				paddingBottom: getValue( 'PaddingBottom' ) !== '' ? `${ getValue( 'PaddingBottom' ) }px` : undefined,
				paddingLeft: getValue( 'PaddingLeft' ) !== '' ? `${ getValue( 'PaddingLeft' ) }px` : undefined,
			},
			[ `.${ mainClassName } .ugb-button--inner` ]: {
				color: getValue( 'BackgroundColor' ) !== '' ? getValue( 'BackgroundColor' ) : undefined,
			},
			[ `.${ mainClassName }:hover` ]: {
				borderColor: getValue( 'HoverBackgroundColor' ) !== '' ? getValue( 'HoverBackgroundColor' ) : undefined,
			},
			[ `.${ mainClassName }:hover .ugb-button--inner` ]: {
				color: getValue( 'HoverBackgroundColor' ) !== '' ? getValue( 'HoverBackgroundColor' ) :
					( getValue( 'BackgroundColor' ) !== '' ? getValue( 'BackgroundColor' ) : undefined ),
			},
		} )

		if ( getValue( 'Icon' ) !== '' ) {
			styles.push( {
				[ `.${ mainClassName }.ugb-button--has-icon.ugb-button--has-icon svg` ]: {
					color: getValue( 'BackgroundColor' ) !== '' ? getValue( 'BackgroundColor' ) : undefined,
				},
				[ `.${ mainClassName }.ugb-button--has-icon.ugb-button--has-icon:hover svg` ]: {
					color: getValue( 'HoverBackgroundColor' ) !== '' ? getValue( 'HoverBackgroundColor' ) :
						( getValue( 'BackgroundColor' ) !== '' ? getValue( 'BackgroundColor' ) : undefined ),
				},
			} )
		}

		cancelHoverOpacity = getValue( 'HoverBackgroundColor' ) !== ''

		// Hover gradient.
		const hasHoverGradientEffect = getValue( 'HoverGhostToNormal' )
		if ( hasHoverGradientEffect ) {
			styles.push( {
				[ `.${ mainClassName }:before` ]: {
					content: '""',
					backgroundImage: `linear-gradient(${ getValue( 'HoverBackgroundGradientDirection', '%sdeg', '90deg' ) }, ${ getValue( 'HoverBackgroundColor' ) || getValue( 'BackgroundColor' ) }, ${ getValue( 'HoverBackgroundColor2' ) || getValue( 'HoverBackgroundColor' ) || getValue( 'BackgroundColor' ) })`,
					top: getValue( 'BorderWidth' ) !== '' ? `-${ getValue( 'BorderWidth' ) }px` : undefined,
					right: getValue( 'BorderWidth' ) !== '' ? `-${ getValue( 'BorderWidth' ) }px` : undefined,
					bottom: getValue( 'BorderWidth' ) !== '' ? `-${ getValue( 'BorderWidth' ) }px` : undefined,
					left: getValue( 'BorderWidth' ) !== '' ? `-${ getValue( 'BorderWidth' ) }px` : undefined,
				},
				[ `.${ mainClassName }:hover` ]: {
					backgroundColor: appendImportant( getValue( 'HoverBackgroundColor' ) !== '' ? getValue( 'HoverBackgroundColor' ) : getValue( 'BackgroundColor' ) ),
				},
				[ `.${ mainClassName }:hover .ugb-button--inner` ]: {
					color: appendImportant( whiteIfDarkBlackIfLight( getValue( 'HoverTextColor' ), getValue( 'HoverBackgroundColor' ) || getValue( 'BackgroundColor' ) ) ),
				},
			} )

			if ( getValue( 'Icon' ) !== '' ) {
				styles.push( {
					[ `.${ mainClassName }.ugb-button--has-icon.ugb-button--has-icon:hover svg` ]: {
						color: appendImportant( whiteIfDarkBlackIfLight( getValue( 'HoverTextColor' ), getValue( 'HoverBackgroundColor' ) || getValue( 'BackgroundColor' ) ) ),
					},
				} )
			}

			cancelHoverOpacity = true
		}
	}

	if ( getValue( 'Design' ) === 'plain' ) {
		styles.push( {
			[ `.${ mainClassName } .ugb-button--inner` ]: {
				color: getValue( 'BackgroundColor' ) !== '' ? getValue( 'BackgroundColor' ) : undefined,
			},
			[ `.${ mainClassName }:hover .ugb-button--inner` ]: {
				color: getValue( 'HoverBackgroundColor' ) !== '' ? getValue( 'HoverBackgroundColor' ) : undefined,
			},
		} )

		if ( getValue( 'Icon' ) !== '' ) {
			styles.push( {
				[ `.${ mainClassName }.ugb-button--has-icon.ugb-button--has-icon svg` ]: {
					color: getValue( 'BackgroundColor' ) !== '' ? getValue( 'BackgroundColor' ) : undefined,
				},
				[ `.${ mainClassName }.ugb-button--has-icon.ugb-button--has-icon:hover svg` ]: {
					color: getValue( 'HoverBackgroundColor' ) !== '' ? getValue( 'HoverBackgroundColor' ) : undefined,
				},
			} )
		}

		cancelHoverOpacity = getValue( 'HoverBackgroundColor' ) !== ''
	}

	if ( getValue( 'Design' ) !== 'link' ) {
		const iconSpacingRule = blockAttributes[ getAttrName( 'IconSpacing' ) ] !== '' && typeof blockAttributes[ getAttrName( 'IconSpacing' ) ] !== 'undefined' ? `${ getValue( 'IconSpacing', '%spx', 16 ) }` : undefined
		const borderRadius = blockAttributes[ getAttrName( 'BorderRadius' ) ]
		styles.push( {
			[ `.${ mainClassName }` ]: {
				opacity: getValue( 'Opacity' ) !== '' ? getValue( 'Opacity' ) : undefined,
				borderRadius: borderRadius !== '' && typeof borderRadius !== 'undefined' ? appendImportant( `${ borderRadius }px` ) : undefined,
			},
			[ `.${ mainClassName }:before` ]: {
				borderRadius: borderRadius !== '' && typeof borderRadius !== 'undefined' ? appendImportant( `${ borderRadius }px` ) : undefined,
			},
			[ `.${ mainClassName }:hover` ]: {
				opacity: getValue( 'HoverOpacity' ) !== '' ? getValue( 'HoverOpacity' ) : ( cancelHoverOpacity ? 1 : undefined ),
			},
			[ `.${ mainClassName }.ugb-button--has-icon.ugb-button--has-icon svg` ]: {
				marginLeft: getValue( 'Icon' ) !== '' ? ( getValue( 'IconPosition' ) === 'right' ? iconSpacingRule : undefined ) : undefined,
				marginRight: getValue( 'Icon' ) !== '' ? ( getValue( 'IconPosition' ) !== 'right' ? iconSpacingRule : undefined ) : undefined,
				width: getValue( 'IconSize' ) !== '' ? `${ getValue( 'IconSize' ) }px` : undefined,
				height: getValue( 'IconSize' ) !== '' ? `${ getValue( 'IconSize' ) }px` : undefined,
			},
		} )
	}

	return deepmerge.all( styles )
}
