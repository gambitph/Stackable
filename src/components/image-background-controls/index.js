/**
 * External dependencies
 */
import {
	AdvancedSelectControl,
	AdvancedRangeControl,
	ImageControl,
	ImageSizeControl,
} from '~stackable/components'
import { cacheImageData, getImageUrlFromCache } from '~stackable/util'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'
import { compose } from '@wordpress/compose'
import { withSelect } from '@wordpress/data'

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
						// Get the URL of the currently selected image size.
						let {
							url,
						} = image
						const currentSelectedSize = props.size || 'full'
						if ( image.sizes[ currentSelectedSize ] ) {
							url = image.sizes[ currentSelectedSize ].url
						}
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
						props.onChangeSize(
							size,
							getImageUrlFromCache( props.id, size || 'full' ),
						)
					} }
				/>
			}

			{ props.onChangeBackgroundPosition &&
				<AdvancedSelectControl
					label={ __( 'Background Image Position', i18n ) }
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

			{ props.onChangeBackgroundRepeat &&
				<AdvancedSelectControl
					label={ __( 'Background Image Repeat', i18n ) }
					options={ [
						{ label: __( 'Default', i18n ), value: '' },
						{ label: __( 'No-Repeat', i18n ), value: 'no-repeat' },
						{ label: __( 'Repeat', i18n ), value: 'repeat' },
						{ label: __( 'Repeat-X', i18n ), value: 'repeat-x' },
						{ label: __( 'Repeat-Y', i18n ), value: 'repeat-y' },
					] }
					value={ props.backgroundRepeat }
					onChange={ props.onChangeBackgroundRepeat }
				/>
			}

			{ props.onChangeBackgroundSize &&
				<AdvancedSelectControl
					label={ __( 'Background Image Size', i18n ) }
					options={ [
						{ label: __( 'Default', i18n ), value: '' },
						{ label: __( 'Auto', i18n ), value: 'auto' },
						{ label: __( 'Cover', i18n ), value: 'cover' },
						{ label: __( 'Contain', i18n ), value: 'contain' },
						{ label: __( 'Custom', i18n ), value: 'custom' },
					] }
					value={ props.backgroundSize }
					onChange={ props.onChangeBackgroundSize }
				/>
			}

			{ props.onChangeBackgroundSize && props.backgroundSize === 'custom' &&
				<AdvancedRangeControl
					label={ __( 'Custom Size', i18n ) }
					units={ [ 'px', '%' ] }
					min={ [ 0, 0 ] }
					max={ [ 1000, 100 ] }
					unit={ props.backgroundCustomSizeUnit }
					onChangeUnit={ props.onChangeBackgroundCustomSizeUnit }
					value={ props.backgroundCustomSize }
					onChange={ props.onChangeBackgroundCustomSize }
					allowReset={ true }
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

	backgroundRepeat: '',
	onChangeBackgroundRepeat: () => {},

	backgroundSize: '',
	onChangeBackgroundSize: () => {},

	backgroundCustomSizeUnit: '',
	onChangeBackgroundCustomSizeUnit: () => {},
	backgroundCustomSize: '',
	onChangeBackgroundCustomSize: () => {},
}

export default compose(
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' )
		cacheImageData( props.id, select )

		return {
			imageData: props.id ? getMedia( props.id ) : null,
		}
	} ),
)( ImageBackgroundControls )
