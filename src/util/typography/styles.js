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
		styles = {
			fontSize: getValue( 'TabletFontSize' ) !== '' ? appendImportant( `${ getValue( 'TabletFontSize' ) }${ getValue( 'TabletFontSizeUnit' ) || 'px' }`, importantSize ) : undefined,
			lineHeight: getValue( 'TabletLineHeight' ) !== '' ? `${ getValue( 'TabletLineHeight' ) }${ getValue( 'TabletLineHeightUnit' ) || 'em' }` : undefined,
		}
	} else { // Mobile.
		styles = {
			fontSize: getValue( 'MobileFontSize' ) !== '' ? appendImportant( `${ getValue( 'MobileFontSize' ) }${ getValue( 'MobileFontSizeUnit' ) || 'px' }`, importantSize ) : undefined,
			lineHeight: getValue( 'MobileLineHeight' ) !== '' ? `${ getValue( 'MobileLineHeight' ) }${ getValue( 'MobileLineHeightUnit' ) || 'em' }` : undefined,
		}
	}

	return important ? appendImportantAll( styles ) : styles
}

export default createTypographyStyles
