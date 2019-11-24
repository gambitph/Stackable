/**
 * External dependencies
 */
import { camelCase } from 'lodash'
import { __getValue } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

/**
 * Internal dependencies
 */
import { appendImportant, hexToRgba } from '..'

const createBackgroundStyles = ( attrNameTemplate = '%s', screen = 'desktop', blockAttributes = {}, options = {} ) => {
	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = __getValue( blockAttributes, getAttrName )

	const {
		importantBackgroundColor = false,
	} = options

	const customSize = getValue( 'BackgroundCustomSize' ) ? getValue( 'BackgroundCustomSize' ) + ( getValue( 'BackgroundCustomSizeUnit' ) || '%' ) : undefined
	const tabletCustomSize = getValue( 'TabletBackgroundCustomSize' ) ? getValue( 'TabletBackgroundCustomSize' ) + ( getValue( 'TabletBackgroundCustomSizeUnit' ) || '%' ) : undefined
	const mobileCustomSize = getValue( 'MobileBackgroundCustomSize' ) ? getValue( 'MobileBackgroundCustomSize' ) + ( getValue( 'MobileBackgroundCustomSizeUnit' ) || '%' ) : undefined

	// Background color opacity.
	let backgroundColor = appendImportant( getValue( 'BackgroundColor' ), importantBackgroundColor )
	if ( ! getValue( 'BackgroundColorType' ) && typeof blockAttributes[ getAttrName( 'BackgroundColorOpacity' ) ] !== 'undefined' && blockAttributes[ getAttrName( 'BackgroundColorOpacity' ) ] !== '' ) {
		if ( ! getValue( 'BackgroundMediaURL' ) && ! getValue( 'TabletBackgroundMediaURL' ) && ! getValue( 'MobileBackgroundMediaURL' ) ) {
			backgroundColor = appendImportant( `${ hexToRgba( getValue( 'BackgroundColor' ) || '#ffffff', getValue( 'BackgroundColorOpacity' ) || 0 ) }`, importantBackgroundColor )
		}
	}

	if ( screen !== 'tablet' && screen !== 'mobile' ) { // Desktop.
		return {
			backgroundColor,
			backgroundAttachment: getValue( 'FixedBackground' ) ? 'fixed' : undefined,
			backgroundImage: getValue( 'BackgroundMediaURL', `url(%s)` ),
			backgroundPosition: getValue( 'BackgroundPosition' ),
			backgroundRepeat: getValue( 'BackgroundRepeat' ),
			backgroundSize: getValue( 'BackgroundSize' ) ?
				( getValue( 'BackgroundSize' ) !== 'custom' ? getValue( 'BackgroundSize' ) : customSize ) :
				undefined,
			backgroundBlendMode: getValue( 'BackgroundImageBlendMode' ),
		}
	} else if ( screen === 'tablet' ) { // Tablet.
		return {
			backgroundImage: getValue( 'TabletBackgroundMediaURL', `url(%s)` ),
			backgroundPosition: getValue( 'TabletBackgroundPosition' ),
			backgroundRepeat: getValue( 'TabletBackgroundRepeat' ),
			backgroundSize: getValue( 'TabletBackgroundSize' ) ?
				( getValue( 'TabletBackgroundSize' ) !== 'custom' ? getValue( 'TabletBackgroundSize' ) : tabletCustomSize ) :
				undefined,
		}
	}

	// Mobile.
	return {
		backgroundImage: getValue( 'MobileBackgroundMediaURL', `url(%s)` ),
		backgroundPosition: getValue( 'MobileBackgroundPosition' ),
		backgroundRepeat: getValue( 'MobileBackgroundRepeat' ),
		backgroundSize: getValue( 'MobileBackgroundSize' ) ?
			( getValue( 'MobileBackgroundSize' ) !== 'custom' ? getValue( 'MobileBackgroundSize' ) : mobileCustomSize ) :
			undefined,
	}
}

