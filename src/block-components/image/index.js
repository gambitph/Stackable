import { attributes } from './attributes'
import { addStyles } from './style'
import { useImage } from './use-image'
import Image_ from './image'

import { useBlockAttributes } from '~stackable/hooks'

import { useBlockEditContext } from '@wordpress/block-editor'

export const Image = props => {
	const {
		...propsToPass
	} = props

	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )

	const { setImage } = useImage()

	return <Image_
		{ ...setImage }

		imageId={ attributes.imageId }
		imageURL={ attributes.imageUrl }
		size={ attributes.imageSize }
		src={ attributes.imageUrl }

		width={ attributes.imageWidth || 150 }
		widthTablet={ attributes.imageWidthTablet }
		widthMobile={ attributes.imageWidthMobile }
		widthUnit={ attributes.imageWidthUnit || '%' }
		widthUnitTablet={ attributes.imageWidthUnitTablet }
		widthUnitMobile={ attributes.imageWidthUnitMobile }

		height={ attributes.imageHeight || 300 }
		heightTablet={ attributes.imageHeightTablet }
		heightMobile={ attributes.imageHeightMobile }
		heightUnit={ attributes.imageHeightUnit || 'px' }
		heightUnitTablet={ attributes.imageHeightUnitTablet }
		heightUnitMobile={ attributes.imageHeightUnitMobile }

		{ ...propsToPass }
	/>
}

Image.defaultProps = {
}

Image.Content = props => {
	const {
		attributes,
		...propsToPass
	} = props

	return <Image_.Content
		imageId={ attributes.imageId }
		imageURL={ attributes.imageUrl }
		size={ attributes.imageSize }
		src={ attributes.imageUrl }

		width={ attributes.imageWidth || 150 }
		widthTablet={ attributes.imageWidthTablet }
		widthMobile={ attributes.imageWidthMobile }
		widthUnit={ attributes.imageWidthUnit || '%' }
		widthUnitTablet={ attributes.imageWidthUnitTablet }
		widthUnitMobile={ attributes.imageWidthUnitMobile }

		height={ attributes.imageHeight || 300 }
		heightTablet={ attributes.imageHeightTablet }
		heightMobile={ attributes.imageHeightMobile }
		heightUnit={ attributes.imageHeightUnit || 'px' }
		heightUnitTablet={ attributes.imageHeightUnitTablet }
		heightUnitMobile={ attributes.imageHeightUnitMobile }

		{ ...propsToPass }
	/>
}

Image.Content.defaultProps = {
	attributes: {},
}

Image.InspectorControls = null

Image.attributes = attributes

Image.addStyles = addStyles
