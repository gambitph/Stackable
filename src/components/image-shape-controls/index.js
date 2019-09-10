/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import {
	ToggleControl,
} from '@wordpress/components'

/**
 * External dependencies
 */
import { ImageShapeControl } from '~stackable/components'
import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'
import { compose } from '@wordpress/compose'
import { withSelect } from '@wordpress/data'
import { getImageSize } from '~stackable/util'

const ImageShapeControls = props => {
	const imageSizeData = props.imageData ? getImageSize( props.imageData, props.imageSize || 'full' ) : null
	const isSquareImage = props.isSquareImage !== null ? props.isSquareImage :
		imageSizeData ? imageSizeData.width === imageSizeData.height : false

	return (
		<Fragment>
			{ props.onChangeShape &&
				<ImageShapeControl
					selected={ props.shape }
					onChange={ props.onChangeShape }
				/>
			}

			{ props.onChangeShapeStretch && ! [ '', 'square', 'circle' ].includes( props.shape ) &&
				<ToggleControl
					label={ __( 'Flip Shape Horizontally', i18n ) }
					checked={ props.shapeFlipX }
					onChange={ props.onChangeShapeFlipX }
				/>
			}

			{ props.onChangeShapeStretch && ! [ '', 'square', 'circle' ].includes( props.shape ) &&
				<ToggleControl
					label={ __( 'Flip Shape Vertically', i18n ) }
					checked={ props.shapeFlipY }
					onChange={ props.onChangeShapeFlipY }
				/>
			}

			{ props.onChangeShapeStretch && ! [ '', 'square' ].includes( props.shape ) && ! isSquareImage &&
				<ToggleControl
					label={ __( 'Stretch Shape Mask', i18n ) }
					checked={ props.shapeStretch }
					onChange={ props.onChangeShapeStretch }
				/>
			}
		</Fragment>
	)
}

ImageShapeControls.defaultProps = {
	// For detecting whether the image is square.
	imageId: '',
	imageSize: 'full',
	isSquareImage: null,

	shape: '',
	shapeFlipX: false,
	shapeFlipY: false,
	shapeStretch: false,
	onChangeShape: () => {},
	onChangeShapeFlipX: () => {},
	onChangeShapeFlipY: () => {},
	onChangeShapeStretch: () => {},
}

export default compose( [
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' )

		return {
			imageData: props.imageId ? getMedia( props.imageId ) : null,
		}
	} ),
] )( ImageShapeControls )
