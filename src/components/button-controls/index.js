import {
	BaseControl,
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components'
import {
	ButtonIconPopoverControl,
	ColorPaletteControl,
	ControlSeparator,
	DesignControl,
	IconControl,
	TextToolbar,
	TypographyControlHelper,
	URLInputControl,
} from '@stackable/components'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import ImageDesignBasic from './images/basic.png'
import ImageDesignGhost from './images/ghost.png'
import ImageDesignLink from './images/link.png'
import ImageDesignPlain from './images/plain.png'

const ButtonControls = props => {
	const design = props.design ? props.design : 'basic'
	const size = props.size ? props.size : 'normal'

	const showGradient = design === 'basic'

	return (
		<Fragment>
			{ props.onChangeUrl && (
				<URLInputControl
					label={ __( 'Link / URL' ) }
					value={ props.url }
					onChange={ props.onChangeUrl }
					placeholder="http://"
				/>
			) }
			{ props.onChangeNewWindow && (
				<ToggleControl
					label={ __( 'Open link in new window' ) }
					checked={ props.newWindow }
					onChange={ props.onChangeNewWindow }
				/>
			) }

			<ControlSeparator />

			{ props.onChangeDesign && (
				<DesignControl
					label={ __( 'Design' ) }
					selected={ design }
					options={ [
						{
							label: __( 'Basic' ), value: 'basic', image: ImageDesignBasic,
						},
						{
							label: __( 'Ghost' ), value: 'ghost', image: ImageDesignGhost,
						},
						{
							label: __( 'Plain' ), value: 'plain', image: ImageDesignPlain,
						},
						{
							label: __( 'Link' ), value: 'link', image: ImageDesignLink,
						},
						...applyFilters( 'stackable.button.edit.designs', [] ),
					] }
					onChange={ props.onChangeDesign }
				/>
			) }

			{ props.onChangeBackgroundColor && design !== 'link' && (
				<ColorPaletteControl
					label={
						props.onChangeBackgroundColor2 && props.backgroundColorType === 'gradient' && showGradient ?
							__( 'Button Color #1' ) :
							__( 'Button Color' )
					}
					value={ props.backgroundColor }
					onChange={ props.onChangeBackgroundColor }
				/>
			) }

			{ props.onChangeTextColor && showGradient && (
				<ColorPaletteControl
					label={ __( 'Text Color' ) }
					value={ props.textColor }
					onChange={ props.onChangeTextColor }
				/>
			) }

			{ props.hasAdvancedColors && design !== 'link' && (
				<ButtonIconPopoverControl
					label={ __( 'Adv. Color Settings' ) }
					onReset={ props.onResetAdvancedColors }
					allowReset={
						props.backgroundColorType ||
						props.backgroundColor2 ||
						props.backgroundGradientDirection ||
						props.opacity
					}
				>
					{ props.onChangeBackgroundColorType && showGradient && (
						<BaseControl
							label={ __( 'Button Color Type' ) }
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
					{ props.onChangeBackgroundColor && props.backgroundColorType === 'gradient' && showGradient && (
						<ColorPaletteControl
							label={
								props.onChangeBackgroundColor2 && props.backgroundColorType === 'gradient' && showGradient ?
									__( 'Button Color #1' ) :
									__( 'Button Color' )
							}
							value={ props.backgroundColor }
							onChange={ props.onChangeBackgroundColor }
						/>
					) }
					{ props.onChangeBackgroundColor2 && props.backgroundColorType === 'gradient' && showGradient && (
						<ColorPaletteControl
							label={ __( 'Button Color #2' ) }
							value={ props.backgroundColor2 }
							onChange={ props.onChangeBackgroundColor2 }
						/>
					) }
					{ props.onChangeBackgroundColor2 && props.backgroundColorType === 'gradient' && showGradient && (
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
					{ props.onChangeOpacity && (
						<RangeControl
							label={ __( 'Opacity' ) }
							value={ props.opacity }
							onChange={ props.onChangeOpacity }
							min={ 0.1 }
							max={ 1 }
							step={ 0.1 }
							allowReset={ true }
						/>
					) }
				</ButtonIconPopoverControl>
			) }

			{ design !== 'link' && <ControlSeparator /> }

			{ props.onChangeHoverGhostToNormal && design === 'ghost' && (
				<ToggleControl
					label={ __( 'Change to Normal Button on Hover' ) }
					checked={ props.hoverGhostToNormal }
					onChange={ props.onChangeHoverGhostToNormal }
				/>
			) }

			{ props.onChangeHoverEffect && ( design !== 'plain' && design !== 'link' ) && (
				<SelectControl
					label={ __( 'Hover Effect' ) }
					value={ props.hoverEffect }
					onChange={ props.onChangeHoverEffect }
					options={ [
						{ value: '', label: __( 'None' ) },
						{ value: 'lift', label: __( 'Lift' ) },
						{ value: 'scale', label: __( 'Scale' ) },
						{ value: 'lift-scale', label: __( 'Lift & Scale' ) },
					] }
				/>
			) }

			{ props.hasHoverColors && design !== 'link' && (
				<ButtonIconPopoverControl
					label={ __( 'Hover Colors' ) }
					onReset={ props.onResetHoverColors }
					allowReset={
						props.hoverBackgroundColor ||
						props.hoverBackgroundColor2 ||
						props.hoverBackgroundGradientDirection ||
						props.hoverTextColor ||
						props.hoverOpacity
					}
				>
					{ props.onChangeHoverBackgroundColor && (
						<ColorPaletteControl
							label={
								props.onChangeHoverBackgroundColor && ( props.hoverGhostToNormal || ( props.backgroundColorType === 'gradient' && showGradient ) ) ?
									__( 'Button Color #1' ) :
									__( 'Button Color' )
							}
							value={ props.hoverBackgroundColor }
							onChange={ props.onChangeHoverBackgroundColor }
						/>
					) }
					{ props.onChangeHoverBackgroundColor2 && ( props.hoverGhostToNormal || ( props.backgroundColorType === 'gradient' && showGradient ) ) && (
						<ColorPaletteControl
							label={ __( 'Button Color #2' ) }
							value={ props.hoverBackgroundColor2 }
							onChange={ props.onChangeHoverBackgroundColor2 }
						/>
					) }
					{ props.onChangeHoverBackgroundColor2 && ( props.hoverGhostToNormal || ( props.backgroundColorType === 'gradient' && showGradient ) ) && (
						<RangeControl
							label={ __( 'Gradient Direction (degrees)' ) }
							value={ props.hoverBackgroundGradientDirection }
							onChange={ props.onChangeHoverBackgroundGradientDirection }
							min={ 0 }
							max={ 360 }
							step={ 10 }
							allowReset={ true }
						/>
					) }
					{ props.onChangeHoverTextColor && ( props.hoverGhostToNormal || showGradient ) && (
						<ColorPaletteControl
							label={ __( 'Text Color' ) }
							value={ props.hoverTextColor }
							onChange={ props.onChangeHoverTextColor }
						/>
					) }
					{ props.onChangeOpacity && (
						<RangeControl
							label={ __( 'Opacity' ) }
							value={ props.hoverOpacity }
							onChange={ props.onChangeHoverOpacity }
							min={ 0.1 }
							max={ 1 }
							step={ 0.1 }
							allowReset={ true }
						/>
					) }
				</ButtonIconPopoverControl>
			) }

			{ design !== 'link' && <ControlSeparator /> }

			{ props.hasTypography && design !== 'link' && (
				<TypographyControlHelper
					attrNameTemplate={ props.attrNameTemplate }
					setAttributes={ props.setAttributes }
					blockAttributes={ props.blockAttributes }
					onChangeFontSize={ null }
					onChangeLineHeight={ null }
				/>
			) }

			{ props.onChangeSize && ( props.onChangeDesign ? design !== 'link' : true ) &&
				<SelectControl
					label={ __( 'Size' ) }
					value={ size }
					options={ [
						{ value: 'tiny', label: __( 'Tiny' ) },
						{ value: 'small', label: __( 'Small' ) },
						{ value: 'normal', label: __( 'Normal' ) },
						{ value: 'medium', label: __( 'Medium' ) },
						{ value: 'large', label: __( 'Large' ) },
					] }
					onChange={ props.onChangeSize }
				/>
			}

			{ props.onChangeBorderWidth && design === 'ghost' &&
				<RangeControl
					label={ __( 'Border Width' ) }
					value={ props.borderWidth }
					min="1"
					max="6"
					onChange={ props.onChangeBorderWidth }
					allowReset={ true }
				/>
			}

			{ props.onChangeBorderRadius && design !== 'link' && design !== 'plain' &&
				<RangeControl
					label={ __( 'Border Radius' ) }
					value={ props.borderRadius }
					min="0"
					max="70"
					onChange={ props.onChangeBorderRadius }
					allowReset={ true }
				/>
			}

			{ props.onChangeShadow && ( design === '' || design === 'basic' ) &&
				<RangeControl
					label={ __( 'Shadow' ) }
					value={ props.shadow }
					onChange={ props.onChangeShadow }
					min={ 0 }
					max={ 9 }
					allowReset={ true }
				/>
			}

			{ props.onChangeIcon && design !== 'link' &&
				<IconControl
					label={ __( 'Icon' ) }
					value={ props.icon }
					onChange={ props.onChangeIcon }
				/>
			}

			{ props.hasAdvancedIcon && design !== 'link' && props.icon !== '' && (
				<ButtonIconPopoverControl
					label={ __( 'Adv. Icon Settings' ) }
					onReset={ props.onResetAdvancedIcon }
					allowReset={ props.iconPosition || props.iconSpacing }
				>
					{ props.onChangeIconPosition &&
						<SelectControl
							label={ __( 'Icon Position' ) }
							value={ props.iconPosition }
							options={ [
								{ value: '', label: __( 'Left' ) },
								{ value: 'right', label: __( 'Right' ) },
							] }
							onChange={ props.onChangeIconPosition }
						/>
					}
					{ props.onChangeIconSpacing && (
						<RangeControl
							label={ __( 'Icon Spacing' ) }
							value={ props.iconSpacing }
							onChange={ props.onChangeIconSpacing }
							min={ 0 }
							max={ 50 }
							step={ 1 }
							allowReset={ true }
						/>
					) }
				</ButtonIconPopoverControl>
			) }
		</Fragment>
	)
}

ButtonControls.defaultProps = {
	// Used for typography.
	hasTypography: true,
	attrNameTemplate: '%s',
	setAttributes: () => {},
	blockAttributes: {},

	design: '',
	onChangeDesign: () => {},

	url: '',
	newWindow: '',
	onChangeUrl: () => {},
	onChangeNewWindow: () => {},

	size: '',
	onChangeSize: () => {},

	hasAdvancedColors: true,
	onResetAdvancedColors: () => {},
	opacity: '',
	textColor: '',
	backgroundColorType: '',
	backgroundColor: '',
	backgroundColor2: '',
	backgroundGradientDirection: '',
	onChangeOpacity: () => {},
	onChangeTextColor: () => {},
	onChangeBackgroundColorType: () => {},
	onChangeBackgroundColor: () => {},
	onChangeBackgroundColor2: () => {},
	onChangeBackgroundGradientDirection: () => {},

	hasHoverColors: true,
	onResetHoverColors: () => {},
	hoverEffect: '',
	hoverOpacity: '',
	hoverTextColor: '',
	hoverBackgroundColor: '',
	hoverBackgroundColor2: '',
	hoverBackgroundGradientDirection: '',
	hoverGhostToNormal: false,
	onChangeHoverEffect: () => {},
	onChangeHoverOpacity: () => {},
	onChangeHoverTextColor: () => {},
	onChangeHoverBackgroundColor: () => {},
	onChangeHoverBackgroundColor2: () => {},
	onChangeHoverBackgroundGradientDirection: () => {},
	onChangeHoverGhostToNormal: () => {},

	borderRadius: '',
	onChangeBorderRadius: () => {},
	borderWidth: '',
	onChangeBorderWidth: () => {},
	shadow: '',
	onChangeShadow: () => {},

	hasAdvancedIcon: true,
	onResetAdvancedIcon: () => {},
	icon: '',
	iconPosition: '',
	iconSpacing: '',
	onChangeIcon: () => {},
	onChangeIconPosition: () => {},
	onChangeIconSpacing: () => {},
}

export default ButtonControls
