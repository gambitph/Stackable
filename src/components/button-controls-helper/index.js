import { ButtonControls } from '@stackable/components'
import { camelCase } from 'lodash'
import { sprintf } from '@wordpress/i18n'

const ButtonControlsHelper = props => {
	const { setAttributes } = props
	const getAttrName = attrName => camelCase( sprintf( props.attrNameTemplate, attrName ) )

	return (
		<ButtonControls
			design={ props.blockAttributes[ getAttrName( 'Design' ) ] || '' }
			onChangeDesign={ value => setAttributes( { [ getAttrName( 'Design' ) ]: value } ) }

			url={ props.blockAttributes[ getAttrName( 'Url' ) ] || '' }
			newWindow={ props.blockAttributes[ getAttrName( 'NewWindow' ) ] || '' }
			noFollow={ props.blockAttributes[ getAttrName( 'NoFollow' ) ] || '' }
			onChangeUrl={ value => setAttributes( { [ getAttrName( 'Url' ) ]: value } ) }
			onChangeNewWindow={ value => setAttributes( { [ getAttrName( 'NewWindow' ) ]: value } ) }
			onChangeNoFollow={ value => setAttributes( { [ getAttrName( 'NoFollow' ) ]: value } ) }

			size={ props.blockAttributes[ getAttrName( 'Size' ) ] || '' }
			onChangeSize={ value => setAttributes( { [ getAttrName( 'Size' ) ]: value } ) }

			onResetAdvancedColors={ () => {
				setAttributes( {
					[ getAttrName( 'BackgroundColorType' ) ]: '',
					[ getAttrName( 'BackgroundColor2' ) ]: '',
					[ getAttrName( 'BackgroundGradientDirection' ) ]: '',
					[ getAttrName( 'Opacity' ) ]: '',
				} )
			} }
			opacity={ props.blockAttributes[ getAttrName( 'Opacity' ) ] || '' }
			textColor={ props.blockAttributes[ getAttrName( 'TextColor' ) ] || '' }
			backgroundColorType={ props.blockAttributes[ getAttrName( 'BackgroundColorType' ) ] || '' }
			backgroundColor={ props.blockAttributes[ getAttrName( 'BackgroundColor' ) ] || '' }
			backgroundColor2={ props.blockAttributes[ getAttrName( 'BackgroundColor2' ) ] || '' }
			backgroundGradientDirection={ props.blockAttributes[ getAttrName( 'BackgroundGradientDirection' ) ] || '' }
			onChangeOpacity={ value => setAttributes( { [ getAttrName( 'Opacity' ) ]: value } ) }
			onChangeTextColor={ value => setAttributes( { [ getAttrName( 'TextColor' ) ]: value } ) }
			onChangeBackgroundColorType={ value => setAttributes( { [ getAttrName( 'BackgroundColorType' ) ]: value } ) }
			onChangeBackgroundColor={ value => setAttributes( { [ getAttrName( 'BackgroundColor' ) ]: value } ) }
			onChangeBackgroundColor2={ value => setAttributes( { [ getAttrName( 'BackgroundColor2' ) ]: value } ) }
			onChangeBackgroundGradientDirection={ value => setAttributes( { [ getAttrName( 'BackgroundGradientDirection' ) ]: value } ) }

			onResetHoverColors={ () => {
				setAttributes( {
					[ getAttrName( 'HoverBackgroundColor' ) ]: '',
					[ getAttrName( 'HoverBackgroundColor2' ) ]: '',
					[ getAttrName( 'HoverBackgroundGradientDirection' ) ]: '',
					[ getAttrName( 'HoverTextColor' ) ]: '',
					[ getAttrName( 'HoverOpacity' ) ]: '',
				} )
			} }
			hoverEffect={ props.blockAttributes[ getAttrName( 'hoverEffect' ) ] || '' }
			hoverOpacity={ props.blockAttributes[ getAttrName( 'HoverOpacity' ) ] || '' }
			hoverTextColor={ props.blockAttributes[ getAttrName( 'HoverTextColor' ) ] || '' }
			hoverBackgroundColor={ props.blockAttributes[ getAttrName( 'HoverBackgroundColor' ) ] || '' }
			hoverBackgroundColor2={ props.blockAttributes[ getAttrName( 'HoverBackgroundColor2' ) ] || '' }
			hoverBackgroundGradientDirection={ props.blockAttributes[ getAttrName( 'HoverBackgroundGradientDirection' ) ] || '' }
			hoverGhostToNormal={ props.blockAttributes[ getAttrName( 'HoverGhostToNormal' ) ] || '' }
			onChangeHoverEffect={ value => setAttributes( { [ getAttrName( 'HoverEffect' ) ]: value } ) }
			onChangeHoverOpacity={ value => setAttributes( { [ getAttrName( 'HoverOpacity' ) ]: value } ) }
			onChangeHoverTextColor={ value => setAttributes( { [ getAttrName( 'HoverTextColor' ) ]: value } ) }
			onChangeHoverBackgroundColor={ value => setAttributes( { [ getAttrName( 'HoverBackgroundColor' ) ]: value } ) }
			onChangeHoverBackgroundColor2={ value => setAttributes( { [ getAttrName( 'HoverBackgroundColor2' ) ]: value } ) }
			onChangeHoverBackgroundGradientDirection={ value => setAttributes( { [ getAttrName( 'HoverBackgroundGradientDirection' ) ]: value } ) }
			onChangeHoverGhostToNormal={ value => setAttributes( { [ getAttrName( 'HoverGhostToNormal' ) ]: value } ) }

			borderRadius={ props.blockAttributes[ getAttrName( 'BorderRadius' ) ] }
			borderWidth={ props.blockAttributes[ getAttrName( 'BorderWidth' ) ] }
			shadow={ props.blockAttributes[ getAttrName( 'Shadow' ) ] || '' }
			onChangeBorderRadius={ value => setAttributes( { [ getAttrName( 'BorderRadius' ) ]: value } ) }
			onChangeBorderWidth={ value => setAttributes( { [ getAttrName( 'BorderWidth' ) ]: value } ) }
			onChangeShadow={ value => setAttributes( { [ getAttrName( 'Shadow' ) ]: value } ) }

			icon={ props.blockAttributes[ getAttrName( 'Icon' ) ] || '' }
			onChangeIcon={ value => setAttributes( { [ getAttrName( 'Icon' ) ]: value } ) }
			onResetAdvancedIcon={ () => {
				setAttributes( {
					[ getAttrName( 'IconSize' ) ]: '',
					[ getAttrName( 'IconPosition' ) ]: '',
					[ getAttrName( 'IconSpacing' ) ]: '',
				} )
			} }
			iconSize={ props.blockAttributes[ getAttrName( 'IconSize' ) ] || '' }
			iconPosition={ props.blockAttributes[ getAttrName( 'IconPosition' ) ] || '' }
			iconSpacing={ props.blockAttributes[ getAttrName( 'IconSpacing' ) ] || '' }
			onChangeIconSize={ value => setAttributes( { [ getAttrName( 'IconSize' ) ]: value } ) }
			onChangeIconPosition={ value => setAttributes( { [ getAttrName( 'IconPosition' ) ]: value } ) }
			onChangeIconSpacing={ value => setAttributes( { [ getAttrName( 'IconSpacing' ) ]: value } ) }

			onResetAdvancedSpacing={ () => {
				setAttributes( {
					// [ getAttrName( 'Width' ) ]: '',
					[ getAttrName( 'MarginTop' ) ]: '',
					[ getAttrName( 'MarginRight' ) ]: '',
					[ getAttrName( 'MarginBottom' ) ]: '',
					[ getAttrName( 'MarginLeft' ) ]: '',
					[ getAttrName( 'PaddingTop' ) ]: '',
					[ getAttrName( 'PaddingRight' ) ]: '',
					[ getAttrName( 'PaddingBottom' ) ]: '',
					[ getAttrName( 'PaddingLeft' ) ]: '',
				} )
			} }
			// width={ props.blockAttributes[ getAttrName( 'Width' ) ] || '' }
			marginTop={ props.blockAttributes[ getAttrName( 'MarginTop' ) ] || '' }
			marginRight={ props.blockAttributes[ getAttrName( 'MarginRight' ) ] || '' }
			marginBottom={ props.blockAttributes[ getAttrName( 'MarginBottom' ) ] || '' }
			marginLeft={ props.blockAttributes[ getAttrName( 'MarginLeft' ) ] || '' }
			paddingTop={ props.blockAttributes[ getAttrName( 'PaddingTop' ) ] || '' }
			paddingRight={ props.blockAttributes[ getAttrName( 'PaddingRight' ) ] || '' }
			paddingBottom={ props.blockAttributes[ getAttrName( 'PaddingBottom' ) ] || '' }
			paddingLeft={ props.blockAttributes[ getAttrName( 'PaddingLeft' ) ] || '' }
			// onChangeWidth={ value => setAttributes( { [ getAttrName( 'Width' ) ]: value } ) }
			// onChangeMargins={ margins => {
			// 	setAttributes( {
			// 		[ getAttrName( 'MarginTop' ) ]: margins.top !== '' ? parseInt( margins.top, 10 ) : '',
			// 		[ getAttrName( 'MarginRight' ) ]: margins.right !== '' ? parseInt( margins.right, 10 ) : '',
			// 		[ getAttrName( 'MarginBottom' ) ]: margins.bottom !== '' ? parseInt( margins.bottom, 10 ) : '',
			// 		[ getAttrName( 'MarginLeft' ) ]: margins.left !== '' ? parseInt( margins.left, 10 ) : '',
			// 	} )
			// } }
			onChangePaddings={ paddings => {
				setAttributes( {
					[ getAttrName( 'PaddingTop' ) ]: paddings.top !== '' ? parseInt( paddings.top, 10 ) : '',
					[ getAttrName( 'PaddingRight' ) ]: paddings.right !== '' ? parseInt( paddings.right, 10 ) : '',
					[ getAttrName( 'PaddingBottom' ) ]: paddings.bottom !== '' ? parseInt( paddings.bottom, 10 ) : '',
					[ getAttrName( 'PaddingLeft' ) ]: paddings.left !== '' ? parseInt( paddings.left, 10 ) : '',
				} )
			} }

			{ ...props }
		/>
	)
}

ButtonControlsHelper.defaultProps = {
	attrNameTemplate: '%s',
	setAttributes: () => {},
	blockAttributes: {},
}

export default ButtonControlsHelper
