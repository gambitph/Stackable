import {
	AdvancedRangeControl,
	AdvancedSelectControl,
	BlendModeControl,
	ButtonIconPopoverControl,
	ColorPaletteControl,
	ImageControl,
	TextToolbar,
	WhenResponsiveScreen,
} from '@stackable/components'
import {
	BaseControl,
	RangeControl,
	ToggleControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'

export const isVideo = url => url.match( /(mp4|webm|ogg)/i )

const BackgroundControls = props => {
	const isBackgroundVideo = () => {
		return [ props.backgroundMediaURL, props.tabletBackgroundMediaURL, props.mobileBackgroundMediaURL ]
			.filter( value => value )
			.filter( isVideo )
			.length > 0
	}

	return (
		<Fragment>
			{ props.onChangeBackgroundColorType && (
				<BaseControl
					label={ __( 'Background Color Type' ) }
				>
					<TextToolbar
						controls={ [
							{
								value: '',
								title: __( 'Single' ),
								isActive: props.backgroundColorType === '',
								onClick: () => props.onChangeBackgroundColorType( '' ),
							},
							{
								value: 'gradient',
								title: __( 'Gradient' ),
								isActive: props.backgroundColorType === 'gradient',
								onClick: () => props.onChangeBackgroundColorType( 'gradient' ),
							},
						] }
					/>
				</BaseControl>
			) }

			{ props.onChangeBackgroundColor && (
				<ColorPaletteControl
					label={
						props.onChangeBackgroundColor2 && props.backgroundColorType === 'gradient' ?
							__( 'Background Color #1' ) :
							__( 'Background Color' )
					}
					value={ props.backgroundColor }
					onChange={ props.onChangeBackgroundColor }
				/>
			) }
			{ props.onChangeBackgroundColorOpacity && props.backgroundColorType !== 'gradient' &&
				( ! props.backgroundMediaURL && ! props.tabletBackgroundMediaURL && ! props.mobileBackgroundMediaURL ) && (
				<RangeControl
					label={ __( 'Background Color Opacity' ) }
					value={ props.backgroundColorOpacity }
					onChange={ props.onChangeBackgroundColorOpacity }
					min={ 0 }
					max={ 1 }
					step={ 0.1 }
					allowReset={ true }
				/>
			) }

			{ props.onChangeBackgroundColor2 && props.backgroundColorType === 'gradient' && (
				<ColorPaletteControl
					label={ __( 'Background Color #2' ) }
					value={ props.backgroundColor2 }
					onChange={ props.onChangeBackgroundColor2 }
				/>
			) }

			{ props.onChangeBackgroundColor2 && props.backgroundColorType === 'gradient' && props.hasAdvancedGradient &&
				<ButtonIconPopoverControl
					label={ __( 'Adv. Gradient Color Settings' ) }
					onReset={ props.onResetAdvancedGradient }
					allowReset={
						props.backgroundGradientDirection !== '' ||
						( props.backgroundGradientLocation1 !== '' && props.backgroundGradientLocation1 !== 0 ) ||
						( props.backgroundGradientLocation2 !== '' && props.backgroundGradientLocation2 !== 100 ) ||
						props.backgroundGradientBlendMode
					}
				>
					{ props.onChangeBackgroundGradientDirection && (
						<RangeControl
							label={ __( 'Gradient Direction (degrees)' ) }
							value={ props.backgroundGradientDirection }
							onChange={ props.onChangeBackgroundGradientDirection }
							min={ 0 }
							max={ 360 }
							step={ 10 }
							allowReset={ true }
						/>
					) }

					{ props.onChangeBackgroundGradientLocation1 && (
						<RangeControl
							label={ __( 'Color 1 Location' ) }
							value={ props.backgroundGradientLocation1 }
							onChange={ props.onChangeBackgroundGradientLocation1 }
							min={ 0 }
							max={ 100 }
							step={ 1 }
							allowReset={ true }
						/>
					) }

					{ props.onChangeBackgroundGradientLocation2 && (
						<RangeControl
							label={ __( 'Color 2 Location' ) }
							value={ props.backgroundGradientLocation2 }
							onChange={ props.onChangeBackgroundGradientLocation2 }
							min={ 0 }
							max={ 100 }
							step={ 1 }
							allowReset={ true }
						/>
					) }

					{ props.onChangeBackgroundGradientBlendMode && (
						<BlendModeControl
							label={ __( 'Background Gradient Blend Mode' ) }
							value={ props.backgroundGradientBlendMode }
							onChange={ props.onChangeBackgroundGradientBlendMode }
						/>
					) }
				</ButtonIconPopoverControl>
			}

			{ props.onChangeBackgroundMedia && (
				<Fragment>
					<WhenResponsiveScreen>
						<ImageControl
							label={ __( 'Background Image or Video' ) }
							help={ __( 'Use .mp4 format for videos' ) }
							onRemove={ () => props.onChangeBackgroundMedia( { url: '', id: '' } ) }
							onChange={ props.onChangeBackgroundMedia }
							imageID={ props.backgroundMediaID }
							imageURL={ props.backgroundMediaURL }
							allowedTypes={ props.backgroundMediaAllowedTypes ? [ 'image', 'video' ] : [ 'image' ] }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="tablet">
						<ImageControl
							label={ __( 'Background Image or Video' ) }
							help={ __( 'Use .mp4 format for videos' ) }
							onRemove={ () => props.onChangeTabletBackgroundMedia( { url: '', id: '' } ) }
							onChange={ props.onChangeTabletBackgroundMedia }
							imageID={ props.tabletBackgroundMediaID }
							imageURL={ props.tabletBackgroundMediaURL }
							allowedTypes={ props.backgroundMediaAllowedTypes ? [ 'image', 'video' ] : [ 'image' ] }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="mobile">
						<ImageControl
							label={ __( 'Background Image or Video' ) }
							help={ __( 'Use .mp4 format for videos' ) }
							onRemove={ () => props.onChangeMobileBackgroundMedia( { url: '', id: '' } ) }
							onChange={ props.onChangeMobileBackgroundMedia }
							imageID={ props.mobileBackgroundMediaID }
							imageURL={ props.mobileBackgroundMediaURL }
							allowedTypes={ props.backgroundMediaAllowedTypes ? [ 'image', 'video' ] : [ 'image' ] }
						/>
					</WhenResponsiveScreen>
				</Fragment>
			) }

			{ props.onChangeBackgroundTintStrength &&
				( props.backgroundMediaURL || props.tabletBackgroundMediaURL || props.mobileBackgroundMediaURL ) && (
				<RangeControl
					label={ __( 'Background Media Tint Strength' ) }
					value={ props.backgroundTintStrength }
					onChange={ props.onChangeBackgroundTintStrength }
					min={ 1 }
					max={ 10 }
					step={ 1 }
					allowReset={ true }
				/>
			) }

			{ props.onChangeFixedBackground &&
				( props.backgroundMediaURL || props.tabletBackgroundMediaURL || props.mobileBackgroundMediaURL ) &&
				! isBackgroundVideo() && (
				<ToggleControl
					label={ __( 'Fixed Background' ) }
					checked={ props.fixedBackground }
					onChange={ props.onChangeFixedBackground }
				/>
			) }

			{ props.hasAdvancedBackground &&
				( props.backgroundMediaURL || props.tabletBackgroundMediaURL || props.mobileBackgroundMediaURL ) &&
				<ButtonIconPopoverControl
					label={ __( 'Adv. Background Image Settings' ) }
					onReset={ props.onResetAdvancedBackground }
					allowReset={
						props.backgroundPosition || props.tabletBackgroundPosition || props.mobileBackgroundPosition ||
						props.backgroundRepeat || props.tabletBackgroundRepeat || props.mobileBackgroundRepeat ||
						props.backgroundSize || props.tabletBackgroundSize || props.mobileBackgroundSize ||
						props.backgroundImageBlendMode
					}
				>

					<WhenResponsiveScreen>
						<AdvancedSelectControl
							label={ __( 'Image Position' ) }
							options={ [
								{ label: __( 'Default' ), value: '' },
								{ label: __( 'Top Left' ), value: 'top left' },
								{ label: __( 'Top Center' ), value: 'top center' },
								{ label: __( 'Top Right' ), value: 'top right' },
								{ label: __( 'Center Left' ), value: 'center left' },
								{ label: __( 'Center Center' ), value: 'center center' },
								{ label: __( 'Center Right' ), value: 'center right' },
								{ label: __( 'Bottom Left' ), value: 'bottom left' },
								{ label: __( 'Bottom Center' ), value: 'bottom center' },
								{ label: __( 'Bottom Right' ), value: 'bottom right' },
							] }
							value={ props.backgroundPosition }
							onChange={ props.onChangeBackgroundPosition }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="tablet">
						<AdvancedSelectControl
							label={ __( 'Image Position' ) }
							options={ [
								{ label: __( 'Default' ), value: '' },
								{ label: __( 'Top Left' ), value: 'top left' },
								{ label: __( 'Top Center' ), value: 'top center' },
								{ label: __( 'Top Right' ), value: 'top right' },
								{ label: __( 'Center Left' ), value: 'center left' },
								{ label: __( 'Center Center' ), value: 'center center' },
								{ label: __( 'Center Right' ), value: 'center right' },
								{ label: __( 'Bottom Left' ), value: 'bottom left' },
								{ label: __( 'Bottom Center' ), value: 'bottom center' },
								{ label: __( 'Bottom Right' ), value: 'bottom right' },
							] }
							value={ props.tabletBackgroundPosition }
							onChange={ props.onChangeTabletBackgroundPosition }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="mobile">
						<AdvancedSelectControl
							label={ __( 'Image Position' ) }
							options={ [
								{ label: __( 'Default' ), value: '' },
								{ label: __( 'Top Left' ), value: 'top left' },
								{ label: __( 'Top Center' ), value: 'top center' },
								{ label: __( 'Top Right' ), value: 'top right' },
								{ label: __( 'Center Left' ), value: 'center left' },
								{ label: __( 'Center Center' ), value: 'center center' },
								{ label: __( 'Center Right' ), value: 'center right' },
								{ label: __( 'Bottom Left' ), value: 'bottom left' },
								{ label: __( 'Bottom Center' ), value: 'bottom center' },
								{ label: __( 'Bottom Right' ), value: 'bottom right' },
							] }
							value={ props.mobileBackgroundPosition }
							onChange={ props.onChangeMobileBackgroundPosition }
						/>
					</WhenResponsiveScreen>

					<WhenResponsiveScreen>
						<AdvancedSelectControl
							label={ __( 'Image Repeat' ) }
							options={ [
								{ label: __( 'Default' ), value: '' },
								{ label: __( 'No-Repeat' ), value: 'no-repeat' },
								{ label: __( 'Repeat' ), value: 'repeat' },
								{ label: __( 'Repeat-X' ), value: 'repeat-x' },
								{ label: __( 'Repeat-Y' ), value: 'repeat-y' },
							] }
							value={ props.backgroundRepeat }
							onChange={ props.onChangeBackgroundRepeat }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="tablet">
						<AdvancedSelectControl
							label={ __( 'Image Repeat' ) }
							options={ [
								{ label: __( 'Default' ), value: '' },
								{ label: __( 'No-Repeat' ), value: 'no-repeat' },
								{ label: __( 'Repeat' ), value: 'repeat' },
								{ label: __( 'Repeat-X' ), value: 'repeat-x' },
								{ label: __( 'Repeat-Y' ), value: 'repeat-y' },
							] }
							value={ props.tabletBackgroundRepeat }
							onChange={ props.onChangeTabletBackgroundRepeat }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="mobile">
						<AdvancedSelectControl
							label={ __( 'Image Repeat' ) }
							options={ [
								{ label: __( 'Default' ), value: '' },
								{ label: __( 'No-Repeat' ), value: 'no-repeat' },
								{ label: __( 'Repeat' ), value: 'repeat' },
								{ label: __( 'Repeat-X' ), value: 'repeat-x' },
								{ label: __( 'Repeat-Y' ), value: 'repeat-y' },
							] }
							value={ props.mobileBackgroundRepeat }
							onChange={ props.onChangeMobileBackgroundRepeat }
						/>
					</WhenResponsiveScreen>

					<WhenResponsiveScreen>
						<AdvancedSelectControl
							label={ __( 'Image Size' ) }
							options={ [
								{ label: __( 'Default' ), value: '' },
								{ label: __( 'Auto' ), value: 'auto' },
								{ label: __( 'Cover' ), value: 'cover' },
								{ label: __( 'Contain' ), value: 'contain' },
								{ label: __( 'Custom' ), value: 'custom' },
							] }
							value={ props.backgroundSize }
							onChange={ props.onChangeBackgroundSize }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="tablet">
						<AdvancedSelectControl
							label={ __( 'Image Size' ) }
							options={ [
								{ label: __( 'Default' ), value: '' },
								{ label: __( 'Auto' ), value: 'auto' },
								{ label: __( 'Cover' ), value: 'cover' },
								{ label: __( 'Contain' ), value: 'contain' },
								{ label: __( 'Custom' ), value: 'custom' },
							] }
							value={ props.tabletBackgroundSize }
							onChange={ props.onChangeTabletBackgroundSize }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="mobile">
						<AdvancedSelectControl
							label={ __( 'Image Size' ) }
							options={ [
								{ label: __( 'Default' ), value: '' },
								{ label: __( 'Auto' ), value: 'auto' },
								{ label: __( 'Cover' ), value: 'cover' },
								{ label: __( 'Contain' ), value: 'contain' },
								{ label: __( 'Custom' ), value: 'custom' },
							] }
							value={ props.mobileBackgroundSize }
							onChange={ props.onChangeMobileBackgroundSize }
						/>
					</WhenResponsiveScreen>

					{ props.backgroundSize === 'custom' && (
						<WhenResponsiveScreen>
							<AdvancedRangeControl
								label={ __( 'Custom Size' ) }
								units={ [ 'px', '%', 'vw' ] }
								min={ [ 0, 0, 0 ] }
								max={ [ 1000, 100, 100 ] }
								unit={ props.backgroundCustomSizeUnit }
								onChangeUnit={ props.onChangeBackgroundCustomSizeUnit }
								value={ props.backgroundCustomSize }
								onChange={ props.onChangeBackgroundCustomSize }
								allowReset={ true }
							/>
						</WhenResponsiveScreen>
					) }
					{ props.tabletBackgroundSize === 'custom' && (
						<WhenResponsiveScreen screen="tablet">
							<AdvancedRangeControl
								label={ __( 'Custom Size' ) }
								units={ [ 'px', '%', 'vw' ] }
								min={ [ 0, 0, 0 ] }
								max={ [ 1000, 100, 100 ] }
								unit={ props.tabletBackgroundCustomSizeUnit }
								onChangeUnit={ props.onChangeTabletBackgroundCustomSizeUnit }
								value={ props.tabletBackgroundCustomSize }
								onChange={ props.onChangeTabletBackgroundCustomSize }
								allowReset={ true }
							/>
						</WhenResponsiveScreen>
					) }
					{ props.mobileBackgroundSize === 'custom' && (
						<WhenResponsiveScreen screen="mobile">
							<AdvancedRangeControl
								label={ __( 'Custom Size' ) }
								units={ [ 'px', '%', 'vw' ] }
								min={ [ 0, 0, 0 ] }
								max={ [ 1000, 100, 100 ] }
								unit={ props.mobileBackgroundCustomSizeUnit }
								onChangeUnit={ props.onChangeMobileBackgroundCustomSizeUnit }
								value={ props.mobileBackgroundCustomSize }
								onChange={ props.onChangeMobileBackgroundCustomSize }
								allowReset={ true }
							/>
						</WhenResponsiveScreen>
					) }

					{ props.onChangeBackgroundImageBlendMode && (
						<BlendModeControl
							label={ __( 'Image Blend Mode' ) }
							value={ props.backgroundImageBlendMode }
							onChange={ props.onChangeBackgroundImageBlendMode }
						/>
					) }
				</ButtonIconPopoverControl>
			}
		</Fragment>
	)
}

BackgroundControls.defaultProps = {
	backgroundColorType: '',
	backgroundColor: '',
	backgroundColorOpacity: '',
	backgroundColor2: '',
	backgroundMediaID: '',
	backgroundMediaURL: '',
	tabletBackgroundMediaID: '',
	tabletBackgroundMediaURL: '',
	mobileBackgroundMediaID: '',
	mobileBackgroundMediaURL: '',
	backgroundTintStrength: '',
	fixedBackground: '',
	onChangeBackgroundColorType: () => {},
	onChangeBackgroundColor: () => {},
	onChangeBackgroundColorOpacity: () => {},
	onChangeBackgroundColor2: () => {},
	onChangeBackgroundMedia: ( { url, id } ) => {}, // eslint-disable-line
	onChangeTabletBackgroundMedia: ( { url, id } ) => {}, // eslint-disable-line
	onChangeMobileBackgroundMedia: ( { url, id } ) => {}, // eslint-disable-line
	onChangeBackgroundTintStrength: () => {},
	onChangeFixedBackground: () => {},

	// Advanced gradient.
	hasAdvancedGradient: true,
	backgroundGradientDirection: '',
	backgroundGradientBlendMode: '',
	backgroundGradientLocation1: 0,
	backgroundGradientLocation2: 100,
	onResetAdvancedGradient: () => {},
	onChangeBackgroundGradientDirection: () => {},
	onChangeBackgroundGradientBlendMode: () => {},
	onChangeBackgroundGradientLocation1: () => {},
	onChangeBackgroundGradientLocation2: () => {},

	// Advanced background.
	hasAdvancedBackground: true,
	backgroundPosition: '',
	tabletBackgroundPosition: '',
	mobileBackgroundPosition: '',
	backgroundRepeat: '',
	tabletBackgroundRepeat: '',
	mobileBackgroundRepeat: '',
	backgroundSize: '',
	tabletBackgroundSize: '',
	mobileBackgroundSize: '',
	backgroundCustomSize: '',
	tabletBackgroundCustomSize: '',
	mobileBackgroundCustomSize: '',
	backgroundCustomSizeUnit: '%',
	tabletBackgroundCustomSizeUnit: '%',
	mobileBackgroundCustomSizeUnit: '%',
	backgroundImageBlendMode: '',
	onResetAdvancedBackground: () => {},
	onChangeBackgroundPosition: () => {},
	onChangeTabletBackgroundPosition: () => {},
	onChangeMobileBackgroundPosition: () => {},
	onChangeBackgroundRepeat: () => {},
	onChangeTabletBackgroundRepeat: () => {},
	onChangeMobileBackgroundRepeat: () => {},
	onChangeBackgroundSize: () => {},
	onChangeTabletBackgroundSize: () => {},
	onChangeMobileBackgroundSize: () => {},
	onChangeBackgroundCustomSize: () => {},
	onChangeTabletBackgroundCustomSize: () => {},
	onChangeMobileBackgroundCustomSize: () => {},
	onChangeBackgroundCustomSizeUnit: () => {},
	onChangeTabletBackgroundCustomSizeUnit: () => {},
	onChangeMobileBackgroundCustomSizeUnit: () => {},
	onChangeBackgroundImageBlendMode: () => {},
}

export default BackgroundControls
