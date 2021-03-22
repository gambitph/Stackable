/**
 * External dependencies
 */
import { camelCase } from 'lodash'
import {
	appendImportantAll, hexToRgba, __getValue,
} from '~stackable/util'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

/**
 * Internal dependencies
 */

export const addBackgroundOnlyStyles = ( styles, blockProps, options = {} ) => {
	const {
		selector = '',
		attrNameTemplate = '%s',
	} = options

	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = __getValue( blockProps.attributes, getAttrName )

	const customSize = getValue( 'BackgroundCustomSize' ) ? getValue( 'BackgroundCustomSize' ) + ( getValue( 'BackgroundCustomSizeUnit' ) || '%' ) : undefined
	const tabletCustomSize = getValue( 'TabletBackgroundCustomSize' ) ? getValue( 'TabletBackgroundCustomSize' ) + ( getValue( 'TabletBackgroundCustomSizeUnit' ) || '%' ) : undefined
	const mobileCustomSize = getValue( 'MobileBackgroundCustomSize' ) ? getValue( 'MobileBackgroundCustomSize' ) + ( getValue( 'MobileBackgroundCustomSizeUnit' ) || '%' ) : undefined

	// Background color opacity.
	let backgroundColor = getValue( 'BackgroundColor' )
	if ( ! getValue( 'BackgroundColorType' ) && typeof blockProps.attributes[ getAttrName( 'BackgroundColorOpacity' ) ] !== 'undefined' && blockProps.attributes[ getAttrName( 'BackgroundColorOpacity' ) ] !== '' ) {
		if ( ! getValue( 'BackgroundMediaURL' ) && ! getValue( 'TabletBackgroundMediaURL' ) && ! getValue( 'MobileBackgroundMediaURL' ) ) {
			backgroundColor = `${ hexToRgba( getValue( 'BackgroundColor' ) || '#ffffff', getValue( 'BackgroundColorOpacity' ) || 0 ) }`
		}
	}

	styles.add( {
		style: {
			[ selector ]: {
				backgroundColor,
				backgroundAttachment: getValue( 'FixedBackground' ) ? 'fixed' : undefined,
				backgroundImage: getValue( 'BackgroundMediaURL', `url(%s)` ),
				backgroundPosition: getValue( 'BackgroundPosition' ),
				backgroundRepeat: getValue( 'BackgroundRepeat' ),
				backgroundSize: getValue( 'BackgroundSize' )
					? ( getValue( 'BackgroundSize' ) !== 'custom' ? getValue( 'BackgroundSize' ) : customSize )
					: undefined,
				backgroundBlendMode: getValue( 'BackgroundImageBlendMode' ),
			},
			tablet: {
				[ selector ]: {
					backgroundImage: getValue( 'TabletBackgroundMediaURL', `url(%s)` ),
					backgroundPosition: getValue( 'TabletBackgroundPosition' ),
					backgroundRepeat: getValue( 'TabletBackgroundRepeat' ),
					backgroundSize: getValue( 'TabletBackgroundSize' )
						? ( getValue( 'TabletBackgroundSize' ) !== 'custom' ? getValue( 'TabletBackgroundSize' ) : tabletCustomSize )
						: undefined,
				},
			},
			mobile: {
				[ selector ]: {
					backgroundImage: getValue( 'MobileBackgroundMediaURL', `url(%s)` ),
					backgroundPosition: getValue( 'MobileBackgroundPosition' ),
					backgroundRepeat: getValue( 'MobileBackgroundRepeat' ),
					backgroundSize: getValue( 'MobileBackgroundSize' )
						? ( getValue( 'MobileBackgroundSize' ) !== 'custom' ? getValue( 'MobileBackgroundSize' ) : mobileCustomSize )
						: undefined,
				},
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}

export const addBackgroundOverlayStyles = ( styles, blockProps, options = {} ) => {
	const {
		selector = '',
		attrNameTemplate = '%s',
	} = options

	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = __getValue( blockProps.attributes, getAttrName )

	const opacity = parseInt( getValue( 'BackgroundTintStrength', '', 5 ) || 0, 10 ) / 10
	const isGradient = getValue( 'BackgroundColorType' ) === 'gradient'

	// The default color is the same as the other one but transparent. Same so that there won't be a weird transition to transparent.
	const defaultColor1 = hexToRgba( getValue( 'BackgroundColor2' ) || '#ffffff', 0 )
	const defaultColor2 = hexToRgba( getValue( 'BackgroundColor' ) || '#ffffff', 0 )

	// Gradient location.
	const color1Location = `${ getValue( 'BackgroundGradientLocation1' ) || '0' }%`
	const color2Location = `${ getValue( 'BackgroundGradientLocation2' ) || '100' }%`

	styles.add( {
		style: {
			[ `${ selector }:before` ]: appendImportantAll( {
				backgroundColor: ! isGradient && getValue( 'BackgroundColor' ) ? getValue( 'BackgroundColor' ) : undefined,
				backgroundImage: isGradient
					? `linear-gradient(${ getValue( 'BackgroundGradientDirection', '%sdeg', '90deg' ) }, ${ getValue( 'BackgroundColor' ) || defaultColor1 } ${ color1Location }, ${ getValue( 'BackgroundColor2' ) || defaultColor2 } ${ color2Location })`
					: undefined,
				opacity: getValue( 'BackgroundMediaURL' ) ? opacity : undefined,
				mixBlendMode: isGradient ? getValue( 'BackgroundGradientBlendMode' ) : undefined,
			} ),
			tablet: {
				[ `${ selector }:before` ]: appendImportantAll( {
					opacity: getValue( 'BackgroundMediaURLTablet' ) ? opacity : undefined,
				} ),
			},
			mobile: {
				[ `${ selector }:before` ]: appendImportantAll( {
					opacity: getValue( 'BackgroundMediaURLMobile' ) ? opacity : undefined,
				} ),
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}

export const addBackgroundStyles = ( styles, blockProps, options = {} ) => {
	addBackgroundOnlyStyles( styles, blockProps, options )
	addBackgroundOverlayStyles( styles, blockProps, options )
}
