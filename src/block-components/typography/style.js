/**
 * External dependencies
 */
import {
	getFontFamily, clampInheritedStyle, appendImportant, appendImportantAll, getAttrNameFunction, __getValue,
} from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { useMemo, Fragment } from '@wordpress/element'

const getTypographySizeStyle = ( options = {} ) => {
	const {
		selector,
		fontSize = '',
		clampDesktopValue = '',
		fontSizeTablet = '',
		importantSize = '',
		clampTabletValue = '',
		fontSizeMobile = '',
		important,
		fontSizeUnit = 'px',
		fontSizeUnitTablet = 'px',
		fontSizeUnitMobile = 'px',
	} = options

	const styles = {
		[ selector ]: {
			fontSize: fontSize !== '' ? appendImportant( `${ fontSize }${ fontSizeUnit || 'px' }`, importantSize ) : undefined,
		},
		tablet: { [ selector ]: {} },
		mobile: { [ selector ]: {} },
	}

	// Handle tablet styles
	if ( clampDesktopValue ) {
		styles.tablet[ selector ].fontSize = `${ clampDesktopValue }${ fontSizeUnit || 'px' }`
	}

	if ( fontSizeTablet ) {
		styles.tablet[ selector ].fontSize = `${ fontSizeTablet }${ fontSizeUnitTablet || 'px' }`
	}

	// Handle mobile styles
	if ( clampDesktopValue ) {
		styles.mobile[ selector ].fontSize = `${ clampDesktopValue }${ fontSizeUnit || 'px' }`
	}

	if ( clampTabletValue ) {
		styles.mobile[ selector ].fontSize = `${ clampTabletValue }${ fontSizeUnitTablet || 'px' }`
	} else if ( clampDesktopValue || fontSizeTablet !== '' ) {
		styles.mobile[ selector ].fontSize = undefined
	}

	if ( fontSizeMobile ) {
		styles.mobile[ selector ].fontSize = `${ fontSizeMobile }${ fontSizeUnitMobile || 'px' }`
	}

	if ( important ) {
		styles[ selector ] = appendImportantAll( styles[ selector ] )
		styles.tablet[ selector ] = appendImportantAll( styles.tablet[ selector ] )
		styles.mobile[ selector ] = appendImportantAll( styles.mobile[ selector ] )
	}

	return styles
}

const getTypographyColorStyle = ( options = {} ) => {
	const {
		selector,
		important,
		textColorType = '',
		textColor1 = '',
		textColor2 = '',
		textGradientDirection = '',
	} = options

	const styles = {
		[ selector ]: {
			...( textColorType !== 'gradient' ? {
				color: textColor1 ? textColor1 : undefined,
			} : textColor1 !== '' && textColor2 !== '' ? {
				backgroundImage: `linear-gradient(${ textGradientDirection !== '' ? `${ textGradientDirection }deg, ` : '' }${ textColor1 }, ${ textColor2 })`,
			} : {} ),
		},
	}

	if ( important ) {
		styles[ selector ] = appendImportantAll( styles[ selector ] )
	}

	return styles
}

const getTypographyMiscStyles = ( options = {} ) => {
	const {
		selector,
		textAlign = '',
		fontFamily = '',
		fontWeight = '',
		textTransform = '',
		letterSpacing = '',
		lineHeight = '',
		lineHeightUnit = 'em',
		textAlignTablet = '',
		lineHeightTablet = '',
		lineHeightUnitTablet = 'em',
		textAlignMobile = '',
		lineHeightMobile = '',
		lineHeightUnitMobile = 'em',
		important,
	} = options

	const styles = {
		[ selector ]: {
			textAlign: textAlign ? textAlign : undefined,
			fontFamily: fontFamily !== '' ? getFontFamily( fontFamily ) : undefined,
			fontWeight: fontWeight !== '' ? fontWeight : undefined,
			textTransform: textTransform !== '' ? textTransform : undefined,
			letterSpacing: letterSpacing !== '' ? `${ letterSpacing }px` : undefined,
			lineHeight: lineHeight !== '' ? `${ lineHeight }${ lineHeightUnit || 'em' }` : undefined,
		},
		tablet: {
			[ selector ]: {
				textAlign: textAlignTablet !== '' ? textAlignTablet : undefined,
				lineHeight: lineHeightTablet !== '' ? `${ lineHeightTablet }${ lineHeightUnitTablet || 'em' }` : undefined,
			},
		},
		mobile: {
			[ selector ]: {
				textAlign: textAlignMobile !== '' ? textAlignMobile : undefined,
				lineHeight: lineHeightMobile !== '' ? `${ lineHeightMobile }${ lineHeightUnitMobile || 'em' }` : undefined,
			},
		},
	}

	if ( important ) {
		styles[ selector ] = appendImportantAll( styles[ selector ] )
		styles.tablet[ selector ] = appendImportantAll( styles.tablet[ selector ] )
		styles.mobile[ selector ] = appendImportantAll( styles.mobile[ selector ] )
	}

	return styles
}

