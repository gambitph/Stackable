/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	AdvancedToolbarControl,
	AdvancedSelectControl,
	BlendModeControl,
	ButtonIconPopoverControl,
	ColorPaletteControl,
	ControlSeparator,
	AdvancedToggleControl,
	AdvancedRangeControl,
	ImageControl2,
} from '~stackable/components'
import {
	useAttributeEditHandlers,
	useDeviceType,
	useBlockSetAttributesContext,
	useBlockHoverState,
} from '~stackable/hooks'
import { getAttributeName, urlIsVideo } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
// import { GradientPicker } from '@wordpress/components'
import {
	__, _x, sprintf,
} from '@wordpress/i18n'

const COLOR_TYPE_CONTROLS = [
	{
		value: '',
		title: __( 'Single', i18n ),
	},
	{
		value: 'gradient',
		title: __( 'Gradient', i18n ),
	},
]

const IMAGE_AND_VIDEO_TYPES = [ 'image', 'video' ]
const IMAGE_TYPES = [ 'image' ]

// TODO: Post v3, add option to select the image size for the background (full, large, medium)
export const BackgroundControls = props => {
	const deviceType = useDeviceType()

	const {
		getAttribute,
		getAttributes,
		updateAttributes,
		getAttrName,
	} = useAttributeEditHandlers( props.attrNameTemplate )

	const setAttributes = useBlockSetAttributesContext()
	const [ currentHoverState ] = useBlockHoverState()

	const hasBackgroundMedia = getAttribute( 'backgroundMediaUrl' ) || getAttribute( 'backgroundMediaUrlTablet' ) || getAttribute( 'backgroundMediaUrlMobile' )
	const isBackgroundVideo = () => {
		return [ getAttribute( 'backgroundMediaUrl' ), getAttribute( 'backgroundMediaUrlTablet' ), getAttribute( 'backgroundMediaUrlMobile' ) ]
			.filter( value => value )
			.filter( urlIsVideo )
			.length > 0
	}

	return (
		<Fragment>
			{ /* <GradientPicker
				value={ getAttrName( 'backgroundColorGradient' ) }
				onChange={ value => console.log( value ) }
				gradients={ [
					{
						name: 'JShine',
						gradient:
							'linear-gradient(135deg,#12c2e9 0%,#c471ed 50%,#f64f59 100%)',
						slug: 'jshine',
					},
					{
						name: 'Moonlit Asteroid',
						gradient:
							'linear-gradient(135deg,#0F2027 0%, #203A43 0%, #2c5364 100%)',
						slug: 'moonlit-asteroid',
					},
					{
						name: 'Rastafarie',
						gradient:
							'linear-gradient(135deg,#1E9600 0%, #FFF200 0%, #FF0000 100%)',
						slug: 'rastafari',
					},
				] }
			/> */ }
			{ props.hasGradient &&
				<AdvancedToolbarControl
					controls={ COLOR_TYPE_CONTROLS }
					attribute={ getAttrName( 'backgroundColorType' ) }
					fullwidth={ false }
					isSmall={ true }
				/>
			}
			<ColorPaletteControl
				label={
					getAttribute( 'backgroundColorType' ) === 'gradient'
						? sprintf( _x( '%s #%d', 'option title', i18n ), __( 'Background Color', i18n ), 1 )
						: __( 'Background Color', i18n )
				}
				attribute={ getAttrName( 'backgroundColor' ) }
				onChange={ value => {
					const attributes = {
						[ getAttrName( 'backgroundColor', 'desktop', currentHoverState ) ]: value,
					}

					if ( props.onBackgroundEnableAttribute ) {
						attributes[ props.onBackgroundEnableAttribute ] = true
					}

					setAttributes( attributes )
				} }
				hasTransparent={ true }
				hover={ getAttribute( 'backgroundColorType' ) !== 'gradient' ? 'all' : false }
			/>
			{ getAttribute( 'backgroundColorType' ) !== 'gradient' && ( ! getAttribute( 'backgroundMediaUrl' ) && ! getAttribute( 'backgroundMediaUrlTablet' ) && ! getAttribute( 'backgroundMediaUrlMobile' ) ) && (
				<AdvancedRangeControl
					label={ __( 'Background Color Opacity', i18n ) }
					attribute={ getAttrName( 'backgroundColorOpacity' ) }
					hover="all"
					min={ 0 }
					max={ 1 }
					step={ 0.1 }
					allowReset={ true }
					placeholder="1.0"
					helpTooltip={ {
						video: 'background-color-opacity',
						description: __( 'Adjusts the transparency of the background color', i18n ),
					} }
				/>
			) }
			{ getAttribute( 'backgroundColorType' ) === 'gradient' && (
				<ColorPaletteControl
					label={ sprintf( _x( '%s #%d', 'option title', i18n ), __( 'Background Color', i18n ), 2 ) }
					attribute={ getAttrName( 'backgroundColor2' ) }
					hasTransparent={ true }
				/>
			) }
			{ getAttribute( 'backgroundColorType' ) === 'gradient' && (
				<ButtonIconPopoverControl
					label={ __( 'Adv. Gradient Color Settings', i18n ) }
					onReset={ () => {
						updateAttributes( {
							backgroundGradientDirection: '',
							backgroundGradientBlendMode: '',
							backgroundGradientLocation1: '',
							backgroundGradientLocation2: '',
						} )
					} }
					allowReset={
						( getAttribute( 'backgroundGradientDirection' ) !== '' && getAttribute( 'backgroundGradientDirection' ) !== 90 ) ||
						( getAttribute( 'backgroundGradientLocation1' ) !== '' && getAttribute( 'backgroundGradientLocation1' ) !== 0 ) ||
						( getAttribute( 'backgroundGradientLocation2' ) !== '' && getAttribute( 'backgroundGradientLocation2' ) !== 100 ) ||
						getAttribute( 'backgroundGradientBlendMode' )
					}
				>
					<AdvancedRangeControl
						label={ __( 'Gradient Direction (degrees)', i18n ) }
						attribute={ getAttrName( 'backgroundGradientDirection' ) }
						min={ 0 }
						max={ 360 }
						step={ 10 }
						allowReset={ true }
						placeholder="90"
						helpTooltip={ {
							// TODO: Add a working video
							description: __( 'Sets the direction (in degrees) of the colors', i18n ),
						} }
					/>

					<AdvancedRangeControl
						label={ sprintf( __( 'Color %d Location', i18n ), 1 ) }
						attribute={ getAttrName( 'backgroundGradientLocation1' ) }
						sliderMin={ 0 }
						max={ 100 }
						step={ 1 }
						allowReset={ true }
						placeholder="0"
						helpTooltip={ {
							video: 'gradient-location',
							description: __( 'Sets the placement of each color in relation to the other color', i18n ),
						} }
					/>

					<AdvancedRangeControl
						label={ sprintf( __( 'Color %d Location', i18n ), 2 ) }
						attribute={ getAttrName( 'backgroundGradientLocation2' ) }
						sliderMin={ 0 }
						max={ 100 }
						step={ 1 }
						allowReset={ true }
						placeholder="100"
						helpTooltip={ {
							video: 'gradient-location',
							description: __( 'Sets the placement of each color in relation to the other color', i18n ),
						} }
					/>

					{ props.hasBackgroundGradientBlendMode &&
						<BlendModeControl
							label={ __( 'Background Gradient Blend Mode', i18n ) }
							attribute={ getAttrName( 'backgroundGradientBlendMode' ) }
							helpTooltip={ {
								video: 'background-blend-mode',
								description: __( 'Sets how this background gradient/image blends into the other background', i18n ),
							} }
						/>
					}
				</ButtonIconPopoverControl>
			) }

			{ getAttribute( 'backgroundColorType' ) === 'gradient' &&
				<ControlSeparator />
			}

			{ props.hasBackgroundImage &&
				<ImageControl2
					label={ props.backgroundMediaAllowVideo ? __( 'Background Image or Video', i18n ) : __( 'Background Image', i18n ) }
					help={ props.backgroundMediaAllowVideo ? __( 'Use .mp4 format for videos', i18n ) : '' }
					allowedTypes={ props.backgroundMediaAllowVideo ? IMAGE_AND_VIDEO_TYPES : IMAGE_TYPES }
					attribute={ getAttrName( 'backgroundMedia' ) }
					onChange={ image => {
						const attrNameId = getAttributeName( `${ getAttrName( 'backgroundMedia' ) }Id`, deviceType )
						const attrNameUrl = getAttributeName( `${ getAttrName( 'backgroundMedia' ) }Url`, deviceType )
						const attrWidthAttribute = getAttributeName( `${ getAttrName( 'backgroundMedia' ) }HeightAttribute`, deviceType )
						const attrHeightAttribute = getAttributeName( `${ getAttrName( 'backgroundMedia' ) }WidthAttribute`, deviceType )
						const attrAlt = getAttributeName( `${ getAttrName( 'backgroundMedia' ) }Alt`, deviceType )

						const attributes = {
							[ attrNameId ]: image.id,
							[ attrNameUrl ]: image.url,
							[ attrWidthAttribute ]: image.width || '',
							[ attrHeightAttribute ]: image.height || '',
							[ attrAlt ]: image.alt || '',
						}

						if ( props.onBackgroundEnableAttribute ) {
							attributes[ props.onBackgroundEnableAttribute ] = true
						}

						setAttributes( attributes )
					}
					}
					responsive="all"
				/>
			}

			{ hasBackgroundMedia &&
				<AdvancedRangeControl
					label={ __( 'Background Media Tint Strength', i18n ) }
					attribute={ getAttrName( 'backgroundTintStrength' ) }
					hover="all"
					min={ 0 }
					max={ 10 }
					step={ 1 }
					allowReset={ true }
					placeholder={ getAttribute( 'backgroundColor' ) ? '5' : '0' }
					helpTooltip={ {
						video: 'background-tint',
						description: __( 'Adjusts the intensity of the background media tint', i18n ),
					} }
				/>
			}

			{ hasBackgroundMedia && ! isBackgroundVideo() &&
				<AdvancedToggleControl
					label={ __( 'Fixed Background', i18n ) }
					attribute={ getAttrName( 'fixedBackground' ) }
					helpTooltip={ {
						video: 'background-fixed',
						description: __( 'Keeps the background image fixed in place while scrolling', i18n ),
					} }
				/>
			}

			{ hasBackgroundMedia &&
				<ButtonIconPopoverControl
					label={ __( 'Adv. Background Image Settings', i18n ) }
					onReset={ () => {
						updateAttributes( {
							BackgroundPosition: '',
							BackgroundPositionTablet: '',
							BackgroundPositionMobile: '',
							BackgroundRepeat: '',
							BackgroundRepeatTablet: '',
							BackgroundRepeatMobile: '',
							BackgroundSize: '',
							BackgroundSizeTablet: '',
							BackgroundSizeMobile: '',
							BackgroundCustomSize: '',
							BackgroundCustomSizeTablet: '',
							BackgroundCustomSizeMobile: '',
							BackgroundCustomSizeUnit: '%',
							BackgroundCustomSizeUnitTablet: '%',
							BackgroundCustomSizeUnitMobile: '%',
							BackgroundImageBlendMode: '',
						} )
					} }
					allowReset={
						getAttribute( 'backgroundPosition' ) || getAttribute( 'BackgroundPositionTablet' ) || getAttribute( 'BackgroundPositionMobile' ) ||
						getAttribute( 'backgroundRepeat' ) || getAttribute( 'BackgroundRepeatTablet' ) || getAttribute( 'BackgroundRepeatMobile' ) ||
						getAttribute( 'backgroundSize' ) || getAttribute( 'BackgroundSizeTablet' ) || getAttribute( 'BackgroundSizeMobile' ) ||
						getAttribute( 'backgroundImageBlendMode' )
					}
				>

					<AdvancedSelectControl
						label={ __( 'Image Position', i18n ) }
						attribute={ getAttrName( 'backgroundPosition' ) }
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
						helpTooltip={ {
							video: 'background-image-position',
							description: __( 'Chooses which part of the background image will be the focal point', i18n ),
						} }
						responsive="all"
					/>

					<AdvancedSelectControl
						label={ __( 'Image Repeat', i18n ) }
						attribute={ getAttrName( 'backgroundRepeat' ) }
						options={ [
							{ label: __( 'Default', i18n ), value: '' },
							{ label: __( 'No-Repeat', i18n ), value: 'no-repeat' },
							{ label: __( 'Repeat', i18n ), value: 'repeat' },
							{ label: __( 'Repeat-X', i18n ), value: 'repeat-x' },
							{ label: __( 'Repeat-Y', i18n ), value: 'repeat-y' },
						] }
						helpTooltip={ {
							video: 'background-image-repeat',
							description: __( 'Covers the background with tiled images', i18n ),
						} }
						responsive="all"
					/>

					<AdvancedSelectControl
						label={ __( 'Image Size', i18n ) }
						attribute={ getAttrName( 'backgroundSize' ) }
						options={ [
							{ label: __( 'Default', i18n ), value: '' },
							{ label: __( 'Auto', i18n ), value: 'auto' },
							{ label: __( 'Cover', i18n ), value: 'cover' },
							{ label: __( 'Contain', i18n ), value: 'contain' },
							{ label: __( 'Custom', i18n ), value: 'custom' },
						] }
						helpTooltip={ {
							video: 'background-image-size',
							description: __( 'Sets the display image size', i18n ),
						} }
						responsive="all"
					/>

					{ getAttributes()[ getAttributeName( getAttrName( 'backgroundSize' ), deviceType ) ] === 'custom' &&
						<AdvancedRangeControl
							label={ __( 'Custom Size', i18n ) }
							attribute={ getAttrName( 'backgroundCustomSize' ) }
							responsive="all"
							units={ [ 'px', '%', 'vw' ] }
							min={ [ 0, 0, 0 ] }
							max={ [ 1000, 100, 100 ] }
						/>
					}

					<BlendModeControl
						label={ __( 'Image Blend Mode', i18n ) }
						attribute={ getAttrName( 'backgroundImageBlendMode' ) }
						helpTooltip={ {
							video: 'background-blend-mode',
							description: __( 'Sets how this background gradient/image blends into the other background', i18n ),
						} }
					/>
				</ButtonIconPopoverControl>
			}
		</Fragment>
	)
}

BackgroundControls.defaultProps = {
	attrNameTemplate: '%s',
	backgroundMediaAllowVideo: true,
	hasGradient: true,
	hasBackgroundImage: true,
	hasBackgroundGradientBlendMode: true,
	onBackgroundEnableAttribute: '',
}
