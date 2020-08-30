/**
 * Internal dependencies
 */
import { appendImportant, appendImportantAll } from '../'

/**
 * External dependencies
 */
import {
	getFontFamily, __getValue, clampInheritedStyle,
} from '~stackable/util'
import { camelCase } from 'lodash'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

export const createTypographyStyles = ( attrNameTemplate = '%s', screen = 'desktop', blockAttributes = {}, options = {} ) => {
	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = __getValue( blockAttributes, getAttrName, '' )

	const {
		importantSize = false,
		important = false,
		inherit = true, // If false, desktop styles will only be applied to desktop, etc.
		inheritMax = 50, // If provided & inherit is true, clamp the inherited value in tablet and mobile to this.
		inheritMin,
	} = options

	let styles = {}

	const desktopFontSize = getValue( 'FontSize' )
	const tabletFontSize = getValue( 'TabletFontSize' )
	const mobileFontSize = getValue( 'MobileFontSize' )

	if ( screen !== 'tablet' && screen !== 'mobile' ) { // Desktop.
		styles = {
			fontFamily: getValue( 'FontFamily' ) !== '' ? appendImportant( getFontFamily( getValue( 'FontFamily' ) ) ) : undefined,
			fontSize: desktopFontSize !== '' ? appendImportant( `${ desktopFontSize }${ getValue( 'FontSizeUnit' ) || 'px' }`, importantSize ) : undefined,
			fontWeight: getValue( 'FontWeight' ) !== '' ? getValue( 'FontWeight' ) : undefined,
			textTransform: getValue( 'TextTransform' ) !== '' ? getValue( 'TextTransform' ) : undefined,
			letterSpacing: getValue( 'LetterSpacing' ) !== '' ? `${ getValue( 'LetterSpacing' ) }px` : undefined,
			lineHeight: getValue( 'LineHeight' ) !== '' ? `${ getValue( 'LineHeight' ) }${ getValue( 'LineHeightUnit' ) || 'em' }` : undefined,
		}
	} else if ( screen === 'tablet' ) { // Tablet.
		styles = {
			lineHeight: getValue( 'TabletLineHeight' ) !== '' ? `${ getValue( 'TabletLineHeight' ) }${ getValue( 'TabletLineHeightUnit' ) || 'em' }` : undefined,
		}

		if ( inherit ) {
			const clampDesktopValue = clampInheritedStyle( desktopFontSize, { min: inheritMin, max: inheritMax } )
			if ( clampDesktopValue ) {
				styles.fontSize = `${ clampDesktopValue }${ getValue( 'FontSizeUnit' ) || 'px' }`
			}
		}
		if ( tabletFontSize ) {
			styles.fontSize = getValue( 'TabletFontSize', `%s${ getValue( 'TabletFontSizeUnit' ) || 'px' }` )
		}
	} else { // Mobile.
		styles = {
			lineHeight: getValue( 'MobileLineHeight' ) !== '' ? `${ getValue( 'MobileLineHeight' ) }${ getValue( 'MobileLineHeightUnit' ) || 'em' }` : undefined,
		}

		if ( inherit ) {
			const clampDesktopValue = clampInheritedStyle( desktopFontSize, { min: inheritMin, max: inheritMax } )
			if ( clampDesktopValue ) {
				styles.fontSize = `${ clampDesktopValue }${ getValue( 'FontSizeUnit' ) || 'px' }`
			}

			const clampTabletValue = clampInheritedStyle( tabletFontSize, { min: inheritMin, max: inheritMax } )
			if ( clampTabletValue ) {
				styles.fontSize = `${ clampTabletValue }${ getValue( 'TabletFontSizeUnit' ) || 'px' }`
			} else if ( clampDesktopValue || tabletFontSize ) {
				// If we have a desktop value clamped, and there's a tablet value, don't do anything.
				styles.fontSize = undefined
			}
		}
		if ( mobileFontSize ) {
			styles.fontSize = getValue( 'MobileFontSize', `%s${ getValue( 'MobileFontSizeUnit' ) || 'px' }` )
		}
	}

	return important ? appendImportantAll( styles ) : styles
}

export default createTypographyStyles