export const Style = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const {
		selector = '',
		attrNameTemplate = '%s',
		importantSize = false,
		important = true,
		inherit = true, // If false, desktop styles will only be applied to desktop, etc.
		inheritMax = 50, // If provided & inherit is true, clamp the inherited value in tablet and mobile to this.
		inheritMin,
	} = options

	const getAttrName = getAttrNameFunction( attrNameTemplate )
	const getValue = __getValue( attributes, getAttrName, '' )

	const clampDesktopValue = useMemo(
		() => inherit && clampInheritedStyle( getValue( 'fontSize' ), { min: inheritMin, max: inheritMax } ),
		[
			getValue( 'fontSize' ),
			inheritMin,
			inheritMax,
		] )

	const clampTabletValue = useMemo(
		() => clampInheritedStyle( getValue( 'fontSizeTablet' ), { min: inheritMin, max: inheritMax } ),
		[
			getValue( 'fontSizeTablet' ),
			inheritMin,
			inheritMax,
		] )

	const typographySizeStyles = useMemo(
		() => getTypographySizeStyle( {
			selector,
			attributes,
			fontSize: getValue( 'fontSize' ),
			clampDesktopValue,
			fontSizeTablet: getValue( 'fontSizeTablet' ),
			importantSize,
			clampTabletValue,
			fontSizeMobile: getValue( 'fontSizeMobile' ),
			important,
			fontSizeUnit: getValue( 'fontSizeUnit' ),
			fontSizeUnitTablet: getValue( 'fontSizeUnitTablet' ),
			fontSizeUnitMobile: getValue( 'fontSizeUnitMobile' ),
		} ),
		[
			selector,
			attributes,
			getValue( 'fontSize' ),
			clampDesktopValue,
			getValue( 'fontSizeTablet' ),
			importantSize,
			clampTabletValue,
			getValue( 'fontSizeMobile' ),
			important,
			getValue( 'fontSizeUnit' ),
			getValue( 'fontSizeUnitTablet' ),
			getValue( 'fontSizeUnitMobile' ),
		]
	)

	const typographyColorStyles = useMemo(
		() => getTypographyColorStyle( {
			selector,
			important,
			textColorType: getValue( 'textColorType' ),
			textColor1: getValue( 'textColor1' ),
			textColor2: getValue( 'textColor2' ),
			textGradientDirection: getValue( 'textGradientDirection' ),
		} ),
		[
			selector,
			important,
			getValue( 'textColorType' ),
			getValue( 'textColor1' ),
			getValue( 'textColor2' ),
			getValue( 'textGradientDirection' ),
		]
	)

	const typographyMiscStyles = useMemo(
		() => getTypographyMiscStyles( {
			selector,
			textAlign: getValue( 'textAlign' ),
			fontFamily: getValue( 'fontFamily' ),
			fontWeight: getValue( 'fontWeight' ),
			textTransform: getValue( 'textTransform' ),
			letterSpacing: getValue( 'letterSpacing' ),
			lineHeight: getValue( 'lineHeight' ),
			lineHeightUnit: getValue( 'lineHeightUnit' ),
			textAlignTablet: getValue( 'textAlignTablet' ),
			lineHeightTablet: getValue( 'lineHeightTablet' ),
			lineHeightUnitTablet: getValue( 'lineHeightUnitTablet' ),
			textAlignMobile: getValue( 'textAlignMobile' ),
			lineHeightMobile: getValue( 'lineHeightMobile' ),
			lineHeightUnitMobile: getValue( 'lineHeightUnitMobile' ),
			important,
		} ),
		[
			selector,
			getValue( 'textAlign' ),
			getValue( 'fontFamily' ),
			getValue( 'fontWeight' ),
			getValue( 'textTransform' ),
			getValue( 'letterSpacing' ),
			getValue( 'lineHeight' ),
			getValue( 'lineHeightUnit' ),
			getValue( 'textAlignTablet' ),
			getValue( 'lineHeightTablet' ),
			getValue( 'lineHeightUnitTablet' ),
			getValue( 'textAlignMobile' ),
			getValue( 'lineHeightMobile' ),
			getValue( 'lineHeightUnitMobile' ),
			important,
		]
	)

	return (
		<Fragment>
			<StyleComponent
				styles={ typographySizeStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent
				styles={ typographyColorStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent
				styles={ typographyMiscStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)
}

Style.Content = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const {
		selector = '',
		attrNameTemplate = '%s',
		importantSize = false,
		important = true,
		inherit = true, // If false, desktop styles will only be applied to desktop, etc.
		inheritMax = 50, // If provided & inherit is true, clamp the inherited value in tablet and mobile to this.
		inheritMin,
	} = options

	const getAttrName = getAttrNameFunction( attrNameTemplate )
	const getValue = __getValue( attributes, getAttrName, '' )

	const clampDesktopValue = inherit && clampInheritedStyle( getValue( 'fontSize' ), { min: inheritMin, max: inheritMax } )

	const clampTabletValue = clampInheritedStyle( getValue( 'fontSizeTablet' ), { min: inheritMin, max: inheritMax } )

	const typographySizeStyles = getTypographySizeStyle( {
		selector,
		attributes,
		fontSize: getValue( 'fontSize' ),
		clampDesktopValue,
		fontSizeTablet: getValue( 'fontSizeTablet' ),
		importantSize,
		clampTabletValue,
		fontSizeMobile: getValue( 'fontSizeMobile' ),
		important,
		fontSizeUnit: getValue( 'fontSizeUnit' ),
		fontSizeUnitTablet: getValue( 'fontSizeUnitTablet' ),
		fontSizeUnitMobile: getValue( 'fontSizeUnitMobile' ),
	} )

	const typographyColorStyles = getTypographyColorStyle( {
		selector,
		important,
		textColorType: getValue( 'textColorType' ),
		textColor1: getValue( 'textColor1' ),
		textColor2: getValue( 'textColor2' ),
		textGradientDirection: getValue( 'textGradientDirection' ),
	} )

	const typographyMiscStyles = getTypographyMiscStyles( {
		selector,
		textAlign: getValue( 'textAlign' ),
		fontFamily: getValue( 'fontFamily' ),
		fontWeight: getValue( 'fontWeight' ),
		textTransform: getValue( 'textTransform' ),
		letterSpacing: getValue( 'letterSpacing' ),
		lineHeight: getValue( 'lineHeight' ),
		lineHeightUnit: getValue( 'lineHeightUnit' ),
		textAlignTablet: getValue( 'textAlignTablet' ),
		lineHeightTablet: getValue( 'lineHeightTablet' ),
		lineHeightUnitTablet: getValue( 'lineHeightUnitTablet' ),
		textAlignMobile: getValue( 'textAlignMobile' ),
		lineHeightMobile: getValue( 'lineHeightMobile' ),
		lineHeightUnitMobile: getValue( 'lineHeightUnitMobile' ),
		important,
	} )

	return (
		<Fragment>
			<StyleComponent.Content
				styles={ typographySizeStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent.Content
				styles={ typographyColorStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent.Content
				styles={ typographyMiscStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)
}
