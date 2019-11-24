/**
 * External dependencies
 */
import { BackgroundControls } from '~stackable/components'
import { camelCase } from 'lodash'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

const BackgroundControlsHelper = props => {
	const { setAttributes } = props
	const getAttrName = attrName => camelCase( sprintf( props.attrNameTemplate, attrName ) )
	const getAttrValue = ( attrName, defaultValue = '' ) => {
		const value = props.blockAttributes[ getAttrName( attrName ) ]
		return value === 0 ? value : ( value || defaultValue )
	}

	return (
		<BackgroundControls
			backgroundColorType={ props.blockAttributes[ getAttrName( 'BackgroundColorType' ) ] || '' }
			backgroundColor={ props.blockAttributes[ getAttrName( 'BackgroundColor' ) ] || '' }
			backgroundColorOpacity={ props.blockAttributes[ getAttrName( 'BackgroundColorOpacity' ) ] }
			backgroundColor2={ props.blockAttributes[ getAttrName( 'BackgroundColor2' ) ] || '' }
			backgroundMediaID={ props.blockAttributes[ getAttrName( 'BackgroundMediaID' ) ] || '' }
			backgroundMediaURL={ props.blockAttributes[ getAttrName( 'BackgroundMediaURL' ) ] || '' }
			tabletBackgroundMediaID={ props.blockAttributes[ getAttrName( 'TabletBackgroundMediaID' ) ] || '' }
			tabletBackgroundMediaURL={ props.blockAttributes[ getAttrName( 'TabletBackgroundMediaURL' ) ] || '' }
			mobileBackgroundMediaID={ props.blockAttributes[ getAttrName( 'MobileBackgroundMediaID' ) ] || '' }
			mobileBackgroundMediaURL={ props.blockAttributes[ getAttrName( 'MobileBackgroundMediaURL' ) ] || '' }
			backgroundTintStrength={ props.blockAttributes[ getAttrName( 'BackgroundTintStrength' ) ] }
			fixedBackground={ props.blockAttributes[ getAttrName( 'FixedBackground' ) ] || '' }
			onChangeBackgroundColorType={ value => setAttributes( { [ getAttrName( 'BackgroundColorType' ) ]: value } ) }
			onChangeBackgroundColor={ value => setAttributes( { [ getAttrName( 'BackgroundColor' ) ]: value } ) }
			onChangeBackgroundColorOpacity={ value => setAttributes( { [ getAttrName( 'BackgroundColorOpacity' ) ]: value } ) }
			onChangeBackgroundColor2={ value => setAttributes( { [ getAttrName( 'BackgroundColor2' ) ]: value } ) }
			onChangeBackgroundMedia={ ( { url, id } ) => {
				setAttributes( {
					[ getAttrName( 'BackgroundMediaURL' ) ]: url,
					[ getAttrName( 'BackgroundMediaID' ) ]: id,
				} )
			} }
			onChangeTabletBackgroundMedia={ ( { url, id } ) => {
				setAttributes( {
					[ getAttrName( 'TabletBackgroundMediaURL' ) ]: url,
					[ getAttrName( 'TabletBackgroundMediaID' ) ]: id,
				} )
			} }
			onChangeMobileBackgroundMedia={ ( { url, id } ) => {
				setAttributes( {
					[ getAttrName( 'MobileBackgroundMediaURL' ) ]: url,
					[ getAttrName( 'MobileBackgroundMediaID' ) ]: id,
				} )
			} }
			onChangeBackgroundTintStrength={ ( value, backgroundColor ) => {
				setAttributes( {
					[ getAttrName( 'BackgroundTintStrength' ) ]: value,
					[ getAttrName( 'BackgroundColor' ) ]: backgroundColor,
				} )
			} }
			onChangeFixedBackground={ value => setAttributes( { [ getAttrName( 'FixedBackground' ) ]: value } ) }

			// Advanced gradient.
			backgroundGradientDirection={ getAttrValue( 'BackgroundGradientDirection', 90 ) }
			backgroundGradientBlendMode={ getAttrValue( 'BackgroundGradientBlendMode' ) }
			backgroundGradientLocation1={ getAttrValue( 'BackgroundGradientLocation1', 0 ) }
			backgroundGradientLocation2={ getAttrValue( 'BackgroundGradientLocation2', 100 ) }
			onChangeBackgroundGradientDirection={ value => setAttributes( { [ getAttrName( 'BackgroundGradientDirection' ) ]: value } ) }
			onChangeBackgroundGradientBlendMode={ value => setAttributes( { [ getAttrName( 'BackgroundGradientBlendMode' ) ]: value } ) }
			onChangeBackgroundGradientLocation1={ value => setAttributes( { [ getAttrName( 'BackgroundGradientLocation1' ) ]: value } ) }
			onChangeBackgroundGradientLocation2={ value => setAttributes( { [ getAttrName( 'BackgroundGradientLocation2' ) ]: value } ) }
			onResetAdvancedGradient={ () => {
				setAttributes( {
					[ getAttrName( 'BackgroundGradientDirection' ) ]: '',
					[ getAttrName( 'BackgroundGradientBlendMode' ) ]: '',
					[ getAttrName( 'BackgroundGradientLocation1' ) ]: '',
					[ getAttrName( 'BackgroundGradientLocation2' ) ]: '',
				} )
			} }

			// Advanced background.
			backgroundPosition={ props.blockAttributes[ getAttrName( 'BackgroundPosition' ) ] || '' }
			tabletBackgroundPosition={ props.blockAttributes[ getAttrName( 'TabletBackgroundPosition' ) ] || '' }
			mobileBackgroundPosition={ props.blockAttributes[ getAttrName( 'MobileBackgroundPosition' ) ] || '' }
			backgroundRepeat={ props.blockAttributes[ getAttrName( 'BackgroundRepeat' ) ] || '' }
			tabletBackgroundRepeat={ props.blockAttributes[ getAttrName( 'TabletBackgroundRepeat' ) ] || '' }
			mobileBackgroundRepeat={ props.blockAttributes[ getAttrName( 'MobileBackgroundRepeat' ) ] || '' }
			backgroundSize={ props.blockAttributes[ getAttrName( 'BackgroundSize' ) ] || '' }
			tabletBackgroundSize={ props.blockAttributes[ getAttrName( 'TabletBackgroundSize' ) ] || '' }
			mobileBackgroundSize={ props.blockAttributes[ getAttrName( 'MobileBackgroundSize' ) ] || '' }
			backgroundCustomSize={ props.blockAttributes[ getAttrName( 'BackgroundCustomSize' ) ] || '' }
			tabletBackgroundCustomSize={ props.blockAttributes[ getAttrName( 'TabletBackgroundCustomSize' ) ] || '' }
			mobileBackgroundCustomSize={ props.blockAttributes[ getAttrName( 'MobileBackgroundCustomSize' ) ] || '' }
			backgroundCustomSizeUnit={ props.blockAttributes[ getAttrName( 'BackgroundCustomSizeUnit' ) ] || '%' }
			tabletBackgroundCustomSizeUnit={ props.blockAttributes[ getAttrName( 'TabletBackgroundCustomSizeUnit' ) ] || '%' }
			mobileBackgroundCustomSizeUnit={ props.blockAttributes[ getAttrName( 'MobileBackgroundCustomSizeUnit' ) ] || '%' }
			backgroundImageBlendMode={ props.blockAttributes[ getAttrName( 'BackgroundImageBlendMode' ) ] || '' }
			onChangeBackgroundPosition={ value => setAttributes( { [ getAttrName( 'BackgroundPosition' ) ]: value } ) }
			onChangeTabletBackgroundPosition={ value => setAttributes( { [ getAttrName( 'TabletBackgroundPosition' ) ]: value } ) }
			onChangeMobileBackgroundPosition={ value => setAttributes( { [ getAttrName( 'MobileBackgroundPosition' ) ]: value } ) }
			onChangeBackgroundRepeat={ value => setAttributes( { [ getAttrName( 'BackgroundRepeat' ) ]: value } ) }
			onChangeTabletBackgroundRepeat={ value => setAttributes( { [ getAttrName( 'TabletBackgroundRepeat' ) ]: value } ) }
			onChangeMobileBackgroundRepeat={ value => setAttributes( { [ getAttrName( 'MobileBackgroundRepeat' ) ]: value } ) }
			onChangeBackgroundSize={ value => setAttributes( { [ getAttrName( 'BackgroundSize' ) ]: value } ) }
			onChangeTabletBackgroundSize={ value => setAttributes( { [ getAttrName( 'TabletBackgroundSize' ) ]: value } ) }
			onChangeMobileBackgroundSize={ value => setAttributes( { [ getAttrName( 'MobileBackgroundSize' ) ]: value } ) }
			onChangeBackgroundCustomSize={ value => setAttributes( { [ getAttrName( 'BackgroundCustomSize' ) ]: value } ) }
			onChangeTabletBackgroundCustomSize={ value => setAttributes( { [ getAttrName( 'TabletBackgroundCustomSize' ) ]: value } ) }
			onChangeMobileBackgroundCustomSize={ value => setAttributes( { [ getAttrName( 'MobileBackgroundCustomSize' ) ]: value } ) }
			onChangeBackgroundCustomSizeUnit={ value => setAttributes( { [ getAttrName( 'BackgroundCustomSizeUnit' ) ]: value } ) }
			onChangeTabletBackgroundCustomSizeUnit={ value => setAttributes( { [ getAttrName( 'TabletBackgroundCustomSizeUnit' ) ]: value } ) }
			onChangeMobileBackgroundCustomSizeUnit={ value => setAttributes( { [ getAttrName( 'MobileBackgroundCustomSizeUnit' ) ]: value } ) }
			onChangeBackgroundImageBlendMode={ value => setAttributes( { [ getAttrName( 'BackgroundImageBlendMode' ) ]: value } ) }
			onResetAdvancedBackground={ () => {
				setAttributes( {
					[ getAttrName( 'BackgroundPosition' ) ]: '',
					[ getAttrName( 'TabletBackgroundPosition' ) ]: '',
					[ getAttrName( 'MobileBackgroundPosition' ) ]: '',
					[ getAttrName( 'BackgroundRepeat' ) ]: '',
					[ getAttrName( 'TabletBackgroundRepeat' ) ]: '',
					[ getAttrName( 'MobileBackgroundRepeat' ) ]: '',
					[ getAttrName( 'BackgroundSize' ) ]: '',
					[ getAttrName( 'TabletBackgroundSize' ) ]: '',
					[ getAttrName( 'MobileBackgroundSize' ) ]: '',
					[ getAttrName( 'BackgroundCustomSize' ) ]: '',
					[ getAttrName( 'TabletBackgroundCustomSize' ) ]: '',
					[ getAttrName( 'MobileBackgroundCustomSize' ) ]: '',
					[ getAttrName( 'BackgroundCustomSizeUnit' ) ]: '%',
					[ getAttrName( 'TabletBackgroundCustomSizeUnit' ) ]: '%',
					[ getAttrName( 'MobileBackgroundCustomSizeUnit' ) ]: '%',
					[ getAttrName( 'BackgroundImageBlendMode' ) ]: '',
				} )
			} }

			{ ...props }
		/>
	)
}

BackgroundControlsHelper.defaultProps = {
	attrNameTemplate: '%s',
	setAttributes: () => {},
	blockAttributes: {},
}

export default BackgroundControlsHelper
