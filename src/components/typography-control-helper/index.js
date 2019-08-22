/**
 * External dependencies
 */
import { TypographyControl } from '~stackable/components'
import { camelCase } from 'lodash'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

const TypographyControlHelper = props => {
	const { setAttributes } = props
	const getAttrName = attrName => camelCase( sprintf( props.attrNameTemplate, attrName ) )

	return (
		<TypographyControl
			fontFamily={ props.blockAttributes[ getAttrName( 'FontFamily' ) ] || '' }
			fontSize={ props.blockAttributes[ getAttrName( 'FontSize' ) ] || '' }
			tabletFontSize={ props.blockAttributes[ getAttrName( 'TabletFontSize' ) ] || '' }
			mobileFontSize={ props.blockAttributes[ getAttrName( 'MobileFontSize' ) ] || '' }
			fontSizeUnit={ props.blockAttributes[ getAttrName( 'FontSizeUnit' ) ] || 'px' }
			tabletFontSizeUnit={ props.blockAttributes[ getAttrName( 'TabletFontSizeUnit' ) ] || 'px' }
			mobileFontSizeUnit={ props.blockAttributes[ getAttrName( 'MobileFontSizeUnit' ) ] || 'px' }
			fontWeight={ props.blockAttributes[ getAttrName( 'FontWeight' ) ] || '' }
			textTransform={ props.blockAttributes[ getAttrName( 'TextTransform' ) ] || '' }
			letterSpacing={ props.blockAttributes[ getAttrName( 'LetterSpacing' ) ] || '' }
			lineHeight={ props.blockAttributes[ getAttrName( 'LineHeight' ) ] || '' }
			tabletLineHeight={ props.blockAttributes[ getAttrName( 'TabletLineHeight' ) ] || '' }
			mobileLineHeight={ props.blockAttributes[ getAttrName( 'MobileLineHeight' ) ] || '' }
			lineHeightUnit={ props.blockAttributes[ getAttrName( 'LineHeightUnit' ) ] || 'em' }
			tabletLineHeightUnit={ props.blockAttributes[ getAttrName( 'TabletLineHeightUnit' ) ] || 'em' }
			mobileLineHeightUnit={ props.blockAttributes[ getAttrName( 'MobileLineHeightUnit' ) ] || 'em' }
			onChangeFontFamily={ value => setAttributes( { [ getAttrName( 'FontFamily' ) ]: value } ) }
			onChangeFontSize={ value => setAttributes( { [ getAttrName( 'FontSize' ) ]: value } ) }
			onChangeTabletFontSize={ value => setAttributes( { [ getAttrName( 'TabletFontSize' ) ]: value } ) }
			onChangeMobileFontSize={ value => setAttributes( { [ getAttrName( 'MobileFontSize' ) ]: value } ) }
			onChangeFontSizeUnit={ value => setAttributes( { [ getAttrName( 'FontSizeUnit' ) ]: value } ) }
			onChangeTabletFontSizeUnit={ value => setAttributes( { [ getAttrName( 'TabletFontSizeUnit' ) ]: value } ) }
			onChangeMobileFontSizeUnit={ value => setAttributes( { [ getAttrName( 'MobileFontSizeUnit' ) ]: value } ) }
			onChangeFontWeight={ value => setAttributes( { [ getAttrName( 'FontWeight' ) ]: value } ) }
			onChangeTextTransform={ value => setAttributes( { [ getAttrName( 'TextTransform' ) ]: value } ) }
			onChangeLetterSpacing={ value => setAttributes( { [ getAttrName( 'LetterSpacing' ) ]: value } ) }
			onChangeLineHeight={ value => setAttributes( { [ getAttrName( 'LineHeight' ) ]: value } ) }
			onChangeTabletLineHeight={ value => setAttributes( { [ getAttrName( 'TabletLineHeight' ) ]: value } ) }
			onChangeMobileLineHeight={ value => setAttributes( { [ getAttrName( 'MobileLineHeight' ) ]: value } ) }
			onChangeLineHeightUnit={ value => setAttributes( { [ getAttrName( 'LineHeightUnit' ) ]: value } ) }
			onChangeTabletLineHeightUnit={ value => setAttributes( { [ getAttrName( 'TabletLineHeightUnit' ) ]: value } ) }
			onChangeMobileLineHeightUnit={ value => setAttributes( { [ getAttrName( 'MobileLineHeightUnit' ) ]: value } ) }
			onReset={ () => {
				setAttributes( {
					[ getAttrName( 'FontFamily' ) ]: '',
					[ getAttrName( 'FontSize' ) ]: '',
					[ getAttrName( 'TabletFontSize' ) ]: '',
					[ getAttrName( 'MobileFontSize' ) ]: '',
					[ getAttrName( 'FontSizeUnit' ) ]: 'px',
					[ getAttrName( 'TabletFontSizeUnit' ) ]: 'px',
					[ getAttrName( 'MobileFontSizeUnit' ) ]: 'px',
					[ getAttrName( 'FontWeight' ) ]: '',
					[ getAttrName( 'TextTransform' ) ]: '',
					[ getAttrName( 'LetterSpacing' ) ]: '',
					[ getAttrName( 'LineHeight' ) ]: '',
					[ getAttrName( 'TabletLineHeight' ) ]: '',
					[ getAttrName( 'MobileLineHeight' ) ]: '',
					[ getAttrName( 'LineHeightUnit' ) ]: 'em',
					[ getAttrName( 'TabletLineHeightUnit' ) ]: 'em',
					[ getAttrName( 'MobileLineHeightUnit' ) ]: 'em',
				} )
			} }
			{ ...props }
		/>
	)
}

TypographyControlHelper.defaultProps = {
	attrNameTemplate: '%s',
	setAttributes: () => {},
	blockAttributes: {},
}

export default TypographyControlHelper
