/**
 * External dependencies
 */
import {
	getFontFamily, clampInheritedStyle, appendImportant, appendImportantAll,
} from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'
import { useMemo, Fragment } from '@wordpress/element'

const getTypographySizeStyle = ( options = {} ) => {
	const {
		selector,
		fontSize,
		clampDesktopValue,
		tabletFontSize,
		importantSize,
		clampTabletValue,
		mobileFontSize,
		important,
		fontSizeUnit,
		tabletFontSizeUnit,
		mobileFontSizeUnit,
	} = options

	const styles = {
		[ selector ]: {
			fontSize: fontSize !== '' ? appendImportant( `${ fontSize }${ fontSizeUnit || 'px' }`, importantSize ) : undefined,
		},
		tablet: {
			[ selector ]: {
				...( clampDesktopValue
					? {
						fontSize: `${ clampDesktopValue }${ fontSizeUnit || 'px' }`,
					}
					: {} ),
				...( tabletFontSize
					? {
						fontSize: sprintf( `%s${ tabletFontSizeUnit || 'px' }`, tabletFontSize ),
					} : {} ),
			},
		},
		mobile: {
			[ selector ]: {
				...( clampTabletValue
					? {
						fontSize: `${ clampTabletValue }${ tabletFontSizeUnit || 'px' }`,
					} : ( ( clampDesktopValue || tabletFontSize )
						? {} : { fontSize: `${ clampDesktopValue }${ fontSizeUnit || 'px' }` }
					) ),
				...( mobileFontSize
					? {
						fontSize: sprintf( `%s${ mobileFontSizeUnit || 'px' }`, mobileFontSize ),
					} : {} ),
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

const getTypographyColorStyle = ( options = {} ) => {
	const {
		selector,
		important,
		textColorType,
		textColor1,
		textColor2,
		textGradientDirection,
	} = options

	const styles = {
		[ selector ]: {
			...( textColorType !== 'gradient' ? {
				color: textColor1 ? textColor1 : undefined,
			} : {
				background: `-webkit-linear-gradient(${ textGradientDirection !== '' ? `${ textGradientDirection }deg, ` : '' }${ textColor1 }, ${ textColor2 })`,
				backgroundClip: 'text',
				'-webkit-background-clip': 'text',
				'-moz-background-clip': 'text',
				'-o-background-clip': 'text',
				textFillColor: 'transparent',
				'-webkit-text-fill-color': 'transparent',
				'-moz-text-fill-color': 'transparent',
				'-o-text-fill-color': 'transparent',
			} ),
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
		textAlign,
		fontFamily,
		fontWeight,
		textTransform,
		letterSpacing,
		lineHeight,
		lineHeightUnit,
		tabletTextAlign,
		tabletLineHeight,
		tabletLineHeightUnit,
		mobileTextAlign,
		mobileLineHeight,
		mobileLineHeightUnit,
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
				textAlign: tabletTextAlign,
				lineHeight: tabletLineHeight !== '' ? `${ tabletLineHeight }${ tabletLineHeightUnit || 'em' }` : undefined,
			},
		},
		mobile: {
			[ selector ]: {
				textAlign: mobileTextAlign,
				lineHeight: mobileLineHeight !== '' ? `${ mobileLineHeight }${ mobileLineHeightUnit || 'em' }` : undefined,
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
		importantSize = false,
		important = true,
		inherit = true, // If false, desktop styles will only be applied to desktop, etc.
		inheritMax = 50, // If provided & inherit is true, clamp the inherited value in tablet and mobile to this.
		inheritMin,
	} = options

	const {
		fontSize,
		tabletFontSize,
		mobileFontSize,
		fontSizeUnit,
		tabletFontSizeUnit,
		mobileFontSizeUnit,
		textColorType,
		textColor1,
		textColor2,
		textGradientDirection,
		textAlign,
		fontFamily,
		fontWeight,
		textTransform,
		letterSpacing,
		lineHeight,
		lineHeightUnit,
		tabletTextAlign,
		tabletLineHeight,
		tabletLineHeightUnit,
		mobileTextAlign,
		mobileLineHeight,
		mobileLineHeightUnit,
	} = attributes

	const clampDesktopValue = useMemo(
		() => inherit && clampInheritedStyle( fontSize, { min: inheritMin, max: inheritMax } ),
		[
			fontSize,
			inheritMin,
			inheritMax,
		] )

	const clampTabletValue = useMemo(
		() => clampInheritedStyle( tabletFontSize, { min: inheritMin, max: inheritMax } ),
		[
			tabletFontSize,
			inheritMin,
			inheritMax,
		] )

	const typographySizeStyles = useMemo(
		() => getTypographySizeStyle( {
			selector,
			attributes,
			fontSize,
			clampDesktopValue,
			tabletFontSize,
			importantSize,
			clampTabletValue,
			mobileFontSize,
			important,
			fontSizeUnit,
			tabletFontSizeUnit,
			mobileFontSizeUnit,
		} ),
		[
			selector,
			attributes,
			fontSize,
			clampDesktopValue,
			tabletFontSize,
			importantSize,
			clampTabletValue,
			mobileFontSize,
			important,
			fontSizeUnit,
			tabletFontSizeUnit,
			mobileFontSizeUnit,
		]
	)

	const typographyColorStyles = useMemo(
		() => getTypographyColorStyle( {
			selector,
			important,
			textColorType,
			textColor1,
			textColor2,
			textGradientDirection,
		} ),
		[
			selector,
			important,
			textColorType,
			textColor1,
			textColor2,
			textGradientDirection,
		]
	)

	const typographyMiscStyles = useMemo(
		() => getTypographyMiscStyles( {
			selector,
			textAlign,
			fontFamily,
			fontWeight,
			textTransform,
			letterSpacing,
			lineHeight,
			lineHeightUnit,
			tabletTextAlign,
			tabletLineHeight,
			tabletLineHeightUnit,
			mobileTextAlign,
			mobileLineHeight,
			mobileLineHeightUnit,
			important,
		} ),
		[
			selector,
			textAlign,
			fontFamily,
			fontWeight,
			textTransform,
			letterSpacing,
			lineHeight,
			lineHeightUnit,
			tabletTextAlign,
			tabletLineHeight,
			tabletLineHeightUnit,
			mobileTextAlign,
			mobileLineHeight,
			mobileLineHeightUnit,
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
		importantSize = false,
		important = true,
		inherit = true, // If false, desktop styles will only be applied to desktop, etc.
		inheritMax = 50, // If provided & inherit is true, clamp the inherited value in tablet and mobile to this.
		inheritMin,
	} = options

	const {
		fontSize,
		tabletFontSize,
		mobileFontSize,
		fontSizeUnit,
		tabletFontSizeUnit,
		mobileFontSizeUnit,
		textColorType,
		textColor1,
		textColor2,
		textGradientDirection,
		textAlign,
		fontFamily,
		fontWeight,
		textTransform,
		letterSpacing,
		lineHeight,
		lineHeightUnit,
		tabletTextAlign,
		tabletLineHeight,
		tabletLineHeightUnit,
		mobileTextAlign,
		mobileLineHeight,
		mobileLineHeightUnit,
	} = attributes

	const clampDesktopValue = inherit && clampInheritedStyle( fontSize, { min: inheritMin, max: inheritMax } )

	const clampTabletValue = clampInheritedStyle( tabletFontSize, { min: inheritMin, max: inheritMax } )

	const typographySizeStyles = getTypographySizeStyle( {
		selector,
		attributes,
		fontSize,
		clampDesktopValue,
		tabletFontSize,
		importantSize,
		clampTabletValue,
		mobileFontSize,
		important,
		fontSizeUnit,
		tabletFontSizeUnit,
		mobileFontSizeUnit,
	} )

	const typographyColorStyles = getTypographyColorStyle( {
		selector,
		important,
		textColorType,
		textColor1,
		textColor2,
		textGradientDirection,
	} )

	const typographyMiscStyles = getTypographyMiscStyles( {
		selector,
		textAlign,
		fontFamily,
		fontWeight,
		textTransform,
		letterSpacing,
		lineHeight,
		lineHeightUnit,
		tabletTextAlign,
		tabletLineHeight,
		tabletLineHeightUnit,
		mobileTextAlign,
		mobileLineHeight,
		mobileLineHeightUnit,
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
