/**
 * External dependencies
 */
import {
	ImageControls,
} from '~stackable/components'
import { camelCase } from 'lodash'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

const ImageControlsHelper = props => {
	const { setAttributes } = props
	const getAttrName = attrName => camelCase( sprintf( props.attrNameTemplate, attrName ) )
	const getAttrValue = attrName => {
		const value = props.blockAttributes[ getAttrName( attrName ) ]
		return value === 0 ? value : ( value || '' )
	}

	return (
		<ImageControls
			id={ getAttrValue( 'Id' ) }
			url={ getAttrValue( 'Url' ) }
			onChangeImage={ ( {
				url,
				id,
				width,
				height,
			} ) => {
				setAttributes( {
					[ getAttrName( 'Url' ) ]: url,
					[ getAttrName( 'Id' ) ]: id,
					[ getAttrName( 'Width' ) ]: width,
					[ getAttrName( 'Height' ) ]: height,
				} )
			} }

			alt={ getAttrValue( 'Alt' ) }
			onChangeAlt={ value => setAttributes( { [ getAttrName( 'Alt' ) ]: value } ) }

			size={ getAttrValue( 'Size' ) }
			onChangeSize={ ( size, url, width, height ) => {
				setAttributes( {
					[ getAttrName( 'Size' ) ]: size,
					[ getAttrName( 'Url' ) ]: url,
					[ getAttrName( 'Width' ) ]: width,
					[ getAttrName( 'Height' ) ]: height,
				} )
			} }

			shape={ getAttrValue( 'Shape' ) }
			onChangeShape={ value => setAttributes( { [ getAttrName( 'Shape' ) ]: value } ) }
			shapeFlipX={ getAttrValue( 'ShapeFlipX' ) }
			onChangeShapeFlipX={ value => setAttributes( { [ getAttrName( 'ShapeFlipX' ) ]: value } ) }
			shapeFlipY={ getAttrValue( 'ShapeFlipY' ) }
			onChangeShapeFlipY={ value => setAttributes( { [ getAttrName( 'ShapeFlipY' ) ]: value } ) }
			shapeStretch={ getAttrValue( 'ShapeStretch' ) }
			onChangeShapeStretch={ value => setAttributes( { [ getAttrName( 'ShapeStretch' ) ]: value } ) }

			style={ getAttrValue( 'Style' ) }
			onChangeStyle={ value => setAttributes( { [ getAttrName( 'Style' ) ]: value } ) }

			width={ getAttrValue( 'Width' ) }
			tabletWidth={ getAttrValue( 'TabletWidth' ) }
			mobileWidth={ getAttrValue( 'MobileWidth' ) }
			onChangeWidth={ ( width, height ) => {
				setAttributes( {
					[ getAttrName( 'Width' ) ]: width,
					[ getAttrName( 'Height' ) ]: height,
				} )
			} }
			onChangeTabletWidth={ value => setAttributes( { [ getAttrName( 'TabletWidth' ) ]: value } ) }
			onChangeMobileWidth={ value => setAttributes( { [ getAttrName( 'MobileWidth' ) ]: value } ) }

			borderRadius={ getAttrValue( 'BorderRadius' ) }
			onChangeBorderRadius={ value => setAttributes( { [ getAttrName( 'BorderRadius' ) ]: value } ) }

			shadow={ getAttrValue( 'Shadow' ) }
			onChangeShadow={ value => setAttributes( { [ getAttrName( 'Shadow' ) ]: value } ) }

			blendMode={ getAttrValue( 'BlendMode' ) }
			onChangeBlendMode={ value => setAttributes( { [ getAttrName( 'BlendMode' ) ]: value } ) }

			// linkUrl={ getAttrValue( 'LinkUrl' ) }
			// linkNewTab={ getAttrValue( 'LinkNewTab' ) }
			// linkNoFollow={ getAttrValue( 'LinkNoFollow' ) }
			// onChangeLinkUrl={ value => setAttributes( { [ getAttrName( 'LinkUrl' ) ]: value } ) }
			// onChangeLinkNewTab={ value => setAttributes( { [ getAttrName( 'LinkNewTab' ) ]: value } ) }
			// onChangeLinkNoFollow={ value => setAttributes( { [ getAttrName( 'LinkNoFollow' ) ]: value } ) }

			{ ...props }
		/>
	)
}

ImageControlsHelper.defaultProps = {
	attrNameTemplate: '%s',
	setAttributes: () => {},
	blockAttributes: {},
}

export default ImageControlsHelper
