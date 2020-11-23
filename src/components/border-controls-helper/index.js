/**
 * External dependencies
 */
import { BorderControls } from '~stackable/components'
import { __getValue } from '~stackable/util'
import { camelCase } from 'lodash'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

const BorderControlsHelper = props => {
	const { setAttributes } = props
	const getAttrName = attrName => camelCase( sprintf( props.attrNameTemplate, attrName ) )
	const getValue = __getValue( props.blockAttributes, getAttrName, '' )

	return (
		<BorderControls
			borderType={ getValue( 'BorderType' ) }
			onChangeBorderType={ value => setAttributes( { [ getAttrName( 'BorderType' ) ]: value } ) }
			onResetBorder={ () => {
				setAttributes( {
					[ getAttrName( 'BorderType' ) ]: '',
				} )
			} }

			borderWidthTop={ getValue( 'BorderWidthTop' ) }
			borderWidthRight={ getValue( 'BorderWidthRight' ) }
			borderWidthBottom={ getValue( 'BorderWidthBottom' ) }
			borderWidthLeft={ getValue( 'BorderWidthLeft' ) }
			tabletBorderWidthTop={ getValue( 'TabletBorderWidthTop' ) }
			tabletBorderWidthRight={ getValue( 'TabletBorderWidthRight' ) }
			tabletBorderWidthBottom={ getValue( 'TabletBorderWidthBottom' ) }
			tabletBorderWidthLeft={ getValue( 'TabletBorderWidthLeft' ) }
			mobileBorderWidthTop={ getValue( 'MobileBorderWidthTop' ) }
			mobileBorderWidthRight={ getValue( 'MobileBorderWidthRight' ) }
			mobileBorderWidthBottom={ getValue( 'MobileBorderWidthBottom' ) }
			mobileBorderWidthLeft={ getValue( 'MobileBorderWidthLeft' ) }
			onChangeBorderWidth={ ( {
				top, right, bottom, left, borderType,
			} ) => {
				const attributes = {
					[ getAttrName( 'BorderWidthTop' ) ]: top,
					[ getAttrName( 'BorderWidthRight' ) ]: right,
					[ getAttrName( 'BorderWidthBottom' ) ]: bottom,
					[ getAttrName( 'BorderWidthLeft' ) ]: left,
				}
				if ( borderType ) {
					attributes[ getAttrName( 'BorderType' ) ] = borderType
				}
				setAttributes( attributes )
			} }
			onChangeTabletBorderWidth={ ( {
				top, right, bottom, left,
			} ) => {
				setAttributes( {
					[ getAttrName( 'TabletBorderWidthTop' ) ]: top,
					[ getAttrName( 'TabletBorderWidthRight' ) ]: right,
					[ getAttrName( 'TabletBorderWidthBottom' ) ]: bottom,
					[ getAttrName( 'TabletBorderWidthLeft' ) ]: left,
				} )
			} }
			onChangeMobileBorderWidth={ ( {
				top, right, bottom, left,
			} ) => {
				setAttributes( {
					[ getAttrName( 'MobileBorderWidthTop' ) ]: top,
					[ getAttrName( 'MobileBorderWidthRight' ) ]: right,
					[ getAttrName( 'MobileBorderWidthBottom' ) ]: bottom,
					[ getAttrName( 'MobileBorderWidthLeft' ) ]: left,
				} )
			} }

			borderColor={ getValue( 'BorderColor' ) }
			onChangeBorderColor={
				( { color, borderType } ) => {
					const attributes = {
						[ getAttrName( 'BorderColor' ) ]: color,
					}
					if ( borderType ) {
						attributes[ getAttrName( 'BorderType' ) ] = borderType
					}
					setAttributes( attributes )
				}
			}

			{ ...props }
		/>
	)
}

BorderControlsHelper.defaultProps = {
	attrNameTemplate: '%s',
	setAttributes: () => {},
	blockAttributes: {},
}

export default BorderControlsHelper
