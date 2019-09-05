/**
 * External dependencies
 */
import {
	AdvancedSelectControl,
	ImageControl,
	ImageSizeControl,
} from '~stackable/components'
import {
	i18n,
} from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'
import { compose } from '@wordpress/compose'
import { withSelect } from '@wordpress/data'
import { getImageSize } from '~stackable/util'

const ImageBackgroundControls = props => {
	return (
		<Fragment>
			{ props.onChangeImage &&
				<ImageControl
					label={ __( 'Image', i18n ) }
					imageID={ props.id }
					imageURL={ props.url }
					onRemove={ () => props.onChangeImage( {
						url: '',
						id: '',
					} ) }
					onChange={ image => {
						const currentSelectedSize = props.size || 'full'
						const url = image.sizes[ currentSelectedSize ] ? image.sizes[ currentSelectedSize ].url : image.url

						props.onChangeImage( {
							id: image.id,
							url,
						} )
					} }
				/>
			}

			{ props.onChangeSize &&
				<ImageSizeControl
					label={ __( 'Image Size', i18n ) }
					value={ props.size }
					onChange={ size => {
						const imageSizeData = getImageSize( props.imageData, size || 'full' )
						const url = imageSizeData ? imageSizeData.source_url : props.url
						props.onChangeSize( size, url )
					} }
				/>
			}

			{ props.onChangeBackgroundPosition &&
				<AdvancedSelectControl
					label={ __( 'Image Position', i18n ) }
					options={ [
						{ label: __( 'Default', i18n ), value: '' },
						{ label: __( 'Top Left', i18n ), value: 'top left' },
						{ label: __( 'Top Center', i18n ), value: 'top center' },
						{ label: __( 'Top Right', i18n ), value: 'top right' },
						{ label: __( 'Center Left', i18n ), value: 'center left' },
						{ label: __( 'Center Center', i18n ), value: 'center center' },
						{ label: __( 'Center Right', i18n ), value: 'center right' },
						{ label: __( 'Bottom Left', i18n ), value: 'bottom left' },
						{ label: __( 'Bottom Center', i18n ), value: 'bottom center' },
						{ label: __( 'Bottom Right', i18n ), value: 'bottom right' },
					] }
					value={ props.backgroundPosition }
					onChange={ props.onChangeBackgroundPosition }
				/>
			}
		</Fragment>
	)
}

ImageBackgroundControls.defaultProps = {
	id: '',
	url: '',
	onChangeImage: ( { url, id } ) => {}, // eslint-disable-line

	size: '',
	onChangeSize: () => {},

	backgroundPosition: '',
	onChangeBackgroundPosition: () => {},
}

export default compose(
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' )

		return {
			imageData: props.id ? getMedia( props.id ) : null,
		}
	} ),
)( ImageBackgroundControls )
