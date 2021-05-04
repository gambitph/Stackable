/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	AdvancedFocalPointControl,
	AdvancedRangeControl,
	AdvancedSelectControl,
	AdvancedToggleControl,
	ButtonIconPopoverControl,
	ImageAltControl,
	ImageControl,
	ImageFilterControl,
	ImageShapeControl,
	ImageSizeControl,
	InspectorStyleControls,
	PanelAdvancedSettings,
	ResponsiveControl2,
	ShadowControl,
} from '~stackable/components'
import {
	useBlockAttributes, useBlockEl,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
import { useDispatch, useSelect } from '@wordpress/data'
import { __ } from '@wordpress/i18n'

export const Edit = props => {
	const {
		imageSelector = '.stk-img-wrapper',
	} = props

	const { clientId } = useBlockEditContext()

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const attributes = useBlockAttributes( clientId )
	const blockElImage = useBlockEl( imageSelector )

	// Get the image size urls.
	const { imageData } = useSelect( select => {
		const image = select( 'core' ).getMedia( attributes.imageId )
		return { imageData: { ...image } }
	}, [ attributes.imageId ] )

	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'Image', i18n ) }
				id="image"
			>
				<ImageControl
					label={ __( 'Select Image', i18n ) }
					allowedTypes={ [ 'image' ] }
					imageID={ attributes.imageId }
					imageURL={ attributes.imageUrl }
					onRemove={ () => updateBlockAttributes( clientId, { imageId: '', imageUrl: '' } ) }
					onChange={ image => {
						// Get the URL of the currently selected image size.
						let {
							url,
						} = image
						const currentSelectedSize = attributes.imageSize || 'full'
						if ( image.sizes[ currentSelectedSize ] ) {
							url = image.sizes[ currentSelectedSize ].url
						}
						updateBlockAttributes( clientId, { imageId: image.id, imageUrl: url } )
					} }
				/>

				{ props.hasWidth &&
					<ResponsiveControl2
						desktopProps={ {
							value: attributes.imageWidth,
							unit: attributes.imageWidthUnit,
							onChange: imageWidth => updateBlockAttributes( clientId, { imageWidth } ),
							onChangeUnit: imageWidth => updateBlockAttributes( clientId, { imageWidth } ),
						} }
						tabletProps={ {
							value: attributes.imageWidthTablet,
							unit: attributes.imageWidthUnitTablet,
							onChange: imageWidthTablet => updateBlockAttributes( clientId, { imageWidthTablet } ),
							onChangeUnit: imageWidthTablet => updateBlockAttributes( clientId, { imageWidthTablet } ),
						} }
						mobileProps={ {
							value: attributes.imageWidthMobile,
							unit: attributes.imageWidthUnitMobile,
							onChange: imageWidthMobile => updateBlockAttributes( clientId, { imageWidthMobile } ),
							onChangeUnit: imageWidthMobile => updateBlockAttributes( clientId, { imageWidthMobile } ),
						} }
					>
						<AdvancedRangeControl
							label={ __( 'Width', i18n ) }
							units={ props.widthUnits }
							min={ props.widthMin }
							sliderMax={ props.widthMax }
							step={ props.widthStep }
							initialPosition={ 100 }
							allowReset={ true }
						/>
					</ResponsiveControl2>
				}

				{ props.hasHeight &&
					<ResponsiveControl2
						desktopProps={ {
							value: attributes.imageHeight,
							unit: attributes.imageHeightUnit,
							onChange: imageHeight => updateBlockAttributes( clientId, { imageHeight } ),
							onChangeUnit: imageHeight => updateBlockAttributes( clientId, { imageHeight } ),
						} }
						tabletProps={ {
							value: attributes.imageHeightTablet,
							unit: attributes.imageHeightUnitTablet,
							onChange: imageHeightTablet => updateBlockAttributes( clientId, { imageHeightTablet } ),
							onChangeUnit: imageHeightTablet => updateBlockAttributes( clientId, { imageHeightTablet } ),
						} }
						mobileProps={ {
							value: attributes.imageHeightMobile,
							unit: attributes.imageHeightUnitMobile,
							onChange: imageHeightMobile => updateBlockAttributes( clientId, { imageHeightMobile } ),
							onChangeUnit: imageHeightMobile => updateBlockAttributes( clientId, { imageHeightMobile } ),
						} }
					>
						<AdvancedRangeControl
							label={ __( 'Height', i18n ) }
							units={ props.heightUnits }
							min={ props.heightMin }
							sliderMax={ props.heightMax }
							step={ props.heightStep }
							allowReset={ true }
							placeholderRender={ blockElImage
								? () => parseFloat( window.getComputedStyle( blockElImage.el() ).height )
								: null }
						/>
					</ResponsiveControl2>
				}

				<ImageAltControl
					label={ __( 'Image Alt', i18n ) }
					value={ attributes.imageAlt }
					onChange={ imageAlt => updateBlockAttributes( clientId, { imageAlt } ) }
				/>

				<AdvancedRangeControl
					label={ __( 'Zoom', i18n ) }
					value={ attributes.imageZoom }
					onChange={ imageZoom => updateBlockAttributes( clientId, { imageZoom } ) }
					min={ 0 }
					sliderMax={ 3 }
					step={ 0.01 }
					initialPosition={ 1 }
					allowReset={ true }
				/>

				<ShadowControl
					value={ attributes.imageShadow }
					onChange={ imageShadow => updateBlockAttributes( clientId, { imageShadow } ) }
				/>

				<ImageSizeControl
					label={ __( 'Image Size', i18n ) }
					value={ attributes.imageSize }
					onChange={ imageSize => {
						const imageUrl = imageData.media_details?.sizes[ imageSize ]?.source_url || imageData.source_url
						updateBlockAttributes( clientId, { imageSize, imageUrl } )
					} }
					defaultValue="full"
					className="ugb--help-tip-image-size"
				/>

				{ props.hasBorderRadius &&
					<AdvancedRangeControl
						label={ __( 'Border Radius', i18n ) }
						value={ attributes.imageBorderRadius }
						min="0"
						sliderMax="30"
						onChange={ imageBorderRadius => updateBlockAttributes( clientId, { imageBorderRadius } ) }
						placeholder="0"
						defaultValue={ 0 }
						allowReset={ true }
						className="ugb--help-tip-general-border-radius"
					/>
				}

				<ResponsiveControl2
					desktopProps={ {
						value: attributes.imageFocalPoint,
						onChange: imageFocalPoint => updateBlockAttributes( clientId, { imageFocalPoint: imageFocalPoint || undefined } ),
					} }
					tabletProps={ {
						value: attributes.imageFocalPointTablet,
						onChange: imageFocalPointTablet => updateBlockAttributes( clientId, { imageFocalPointTablet: imageFocalPointTablet || undefined } ),
					} }
					mobileProps={ {
						value: attributes.imageFocalPointMobile,
						onChange: imageFocalPointMobile => updateBlockAttributes( clientId, { imageFocalPointMobile: imageFocalPointMobile || undefined } ),
					} }
				>
					<AdvancedFocalPointControl
						label={ __( 'Focal point', i18n ) }
						url={ attributes.imageUrl }
					/>
				</ResponsiveControl2>

				<ResponsiveControl2
					desktopProps={ {
						value: attributes.imageFit,
						onChange: imageFit => updateBlockAttributes( clientId, { imageFit } ),
					} }
					tabletProps={ {
						value: attributes.imageFitTablet,
						onChange: imageFitTablet => updateBlockAttributes( clientId, { imageFitTablet } ),
					} }
					mobileProps={ {
						value: attributes.imageFitMobile,
						onChange: imageFitMobile => updateBlockAttributes( clientId, { imageFitMobile } ),
					} }
				>
					<AdvancedSelectControl
						label={ __( 'Image Fit', i18n ) }
						options={ [
							{ label: __( 'Default', i18n ), value: '' },
							{ label: __( 'Contain', i18n ), value: 'contain' },
							{ label: __( 'Cover', i18n ), value: 'cover' },
							{ label: __( 'Fill', i18n ), value: 'fill' },
							{ label: __( 'None', i18n ), value: 'none' },
							{ label: __( 'Scale Down', i18n ), value: 'scale-down' },
						] }
						className="ugb--help-tip-background-image-size"
					/>
				</ResponsiveControl2>

				{ props.hasShape &&
					<ButtonIconPopoverControl
						label={ __( 'Image Shape', i18n ) }
						onReset={ () => {
							updateBlockAttributes( clientId, {
								imageShape: '',
								imageShapeFlipX: '',
								imageShapeFlipY: '',
								imageShapeStretch: true,
							} )
						} }
						allowReset={
							attributes.imageShape ||
							attributes.imageShapeFlipX ||
							attributes.imageShapeFlipY ||
							! attributes.imageShapeStretch
						}
					>
						<ImageShapeControl
							selected={ attributes.imageShape }
							onChange={ imageShape => updateBlockAttributes( clientId, { imageShape } ) }
						/>
						<AdvancedToggleControl
							label={ __( 'Flip Shape Horizontally', i18n ) }
							checked={ attributes.imageShapeFlipX }
							onChange={ imageShapeFlipX => updateBlockAttributes( clientId, { imageShapeFlipX } ) }
						/>
						<AdvancedToggleControl
							label={ __( 'Flip Shape Vertically', i18n ) }
							checked={ attributes.imageShapeFlipY }
							onChange={ imageShapeFlipY => updateBlockAttributes( clientId, { imageShapeFlipY } ) }
						/>
						<AdvancedToggleControl
							label={ __( 'Stretch Shape Mask', i18n ) }
							checked={ attributes.imageShapeStretch }
							onChange={ imageShapeStretch => updateBlockAttributes( clientId, { imageShapeStretch } ) }
							defaultValue={ true }
						/>
					</ButtonIconPopoverControl>
				}

				<ButtonIconPopoverControl
					label={ __( 'Image Filter', i18n ) }
					onReset={ () => {
						updateBlockAttributes( clientId, { imageFilter: '' } )
					} }
					allowReset={ attributes.imageFilter }
				>
					<ImageFilterControl
						value={ attributes.imageFilter }
						onChange={ imageFilter => updateBlockAttributes( clientId, { imageFilter } ) }
					/>
				</ButtonIconPopoverControl>
			</PanelAdvancedSettings>

		</InspectorStyleControls>
	)
}

Edit.defaultProps = {
	hasWidth: true,
	widthUnits: [ 'px', '%', 'vw' ],
	widthMin: [ 0, 0, 0 ],
	widthMax: [ 1000, 100, 100 ],
	widthStep: [ 1, 1, 1 ],

	hasHeight: true,
	heightUnits: [ 'px', '%', 'vh' ],
	heightMin: [ 0, 0, 0 ],
	heightMax: [ 1000, 100, 100 ],
	heightStep: [ 1, 1, 1 ],

	hasBorderRadius: true,
	hasShape: true,
}