export const createBackgroundOverlayStyles = ( attrNameTemplate = '%s', screen = 'desktop', blockAttributes = {}, options = {} ) => {
	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = __getValue( blockAttributes, getAttrName )

	const {
		importantBackgroundColor = false,
	} = options

	const opacity = parseInt( getValue( 'BackgroundTintStrength', '', 5 ) || 0, 10 ) / 10
	const isGradient = getValue( 'BackgroundColorType' ) === 'gradient'

	// The default color is the same as the other one but transparent. Same so that there won't be a weird transition to transparent.
	const defaultColor1 = hexToRgba( getValue( 'BackgroundColor2' ) || '#ffffff', 0 )
	const defaultColor2 = hexToRgba( getValue( 'BackgroundColor' ) || '#ffffff', 0 )

	// Gradient location.
	const color1Location = `${ getValue( 'BackgroundGradientLocation1' ) || '0' }%`
	const color2Location = `${ getValue( 'BackgroundGradientLocation2' ) || '100' }%`

	if ( screen !== 'tablet' && screen !== 'mobile' ) { // Desktop.
		return {
			backgroundColor: appendImportant( ! isGradient && getValue( 'BackgroundColor' ) ? getValue( 'BackgroundColor' ) : undefined, importantBackgroundColor ),
			backgroundImage: appendImportant( isGradient ?
				`linear-gradient(${ getValue( 'BackgroundGradientDirection', '%sdeg', '90deg' ) }, ${ getValue( 'BackgroundColor' ) || defaultColor1 } ${ color1Location }, ${ getValue( 'BackgroundColor2' ) || defaultColor2 } ${ color2Location })` :
				undefined, importantBackgroundColor ),
			opacity: getValue( 'BackgroundMediaURL' ) ? opacity : undefined,
			mixBlendMode: isGradient ? getValue( 'BackgroundGradientBlendMode' ) : undefined,
		}
	} else if ( screen === 'tablet' ) { // Tablet.
		return {
			opacity: getValue( 'TabletBackgroundMediaURL' ) ? opacity : undefined,
		}
	}

	// Mobile.
	return {
		opacity: getValue( 'MobileBackgroundMediaURL' ) ? opacity : undefined,
	}
}

export const hasBackgroundOverlay = ( attrNameTemplate = '%s', blockAttributes = {} ) => {
	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = __getValue( blockAttributes, getAttrName )

	return getValue( 'BackgroundColorType' ) === 'gradient' ||
		getValue( 'BackgroundMediaUrl' ) ||
		getValue( 'TabletBackgroundMediaUrl' ) ||
		getValue( 'MobileBackgroundMediaUrl' )
}

export const createBackgroundStyleSet = ( attrNameTemplate = '%s', mainClassName = '', blockAttributes = {}, options = {} ) => {
	return {
		[ `.${ mainClassName }` ]: {
			...createBackgroundStyles( attrNameTemplate, 'desktop', blockAttributes, options ),
		},
		[ `.${ mainClassName }:before` ]: {
			...createBackgroundOverlayStyles( attrNameTemplate, 'desktop', blockAttributes, options ),
		},
		tablet: {
			[ `.${ mainClassName }` ]: {
				...createBackgroundStyles( attrNameTemplate, 'tablet', blockAttributes, options ),
			},
			[ `.${ mainClassName }:before` ]: {
				...createBackgroundOverlayStyles( attrNameTemplate, 'tablet', blockAttributes, options ),
			},
		},
		mobile: {
			[ `.${ mainClassName }` ]: {
				...createBackgroundStyles( attrNameTemplate, 'mobile', blockAttributes, options ),
			},
			[ `.${ mainClassName }:before` ]: {
				...createBackgroundOverlayStyles( attrNameTemplate, 'mobile', blockAttributes, options ),
			},
		},
	}
}

export default createBackgroundStyles
