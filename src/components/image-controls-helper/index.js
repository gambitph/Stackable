/**
 * External dependencies
 */
import { ImageControls } from '~stackable/components'
import { __getValue } from '~stackable/util'
import { camelCase } from 'lodash'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

const ImageControlsHelper = props => {
	const { setAttributes } = props
	const getAttrName = attrName => camelCase( sprintf( props.attrNameTemplate, attrName ) )
	const getValue = __getValue( props.blockAttributes, getAttrName, '' )

	return (
		<ImageControls
			id={ getValue( 'Id' ) }
			url={ getValue( 'Url' ) }
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

			alt={ getValue( 'Alt' ) }
			onChangeAlt={ value => setAttributes( { [ getAttrName( 'Alt' ) ]: value } ) }

			size={ getValue( 'Size' ) }
			onChangeSize={ ( size, url, width, height ) => {
				setAttributes( {
					[ getAttrName( 'Size' ) ]: size,
					[ getAttrName( 'Url' ) ]: url,
					[ getAttrName( 'Width' ) ]: width,
					[ getAttrName( 'Height' ) ]: height,
				} )
			} }

			shape={ getValue( 'Shape' ) }
			onChangeShape={ value => setAttributes( { [ getAttrName( 'Shape' ) ]: value } ) }
			shapeFlipX={ getValue( 'ShapeFlipX' ) }
			onChangeShapeFlipX={ value => setAttributes( { [ getAttrName( 'ShapeFlipX' ) ]: value } ) }
			shapeFlipY={ getValue( 'ShapeFlipY' ) }
			onChangeShapeFlipY={ value => setAttributes( { [ getAttrName( 'ShapeFlipY' ) ]: value } ) }
			shapeStretch={ getValue( 'ShapeStretch' ) }
			onChangeShapeStretch={ value => setAttributes( { [ getAttrName( 'ShapeStretch' ) ]: value } ) }

			style={ getValue( 'Style' ) }
			onChangeStyle={ value => setAttributes( { [ getAttrName( 'Style' ) ]: value } ) }

			width={ getValue( 'Width' ) }
			tabletWidth={ getValue( 'TabletWidth' ) }
			mobileWidth={ getValue( 'MobileWidth' ) }
			onChangeWidth={ ( width, height ) => {
				setAttributes( {
					[ getAttrName( 'Width' ) ]: width,
					[ getAttrName( 'Height' ) ]: height,
				} )
			} }
			onChangeTabletWidth={ value => setAttributes( { [ getAttrName( 'TabletWidth' ) ]: value } ) }
			onChangeMobileWidth={ value => setAttributes( { [ getAttrName( 'MobileWidth' ) ]: value } ) }

			square={ getValue( 'Square' ) }
			onChangeSquare={ value => setAttributes( { [ getAttrName( 'Square' ) ]: value } ) }

			borderRadius={ getValue( 'BorderRadius' ) }
			onChangeBorderRadius={ value => setAttributes( { [ getAttrName( 'BorderRadius' ) ]: value } ) }

			shadow={ getValue( 'Shadow' ) }
			onChangeShadow={ value => setAttributes( { [ getAttrName( 'Shadow' ) ]: value } ) }

			blendMode={ getValue( 'BlendMode' ) }
			onChangeBlendMode={ value => setAttributes( { [ getAttrName( 'BlendMode' ) ]: value } ) }

			// linkUrl={ getValue( 'LinkUrl' ) }
			// linkNewTab={ getValue( 'LinkNewTab' ) }
			// linkNoFollow={ getValue( 'LinkNoFollow' ) }
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
