/**
 * External dependencies
 */
import {
	appendImportantAll,
	getAttrNameFunction,
	hexToRgba,
	__getValue,
} from '~stackable/util'

export const addBackgroundOnlyStyles = ( styles, attributes, options = {} ) => {
	const {
		selector = '',
		attrNameTemplate = '%s',
	} = options

	const getAttrName = getAttrNameFunction( attrNameTemplate )
	const getValue = __getValue( attributes, getAttrName )

	const customSize = getValue( 'BackgroundCustomSize' ) ? getValue( 'BackgroundCustomSize' ) + ( getValue( 'BackgroundCustomSizeUnit' ) || '%' ) : undefined
	const tabletCustomSize = getValue( 'BackgroundCustomSizeTablet' ) ? getValue( 'BackgroundCustomSizeTablet' ) + ( getValue( 'BackgroundCustomSizeUnitTablet' ) || '%' ) : undefined
	const mobileCustomSize = getValue( 'BackgroundCustomSizeMobile' ) ? getValue( 'BackgroundCustomSizeMobile' ) + ( getValue( 'BackgroundCustomSizeUnitMobile' ) || '%' ) : undefined

	// Background color opacity.
	let backgroundColor = getValue( 'BackgroundColor' )
	if ( ! getValue( 'BackgroundColorType' ) && typeof attributes[ getAttrName( 'BackgroundColorOpacity' ) ] !== 'undefined' && attributes[ getAttrName( 'BackgroundColorOpacity' ) ] !== '' ) {
		if ( ! getValue( 'BackgroundMediaURL' ) && ! getValue( 'BackgroundMediaURLTablet' ) && ! getValue( 'BackgroundMediaURLMobile' ) ) {
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
					backgroundImage: getValue( 'BackgroundMediaURLTablet', `url(%s)` ),
					backgroundPosition: getValue( 'BackgroundPositionTablet' ),
					backgroundRepeat: getValue( 'BackgroundRepeatTablet' ),
					backgroundSize: getValue( 'BackgroundSizeTablet' )
						? ( getValue( 'BackgroundSizeTablet' ) !== 'custom' ? getValue( 'BackgroundSizeTablet' ) : tabletCustomSize )
						: undefined,
				},
			},
			mobile: {
				[ selector ]: {
					backgroundImage: getValue( 'BackgroundMediaURLMobile', `url(%s)` ),
					backgroundPosition: getValue( 'BackgroundPositionMobile' ),
					backgroundRepeat: getValue( 'BackgroundRepeatMobile' ),
					backgroundSize: getValue( 'BackgroundSizeMobile' )
						? ( getValue( 'BackgroundSizeMobile' ) !== 'custom' ? getValue( 'BackgroundSizeMobile' ) : mobileCustomSize )
						: undefined,
				},
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}

export const addBackgroundOverlayStyles = ( styles, attributes, options = {} ) => {
	const {
		selector = '',
		attrNameTemplate = '%s',
	} = options

	const getAttrName = getAttrNameFunction( attrNameTemplate )
	const getValue = __getValue( attributes, getAttrName )

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

export const addBackgroundStyles = ( styles, attributes, options = {} ) => {
	addBackgroundOnlyStyles( styles, attributes, options )
	addBackgroundOverlayStyles( styles, attributes, options )
}
