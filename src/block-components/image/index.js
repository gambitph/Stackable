/**
 * Internal dependencies
 */
import { addAttributes } from './attributes'
import { addStyles } from './style'
import { useImage } from './use-image'
import { Edit } from './edit'
import Image_ from './image'

/**
 * External dependencies
 */
import { useBlockAttributesContext } from '~stackable/hooks'
import { pickBy } from 'lodash'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
import { applyFilters } from '@wordpress/hooks'
import { useSelect } from '@wordpress/data'

export { deprecationImageOverlayOpacity } from './deprecated'

export const Image = props => {
	const {
		defaultWidth,
		defaultHeight: _defaultHeight,
		...propsToPass
	} = props

	const { isSelected, clientId } = useBlockEditContext()
	const attributes = useBlockAttributesContext( attributes => {
		return {
			imageOverlayColorType: attributes.imageOverlayColorType,
			imageOverlayColorHover: attributes.imageOverlayColorHover,
			imageOverlayColorParentHover: attributes.imageOverlayColorParentHover,
			imageOverlayOpacityHover: attributes.imageOverlayOpacityHover,
			imageOverlayOpacityParentHover: attributes.imageOverlayOpacityParentHover,
			imageOverlayGradientLocation1Hover: attributes.imageOverlayGradientLocation1Hover,
			imageOverlayGradientLocation1ParentHover: attributes.imageOverlayGradientLocation1ParentHover,
			imageOverlayGradientLocation2Hover: attributes.imageOverlayGradientLocation2Hover,
			imageOverlayGradientLocation2ParentHover: attributes.imageOverlayGradientLocation2ParentHover,
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
			imageExternalUrl: attributes.imageExternalUrl,
			figcaption: attributes.figcaptionText,
			figcaptionShow: attributes.figcaptionShow,
		}
	} )
	const { parentBlock } = useSelect( select => {
		const { getBlockRootClientId, getBlock } = select( 'core/block-editor' )
		const parentClientId = getBlockRootClientId( clientId )
		return {
			parentBlock: getBlock( parentClientId ),
		}
	}, [ clientId ] )

	const { setImage } = useImage()

	const defaultHeight = _defaultHeight === 'auto' ? 'auto' : _defaultHeight !== undefined ? _defaultHeight : ''

	const enableHandlers = applyFilters( 'stackable.image.enable-handlers', true, parentBlock )

	const hasHoverOverlay = attributes.imageOverlayColorType === 'gradient' &&
		( attributes.imageOverlayColorHover || attributes.imageOverlayColorParentHover ||
		attributes.imageOverlayOpacityHover || attributes.imageOverlayOpacityParentHover )

	return <Image_
		{ ...setImage }
		showHandles={ enableHandlers && isSelected }

		imageId={ attributes.imageId }
		imageURL={ attributes.imageUrl }
		size={ attributes.imageSize }
		src={ attributes.imageUrl || attributes.imageExternalUrl }

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

		figcaption={ attributes.figcaption }
		figcaptionShow={ attributes.figcaptionShow }
		figcaptionClassnames={ props.figcaptionClassnames }

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
		attributes.imageOverlayOpacityHover || attributes.imageOverlayOpacityParentHover )

	return <Image_.Content
		imageId={ attributes.imageId }
		imageURL={ attributes.imageUrl }
		alt={ alt || attributes.imageAlt }
		showEmptyAlt={ attributes.imageShowEmptyAlt }
		size={ attributes.imageSize }
		src={ src || attributes.imageUrl || attributes.imageExternalUrl }

		width={ width || attributes.imageWidthAttribute || attributes.imageWidth || defaultWidth }
		height={ attributes.imageHeightAttribute || attributes.imageHeight || defaultHeight }

		shape={ attributes.imageShape }
		shapeStretch={ attributes.imageShapeStretch }
		shadow={ attributes.imageShadow }

		hasGradientOverlay={ hasHoverOverlay }
		hasLightbox={ attributes.imageHasLightbox }

		figcaption={ attributes.figcaptionText }
		figcaptionShow={ attributes.figcaptionShow }
		figcaptionClassnames={ props.figcaptionClassnames }

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

Image.addStyles = addStyles
