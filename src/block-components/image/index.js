/**
 * Internal dependencies
 */
import { addAttributes } from './attributes'
import { Style } from './style'
import { useImage } from './use-image'
import { Edit } from './edit'
import Image_ from './image'

/**
 * External dependencies
 */
import { useBlockAttributesContext, useBlockContext } from '~stackable/hooks'
import { pickBy } from 'lodash'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
import { applyFilters } from '@wordpress/hooks'

export const Image = props => {
	const {
		defaultWidth,
		defaultHeight: _defaultHeight,
		...propsToPass
	} = props

	const { isSelected } = useBlockEditContext()
	const attributes = useBlockAttributesContext( attributes => {
		return {
			imageOverlayColorType: attributes.imageOverlayColorType,
			imageOverlayColorHover: attributes.imageOverlayColorHover,
			imageOverlayColorParentHover: attributes.imageOverlayColorParentHover,
			imageOverlayColor2Hover: attributes.imageOverlayColor2Hover,
			imageOverlayColor2ParentHover: attributes.imageOverlayColor2ParentHover,
			imageOverlayOpacityHover: attributes.imageOverlayOpacityHover,
			imageOverlayOpacityParentHover: attributes.imageOverlayOpacityParentHover,
			imageOverlayGradientLocation1Hover: attributes.imageOverlayGradientLocation1Hover,
			imageOverlayGradientLocation1ParentHover: attributes.imageOverlayGradientLocation1ParentHover,
			imageOverlayGradientLocation2Hover: attributes.imageOverlayGradientLocation2Hover,
			imageOverlayGradientLocation2ParentHover: attributes.imageOverlayGradientLocation2ParentHover,
			imageOverlayGradientDirectionHover: attributes.imageOverlayGradientDirectionHover,
			imageOverlayGradientDirectionParentHover: attributes.imageOverlayGradientDirectionParentHover,
			imageId: attributes.imageId,
			imageUrl: attributes.imageUrl,
			imageSize: attributes.imageSize,
			imageWidth: attributes.imageWidth,
			imageWidthTablet: attributes.imageWidthTablet,
			imageWidthMobile: attributes.imageWidthMobile,
			imageWidthUnit: attributes.imageWidthUnit,
			imageWidthUnitTablet: attributes.imageWidthUnitTablet,
			imageWidthUnitMobile: attributes.imageWidthUnitMobile,
			imageHeight: attributes.imageHeight,
			imageHeightTablet: attributes.imageHeightTablet,
			imageHeightMobile: attributes.imageHeightMobile,
			imageHeightUnit: attributes.imageHeightUnit,
			imageHeightUnitTablet: attributes.imageHeightUnitTablet,
			imageHeightUnitMobile: attributes.imageHeightUnitMobile,
			imageHasLightbox: attributes.imageHasLightbox,
			imageShape: attributes.imageShape,
			imageShapeStretch: attributes.imageShapeStretch,
			imageShadow: attributes.imageShadow,
		}
	} )
	const { parentBlock } = useBlockContext()

	const { setImage } = useImage()

	const defaultHeight = _defaultHeight === 'auto' ? 'auto' : _defaultHeight !== undefined ? _defaultHeight : ''

	const enableHandlers = applyFilters( 'stackable.image.enable-handlers', true, parentBlock )

	const hasHoverOverlay = attributes.imageOverlayColorType === 'gradient' &&
		( attributes.imageOverlayColorHover || attributes.imageOverlayColorParentHover ||
		attributes.imageOverlayColor2Hover || attributes.imageOverlayColor2ParentHover ||
		attributes.imageOverlayOpacityHover || attributes.imageOverlayOpacityParentHover ||
		attributes.imageOverlayGradientLocation1Hover || attributes.imageOverlayGradientLocation1ParentHover ||
		attributes.imageOverlayGradientLocation2Hover || attributes.imageOverlayGradientLocation2ParentHover ||
		attributes.imageOverlayGradientDirectionHover || attributes.imageOverlayGradientDirectionParentHover )

	return <Image_
		{ ...setImage }
		showHandles={ enableHandlers && isSelected }

		imageId={ attributes.imageId }
		imageURL={ attributes.imageUrl }
		size={ attributes.imageSize }
		src={ attributes.imageUrl }

		width={ attributes.imageWidth || defaultWidth }
		widthTablet={ attributes.imageWidthTablet }
		widthMobile={ attributes.imageWidthMobile }
		widthUnit={ attributes.imageWidthUnit || '%' }
		widthUnitTablet={ attributes.imageWidthUnitTablet }
		widthUnitMobile={ attributes.imageWidthUnitMobile }

		height={ attributes.imageHeight || defaultHeight }
		heightTablet={ attributes.imageHeightTablet }
		heightMobile={ attributes.imageHeightMobile }
		heightUnit={ attributes.imageHeightUnit || 'px' }
		heightUnitTablet={ attributes.imageHeightUnitTablet }
		heightUnitMobile={ attributes.imageHeightUnitMobile }

		shape={ attributes.imageShape }
		shapeStretch={ attributes.imageShapeStretch }
		shadow={ attributes.imageShadow }

		hasGradientOverlay={ hasHoverOverlay }
		hasLightbox={ attributes.imageHasLightbox }

		defaultWidth={ props.defaultWidth }
		defaultHeight={ props.defaultHeight }

		{ ...pickBy( propsToPass, v => v !== undefined ) }
	/>
}

Image.defaultProps = {
	defaultWidth: 150,
	defaultHeight: 300,
	enableHandles: true,
	showTooltips: false,
}

Image.Content = props => {
	const {
		defaultWidth,
		defaultHeight: _defaultHeight,
		attributes,
		src,
		alt,
		width,
		...propsToPass
	} = props

	const defaultHeight = _defaultHeight === 'auto' && attributes.imageUrl ? 'auto' : 300

	const hasHoverOverlay = attributes.imageOverlayColorType === 'gradient' &&
		( attributes.imageOverlayColorHover || attributes.imageOverlayColorParentHover ||
		attributes.imageOverlayColor2Hover || attributes.imageOverlayColor2ParentHover ||
		attributes.imageOverlayOpacityHover || attributes.imageOverlayOpacityParentHover ||
		attributes.imageOverlayGradientLocation1Hover || attributes.imageOverlayGradientLocation1ParentHover ||
		attributes.imageOverlayGradientLocation2Hover || attributes.imageOverlayGradientLocation2ParentHover ||
		attributes.imageOverlayGradientDirectionHover || attributes.imageOverlayGradientDirectionParentHover )

	return <Image_.Content
		imageId={ attributes.imageId }
		imageURL={ attributes.imageUrl }
		alt={ alt || attributes.imageAlt }
		size={ attributes.imageSize }
		src={ src || attributes.imageUrl }

		width={ width || attributes.imageWidthAttribute || attributes.imageWidth || defaultWidth }
		height={ attributes.imageHeightAttribute || attributes.imageHeight || defaultHeight }

		shape={ attributes.imageShape }
		shapeStretch={ attributes.imageShapeStretch }
		shadow={ attributes.imageShadow }

		hasGradientOverlay={ hasHoverOverlay }
		hasLightbox={ attributes.imageHasLightbox }

		{ ...propsToPass }
	/>
}

Image.Content.defaultProps = {
	attributes: {},
	defaultWidth: 150,
	defaultHeight: 300,
}

Image.InspectorControls = Edit

Image.addAttributes = addAttributes

Image.Style = Style
