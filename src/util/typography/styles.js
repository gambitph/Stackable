/**
 * Internal dependencies
 */
import { appendImportant, appendImportantAll } from '../'

/**
 * External dependencies
 */
import {
	getFontFamily, __getValue, clampValue,
} from '~stackable/util'
import { camelCase } from 'lodash'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

const createTypographyStyles = ( attrNameTemplate = '%s', screen = 'desktop', blockAttributes = {}, options = {} ) => {
	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = __getValue( blockAttributes, getAttrName, '' )

	const {
		importantSize = false,
		important = false,
		inherit = true, // If false, desktop styles will only be applied to desktop, etc.
		inheritTabletMax = 50, // If provided & inherit is true, clamp the inherited value in tablet to this.
		inheritTabletMin,
		inheritMobileMax = 50, // If provided & inherit is true, clamp the inherited value in mobile to this.
		inheritMobileMin,
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
			const clampTabletValue = clampValue( desktopFontSize, { min: inheritTabletMin, max: inheritTabletMax } )

			styles.fontSize = tabletFontSize !== '' ? appendImportant( `${ tabletFontSize }${ getValue( 'TabletFontSizeUnit' ) || 'px' }`, importantSize ) : appendImportant( clampTabletValue && `${ clampTabletValue }${ getValue( 'TabletFontSizeUnit' ) || 'px' }`, importantSize )
		} else {
			styles.fontSize = tabletFontSize !== '' ? appendImportant( `${ tabletFontSize }${ getValue( 'TabletFontSizeUnit' ) || 'px' }`, importantSize ) : undefined
		}
	} else { // Mobile.
		styles = {
			lineHeight: getValue( 'MobileLineHeight' ) !== '' ? `${ getValue( 'MobileLineHeight' ) }${ getValue( 'MobileLineHeightUnit' ) || 'em' }` : undefined,
		}
		if ( inherit ) {
			const clampMobileValue = clampValue( desktopFontSize, { min: inheritMobileMin, max: inheritMobileMax } )

			styles.fontSize = mobileFontSize !== '' ? appendImportant( `${ mobileFontSize }${ getValue( 'MobileFontSizeUnit' ) || 'px' }`, importantSize ) : appendImportant( clampMobileValue && `${ clampMobileValue }${ getValue( 'MobileFontSizeUnit' ) || 'px' }`, importantSize )
		} else {
			styles.fontSize = mobileFontSize !== '' ? appendImportant( `${ mobileFontSize }${ getValue( 'TabletFontSizeUnit' ) || 'px' }`, importantSize ) : undefined
		}
	}

	return important ? appendImportantAll( styles ) : styles
}

export default createTypographyStyles
