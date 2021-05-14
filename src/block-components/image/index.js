import { addAttributes } from './attributes'
import { addStyles } from './style'
import { useImage } from './use-image'
import { Edit } from './edit'
import Image_ from './image'

import { useBlockAttributes } from '~stackable/hooks'
import { pickBy } from 'lodash'

import { useBlockEditContext } from '@wordpress/block-editor'

export const Image = props => {
	const {
		defaultWidth,
		defaultHeight,
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

		{ ...pickBy( propsToPass, v => v !== undefined ) }
	/>
}

Image.defaultProps = {
	defaultWidth: 150,
	defaultHeight: 300,
}

Image.Content = props => {
	const {
		attributes,
		...propsToPass
	} = props

	return <Image_.Content
		imageId={ attributes.imageId }
		imageURL={ attributes.imageUrl }
		alt={ attributes.imageAlt }
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

		shape={ attributes.imageShape }
		shapeStretch={ attributes.imageShapeStretch }
		shadow={ attributes.imageShadow }

		{ ...propsToPass }
	/>
}

Image.Content.defaultProps = {
	attributes: {},
}

Image.InspectorControls = Edit

Image.addAttributes = addAttributes

Image.addStyles = addStyles
