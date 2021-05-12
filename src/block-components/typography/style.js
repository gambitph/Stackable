/**
 * External dependencies
 */
import {
	getFontFamily, clampInheritedStyle, appendImportant, appendImportantAll,
} from '~stackable/util'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

export const addStyles = ( styles, attributes, options = {} ) => {
	const {
		selector = '',
		importantSize = false,
		important = true,
		inherit = true, // If false, desktop styles will only be applied to desktop, etc.
		inheritMax = 50, // If provided & inherit is true, clamp the inherited value in tablet and mobile to this.
		inheritMin,
	} = options

	const desktopFontSize = attributes.fontSize
	const tabletFontSize = attributes.tabletFontSize
	const mobileFontSize = attributes.mobileFontSize

	const clampDesktopValue = inherit && clampInheritedStyle( desktopFontSize, { min: inheritMin, max: inheritMax } )
	const clampTabletValue = clampInheritedStyle( tabletFontSize, { min: inheritMin, max: inheritMax } )

	const typographyStyles = {
		[ selector ]: {
			textAlign: attributes.textAlign ? attributes.textAlign : undefined,
			fontFamily: attributes.fontFamily !== '' ? getFontFamily( attributes.fontFamily ) : undefined,
			fontSize: desktopFontSize !== '' ? appendImportant( `${ desktopFontSize }${ attributes.fontSizeUnit || 'px' }`, importantSize ) : undefined,
			fontWeight: attributes.fontWeight !== '' ? attributes.fontWeight : undefined,
			textTransform: attributes.textTransform !== '' ? attributes.textTransform : undefined,
			letterSpacing: attributes.letterSpacing !== '' ? `${ attributes.letterSpacing }px` : undefined,
			lineHeight: attributes.lineHeight !== '' ? `${ attributes.lineHeight }${ attributes.lineHeightUnit || 'em' }` : undefined,
			...( attributes.textColorType !== 'gradient' ? {
				color: attributes.textColor1 ? attributes.textColor1 : undefined,
			} : {
				background: `-webkit-linear-gradient(${ attributes.textGradientDirection !== '' ? `${ attributes.textGradientDirection }deg, ` : '' }${ attributes.textColor1 }, ${ attributes.textColor2 })`,
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
		tablet: {
			[ selector ]: {
				textAlign: attributes.tabletTextAlign,
				lineHeight: attributes.tabletLineHeight !== '' ? `${ attributes.tabletLineHeight }${ attributes.tabletLineHeightUnit || 'em' }` : undefined,
				...( clampDesktopValue
					? {
						fontSize: `${ clampDesktopValue }${ attributes.fontSizeUnit || 'px' }`,
					}
					: {} ),
				...( tabletFontSize
					? {
						fontSize: sprintf( `%s${ attributes.tabletFontSizeUnit || 'px' }`, attributes.tabletFontSize ),
					} : {} ),
			},
		},
		mobile: {
			[ selector ]: {
				textAlign: attributes.mobileTextAlign,
				lineHeight: attributes.mobileLineHeight !== '' ? `${ attributes.mobileLineHeight }${ attributes.mobileLineHeightUnit || 'em' }` : undefined,
				...( clampTabletValue
					? {
						fontSize: `${ clampTabletValue }${ attributes.tabletFontSizeUnit || 'px' }`,
					} : ( ( clampDesktopValue || tabletFontSize )
						? {} : { fontSize: `${ clampDesktopValue }${ attributes.fontSizeUnit || 'px' }` }
					) ),
				...( mobileFontSize
					? {
						fontSize: sprintf( `%s${ attributes.mobileFontSizeUnit || 'px' }`, attributes.mobileFontSize ),
					} : {} ),
			},
		},
	}

	if ( important ) {
		typographyStyles[ selector ] = appendImportantAll( typographyStyles[ selector ] )
		typographyStyles.tablet[ selector ] = appendImportantAll( typographyStyles.tablet[ selector ] )
		typographyStyles.mobile[ selector ] = appendImportantAll( typographyStyles.mobile[ selector ] )
	}

	styles.add( {
		style: typographyStyles,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
