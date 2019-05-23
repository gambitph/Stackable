import { camelCase } from 'lodash'
import { getFontFamily } from '@stackable/util'
import { sprintf } from '@wordpress/i18n'

const createTypographyStyles = ( attrNameTemplate = '%s', screen = 'desktop', blockAttributes = {} ) => {
	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = ( attrName, defaultValue = '' ) => blockAttributes[ getAttrName( attrName ) ] || defaultValue

	if ( screen !== 'tablet' && screen !== 'mobile' ) { // Desktop.
		return {
			fontFamily: getValue( 'FontFamily' ) !== '' ? getFontFamily( getValue( 'FontFamily' ) ) : undefined,
			fontSize: getValue( 'FontSize' ) !== '' ? `${ getValue( 'FontSize' ) }${ getValue( 'FontSizeUnit', 'px' ) }` : undefined,
			fontWeight: getValue( 'FontWeight' ) !== '' ? getValue( 'FontWeight' ) : undefined,
			textTransform: getValue( 'TextTransform' ) !== '' ? getValue( 'TextTransform' ) : undefined,
			letterSpacing: getValue( 'LetterSpacing' ) !== '' ? `${ getValue( 'LetterSpacing' ) }px` : undefined,
			lineHeight: getValue( 'LineHeight' ) !== '' ? `${ getValue( 'LineHeight' ) }${ getValue( 'LineHeightUnit', 'em' ) }` : undefined,
		}
	} else if ( screen === 'tablet' ) { // Tablet.
		return {
			fontSize: getValue( 'TabletFontSize' ) !== '' ? `${ getValue( 'TabletFontSize' ) }${ getValue( 'TabletFontSizeUnit', 'px' ) }` : undefined,
			lineHeight: getValue( 'TabletLineHeight' ) !== '' ? `${ getValue( 'TabletLineHeight' ) }${ getValue( 'TabletLineHeightUnit', 'em' ) }` : undefined,
		}
	}

	// Mobile.
	return {
		fontSize: getValue( 'MobileFontSize' ) !== '' ? `${ getValue( 'MobileFontSize' ) }${ getValue( 'MobileFontSizeUnit', 'px' ) }` : undefined,
		lineHeight: getValue( 'MobileLineHeight' ) !== '' ? `${ getValue( 'MobileLineHeight' ) }${ getValue( 'MobileLineHeightUnit', 'em' ) }` : undefined,
	}
}

export default createTypographyStyles
