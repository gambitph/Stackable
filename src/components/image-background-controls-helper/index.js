/**
 * External dependencies
 */
import {
	ImageBackgroundControls,
} from '~stackable/components'
import { camelCase } from 'lodash'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

const ImageBackgroundControlsHelper = props => {
	const { setAttributes } = props
	const getAttrName = attrName => camelCase( sprintf( props.attrNameTemplate, attrName ) )
	const getAttrValue = attrName => {
		const value = props.blockAttributes[ getAttrName( attrName ) ]
		return value === 0 ? value : ( value || '' )
	}

	return (
		<ImageBackgroundControls
			id={ getAttrValue( 'Id' ) }
			url={ getAttrValue( 'Url' ) }
			onChangeImage={ ( {
				url,
				id,
			} ) => {
				setAttributes( {
					[ getAttrName( 'Url' ) ]: url,
					[ getAttrName( 'Id' ) ]: id,
				} )
			} }

			size={ getAttrValue( 'Size' ) }
			onChangeSize={ ( size, url ) => {
				setAttributes( {
					[ getAttrName( 'Size' ) ]: size,
					[ getAttrName( 'Url' ) ]: url,
				} )
			} }

			backgroundPosition={ getAttrValue( 'BackgroundPosition' ) }
			onChangeBackgroundPosition={ value => setAttributes( { [ getAttrName( 'BackgroundPosition' ) ]: value } ) }

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
