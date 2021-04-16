/**
 * External dependencies
 */
import { camelCase } from 'lodash'
import {
	getFontFamily, __getValue, clampInheritedStyle, appendImportant, appendImportantAll,
} from '~stackable/util'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

export const addStyles = ( styles, attributes, options = {} ) => {
	const {
		selector = '',
		attrNameTemplate = '%s',
		importantSize = false,
		important = true,
		inherit = true, // If false, desktop styles will only be applied to desktop, etc.
		inheritMax = 50, // If provided & inherit is true, clamp the inherited value in tablet and mobile to this.
		inheritMin,
	} = options

	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = __getValue( attributes, getAttrName, '' )

	const desktopFontSize = getValue( 'FontSize' )
	const tabletFontSize = getValue( 'TabletFontSize' )
	const mobileFontSize = getValue( 'MobileFontSize' )

	const clampDesktopValue = inherit && clampInheritedStyle( desktopFontSize, { min: inheritMin, max: inheritMax } )
	const clampTabletValue = clampInheritedStyle( tabletFontSize, { min: inheritMin, max: inheritMax } )

	const typographyStyles = {
		[ selector ]: {
			textAlign: getValue( 'textAlign' ),
			fontFamily: getValue( 'FontFamily' ) !== '' ? getFontFamily( getValue( 'FontFamily' ) ) : undefined,
			fontSize: desktopFontSize !== '' ? appendImportant( `${ desktopFontSize }${ getValue( 'FontSizeUnit' ) || 'px' }`, importantSize ) : undefined,
			fontWeight: getValue( 'FontWeight' ) !== '' ? getValue( 'FontWeight' ) : undefined,
			textTransform: getValue( 'TextTransform' ) !== '' ? getValue( 'TextTransform' ) : undefined,
			letterSpacing: getValue( 'LetterSpacing' ) !== '' ? `${ getValue( 'LetterSpacing' ) }px` : undefined,
			lineHeight: getValue( 'LineHeight' ) !== '' ? `${ getValue( 'LineHeight' ) }${ getValue( 'LineHeightUnit' ) || 'em' }` : undefined,
			...( getValue( 'textColorType' ) !== 'gradient' ? {
				color: getValue( 'textColor1' ),
			} : {
				background: `-webkit-linear-gradient(${ getValue( 'textGradientDirection' ) !== '' ? `${ getValue( 'textGradientDirection' ) }deg, ` : '' }${ getValue( 'textColor1' ) }, ${ getValue( 'textColor2' ) })`,
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
				textAlign: getValue( 'tabletTextAlign' ),
				lineHeight: getValue( 'TabletLineHeight' ) !== '' ? `${ getValue( 'TabletLineHeight' ) }${ getValue( 'TabletLineHeightUnit' ) || 'em' }` : undefined,
				...( clampDesktopValue
					? {
						fontSize: `${ clampDesktopValue }${ getValue( 'FontSizeUnit' ) || 'px' }`,
					}
					: {} ),
				...( tabletFontSize
					? {
						fontSize: getValue( 'TabletFontSize', `%s${ getValue( 'TabletFontSizeUnit' ) || 'px' }` ),
					} : {} ),
			},
		},
		mobile: {
			[ selector ]: {
				textAlign: getValue( 'mobileTextAlign' ),
				lineHeight: getValue( 'MobileLineHeight' ) !== '' ? `${ getValue( 'MobileLineHeight' ) }${ getValue( 'MobileLineHeightUnit' ) || 'em' }` : undefined,
				...( clampTabletValue
					? {
						fontSize: `${ clampTabletValue }${ getValue( 'TabletFontSizeUnit' ) || 'px' }`,
					} : ( ( clampDesktopValue || tabletFontSize )
						? {} : { fontSize: `${ clampDesktopValue }${ getValue( 'FontSizeUnit' ) || 'px' }` }
					) ),
				...( mobileFontSize
					? {
						fontSize: getValue( 'MobileFontSize', `%s${ getValue( 'MobileFontSizeUnit' ) || 'px' }` ),
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
