import { createTypographyStyles, whiteIfDarkBlackIfLight } from '@stackable/util'
import { camelCase } from 'lodash'
import deepmerge from 'deepmerge'
import { sprintf } from '@wordpress/i18n'

export const createButtonStyleSet = ( attrNameTemplate = '%s', mainClassName = '', blockAttributes = {} ) => {
	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = ( attrName, defaultValue = '' ) => blockAttributes[ getAttrName( attrName ) ] || defaultValue

	const styles = []

	styles.push( {
		[ `.${ mainClassName } .ugb-button--inner` ]: {
			...createTypographyStyles( attrNameTemplate, 'desktop', blockAttributes ),
		},
	} )

	// The default color is the same as the other one but transparent. Same so that there won't be a weird transition to transparent.
	const defaultColor1 = getValue( 'BackgroundColor2' )
	const defaultColor2 = getValue( 'BackgroundColor' )

	// Basic design.
	if ( getValue( 'Design' ) === '' || getValue( 'Design' ) === 'basic' ) {
		styles.push( {
			[ `.${ mainClassName }` ]: {
				backgroundColor: getValue( 'BackgroundColor' ) !== '' ? getValue( 'BackgroundColor' ) : undefined,
				backgroundImage: getValue( 'BackgroundColorType' ) === 'gradient' ?
					`linear-gradient(${ getValue( 'BackgroundGradientDirection', 90 ) }deg, ${ getValue( 'BackgroundColor', defaultColor1 ) }, ${ getValue( 'BackgroundColor2', defaultColor2 ) })` :
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

		// Hover gradient.
		const hasHoverGradientEffect = getValue( 'BackgroundColorType' ) === 'gradient' && ( getValue( 'HoverBackgroundColor' ) || getValue( 'HoverBackgroundColor2' ) || getValue( 'HoverBackgroundGradientDirection' ) )
		styles.push( {
			[ `.${ mainClassName }:before` ]: {
				content: hasHoverGradientEffect ? '""' : undefined,
				backgroundImage: hasHoverGradientEffect ?
					`linear-gradient(${ getValue( 'HoverBackgroundGradientDirection', getValue( 'BackgroundGradientDirection', 90 ) ) }deg, ${ getValue( 'HoverBackgroundColor', getValue( 'BackgroundColor', defaultColor1 ) ) }, ${ getValue( 'HoverBackgroundColor2', getValue( 'BackgroundColor2', defaultColor2 ) ) })` :
					undefined,
			},
		} )
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
			[ `.${ mainClassName } .ugb-button--inner, .${ mainClassName }.ugb-button--has-icon.ugb-button--has-icon svg` ]: {
				color: getValue( 'BackgroundColor' ) !== '' ? getValue( 'BackgroundColor' ) : undefined,
			},
			[ `.${ mainClassName }:hover` ]: {
				borderColor: getValue( 'HoverBackgroundColor' ) !== '' ? getValue( 'HoverBackgroundColor' ) : undefined,
			},
			[ `.${ mainClassName }:hover .ugb-button--inner, .${ mainClassName }.ugb-button--has-icon.ugb-button--has-icon:hover svg` ]: {
				color: getValue( 'HoverBackgroundColor' ) !== '' ? getValue( 'HoverBackgroundColor' ) : undefined,
			},
		} )

		// Hover gradient.
		const hasHoverGradientEffect = getValue( 'HoverGhostToNormal' )
		if ( hasHoverGradientEffect ) {
			styles.push( {
				[ `.${ mainClassName }:before` ]: {
					content: '""',
					backgroundImage: `linear-gradient(${ getValue( 'HoverBackgroundGradientDirection', 90 ) }deg, ${ getValue( 'HoverBackgroundColor', getValue( 'BackgroundColor' ) ) }, ${ getValue( 'HoverBackgroundColor2', getValue( 'HoverBackgroundColor', getValue( 'BackgroundColor' ) ) ) })`,
					top: getValue( 'BorderWidth' ) !== '' ? `-${ getValue( 'BorderWidth' ) }px` : undefined,
					right: getValue( 'BorderWidth' ) !== '' ? `-${ getValue( 'BorderWidth' ) }px` : undefined,
					bottom: getValue( 'BorderWidth' ) !== '' ? `-${ getValue( 'BorderWidth' ) }px` : undefined,
					left: getValue( 'BorderWidth' ) !== '' ? `-${ getValue( 'BorderWidth' ) }px` : undefined,
				},
				[ `.${ mainClassName }:hover .ugb-button--inner, .${ mainClassName }.ugb-button--has-icon.ugb-button--has-icon:hover svg` ]: {
					color: whiteIfDarkBlackIfLight( getValue( 'HoverTextColor' ), getValue( 'HoverBackgroundColor', getValue( 'BackgroundColor' ) ) ),
				},
			} )
		}
	}

	if ( getValue( 'Design' ) === 'plain' ) {
		styles.push( {
			[ `.${ mainClassName } .ugb-button--inner, .${ mainClassName }.ugb-button--has-icon.ugb-button--has-icon svg` ]: {
				color: getValue( 'BackgroundColor' ) !== '' ? getValue( 'BackgroundColor' ) : undefined,
			},
			[ `.${ mainClassName }:hover .ugb-button--inner, .${ mainClassName }.ugb-button--has-icon.ugb-button--has-icon:hover svg` ]: {
				color: getValue( 'HoverBackgroundColor' ) !== '' ? getValue( 'HoverBackgroundColor' ) : undefined,
			},
		} )
	}

	if ( getValue( 'Design' ) !== 'link' ) {
		const iconSpacingRule = getValue( 'IconSpacing' ) !== '' ? `${ getValue( 'IconSpacing' ) }px` : undefined
		const borderRadius = blockAttributes[ getAttrName( 'borderRadius' ) ]
		styles.push( {
			[ `.${ mainClassName }` ]: {
				opacity: getValue( 'Opacity' ) !== '' ? getValue( 'Opacity' ) : undefined,
				borderRadius: borderRadius !== '' && typeof borderRadius !== 'undefined' ? `${ borderRadius }px !important` : undefined,
			},
			[ `.${ mainClassName }:before` ]: {
				borderRadius: borderRadius !== '' && typeof borderRadius !== 'undefined' ? `${ borderRadius }px !important` : undefined,
			},
			[ `.${ mainClassName }:hover` ]: {
				opacity: getValue( 'HoverOpacity' ) !== '' ? getValue( 'HoverOpacity' ) : undefined,
			},
			[ `.${ mainClassName }.ugb-button--has-icon.ugb-button--has-icon svg` ]: {
				marginLeft: getValue( 'Icon' ) !== '' ? ( getValue( 'IconPosition' ) === 'right' ? iconSpacingRule : undefined ) : undefined,
				marginRight: getValue( 'Icon' ) !== '' ? ( getValue( 'IconPosition' ) !== 'right' ? iconSpacingRule : undefined ) : undefined,
			},
		} )
	}

	return deepmerge.all( styles )
}
