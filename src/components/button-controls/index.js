/**
 * External dependencies
 */
import {
	AdvancedRangeControl,
	ButtonIconPopoverControl,
	ColorPaletteControl,
	ControlSeparator,
	DesignControl,
	FourRangeControl,
	IconControl,
	TextToolbar,
	TypographyControlHelper,
	URLInputControl,
} from '~stackable/components'

/**
 * Internal dependencies
 */
import ImageDesignBasic from './images/basic.png'
import ImageDesignGhost from './images/ghost.png'
import ImageDesignLink from './images/link.png'
import ImageDesignPlain from './images/plain.png'

/**
 * WordPress dependencies
 */
import {
	BaseControl,
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components'
import {
	__, _x, sprintf,
} from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { i18n } from 'stackable'

const ButtonControls = props => {
	const design = props.design ? props.design : 'basic'
	const size = props.size ? props.size : 'normal'

	const showGradient = design === 'basic'

	return (
		<Fragment>
			{ props.onChangeUrl && (
				<URLInputControl
					label={ __( 'Link / URL', i18n ) }
					value={ props.url }
					onChange={ props.onChangeUrl }
					placeholder="http://"
				/>
			) }
			{ props.onChangeUrl && props.onChangeNewTab && (
				<ToggleControl
					label={ __( 'Open link in new tab', i18n ) }
					checked={ props.newTab }
					onChange={ props.onChangeNewTab }
				/>
			) }
			{ props.onChangeUrl && props.onChangeNoFollow && (
				<ToggleControl
					label={ __( 'Nofollow link', i18n ) }
					checked={ props.noFollow }
					onChange={ props.onChangeNoFollow }
				/>
			) }

			{ props.onChangeUrl && <ControlSeparator /> }

			{ props.onChangeDesign && (
				<DesignControl
					label={ __( 'Design', i18n ) }
					selected={ design }
					options={ [
						{
							label: __( 'Basic', i18n ), value: 'basic', image: ImageDesignBasic,
						},
						{
							label: __( 'Ghost', i18n ), value: 'ghost', image: ImageDesignGhost,
						},
						{
							label: __( 'Plain', i18n ), value: 'plain', image: ImageDesignPlain,
						},
						...( ! props.onChangeUseSocialColors ? [
							{
								label: __( 'Link', i18n ), value: 'link', image: ImageDesignLink,
							} ] : []
						),
						...applyFilters( 'stackable.button.edit.layouts', [] ),
					] }
					onChange={ props.onChangeDesign }
				/>
			) }

			<ControlSeparator />

			{ props.hasTypography && design !== 'link' && (
				<TypographyControlHelper
					attrNameTemplate={ props.attrNameTemplate }
					setAttributes={ props.setAttributes }
					blockAttributes={ props.blockAttributes }
					// onChangeFontSize={ null }
					onChangeLineHeight={ null }
					showSecondFontSize={ false }
				/>
			) }

			{ props.onChangeSize && ( props.onChangeDesign ? design !== 'link' : true ) &&
				<SelectControl
					label={ __( 'Button Size', i18n ) }
					value={ size }
					options={ [
						{ value: 'tiny', label: __( 'Tiny', i18n ) },
						{ value: 'small', label: __( 'Small', i18n ) },
						{ value: 'normal', label: __( 'Normal', i18n ) },
						{ value: 'medium', label: __( 'Medium', i18n ) },
						{ value: 'large', label: __( 'Large', i18n ) },
					] }
					onChange={ props.onChangeSize }
				/>
			}

			{ props.onChangeBorderRadius && design !== 'link' && design !== 'plain' &&
				<AdvancedRangeControl
					label={ __( 'Border Radius', i18n ) }
					value={ props.borderRadius }
					min="0"
					max="100"
					onChange={ props.onChangeBorderRadius }
					allowReset={ true }
					placeholder="4"
				/>
			}

			{ props.onChangePaddings && design !== 'link' && design !== 'plain' &&
				<FourRangeControl
					label={ __( 'Vertical Padding', i18n ) }
					top={ props.paddingTop }
					bottom={ props.paddingBottom }
					onChange={ props.onChangePaddings }
					enableLeft={ false }
					enableRight={ false }
					placeholder={ [ 8, 8 ] }
				/>
			}
			{ props.onChangePaddings && design !== 'link' && design !== 'plain' &&
				<FourRangeControl
					label={ __( 'Horizontal Padding', i18n ) }
					right={ props.paddingRight }
					left={ props.paddingLeft }
					onChange={ props.onChangePaddings }
					enableTop={ false }
					enableBottom={ false }
					max={ 100 }
					placeholder={ [ 26, 26 ] }
				/>
			}

			{ props.onChangeBorderWidth && design === 'ghost' &&
				<AdvancedRangeControl
					label={ __( 'Border Width', i18n ) }
					value={ props.borderWidth }
					min="1"
					max="6"
					onChange={ props.onChangeBorderWidth }
					allowReset={ true }
					placeholder="2"
				/>
			}

			{ props.onChangeShadow && ( design === '' || design === 'basic' ) &&
				<AdvancedRangeControl
					label={ __( 'Shadow', i18n ) }
					value={ props.shadow }
					onChange={ props.onChangeShadow }
					min={ 0 }
					max={ 9 }
					allowReset={ true }
					placeholder="0"
				/>
			}

			{ design !== 'link' && <ControlSeparator /> }

			{ props.onChangeUseSocialColors &&
				<ToggleControl
					label={ __( 'Use social colors', i18n ) }
					checked={ props.useSocialColors }
					onChange={ props.onChangeUseSocialColors }
				/>
			}

			{ ( ! props.onChangeUseSocialColors || ! props.useSocialColors ) &&
				<Fragment>
					{ props.onChangeBackgroundColorType && showGradient && (
						<BaseControl
							label={ __( 'Button Color Type', i18n ) }
							id="button-color-type"
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

					{ props.onChangeBackgroundColor && design !== 'link' && (
						<ColorPaletteControl
							label={
								props.onChangeBackgroundColor2 && props.backgroundColorType === 'gradient' && showGradient ?
									sprintf( _x( '%s #%d', 'Panel title', i18n ), __( 'Button Color', i18n ), 1 ) :
									__( 'Button Color', i18n )
							}
							value={ props.backgroundColor }
							onChange={ props.onChangeBackgroundColor }
						/>
					) }

					{ props.onChangeBackgroundColor2 && props.backgroundColorType === 'gradient' && showGradient && (
						<ColorPaletteControl
							label={ sprintf( _x( '%s #%d', 'Panel title', i18n ), __( 'Button Color', i18n ), 2 ) }
							value={ props.backgroundColor2 }
							onChange={ props.onChangeBackgroundColor2 }
						/>
					) }

					{ props.onChangeBackgroundColor2 && props.backgroundColorType === 'gradient' && showGradient && (
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

					{ props.onChangeTextColor && showGradient && (
						<ColorPaletteControl
							label={ __( 'Text Color', i18n ) }
							value={ props.textColor }
							onChange={ props.onChangeTextColor }
						/>
					) }
				</Fragment>
			}

			{ props.onChangeOpacity && (
				<AdvancedRangeControl
					label={ __( 'Opacity', i18n ) }
					value={ props.opacity }
					onChange={ props.onChangeOpacity }
					min={ 0.1 }
					max={ 1 }
					step={ 0.1 }
					allowReset={ true }
					placeholder="1.0"
				/>
			) }

			{ design !== 'link' && <ControlSeparator /> }

			{ props.onChangeHoverGhostToNormal && design === 'ghost' && (
				<ToggleControl
					label={ __( 'Change to Normal Button on Hover', i18n ) }
					checked={ props.hoverGhostToNormal }
					onChange={ props.onChangeHoverGhostToNormal }
				/>
			) }

			{ props.onChangeHoverEffect && design !== 'link' && (
				<SelectControl
					label={ __( 'Hover Effect', i18n ) }
					value={ props.hoverEffect }
					onChange={ props.onChangeHoverEffect }
					options={ [
						{ value: '', label: __( 'None', i18n ) },
						{ value: 'lift', label: __( 'Lift', i18n ) },
						{ value: 'scale', label: __( 'Scale', i18n ) },
						{ value: 'lift-scale', label: __( 'Lift & Scale', i18n ) },
						{ value: 'scale-more', label: __( 'Scale More', i18n ) },
						{ value: 'lift-scale-more', label: __( 'Lift & Scale More', i18n ) },
					] }
				/>
			) }

			{ props.onChangeOpacity && (
				<RangeControl
					label={ __( 'Hover Opacity', i18n ) }
					value={ props.hoverOpacity }
					onChange={ props.onChangeHoverOpacity }
					min={ 0.1 }
					max={ 1 }
					step={ 0.1 }
					allowReset={ true }
				/>
			) }

			{ props.hasHoverColors && design !== 'link' && ( ! props.onChangeUseSocialColors || ! props.useSocialColors ) && (
				<ButtonIconPopoverControl
					label={ __( 'Hover Colors', i18n ) }
					onReset={ props.onResetHoverColors }
					allowReset={
						props.hoverBackgroundColor ||
						props.hoverBackgroundColor2 ||
						props.hoverBackgroundGradientDirection ||
						props.hoverTextColor
					}
				>
					{ props.onChangeHoverBackgroundColor && (
						<ColorPaletteControl
							label={
								props.onChangeHoverBackgroundColor && ( ( design === 'ghost' && props.hoverGhostToNormal ) || ( props.backgroundColorType === 'gradient' && showGradient ) ) ?
									sprintf( _x( '%s #%d', 'Panel title', i18n ), __( 'Button Color', i18n ), 1 ) :
									__( 'Button Color', i18n )
							}
							value={ props.hoverBackgroundColor }
							onChange={ props.onChangeHoverBackgroundColor }
						/>
					) }
					{ props.onChangeHoverBackgroundColor2 && ( ( design === 'ghost' && props.hoverGhostToNormal ) || ( props.backgroundColorType === 'gradient' && showGradient ) ) && (
						<ColorPaletteControl
							label={ sprintf( _x( '%s #%d', 'Panel title', i18n ), __( 'Button Color', i18n ), 2 ) }
							value={ props.hoverBackgroundColor2 }
							onChange={ props.onChangeHoverBackgroundColor2 }
						/>
					) }
					{ props.onChangeHoverBackgroundColor2 && ( ( design === 'ghost' && props.hoverGhostToNormal ) || ( props.backgroundColorType === 'gradient' && showGradient ) ) && (
						<AdvancedRangeControl
							label={ __( 'Gradient Direction (degrees)', i18n ) }
							value={ props.hoverBackgroundGradientDirection }
							onChange={ props.onChangeHoverBackgroundGradientDirection }
							min={ 0 }
							max={ 360 }
							step={ 10 }
							allowReset={ true }
							placeholder="90"
						/>
					) }
					{ props.onChangeHoverTextColor && ( ( design === 'ghost' && props.hoverGhostToNormal ) || showGradient ) && (
						<ColorPaletteControl
							label={ __( 'Text Color', i18n ) }
							value={ props.hoverTextColor }
							onChange={ props.onChangeHoverTextColor }
						/>
					) }
				</ButtonIconPopoverControl>
			) }

			{ design !== 'link' && <ControlSeparator /> }

			{ props.onChangeIcon && design !== 'link' &&
				<IconControl
					label={ __( 'Icon', i18n ) }
					value={ props.icon }
					onChange={ props.onChangeIcon }
				/>
			}

			{ props.hasAdvancedIcon && design !== 'link' && props.icon !== '' && (
				<ButtonIconPopoverControl
					label={ __( 'Adv. Icon Settings', i18n ) }
					onReset={ props.onResetAdvancedIcon }
					allowReset={ props.iconPosition || props.iconSize !== '' || props.iconSpacing !== '' }
				>
					{ props.onChangeIconSize && (
						<RangeControl
							label={ __( 'Icon Size', i18n ) }
							value={ props.iconSize }
							onChange={ props.onChangeIconSize }
							min={ 5 }
							max={ 100 }
							step={ 1 }
							allowReset={ true }
						/>
					) }
					{ props.onChangeIconPosition &&
						<SelectControl
							label={ __( 'Icon Position', i18n ) }
							value={ props.iconPosition }
							options={ [
								{ value: '', label: __( 'Left', i18n ) },
								{ value: 'right', label: __( 'Right', i18n ) },
							] }
							onChange={ props.onChangeIconPosition }
						/>
					}
					{ props.onChangeIconSpacing && (
						<RangeControl
							label={ __( 'Icon Spacing', i18n ) }
							value={ props.iconSpacing }
							onChange={ props.onChangeIconSpacing }
							min={ 0 }
							max={ 50 }
							step={ 1 }
							allowReset={ true }
							placeholder="16"
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
	newTab: '',
	noFollow: '',
	onChangeUrl: () => {},
	onChangeNewTab: () => {},
	onChangeNoFollow: () => {},

	size: '',
	onChangeSize: () => {},

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

	paddingTop: '',
	paddingRight: '',
	paddingBottom: '',
	paddingLeft: '',
	onChangePaddings: () => {},

	hasAdvancedIcon: true,
	onResetAdvancedIcon: () => {},
	icon: '',
	iconSize: '',
	iconPosition: '',
	iconSpacing: '',
	onChangeIcon: () => {},
	onChangeIconSize: () => {},
	onChangeIconPosition: () => {},
	onChangeIconSpacing: () => {},

	// Used by social icon buttons.
	useSocialColors: true,
	onChangeUseSocialColors: null,
}

export default ButtonControls
