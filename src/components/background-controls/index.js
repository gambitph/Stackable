/**
 * External dependencies
 */
import {
	AdvancedRangeControl,
	AdvancedSelectControl,
	BlendModeControl,
	ButtonIconPopoverControl,
	ColorPaletteControl,
	ImageControl,
	TextToolbar,
	WhenResponsiveScreen,
	ControlSeparator,
} from '~stackable/components'
import { urlIsVideo } from '~stackable/util'

/**
 * WordPress dependencies
 */
import {
	BaseControl,
	ToggleControl,
} from '@wordpress/components'
import {
	__, _x, sprintf,
} from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'
import { i18n } from 'stackable'

const BackgroundControls = props => {
	const isBackgroundVideo = () => {
		return [ props.backgroundMediaURL, props.tabletBackgroundMediaURL, props.mobileBackgroundMediaURL ]
			.filter( value => value )
			.filter( urlIsVideo )
			.length > 0
	}

	return (
		<Fragment>
			{ props.onChangeBackgroundColorType && (
				<BaseControl
					label={ props.labelBackgroundColorType }
					id="ugb-background-color-type"
				>
					<TextToolbar
						controls={ [
							{
								value: '',
								title: __( 'Single', i18n ),
								isActive: props.backgroundColorType === '',
								onClick: () => props.onChangeBackgroundColorType( '' ),
							},
							{
								value: 'gradient',
								title: __( 'Gradient', i18n ),
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
							sprintf( _x( '%s #%d', 'Panel title', i18n ), props.labelBackgroundColor, 1 ) :
							props.labelBackgroundColor
					}
					value={ props.backgroundColor }
					onChange={ props.onChangeBackgroundColor }
				/>
			) }
			{ props.onChangeBackgroundColorOpacity && props.backgroundColorType !== 'gradient' &&
				( ! props.backgroundMediaURL && ! props.tabletBackgroundMediaURL && ! props.mobileBackgroundMediaURL ) && (
				<AdvancedRangeControl
					label={ __( 'Background Color Opacity', i18n ) }
					value={ props.backgroundColorOpacity }
					onChange={ props.onChangeBackgroundColorOpacity }
					min={ 0 }
					max={ 1 }
					step={ 0.1 }
					allowReset={ true }
					placeholder="1.0"
				/>
			) }

			{ props.onChangeBackgroundColor2 && props.backgroundColorType === 'gradient' && (
				<ColorPaletteControl
					label={ sprintf( _x( '%s #%d', 'Panel title', i18n ), props.labelBackgroundColor, 2 ) }
					value={ props.backgroundColor2 }
					onChange={ props.onChangeBackgroundColor2 }
				/>
			) }

			{ props.onChangeBackgroundColor2 && props.backgroundColorType === 'gradient' && props.hasAdvancedGradient &&
				<ButtonIconPopoverControl
					label={ __( 'Adv. Gradient Color Settings', i18n ) }
					onReset={ props.onResetAdvancedGradient }
					allowReset={
						( props.backgroundGradientDirection !== '' && props.backgroundGradientDirection !== 90 ) ||
						( props.backgroundGradientLocation1 !== '' && props.backgroundGradientLocation1 !== 0 ) ||
						( props.backgroundGradientLocation2 !== '' && props.backgroundGradientLocation2 !== 100 ) ||
						props.backgroundGradientBlendMode
					}
				>
					{ props.onChangeBackgroundGradientDirection && (
						<AdvancedRangeControl
							label={ __( 'Gradient Direction (degrees)', i18n ) }
							value={ props.backgroundGradientDirection }
							onChange={ props.onChangeBackgroundGradientDirection }
							min={ 0 }
							max={ 360 }
							step={ 10 }
							allowReset={ true }
							placeholder="90"
						/>
					) }

					{ props.onChangeBackgroundGradientLocation1 && (
						<AdvancedRangeControl
							label={ sprintf( __( 'Color %d Location', i18n ), 1 ) }
							value={ props.backgroundGradientLocation1 }
							onChange={ props.onChangeBackgroundGradientLocation1 }
							min={ 0 }
							max={ 100 }
							step={ 1 }
							allowReset={ true }
							placeholder="0"
						/>
					) }

					{ props.onChangeBackgroundGradientLocation2 && (
						<AdvancedRangeControl
							label={ sprintf( __( 'Color %d Location', i18n ), 2 ) }
							value={ props.backgroundGradientLocation2 }
							onChange={ props.onChangeBackgroundGradientLocation2 }
							min={ 0 }
							max={ 100 }
							step={ 1 }
							allowReset={ true }
							placeholder="100"
						/>
					) }

					{ props.onChangeBackgroundGradientBlendMode && (
						<BlendModeControl
							label={ __( 'Background Gradient Blend Mode', i18n ) }
							value={ props.backgroundGradientBlendMode }
							onChange={ props.onChangeBackgroundGradientBlendMode }
						/>
					) }
				</ButtonIconPopoverControl>
			}

			{ props.onChangeBackgroundColor2 && props.backgroundColorType === 'gradient' && props.hasAdvancedGradient && props.onChangeBackgroundMedia &&
				<ControlSeparator />
			}

			{ props.onChangeBackgroundMedia && (
				<Fragment>
					<WhenResponsiveScreen>
						<ImageControl
							label={ props.backgroundMediaAllowVideo ? __( 'Background Image or Video', i18n ) : __( 'Background Image', i18n ) }
							help={ props.backgroundMediaAllowVideo ? __( 'Use .mp4 format for videos', i18n ) : '' }
							onRemove={ () => props.onChangeBackgroundMedia( { url: '', id: '' } ) }
							onChange={ props.onChangeBackgroundMedia }
							imageID={ props.backgroundMediaID }
							imageURL={ props.backgroundMediaURL }
							allowedTypes={ props.backgroundMediaAllowVideo ? [ 'image', 'video' ] : [ 'image' ] }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="tablet">
						<ImageControl
							label={ props.backgroundMediaAllowVideo ? __( 'Background Image or Video', i18n ) : __( 'Background Image', i18n ) }
							help={ props.backgroundMediaAllowVideo ? __( 'Use .mp4 format for videos', i18n ) : '' }
							onRemove={ () => props.onChangeTabletBackgroundMedia( { url: '', id: '' } ) }
							onChange={ props.onChangeTabletBackgroundMedia }
							imageID={ props.tabletBackgroundMediaID }
							imageURL={ props.tabletBackgroundMediaURL }
							allowedTypes={ props.backgroundMediaAllowVideo ? [ 'image', 'video' ] : [ 'image' ] }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="mobile">
						<ImageControl
							label={ props.backgroundMediaAllowVideo ? __( 'Background Image or Video', i18n ) : __( 'Background Image', i18n ) }
							help={ props.backgroundMediaAllowVideo ? __( 'Use .mp4 format for videos', i18n ) : '' }
							onRemove={ () => props.onChangeMobileBackgroundMedia( { url: '', id: '' } ) }
							onChange={ props.onChangeMobileBackgroundMedia }
							imageID={ props.mobileBackgroundMediaID }
							imageURL={ props.mobileBackgroundMediaURL }
							allowedTypes={ props.backgroundMediaAllowVideo ? [ 'image', 'video' ] : [ 'image' ] }
						/>
					</WhenResponsiveScreen>
				</Fragment>
			) }

			{ props.onChangeBackgroundTintStrength && props.onChangeBackgroundMedia &&
				( props.backgroundMediaURL || props.tabletBackgroundMediaURL || props.mobileBackgroundMediaURL ) && (
				<AdvancedRangeControl
					label={ __( 'Background Media Tint Strength', i18n ) }
					value={ props.backgroundTintStrength }
					onChange={ value => {
						const noValue = typeof value === 'undefined' || value === ''
						// If the tint is changed, but on background color yet, make it black. Fixes #136.
						if ( props.backgroundColor === '' && ! noValue ) {
							props.onChangeBackgroundTintStrength( value, '#000000' )
						// If the tint is reset, and the background is black (was set earlier), remove it.
						} else if ( props.backgroundColor === '#000000' && noValue ) {
							props.onChangeBackgroundTintStrength( value, '' )
						} else {
							props.onChangeBackgroundTintStrength( value, props.backgroundColor )
						}
					} }
					min={ 0 }
					max={ 10 }
					step={ 1 }
					allowReset={ true }
					placeholder={ props.backgroundColor ? '5' : '0' }
				/>
			) }

			{ props.onChangeFixedBackground && props.onChangeBackgroundMedia &&
				( props.backgroundMediaURL || props.tabletBackgroundMediaURL || props.mobileBackgroundMediaURL ) &&
				! isBackgroundVideo() && (
				<ToggleControl
					label={ __( 'Fixed Background', i18n ) }
					checked={ props.fixedBackground }
					onChange={ props.onChangeFixedBackground }
				/>
			) }

			{ props.hasAdvancedBackground && props.onChangeBackgroundMedia &&
				( props.backgroundMediaURL || props.tabletBackgroundMediaURL || props.mobileBackgroundMediaURL ) &&
				<ButtonIconPopoverControl
					label={ __( 'Adv. Background Image Settings', i18n ) }
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
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="tablet">
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
							value={ props.tabletBackgroundPosition }
							onChange={ props.onChangeTabletBackgroundPosition }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="mobile">
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
							value={ props.mobileBackgroundPosition }
							onChange={ props.onChangeMobileBackgroundPosition }
						/>
					</WhenResponsiveScreen>

					<WhenResponsiveScreen>
						<AdvancedSelectControl
							label={ __( 'Image Repeat', i18n ) }
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
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="tablet">
						<AdvancedSelectControl
							label={ __( 'Image Repeat', i18n ) }
							options={ [
								{ label: __( 'Default', i18n ), value: '' },
								{ label: __( 'No-Repeat', i18n ), value: 'no-repeat' },
								{ label: __( 'Repeat', i18n ), value: 'repeat' },
								{ label: __( 'Repeat-X', i18n ), value: 'repeat-x' },
								{ label: __( 'Repeat-Y', i18n ), value: 'repeat-y' },
							] }
							value={ props.tabletBackgroundRepeat }
							onChange={ props.onChangeTabletBackgroundRepeat }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="mobile">
						<AdvancedSelectControl
							label={ __( 'Image Repeat', i18n ) }
							options={ [
								{ label: __( 'Default', i18n ), value: '' },
								{ label: __( 'No-Repeat', i18n ), value: 'no-repeat' },
								{ label: __( 'Repeat', i18n ), value: 'repeat' },
								{ label: __( 'Repeat-X', i18n ), value: 'repeat-x' },
								{ label: __( 'Repeat-Y', i18n ), value: 'repeat-y' },
							] }
							value={ props.mobileBackgroundRepeat }
							onChange={ props.onChangeMobileBackgroundRepeat }
						/>
					</WhenResponsiveScreen>

					<WhenResponsiveScreen>
						<AdvancedSelectControl
							label={ __( 'Image Size', i18n ) }
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
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="tablet">
						<AdvancedSelectControl
							label={ __( 'Image Size', i18n ) }
							options={ [
								{ label: __( 'Default', i18n ), value: '' },
								{ label: __( 'Auto', i18n ), value: 'auto' },
								{ label: __( 'Cover', i18n ), value: 'cover' },
								{ label: __( 'Contain', i18n ), value: 'contain' },
								{ label: __( 'Custom', i18n ), value: 'custom' },
							] }
							value={ props.tabletBackgroundSize }
							onChange={ props.onChangeTabletBackgroundSize }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="mobile">
						<AdvancedSelectControl
							label={ __( 'Image Size', i18n ) }
							options={ [
								{ label: __( 'Default', i18n ), value: '' },
								{ label: __( 'Auto', i18n ), value: 'auto' },
								{ label: __( 'Cover', i18n ), value: 'cover' },
								{ label: __( 'Contain', i18n ), value: 'contain' },
								{ label: __( 'Custom', i18n ), value: 'custom' },
							] }
							value={ props.mobileBackgroundSize }
							onChange={ props.onChangeMobileBackgroundSize }
						/>
					</WhenResponsiveScreen>

					{ props.backgroundSize === 'custom' && (
						<WhenResponsiveScreen>
							<AdvancedRangeControl
								label={ __( 'Custom Size', i18n ) }
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
								label={ __( 'Custom Size', i18n ) }
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
								label={ __( 'Custom Size', i18n ) }
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
							label={ __( 'Image Blend Mode', i18n ) }
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

	labelBackgroundColorType: __( 'Background Color Type', i18n ),
	labelBackgroundColor: __( 'Background Color', i18n ),

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
	backgroundMediaAllowVideo: true,
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
