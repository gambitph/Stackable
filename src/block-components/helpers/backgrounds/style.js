/**
 * External dependencies
 */
import {
	appendImportantAll,
	getAttrNameFunction,
	hexToRgba,
	__getValue,
} from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { Fragment, useMemo } from '@wordpress/element'

const getStyles1 = ( attributes, options = {} ) => {
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

	return {
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
	}
}

const getStyles2 = ( attributes, options = {} ) => {
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

	return {
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

		// In the editor, the background overlay can go outside the block if there's a border radius.
		editor: {
			[ `${ selector }:before` ]: appendImportantAll( {
				borderRadius: isGradient || getValue( 'BackgroundColor' ) ? getValue( 'borderRadius', '%spx' ) : undefined, // Block border radius
			} ),
		},
	}
}

export const BackgroundStyle = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props
	const {
		attrNameTemplate = '%s',
	} = options

	const getAttrName = getAttrNameFunction( attrNameTemplate )
	const getValue = __getValue( attributes, getAttrName )

	const styles1 = useMemo(
		() => getStyles1( attributes, options ),
		[
			options.attrNameTemplate,
			options.selector,
			getValue( 'BorderRadius' ), // Clip the background image

			getValue( 'BackgroundCustomSize' ),
			getValue( 'BackgroundCustomSizeUnit' ),
			getValue( 'BackgroundCustomSizeTablet' ),
			getValue( 'BackgroundCustomSizeUnitTablet' ),
			getValue( 'BackgroundCustomSizeMobile' ),
			getValue( 'BackgroundCustomSizeUnitMobile' ),

			getValue( 'BackgroundColor' ),
			getValue( 'BackgroundColorType' ),
			getValue( 'BackgroundColorOpacity' ),
			getValue( 'BackgroundMediaURL' ),
			getValue( 'BackgroundMediaURLTablet' ),
			getValue( 'BackgroundMediaURLMobile' ),

			getValue( 'FixedBackground' ),
			getValue( 'BackgroundImageBlendMode' ),

			getValue( 'BackgroundPosition' ),
			getValue( 'BackgroundRepeat' ),
			getValue( 'BackgroundSize' ),
			getValue( 'BackgroundPositionTablet' ),
			getValue( 'BackgroundRepeatTablet' ),
			getValue( 'BackgroundSizeTablet' ),
			getValue( 'BackgroundPositionMobile' ),
			getValue( 'BackgroundRepeatMobile' ),
			getValue( 'BackgroundSizeMobile' ),
			attributes.uniqueId,
		]
	)

	const styles2 = useMemo(
		() => getStyles2( attributes, options ),
		[
			options.attrNameTemplate,
			options.selector,
			getValue( 'BackgroundTintStrength' ),
			getValue( 'BackgroundColorType' ),
			getValue( 'BackgroundColor2' ),
			getValue( 'BackgroundColor' ),
			getValue( 'BackgroundGradientLocation1' ),
			getValue( 'BackgroundGradientLocation2' ),
			getValue( 'BackgroundGradientDirection' ),
			getValue( 'BackgroundMediaURL' ),
			getValue( 'BackgroundGradientBlendMode' ),
			getValue( 'BackgroundMediaURLTablet' ),
			getValue( 'BackgroundMediaURLMobile' ),
			attributes.uniqueId,
		]
	)

	return (
		<Fragment>
			<StyleComponent
				styles={ styles1 }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent
				styles={ styles2 }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)
}

BackgroundStyle.Content = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const styles1 = getStyles1( attributes, options )
	const styles2 = getStyles2( attributes, options )

	return (
		<Fragment>
			<StyleComponent.Content
				styles={ styles1 }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent.Content
				styles={ styles2 }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)
}
