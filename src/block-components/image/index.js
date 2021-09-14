import { addAttributes } from './attributes'
import { Style } from './style'
import { useImage } from './use-image'
import { Edit } from './edit'
import Image_ from './image'

import { useBlockAttributes, useBlockContext } from '~stackable/hooks'
import { pickBy } from 'lodash'

import { useBlockEditContext } from '@wordpress/block-editor'
import { useState, useEffect } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'

export const Image = props => {
	const {
		defaultWidth,
		defaultHeight: _defaultHeight,
		...propsToPass
	} = props

	const { clientId, isSelected } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )
	const { parentBlock } = useBlockContext()

	const { setImage } = useImage()

	const defaultHeight = _defaultHeight === 'auto' && attributes.imageUrl ? 'auto' : 300

	const enableHandlers = applyFilters( 'stackable.image.enable-handlers', true, parentBlock )

	// Enable editing of the image only when the current block that implements
	// it is selected. We need to use setTimeout since the isSelected is
	// changed earlier.
	const [ debouncedIsSelected, setDebouncedIsSelected ] = useState( false )
	useEffect( () => {
		if ( ! isSelected ) {
			setDebouncedIsSelected( false )
			return
		}
		const t = setTimeout( () => {
			if ( isSelected ) {
				setDebouncedIsSelected( isSelected )
			}
		}, 1 )
		return () => clearTimeout( t )
	}, [ isSelected ] )

	return <Image_
		{ ...setImage }
		enableClickToEdit={ debouncedIsSelected }
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

		{ ...pickBy( propsToPass, v => v !== undefined ) }
	/>
}

Image.defaultProps = {
	defaultWidth: 150,
	defaultHeight: 300,
	enableHandles: true,
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
