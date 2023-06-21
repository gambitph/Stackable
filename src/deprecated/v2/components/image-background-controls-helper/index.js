/**
 * External dependencies
 */
import { ImageBackgroundControls } from '~stackable/components'
import { __getValue } from '~stackable/util'
import { camelCase } from 'lodash'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

const ImageBackgroundControlsHelper = props => {
	const { setAttributes } = props
	const getAttrName = attrName => camelCase( sprintf( props.attrNameTemplate, attrName ) )
	const getValue = __getValue( props.blockAttributes, getAttrName, '' )

	return (
		<ImageBackgroundControls
			id={ getValue( 'Id' ) }
			url={ getValue( 'Url' ) }
			onChangeImage={ ( {
				url,
				id,
			} ) => {
				setAttributes( {
					[ getAttrName( 'Url' ) ]: url,
					[ getAttrName( 'Id' ) ]: id,
				} )
			} }

			size={ getValue( 'Size' ) }
			onChangeSize={ ( size, url ) => {
				setAttributes( {
					[ getAttrName( 'Size' ) ]: size,
					[ getAttrName( 'Url' ) ]: url,
				} )
			} }

			backgroundPosition={ getValue( 'BackgroundPosition' ) }
			onChangeBackgroundPosition={ value => setAttributes( { [ getAttrName( 'BackgroundPosition' ) ]: value } ) }
			backgroundRepeat={ getValue( 'BackgroundRepeat' ) }
			onChangeBackgroundRepeat={ value => setAttributes( { [ getAttrName( 'BackgroundRepeat' ) ]: value } ) }
			backgroundSize={ getValue( 'BackgroundSize' ) }
			onChangeBackgroundSize={ value => setAttributes( { [ getAttrName( 'BackgroundSize' ) ]: value } ) }

			backgroundCustomSize={ getValue( 'BackgroundCustomSize' ) }
			onChangeBackgroundCustomSize={ value => setAttributes( { [ getAttrName( 'BackgroundCustomSize' ) ]: value } ) }
			backgroundCustomSizeUnit={ getValue( 'BackgroundCustomSizeUnit' ) || 'px' }
			onChangeBackgroundCustomSizeUnit={ value => setAttributes( { [ getAttrName( 'BackgroundCustomSizeUnit' ) ]: value } ) }

			{ ...props }
		/>
	)
}

ImageBackgroundControlsHelper.defaultProps = {
	attrNameTemplate: '%s',
	setAttributes: () => {},
	blockAttributes: {},
}

export default ImageBackgroundControlsHelper
