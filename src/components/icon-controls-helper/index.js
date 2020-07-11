/**
 * External dependencies
 */
import { IconControls } from '~stackable/components'
import { __getValue } from '~stackable/util'
import { camelCase } from 'lodash'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

const IconControlsHelper = props => {
	const { setAttributes } = props
	const getAttrName = attrName => camelCase( sprintf( props.attrNameTemplate, attrName ) )
	const getValue = __getValue( props.blockAttributes, getAttrName, '' )

	return (
		<IconControls
			icon={ getValue( 'Icon' ) }
			onChangeIcon={ value => setAttributes( { [ getAttrName( 'Icon' ) ]: value } ) }

			design={ getValue( 'Design' ) || 'plain' }
			onChangeDesign={ value => setAttributes( { [ getAttrName( 'Design' ) ]: value } ) }

			colorType={ getValue( 'ColorType' ) }
			onChangeColorType={ value => setAttributes( { [ getAttrName( 'ColorType' ) ]: value } ) }
			color={ getValue( 'Color' ) }
			onChangeColor={ value => setAttributes( { [ getAttrName( 'Color' ) ]: value } ) }
			color2={ getValue( 'Color2' ) }
			onChangeColor2={ value => setAttributes( { [ getAttrName( 'Color2' ) ]: value } ) }
			colorGradientDirection={ getValue( 'ColorGradientDirection' ) }
			onChangeColorGradientDirection={ value => setAttributes( { [ getAttrName( 'ColorGradientDirection' ) ]: value } ) }

			// Multicolor.
			color3={ getValue( 'Color3' ) }
			onChangeColor3={ value => setAttributes( { [ getAttrName( 'Color3' ) ]: value } ) }
			color4={ getValue( 'Color4' ) }
			onChangeColor4={ value => setAttributes( { [ getAttrName( 'Color4' ) ]: value } ) }
			color5={ getValue( 'Color5' ) }
			onChangeColor5={ value => setAttributes( { [ getAttrName( 'Color5' ) ]: value } ) }
			color6={ getValue( 'Color6' ) }
			onChangeColor6={ value => setAttributes( { [ getAttrName( 'Color6' ) ]: value } ) }
			color7={ getValue( 'Color7' ) }
			onChangeColor7={ value => setAttributes( { [ getAttrName( 'Color7' ) ]: value } ) }
			color8={ getValue( 'Color8' ) }
			onChangeColor8={ value => setAttributes( { [ getAttrName( 'Color8' ) ]: value } ) }
			color9={ getValue( 'Color9' ) }
			onChangeColor9={ value => setAttributes( { [ getAttrName( 'Color9' ) ]: value } ) }
			color10={ getValue( 'Color10' ) }
			onChangeColor10={ value => setAttributes( { [ getAttrName( 'Color10' ) ]: value } ) }
			multiOpacity1={ getValue( 'MultiOpacity1' ) }
			onChangeMultiOpacity1={ value => setAttributes( { [ getAttrName( 'MultiOpacity1' ) ]: value } ) }
			multiOpacity2={ getValue( 'MultiOpacity2' ) }
			onChangeMultiOpacity2={ value => setAttributes( { [ getAttrName( 'MultiOpacity2' ) ]: value } ) }
			multiOpacity3={ getValue( 'MultiOpacity3' ) }
			onChangeMultiOpacity3={ value => setAttributes( { [ getAttrName( 'MultiOpacity3' ) ]: value } ) }
			multiOpacity4={ getValue( 'MultiOpacity4' ) }
			onChangeMultiOpacity4={ value => setAttributes( { [ getAttrName( 'MultiOpacity4' ) ]: value } ) }
			multiOpacity5={ getValue( 'MultiOpacity5' ) }
			onChangeMultiOpacity5={ value => setAttributes( { [ getAttrName( 'MultiOpacity5' ) ]: value } ) }
			multiOpacity6={ getValue( 'MultiOpacity6' ) }
			onChangeMultiOpacity6={ value => setAttributes( { [ getAttrName( 'MultiOpacity6' ) ]: value } ) }
			multiOpacity7={ getValue( 'MultiOpacity7' ) }
			onChangeMultiOpacity7={ value => setAttributes( { [ getAttrName( 'MultiOpacity7' ) ]: value } ) }
			multiOpacity8={ getValue( 'MultiOpacity8' ) }
			onChangeMultiOpacity8={ value => setAttributes( { [ getAttrName( 'MultiOpacity8' ) ]: value } ) }
			multiOpacity9={ getValue( 'MultiOpacity9' ) }
			onChangeMultiOpacity9={ value => setAttributes( { [ getAttrName( 'MultiOpacity9' ) ]: value } ) }
			multiOpacity10={ getValue( 'MultiOpacity10' ) }
			onChangeMultiOpacity10={ value => setAttributes( { [ getAttrName( 'MultiOpacity10' ) ]: value } ) }

			borderRadius={ getValue( 'BorderRadius' ) }
			onChangeBorderRadius={ value => setAttributes( { [ getAttrName( 'BorderRadius' ) ]: value } ) }
			padding={ getValue( 'Padding' ) }
			onChangePadding={ value => setAttributes( { [ getAttrName( 'Padding' ) ]: value } ) }
			outlineWidth={ getValue( 'OutlineWidth' ) }
			onChangeOutlineWidth={ value => setAttributes( { [ getAttrName( 'OutlineWidth' ) ]: value } ) }
			shadow={ getValue( 'Shadow' ) }
			onChangeShadow={ value => setAttributes( { [ getAttrName( 'Shadow' ) ]: value } ) }
			backgroundColorType={ getValue( 'BackgroundColorType' ) }
			onChangeBackgroundColorType={ value => setAttributes( { [ getAttrName( 'BackgroundColorType' ) ]: value } ) }
			backgroundColor={ getValue( 'BackgroundColor' ) }
			onChangeBackgroundColor={ value => setAttributes( { [ getAttrName( 'BackgroundColor' ) ]: value } ) }
			backgroundColor2={ getValue( 'BackgroundColor2' ) }
			onChangeBackgroundColor2={ value => setAttributes( { [ getAttrName( 'BackgroundColor2' ) ]: value } ) }
			backgroundColorGradientDirection={ getValue( 'BackgroundColorGradientDirection' ) }
			onChangeBackgroundColorGradientDirection={ value => setAttributes( { [ getAttrName( 'BackgroundColorGradientDirection' ) ]: value } ) }

			size={ getValue( 'Size' ) }
			tabletSize={ getValue( 'TabletSize' ) }
			mobileSize={ getValue( 'MobileSize' ) }
			sizeMax={ props.sizeMax }
			onChangeSize={ value => setAttributes( { [ getAttrName( 'Size' ) ]: value } ) }
			onChangeTabletSize={ value => setAttributes( { [ getAttrName( 'TabletSize' ) ]: value } ) }
			onChangeMobileSize={ value => setAttributes( { [ getAttrName( 'MobileSize' ) ]: value } ) }
			opacity={ getValue( 'Opacity' ) }
			onChangeOpacity={ value => setAttributes( { [ getAttrName( 'Opacity' ) ]: value } ) }
			rotation={ getValue( 'Rotation' ) }
			onChangeRotation={ value => setAttributes( { [ getAttrName( 'Rotation' ) ]: value } ) }

			showBackgroundShape={ getValue( 'ShowBackgroundShape' ) }
			onChangeShowBackgroundShape={ value => setAttributes( { [ getAttrName( 'ShowBackgroundShape' ) ]: value } ) }
			backgroundShape={ getValue( 'BackgroundShape' ) || 'blob1' }
			onChangeBackgroundShape={ value => setAttributes( { [ getAttrName( 'BackgroundShape' ) ]: value } ) }
			backgroundShapeOpacity={ getValue( 'BackgroundShapeOpacity' ) }
			onChangeBackgroundShapeOpacity={ value => setAttributes( { [ getAttrName( 'BackgroundShapeOpacity' ) ]: value } ) }
			backgroundShapeSize={ getValue( 'BackgroundShapeSize' ) }
			onChangeBackgroundShapeSize={ value => setAttributes( { [ getAttrName( 'BackgroundShapeSize' ) ]: value } ) }
			backgroundShapeColor={ getValue( 'BackgroundShapeColor' ) }
			onChangeBackgroundShapeColor={ value => setAttributes( { [ getAttrName( 'BackgroundShapeColor' ) ]: value } ) }
			backgroundShapeOffsetHorizontal={ getValue( 'BackgroundShapeOffsetHorizontal' ) }
			onChangeBackgroundShapeHorizontalOffset={ value => setAttributes( { [ getAttrName( 'BackgroundShapeOffsetHorizontal' ) ]: value } ) }
			backgroundShapeOffsetVertical={ getValue( 'BackgroundShapeOffsetVertical' ) }
			onChangeBackgroundShapeVerticalOffset={ value => setAttributes( { [ getAttrName( 'BackgroundShapeOffsetVertical' ) ]: value } ) }

			{ ...props }
		/>
	)
}

IconControlsHelper.defaultProps = {
	attrNameTemplate: '%s',
	setAttributes: () => {},
	blockAttributes: {},
}

export default IconControlsHelper
