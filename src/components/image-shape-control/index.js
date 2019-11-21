
/**
 * Internal dependencies
 */
import ImageShapeDefault from './images/default.png'
import ImageShapeSquare from './images/square.png'
import ImageShapeCircle from './images/circle.png'
import ImageShapeBlob1 from './images/blob1.png'

/**
 * External dependencies
 */
import { i18n, showProNotice } from 'stackable'
import { DesignControl, ProControlButton } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { __, sprintf } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'

const ImageShapeControl = props => {
	return (
		<Fragment>
			<DesignControl
				className="ugb-image-shape-control"
				{ ...props }
				options={ [
					{
						label: __( 'Default', i18n ), value: '', image: ImageShapeDefault,
					},
					{
						label: __( 'Square', i18n ), value: 'square', image: ImageShapeSquare,
					},
					{
						label: __( 'Circle', i18n ), value: 'circle', image: ImageShapeCircle,
					},
					{
						label: sprintf( __( 'Blob %s', i18n ), 1 ), value: 'blob1', image: ImageShapeBlob1,
					},
					...applyFilters( 'stackable.image.control.shapes', [] ),
				] }
			/>
			{ showProNotice && <ProControlButton type="image" /> }
		</Fragment>
	)
}

ImageShapeControl.defaultProps = {
	label: __( 'Shape', i18n ),
	selected: '',
}

export default ImageShapeControl
