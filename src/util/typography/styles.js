/**
 * Internal dependencies
 */
import { appendImportant, appendImportantAll } from '../'

/**
 * External dependencies
 */
import { getFontFamily, __getValue } from '~stackable/util'
import { camelCase } from 'lodash'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

/**
 * Handles the responsive font size if the value
 * is not yet defined.
 *
 * @param {number} fontSize the font size
 * @param {string} fontSizeUnit
 * @param {boolean} importantSize
 *
 * @return {*} the passed font size rule
 */
const inheritTypographyFontSize = ( fontSize = null, fontSizeUnit = 'px', importantSize = null ) => {
	if ( ! fontSize || ! importantSize ) {
		return undefined
	}

	/**
	 * When tablet font size is undefined and desktop font size is defined, inherit the desktop's value
	 * if size <= 50. If desktop font size is > 50, keep the value as 50px.
	 */
	if ( fontSize !== '' ) {
		if ( fontSize <= 50 ) {
			return appendImportant( `${ fontSize }${ fontSizeUnit }`, importantSize )
		}
		return appendImportant( `50${ fontSizeUnit }`, importantSize )
	}
}

const createTypographyStyles = ( attrNameTemplate = '%s', screen = 'desktop', blockAttributes = {}, options = {} ) => {
	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = __getValue( blockAttributes, getAttrName, '' )

	const {
		importantSize = false,
		important = false,
	} = options

	let styles = {}

	if ( screen !== 'tablet' && screen !== 'mobile' ) { // Desktop.
		styles = {
			fontFamily: getValue( 'FontFamily' ) !== '' ? appendImportant( getFontFamily( getValue( 'FontFamily' ) ) ) : undefined,
			fontSize: getValue( 'FontSize' ) !== '' ? appendImportant( `${ getValue( 'FontSize' ) }${ getValue( 'FontSizeUnit' ) || 'px' }`, importantSize ) : undefined,
			fontWeight: getValue( 'FontWeight' ) !== '' ? getValue( 'FontWeight' ) : undefined,
			textTransform: getValue( 'TextTransform' ) !== '' ? getValue( 'TextTransform' ) : undefined,
			letterSpacing: getValue( 'LetterSpacing' ) !== '' ? `${ getValue( 'LetterSpacing' ) }px` : undefined,
			lineHeight: getValue( 'LineHeight' ) !== '' ? `${ getValue( 'LineHeight' ) }${ getValue( 'LineHeightUnit' ) || 'em' }` : undefined,
		}
	} else if ( screen === 'tablet' ) { // Tablet.
		// Checks if the font size for tablet is not defined.
		let fontSize
		if ( getValue( 'TabletFontSize' ) === '' ) {
			fontSize = inheritTypographyFontSize( getValue( 'FontSize' ), getValue( 'FontSizeUnit' ), importantSize )
		} else {
			fontSize = appendImportant( `${ getValue( 'TabletFontSize' ) }${ getValue( 'TabletFontSizeUnit' ) || 'px' }`, importantSize )
		}

		styles = {
			fontSize,
			lineHeight: getValue( 'TabletLineHeight' ) !== '' ? `${ getValue( 'TabletLineHeight' ) }${ getValue( 'TabletLineHeightUnit' ) || 'em' }` : undefined,
		}
	} else { // Mobile.
		// Checks if the font size for mobile is not defined.
		let fontSize
		if ( getValue( 'MobileFontSize' ) === '' ) {
			fontSize = inheritTypographyFontSize( getValue( 'FontSize' ), getValue( 'FontSizeUnit' ), importantSize )
		} else {
			fontSize = appendImportant( `${ getValue( 'MobileFontSize' ) }${ getValue( 'MobileFontSizeUnit' ) || 'px' }`, importantSize )
		}

		styles = {
			fontSize,
			lineHeight: getValue( 'MobileLineHeight' ) !== '' ? `${ getValue( 'MobileLineHeight' ) }${ getValue( 'MobileLineHeightUnit' ) || 'em' }` : undefined,
		}
	}

	return important ? appendImportantAll( styles ) : styles
}

export default createTypographyStyles
