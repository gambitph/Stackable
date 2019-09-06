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
import {
	AdvancedRangeControl,
	BlendModeControl,
	ControlSeparator,
	DesignControl,
	ImageControl,
	WhenResponsiveScreen,
	ImageSizeControl,
	ProControlButton,
} from '~stackable/components'
import {
	i18n,
	showProNotice,
} from 'stackable'

/**
 * WordPress dependencies
 */
import {
	RangeControl,
	ToggleControl,
	TextareaControl,
	ExternalLink,
} from '@wordpress/components'
import { __, sprintf } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { compose } from '@wordpress/compose'
import { withSelect } from '@wordpress/data'
import { getImageSize } from '~stackable/util'

const ImageControls = props => {
	// Find the maximum width for the width setting.
	const imageSizeData = getImageSize( props.imageData, props.size || 'full' )
	let widthMax = props.widthMax || 1000
	let heightMax = 0

	if ( props.onChangeSize ) {
		if ( imageSizeData ) {
			widthMax = imageSizeData.width
			heightMax = imageSizeData.height
		}
	}

	const isSquareImage = imageSizeData ? imageSizeData.width === imageSizeData.height : false

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
						width: '',
						height: '',
					} ) }
					onChange={ image => {
						// Get the URL of the currently selected image size.
						let {
							url,
							width,
							height,
						} = image
						const currentSelectedSize = props.size || 'full'
						if ( image.sizes[ currentSelectedSize ] ) {
							url = image.sizes[ currentSelectedSize ].url
							width = image.sizes[ currentSelectedSize ].width
							height = image.sizes[ currentSelectedSize ].height
						}

						props.onChangeImage( {
							id: image.id,
							url,
							width,
							height,
						} )
					} }
				/>
			}

			{ props.onChangeShape &&
				<DesignControl
					label={ __( 'Shape', i18n ) }
					selected={ props.shape }
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
					onChange={ props.onChangeShape }
				/>
			}

			{ props.onChangeShape && showProNotice && <ProControlButton type="image" /> }

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

			<ControlSeparator />

			{ props.onChangeAlt &&
				<TextareaControl
					label={ __( 'Alt Text (Alternative Text)', i18n ) }
					value={ props.alt }
					onChange={ props.onChangeAlt }
					help={
						<Fragment>
							<ExternalLink href="https://www.w3.org/WAI/tutorials/images/decision-tree">
								{ __( 'Describe the purpose of the image', i18n ) }
							</ExternalLink>
							{ __( 'Leave empty if the image is purely decorative.', i18n ) }
						</Fragment>
					}
				/>
			}

			{ props.onChangeSize &&
				<ImageSizeControl
					label={ __( 'Image Size', i18n ) }
					value={ props.size }
					onChange={ size => {
						const imageSizeData = getImageSize( props.imageData, size || 'full' )
						let width = ''
						let height = ''
						let url = props.url
						if ( imageSizeData ) {
							width = imageSizeData.width
							height = imageSizeData.height
							url = imageSizeData.source_url
						}
						props.onChangeSize( size, url, width, height )
					} }
				/>
			}

			{ props.onChangeWidth &&
				<Fragment>
					<WhenResponsiveScreen>
						<AdvancedRangeControl
							label={ __( 'Image Width', i18n ) }
							value={ props.width }
							max={ widthMax }
							onChange={ width => {
								// Reset back to default.
								// if ( ! width && widthMax ) {
								// 	props.onChangeWidth( widthMax, heightMax )
								// 	return
								// }
								const ratio = heightMax / widthMax
								props.onChangeWidth(
									width ? width : '',
									width ? parseInt( ratio * width, 10 ) : ''
								)
							} }
							allowReset={ true }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="tablet">
						<AdvancedRangeControl
							label={ __( 'Image Width', i18n ) }
							value={ props.tabletWidth }
							max={ widthMax }
							onChange={ props.onChangeTabletWidth }
							allowReset={ true }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="mobile">
						<AdvancedRangeControl
							label={ __( 'Image Width', i18n ) }
							value={ props.mobileWidth }
							max={ widthMax }
							onChange={ props.onChangeMobileWidth }
							allowReset={ true }
						/>
					</WhenResponsiveScreen>
				</Fragment>
			}

			{ props.onChangeBorderRadius && props.shape === '' &&
				<AdvancedRangeControl
					label={ __( 'Border Radius', i18n ) }
					value={ props.borderRadius }
					onChange={ props.onChangeBorderRadius }
					min={ 0 }
					max={ 100 }
					allowReset={ true }
				/>
			}

			{ props.onChangeShadow && props.shape === '' &&
				<RangeControl
					label={ __( 'Shadow / Outline', i18n ) }
					value={ props.shadow }
					onChange={ props.onChangeShadow }
					min={ 0 }
					max={ 9 }
					allowReset={ true }
				/>
			}

			{ props.onChangeBlendMode &&
				<BlendModeControl
					label={ __( 'Blend Mode', i18n ) }
					value={ props.blendMode }
					onChange={ props.onChangeBlendMode }
				/>
			}

			{ /* { props.onChangeLinkUrl && <ControlSeparator /> }

			{ props.onChangeLinkUrl &&
				<URLInputControl
					label={ __( 'Link / URL', i18n ) }
					value={ props.linkUrl }
					onChange={ props.onChangeLinkUrl }
					placeholder="http://"
				/>
			}
			{ props.onChangeLinkNewWindow && props.linkUrl &&
				<ToggleControl
					label={ __( 'Open link in new window', i18n ) }
					checked={ props.linkNewWindow }
					onChange={ props.onChangeLinkNewWindow }
				/>
			}
			{ props.onChangeLinkNoFollow && props.linkUrl &&
				<ToggleControl
					label={ __( 'Nofollow link', i18n ) }
					checked={ props.linkNoFollow }
					onChange={ props.onChangeLinkNoFollow }
				/>
			} */ }
		</Fragment>
	)
}

ImageControls.defaultProps = {
	id: '',
	url: '',
	onChangeImage: ( { url, id, width, height } ) => {}, // eslint-disable-line

	shape: '',
	onChangeShape: () => {},
	shapeStretch: '',
	onChangeShapeStretch: () => {},

	alt: '',
	onChangeAlt: () => {},

	size: 'large',
	onChangeSize: () => {},

	widthMax: 1000,
	width: '',
	tabletWidth: '',
	mobileWidth: '',
	onChangeWidth: () => {},
	onChangeTabletWidth: () => {},
	onChangeMobileWidth: () => {},

	borderRadius: '',
	onChangeBorderRadius: () => {},

	shadow: '',
	onChangeShadow: () => {},

	blendMode: '',
	onChangeBlendMode: () => {},

	// linkUrl: '',
	// linkNewWindow: '',
	// linkNoFollow: '',
	// onChangeLinkUrl: () => {},
	// onChangeLinkNewWindow: () => {},
	// onChangeLinkNoFollow: () => {},
}

export default compose(
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' )

		return {
			imageData: props.id ? getMedia( props.id ) : null,
		}
	} ),
)( ImageControls )
