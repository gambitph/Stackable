/**
 * External dependencies
 */
import {
	AdvancedRangeControl,
	BlendModeControl,
	ControlSeparator,
	ImageControl,
	ImageAltControl,
	WhenResponsiveScreen,
	ImageSizeControl,
	ImageShapeControls,
} from '~stackable/components'
import {
	i18n,
} from 'stackable'
import { getImageSize, cacheImageData } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'
import { compose } from '@wordpress/compose'
import { ToggleControl } from '@wordpress/components'
import { withSelect } from '@wordpress/data'

const ImageControls = props => {
	// Find the maximum width for the width setting.
	const imageSizeData = getImageSize( props.imageData, props.size || 'full' )
	let widthMax = props.widthMax || 1000
	let heightMax = 0

	if ( props.imageData && props.onChangeSize ) {
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
				<ImageShapeControls
					isSquareImage={ isSquareImage }
					shape={ props.shape }
					shapeFlipX={ props.shapeFlipX }
					shapeFlipY={ props.shapeFlipY }
					shapeStretch={ props.shapeStretch }
					onChangeShape={ props.onChangeShape }
					onChangeShapeFlipX={ props.onChangeShapeFlipX }
					onChangeShapeFlipY={ props.onChangeShapeFlipY }
					onChangeShapeStretch={ props.onChangeShapeStretch }
				/>
			}

			<ControlSeparator />

			{ props.onChangeAlt &&
				<ImageAltControl
					value={ props.alt }
					onChange={ props.onChangeAlt }
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
									typeof width === 'number' ? width : '',
									typeof width === 'number' ? parseInt( ratio * width, 10 ) : ''
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

			{ props.onChangeSquare && ( typeof props.width === 'number' || props.width ) &&
				<ToggleControl
					label={ __( 'Force square image', i18n ) }
					checked={ props.square }
					onChange={ props.onChangeSquare }
				/>
			}

			{ props.onChangeBorderRadius && props.shape === '' &&
				<AdvancedRangeControl
					label={ __( 'Border Radius', i18n ) }
					value={ props.borderRadius }
					onChange={ props.onChangeBorderRadius }
					min={ 0 }
					max={ 100 }
					allowReset={ true }
					placeholder="0"
				/>
			}

			{ props.onChangeShadow && props.shape === '' &&
				<AdvancedRangeControl
					label={ __( 'Shadow / Outline', i18n ) }
					value={ props.shadow }
					onChange={ props.onChangeShadow }
					min={ 0 }
					max={ 9 }
					allowReset={ true }
					placeholder="0"
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
			{ props.onChangeLinkNewTab && props.linkUrl &&
				<ToggleControl
					label={ __( 'Open link in new tab', i18n ) }
					checked={ props.linkNewTab }
					onChange={ props.onChangeLinkNewTab }
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
	square: '',
	onChangeSquare: () => {},

	borderRadius: '',
	onChangeBorderRadius: () => {},

	shadow: '',
	onChangeShadow: () => {},

	blendMode: '',
	onChangeBlendMode: () => {},

	// linkUrl: '',
	// linkNewTab: '',
	// linkNoFollow: '',
	// onChangeLinkUrl: () => {},
	// onChangeLinkNewTab: () => {},
	// onChangeLinkNoFollow: () => {},
}

export default compose(
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' )
		cacheImageData( props.id, select )

		return {
			imageData: props.id ? getMedia( props.id ) : null,
		}
	} ),
)( ImageControls )
