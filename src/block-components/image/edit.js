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
	ImageControl2,
	ImageFilterControl,
	ImageShapeControl,
	ImageSizeControl,
	InspectorStyleControls,
	PanelAdvancedSettings,
	ShadowControl,
	ColorPaletteControl,
	AdvancedToolbarControl,
	BlendModeControl,
	ControlSeparator,
	AdvancedTextControl,
} from '~stackable/components'
import {
	useBlockAttributesContext,
	useBlockSetAttributesContext,
	useDeviceType,
} from '~stackable/hooks'
import { getAttributeName } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { useSelect, select } from '@wordpress/data'
import { _x, __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { useMemo } from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'

// Note: image drop shadows do not accept negative spread.
const IMAGE_SHADOWS = [
	'none',
	'0px 0 1px rgba(120, 120, 120, 0.5)',
	'0px 0 2px rgba(120, 120, 120, 0.5)',
	'0px 5px 10px rgba(153, 153, 153, 0.35)',
	'0px 2px 20px rgba(153, 153, 153, 0.2)',
	'25px 10px 30px rgba(18, 63, 82, 0.3)',
	'0px 10px 30px rgba(0, 0, 0, 0.1)',
	'7px 5px 30px rgba(72, 73, 121, 0.15)',
	'0px 10px 60px rgba(0, 0, 0, 0.1)',
	'70px 60px 60px rgba(72, 73, 121, 0.2) ',
]

const Controls = props => {
	const attributes = useBlockAttributesContext( attributes => {
		return {
			imageId: attributes.imageId,
			imageAspectRatio: attributes.imageAspectRatio,
			imageWidthUnit: attributes.imageWidthUnit,
			imageHeightUnit: attributes.imageHeightUnit,
			imageWidth: attributes.imageWidth,
			imageHeight: attributes.imageHeight,
			imageWidthAttribute: attributes.imageWidthAttribute,
			imageHeightTablet: attributes[ getAttributeName( 'imageHeight', 'tablet' ) ],
			imageHeightMobile: attributes[ getAttributeName( 'imageHeight', 'mobile' ) ],
			imageHasLightbox: attributes.imageHasLightbox,
			imageSize: attributes.imageSize,
			imageAlt: attributes.imageAlt,
			imageOverlayColorType: attributes.imageOverlayColorType,
			imageUrl: attributes.imageUrl,
			imageShapeFlipX: attributes.imageShapeFlipX,
			imageShapeFlipY: attributes.imageShapeFlipY,
			imageShapeStretch: attributes.imageShapeStretch,
			imageShape: attributes.imageShape,
			imageFilter: attributes.imageFilter,
			imageExternalUrl: attributes.imageExternalUrl,
		}
	} )
	const setAttributes = useBlockSetAttributesContext()
	const deviceType = useDeviceType()

	// Get the width of the image block, this is needed for resizing the image
	// when replacing, and for resetting the width.
	const { getEditorDom } = useSelect( 'stackable/editor-dom' )
	const { clientId } = useBlockEditContext()
	const editorDom = getEditorDom?.() || undefined
	const isImageBlock = useMemo( () => {
		return select( 'core/block-editor' ).getBlockName( clientId ) === 'stackable/image'
	}, [ clientId ] )
	const imageBlockWidth = useMemo( () => {
		if ( editorDom ) {
			if ( isImageBlock ) {
				const blockEl = editorDom.querySelector( `[data-block="${ clientId }"]` )
				return blockEl?.clientWidth || undefined
			}
		}
		return undefined
	}, [ editorDom, isImageBlock, clientId ] )

	// Get the image size urls.
	const { imageData } = useSelect( select => {
		const image = select( 'core' ).getMedia( attributes.imageId )
		return { imageData: { ...image } }
	}, [ attributes.imageId ] )

	const borderRadiusSliderMax = useMemo( () => {
		if (
			attributes.imageWidthUnit === 'px' &&
			[ '', 'px' ].includes( attributes.imageHeightUnit )
		) {
			return ( Math.max( attributes.imageWidth, attributes.imageHeight ) || 200 ) / 2
		}

		if ( attributes.imageWidthUnit === 'px' ) {
			return attributes.imageWidth
		}

		if ( [ '', 'px' ].includes( attributes.imageHeightUnit ) ) {
			return ( ( attributes.imageHeight || 200 ) / 2 )
		}

		return 100
	}, [ attributes.imageWidth, attributes.imageWidthUnit, attributes.imageHeight, attributes.imageHeightUnit ] )

	return (
		<>
			{ applyFilters( 'stackable.block-component.image.before', null, props ) }
			{ props.hasSelector && (
				<ImageControl2 // TODO: add selected image size as a prop.
					label={ __( 'Select Image', i18n ) }
					allowedTypes={ [ 'image' ] }
					attribute="image"
					hasPanelModifiedIndicator={ false }
					onRemove={ () => setAttributes( {
						imageId: '',
						imageUrl: '',
						imageWidthAttribute: '',
						imageHeightAttribute: '',
						imageWidthUnit: '',
						imageHeightUnit: '',
					} ) }
					onChange={ image => {
						// Get the URL of the currently selected image size.
						let {
							url,
							width,
							height,
						} = image
						const currentSelectedSize = attributes.imageSize || 'full'
						if ( image.sizes?.[ currentSelectedSize ] ) {
							url = image.sizes?.[ currentSelectedSize ]?.url || url
							height = image.sizes?.[ currentSelectedSize ]?.height || height || ''
							width = image.sizes?.[ currentSelectedSize ]?.width || width || ''
						}

						const newAttributes = {
							imageId: image.id,
							imageUrl: url,
							imageWidthAttribute: width,
							imageHeightAttribute: height,
							imageExternalUrl: '',
							...( attributes.imageAlt ? {} : { imageAlt: image.alt || '' } ), // Only set the alt if it's empty.
						}

						// If the image being selected is smaller than the
						// current width of the image block, don't use 100%
						// because the image will look blurry, instead use the
						// actual width.
						if ( isImageBlock && imageBlockWidth && ! props.hasManuallyChangedDimensions ) {
							// When the image gets reset, we need to also reset
							// the width unit to '%' so that when we add another
							// image, the image would not be small
							newAttributes.imageWidth = ''
							newAttributes.imageWidthUnit = '%'
							// We need the width of the image block to compare
							if ( width < imageBlockWidth ) {
								newAttributes.imageWidth = width
								newAttributes.imageWidthUnit = 'px'
							}
						}

						setAttributes( newAttributes )
					} }
				/>
			) }
			<AdvancedTextControl
				label={ __( 'Image Url', i18n ) }
				attribute="imageExternalUrl"
				onChange={ text => {
					setAttributes( {
						imageExternalUrl: text,
						imageUrl: '',
						imageAlt: '',
						imageId: '',
						imageWidthAttribute: '',
						imageHeightAttribute: '',
					} )
				} }
			/>

			{ props.hasAspectRatio &&
				<AdvancedSelectControl
					label={ __( 'Aspect Ratio', i18n ) }
					attribute="imageAspectRatio"
					options={ [
						{ label: __( 'Original', i18n ), value: '' },
						{ label: __( 'Square 1:1', i18n ), value: '1/1' },
						{ label: __( 'Standard 4:3', i18n ), value: '4/3' },
						{ label: __( 'Classic 3:2', i18n ), value: '3/2' },
						{ label: __( 'Wide 16:9', i18n ), value: '16/9' },
						{ label: __( 'Cinematic 2:1', i18n ), value: '2/1' },
						{ label: __( 'Ultra Wide 3:1', i18n ), value: '3/1' },
						{ label: __( 'Panoramic 4:1', i18n ), value: '4/1' },
						{ label: __( 'Portrait 3:4', i18n ), value: '3/4' },
						{ label: __( 'Classic Portrait 2:3', i18n ), value: '2/3' },
						{ label: __( 'Tall 9:16', i18n ), value: '9/16' },
					] }
					responsive="all"
					// For blocks with fixed width like card block,
					// set the height to auto to allow the aspect ratio to take effect.
					onChange={ value => {
						const attrImageAspectRatio = getAttributeName( 'imageAspectRatio', deviceType )
						const attrImageHeight = getAttributeName( 'imageHeight', deviceType )
						const values = { [ attrImageAspectRatio ]: value }

						if ( value && props.hasHeight && !! attributes[ attrImageHeight ] ) {
							values[ attrImageHeight ] = ''
						}
						setAttributes( values )
					} }
				/>
			}

			{ props.hasWidth &&
				<AdvancedRangeControl
					label={ __( 'Width', i18n ) }
					attribute="imageWidth"
					units={ props.widthUnits }
					min={ props.widthMin }
					sliderMax={ props.widthMax }
					step={ props.widthStep }
					initialPosition={ 100 }
					allowReset={ true }
					// placeholder="250" // TODO: This should be referenced somewher instead of just a static number
					placeholder="auto"
					// Add a default value here so that the reset button will not appear.
					default={ ( () => {
						// We follow the logic in the override reset.
						if ( isImageBlock && deviceType === 'Desktop' ) {
							if ( attributes.imageWidthUnit === 'px' ) {
								if ( imageBlockWidth && attributes.imageWidthAttribute < imageBlockWidth ) {
									return attributes.imageWidthAttribute
								}
							}
						}
						return ''
					} )() }
					onChangeUnit={ ( unit, attributeName, oldUnit ) => {
						// When the unit is changed, we need to adjust the width
						// so that the image does not get distorted.
						if ( isImageBlock && deviceType === 'Desktop' ) {
							// Switching from % to px
							if ( oldUnit === '%' && unit === 'px' ) {
								// If image is too small, use the original image width
								if ( imageBlockWidth && attributes.imageWidthAttribute < imageBlockWidth ) {
									return setAttributes( {
										imageWidth: attributes.imageWidthAttribute,
										[ attributeName ]: unit,
									} )
								}
								// If the width is larger than the block width, reset to 100% / width of block
								if ( attributes.imageWidth === '' ) {
									return setAttributes( {
										imageWidth: imageBlockWidth,
										[ attributeName ]: unit,
									} )
								}
							// Switching from px to %
							} else if ( oldUnit === 'px' && unit === '%' ) {
								// If the image is larger than the block width, reset to 100%
								if ( imageBlockWidth && attributes.imageWidthAttribute > imageBlockWidth ) {
									return setAttributes( {
										imageWidth: '',
										[ attributeName ]: unit,
									} )
								}
								// If image goes past 100$, reset to 100%
								if ( attributes.imageWidth > 100 ) {
									return setAttributes( {
										imageWidth: '',
										[ attributeName ]: unit,
									} )
								}
							}
						}
						// Normal saving behavior.
						setAttributes( { [ attributeName ]: unit } )
					} }
					responsive="all"
					onOverrideReset={ () => {
						// When resetting and in desktop, adjust the width so that we get the right "reset" value. Logic:
						// - If the width is in px and the width attribute is set, use the original image with
						//   ...unless the image width is larger than the block width, then reset to 100%
						// - If the width is in %, and the image is smaller than the block, reset to the 'px' width
						//   ...or just reset to 100%
						if ( isImageBlock && deviceType === 'Desktop' ) {
							let newWidthAttribute = ''
							if ( attributes.imageWidthUnit === 'px' ) {
								if ( attributes.imageWidthAttribute ) {
									newWidthAttribute = attributes.imageWidthAttribute
								}
								if ( imageBlockWidth && attributes.imageWidthAttribute > imageBlockWidth ) {
									newWidthAttribute = ''
									// We need to do a 'set attribute' here.
									setAttributes( { imageWidthUnit: '%' } )
								}
							} else if ( attributes.imageWidthUnit === '%' ) {
								if ( imageBlockWidth && attributes.imageWidthAttribute < imageBlockWidth ) {
									newWidthAttribute = attributes.imageWidthAttribute
									// We need to do a 'set attribute' here.
									setAttributes( { imageWidthUnit: 'px' } )
								}
							}
							// Returning a value here overrides the reset into the new value
							return newWidthAttribute
						}
					} }
					helpTooltip={ {
						//TODO: Add a working video
						title: __( 'Image width', i18n ),
						description: __( 'Adjusts the image width', i18n ),
					} }
				/>
			}

			{ props.hasHeight &&
				<AdvancedRangeControl
					label={ __( 'Height', i18n ) }
					attribute="imageHeight"
					units={ props.heightUnits }
					min={ props.heightMin }
					sliderMax={ props.heightMax }
					step={ props.heightStep }
					allowReset={ true }
					placeholder=""
					responsive="all"
					helpTooltip={ {
						//TODO: Add a working video
						title: __( 'Image height', i18n ),
						description: __( 'Adjusts the image height', i18n ),
					} }
				/>
			}

			{ props.hasLightbox &&
				<AdvancedToggleControl
					label={ __( 'Open Image in Lightbox', i18n ) }
					attribute="imageHasLightbox"
				/>
			}

			{ props.hasAlt && (
				<ImageAltControl
					label={ __( 'Image Alt', i18n ) }
					value={ attributes.imageAlt }
					onChange={ imageAlt => setAttributes( { imageAlt } ) }
				/>
			) }

			<AdvancedRangeControl
				label={ __( 'Zoom', i18n ) }
				attribute="imageZoom"
				hover="all"
				min={ 0 }
				sliderMax={ 3 }
				step={ 0.01 }
				initialPosition={ 1 }
				allowReset={ true }
			/>

			{ props.hasShadow && (
				<ShadowControl
					options={ IMAGE_SHADOWS }
					attribute="imageShadow"
					hover="all"
					isFilter={ true }
					helpTooltip={ {
						video: 'image-shadow',
						title: __( 'Image Shadow', i18n ),
						description: __( 'Adjusts the intensity of the image shadow', i18n ),
					} }
				/>
			) }

			{ attributes.imageId && (
				<ImageSizeControl
					label={ __( 'Image Size', i18n ) }
					value={ attributes.imageSize }
					onChange={ imageSize => {
						const imageUrl = imageData.media_details?.sizes[ imageSize ]?.source_url || imageData.source_url
						const width = imageData.media_details?.sizes[ imageSize ]?.width || imageData.media_details?.width || ''
						const height = imageData.media_details?.sizes[ imageSize ]?.height || imageData.media_details?.height || ''
						setAttributes( {
							imageSize,
							imageUrl,
							imageWidthAttribute: width,
							imageHeightAttribute: height,
						} )
					} }
					defaultValue="full"
					helpTooltip={ {
						video: 'image-size',
						description: __( 'Sets the image display size to thumbnail, medium, large or full size. A smaller image size will also load faster.', i18n ),
					} }
				/>
			) }

			{ props.hasBorderRadius &&
				<AdvancedRangeControl
					label={ __( 'Border Radius', i18n ) }
					attribute="imageBorderRadius"
					min="0"
					sliderMax={ borderRadiusSliderMax }
					placeholder="0"
					defaultValue={ 0 }
					allowReset={ true }
					helpTooltip={ {
						video: 'image-border-radius',
						description: __( 'Adjusts the radius of image corners to make them more rounded', i18n ),
					} }
				/>
			}

			<ControlSeparator />

			<AdvancedToolbarControl
				controls={ [
					{
						value: '',
						title: __( 'Single', i18n ),
					},
					{
						value: 'gradient',
						title: __( 'Gradient', i18n ),
					},
				] }
				attribute="imageOverlayColorType"
				isSmall={ true }
			/>

			<ColorPaletteControl
				label={ __( 'Overlay Color', i18n ) }
				attribute="imageOverlayColor"
				hover="all"
				isGradient={ attributes.imageOverlayColorType === 'gradient' }
			/>
			<AdvancedRangeControl
				label={ __( 'Overlay Opacity', i18n ) }
				attribute="imageOverlayOpacity"
				hover="all"
				min={ 0 }
				max={ 1 }
				step={ 0.1 }
				placeholder="0.3"
			/>

			<BlendModeControl
				label={ __( 'Overlay Blend Mode', i18n ) }
				attribute="imageOverlayBlendMode"
				helpTooltip={ {
					// TODO: Add a working video
					description: __( 'Sets how the overlay color blends with the image', i18n ),
				} }
			/>

			<ControlSeparator />

			<AdvancedFocalPointControl
				attribute="imageFocalPoint"
				label={ __( 'Focal point', i18n ) }
				url={ props.src ? props.src : ( attributes.imageUrl || attributes.imageExternalUrl ) }
				responsive="all"
				hover="all"
			/>

			<AdvancedSelectControl
				label={ __( 'Image Fit', i18n ) }
				attribute="imageFit"
				options={ [
					{ label: __( 'Default', i18n ), value: '' },
					{ label: __( 'Contain', i18n ), value: 'contain' },
					{ label: __( 'Cover', i18n ), value: 'cover' },
					{ label: __( 'Fill', i18n ), value: 'fill' },
					{ label: __( 'None', i18n ), value: 'none' },
					{ label: __( 'Scale Down', i18n ), value: 'scale-down' },
				] }
				helpTooltip={ {
					video: 'image-size',
					description: __( 'Sets the fit to default, contain, cover, fill, none, and scale down. Image fit specifies how an image resizes in a container.', i18n ),

				} }
				responsive="all"
			/>

			{ props.hasShape &&
				<ButtonIconPopoverControl
					label={ __( 'Image Shape', i18n ) }
					onReset={ () => {
						setAttributes( {
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
						onChange={ imageShape => setAttributes( { imageShape } ) }
						helpTooltip={ {
							video: 'image-shape',
							title: __( 'Shape', i18n ),
							description: __( 'Change the shape of the image', i18n ),
						} }
					/>
					<AdvancedToggleControl
						label={ __( 'Flip Shape Horizontally', i18n ) }
						attribute="imageShapeFlipX"
					/>
					<AdvancedToggleControl
						label={ __( 'Flip Shape Vertically', i18n ) }
						attribute="imageShapeFlipY"
					/>
					<AdvancedToggleControl
						label={ __( 'Stretch Shape Mask', i18n ) }
						attribute="imageShapeStretch"
						defaultValue={ true }
					/>
				</ButtonIconPopoverControl>
			}

			<ButtonIconPopoverControl
				label={ __( 'Image Filter', i18n ) }
				popoverLabel=""
				onReset={ () => {
					setAttributes( { imageFilter: '' } )
				} }
				allowReset={ attributes.imageFilter }
			>
				<ImageFilterControl
					label={ __( 'Image Filter', i18n ) }
					attribute="imageFilter"
					hover="all"
				/>
			</ButtonIconPopoverControl>
		</>
	)
}

Controls.defaultProps = {
	hasAlt: true,
	hasWidth: true,
	hasSelector: true,
	hasShadow: true,
	widthUnits: [ 'px', '%', 'vw' ],
	widthMin: [ 0, 0, 0 ],
	widthMax: [ 1000, 100, 100 ],
	widthStep: [ 1, 1, 1 ],

	hasHeight: true,
	heightUnits: [ 'px', '%', 'vh' ],
	heightMin: [ 0, 0, 0 ],
	heightMax: [ 1000, 100, 100 ],
	heightStep: [ 1, 1, 1 ],

	hasAspectRatio: true,
	hasBorderRadius: true,
	hasShape: true,
}

export const Edit = props => {
	const imageShow = useBlockAttributesContext( attributes => attributes.imageShow )
	const setAttributes = useBlockSetAttributesContext()

	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ props.label }
				id="image"
				initialOpen={ props.initialOpen }
				hasToggle={ props.hasToggle }
				{ ...( props.hasToggle ? {
					checked: imageShow,
					onChange: imageShow => setAttributes( { imageShow } ),
				} : {} ) }
			>
				<Controls { ...props } />
			</PanelAdvancedSettings>

		</InspectorStyleControls>
	)
}

Edit.defaultProps = {
	initialOpen: false,
	label: __( 'Image', i18n ),
	hasToggle: false,
	hasAlt: true,
	hasWidth: true,
	hasSelector: true,
	hasShadow: true,
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

Edit.Controls = Controls
