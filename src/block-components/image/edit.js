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
} from '~stackable/components'
import {
	useBlockAttributes,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
import { useDispatch, useSelect } from '@wordpress/data'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { useMemo } from '@wordpress/element'

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
	const { clientId } = useBlockEditContext()

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const attributes = useBlockAttributes( clientId )

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
					onRemove={ () => updateBlockAttributes( clientId, {
						imageId: '',
						imageUrl: '',
						imageWidthAttribute: '',
						imageHeightAttribute: '',
						imageAlt: '',
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
						updateBlockAttributes( clientId, {
							imageId: image.id,
							imageUrl: url,
							imageWidthAttribute: width,
							imageHeightAttribute: height,
							imageAlt: image.alt || '',
						} )
					} }
				/>
			) }

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
					placeholder="250" // TODO: This should be referenced somewher instead of just a static number
					responsive="all"
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
				/>
			}

			{ props.hasAlt && (
				<ImageAltControl
					label={ __( 'Image Alt', i18n ) }
					value={ attributes.imageAlt }
					onChange={ imageAlt => updateBlockAttributes( clientId, { imageAlt } ) }
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
						updateBlockAttributes( clientId, {
							imageSize,
							imageUrl,
							imageWidthAttribute: width,
							imageHeightAttribute: height,
						} )
					} }
					defaultValue="full"
					className="ugb--help-tip-image-size"
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
					className="ugb--help-tip-general-border-radius"
				/>
			}

			<ColorPaletteControl
				label={ __( 'Overlay Color', i18n ) }
				attribute="imageOverlayColor"
				hover="all"
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

			<AdvancedFocalPointControl
				attribute="imageFocalPoint"
				label={ __( 'Focal point', i18n ) }
				url={ props.src ? props.src : attributes.imageUrl }
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
				className="ugb--help-tip-background-image-size"
				responsive="all"
			/>

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
					updateBlockAttributes( clientId, { imageFilter: '' } )
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

	hasBorderRadius: true,
	hasShape: true,
}

export const Edit = props => {
	const { clientId } = useBlockEditContext()

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const attributes = useBlockAttributes( clientId )

	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ props.label }
				id="image"
				initialOpen={ props.initialOpen }
				{ ...( props.hasToggle ? {
					checked: attributes.imageShow,
					onChange: imageShow => updateBlockAttributes( clientId, { imageShow } ),
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
