/**
 * External dependencies
 */
import {
	AdvancedRangeControl,
	ColorPaletteControl,
	ControlSeparator,
	DesignControl,
	IconControl,
	WhenResponsiveScreen,
	ProControlButton,
	AdvancedToolbarControl,
} from '~stackable/components'
import { i18n, showProNotice } from 'stackable'

/**
 * Internal dependencies
 */
import ImageDesignPlain from './images/plain.png'
import ImageDesignShaped from './images/shaped.png'
import ImageDesignOutlined from './images/outlined.png'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { BaseControl } from '@wordpress/components'

const IconControls = props => {
	const design = props.design ? props.design : 'basic'
	const showBackground = design === 'shaped' || design === 'outlined'

	return (
		<Fragment>
			{ props.onChangeIcon &&
				<IconControl
					label={ __( 'Icon', i18n ) }
					value={ props.icon }
					onChange={ props.onChangeIcon }
				/>
			}

			{ props.onChangeDesign &&
				<DesignControl
					label={ __( 'Design', i18n ) }
					selected={ props.design }
					columns={ 3 }
					options={ [
						{
							label: __( 'Plain', i18n ), value: 'plain', image: ImageDesignPlain,
						},
						{
							label: __( 'Shaped', i18n ), value: 'shaped', image: ImageDesignShaped,
						},
						{
							label: __( 'Outlined', i18n ), value: 'outlined', image: ImageDesignOutlined,
						},
						...applyFilters( 'stackable.icon-controls.edit.layouts', [] ),
					] }
					onChange={ props.onChangeDesign }
				/>
			}

			{ showProNotice && <ProControlButton
				title={ __( 'Say Hello to Gorgeous Icons 👋', i18n ) }
				description={ __( 'Liven up your icons with gradient fills, multiple colors and background shapes. This feature is only available on Stackable Premium', i18n ) }
			/> }

			{ showProNotice &&
				<BaseControl
					label={ __( 'Icon Color Type', i18n ) }
					id="icon-color-type"
				>
					<AdvancedToolbarControl
						controls={ [
							{
								value: '',
								title: __( 'Single', i18n ),
							},
							{
								value: 'gradient',
								title: __( 'Gradient', i18n ),
								className: 'ugb--is-premium',
								disabled: true,
							},
							{
								value: 'multicolor',
								title: __( 'Multicolor', i18n ),
								className: 'ugb--is-premium',
								disabled: true,
							},
						] }
						value=""
						fullwidth={ false }
						isSmall={ true }
					/>
				</BaseControl>
			}

			{ applyFilters( 'stackable.icon-controls.edit.color', ( () => {
				return (
					<Fragment>
						{ props.onChangeColor &&
							<ColorPaletteControl
								label={ __( 'Icon Color', i18n ) }
								value={ props.color }
								onChange={ props.onChangeColor }
							/>
						}
					</Fragment>
				)
			} )(), props ) }

			{ props.onChangeColor && props.onChangeDesign &&
				<ControlSeparator />
			}

			{ showBackground && props.onChangeBackgroundColor &&
				<Fragment>

					{ showProNotice && props.onChangeBackgroundColorType && props.design !== 'outlined' &&
						<BaseControl
							label={ __( 'Icon Shape / Outline Color', i18n ) }
							id="icon-shape-color-type"
						>
							<AdvancedToolbarControl
								controls={ [
									{
										value: '',
										title: __( 'Single', i18n ),
									},
									{
										value: 'gradient',
										title: __( 'Gradient', i18n ),
										className: 'ugb--is-premium',
										disabled: true,
									},
								] }
								value=""
								fullwidth={ false }
								isSmall={ true }
							/>
						</BaseControl>
					}

					{ applyFilters( 'stackable.icon-controls.edit.background-color', ( () => {
						return (
							<Fragment>

								{ props.onChangeBackgroundColor &&
									<ColorPaletteControl
										label={ __( 'Icon Shape / Outline Color', i18n ) }
										value={ props.backgroundColor }
										onChange={ props.onChangeBackgroundColor }
									/>
								}
							</Fragment>
						)
					} )(), props ) }

					{ props.onChangeBorderRadius &&
						<AdvancedRangeControl
							label={ props.design === 'shaped' ? __( 'Icon Shape Border Radius', i18n ) : __( 'Outline Border Radius', i18n ) }
							value={ props.borderRadius }
							onChange={ props.onChangeBorderRadius }
							min={ 0 }
							max={ 50 }
							step={ 1 }
							allowReset={ true }
							placeholder={ 50 }
						/>
					}

					{ props.onChangePadding &&
						<AdvancedRangeControl
							label={ props.design === 'shaped' ? __( 'Icon Shape Padding', i18n ) : __( 'Outline Padding', i18n ) }
							value={ props.padding }
							onChange={ props.onChangePadding }
							min={ 0 }
							max={ 150 }
							step={ 1 }
							allowReset={ true }
							placeholder={ 20 }
						/>
					}

					{ design === 'shaped' && props.onChangeShadow &&
						<AdvancedRangeControl
							label={ __( 'Shadow / Outline', i18n ) }
							value={ props.shadow }
							onChange={ props.onChangeShadow }
							min={ 0 }
							max={ 9 }
							allowReset={ true }
							placeholder="0"
							className="ugb--help-tip-general-shadow"
						/>
					}

					{ design === 'outlined' && props.onChangeOutlineWidth &&
						<AdvancedRangeControl
							label={ __( 'Outline Width', i18n ) }
							value={ props.outlineWidth }
							onChange={ props.onChangeOutlineWidth }
							min={ 0 }
							max={ 10 }
							step={ 1 }
							allowReset={ true }
							placeholder="3"
						/>
					}

					{ props.onChangeBackgroundColorType &&
						<ControlSeparator />
					}

				</Fragment>
			}

			{ props.onChangeSize &&
				<Fragment>
					<WhenResponsiveScreen>
						<AdvancedRangeControl
							label={ __( 'Icon Size', i18n ) }
							value={ props.size }
							max={ props.sizeMax }
							onChange={ props.onChangeSize }
							allowReset={ true }
							placeholder="50"
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="tablet">
						<AdvancedRangeControl
							label={ __( 'Icon Size', i18n ) }
							value={ props.tabletSize }
							max={ props.sizeMax }
							onChange={ props.onChangeTabletSize }
							allowReset={ true }
							placeholder={ props.size || 50 }
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="mobile">
						<AdvancedRangeControl
							label={ __( 'Icon Size', i18n ) }
							value={ props.mobileSize }
							max={ props.sizeMax }
							onChange={ props.onChangeMobileSize }
							allowReset={ true }
							placeholder={ props.tabletSize || props.size || 50 }
						/>
					</WhenResponsiveScreen>
				</Fragment>
			}

			{ props.onChangeOpacity &&
				<AdvancedRangeControl
					label={ __( 'Icon Opacity', i18n ) }
					value={ props.opacity }
					min={ 0 }
					max={ 1 }
					step={ 0.1 }
					onChange={ props.onChangeOpacity }
					allowReset={ true }
					placeholder="1.0"
				/>
			}

			{ props.onChangeRotation &&
				<AdvancedRangeControl
					label={ __( 'Icon Rotation', i18n ) }
					value={ props.rotation }
					min={ 0 }
					max={ 360 }
					onChange={ props.onChangeRotation }
					allowReset={ true }
					placeholder="0"
				/>
			}

			{ applyFilters( 'stackable.icon-controls.edit.after', null, props ) }

		</Fragment>
	)
}

IconControls.defaultProps = {
	icon: '',
	onChangeIcon: () => {},
	design: '',
	onChangeDesign: () => {},
	colorType: '',
	onChangeColorType: () => {},
	color: '',
	onChangeColor: () => {},
	color2: '',
	onChangeColor2: () => {},
	colorGradientDirection: '',
	onChangeColorGradientDirection: () => {},

	// The number of color & opacity options to show for the multicolor option.
	// This typically should be based on the number of <path> tags in the SVG.
	numPaths: '',
	color3: '',
	onChangeColor3: () => {},
	color4: '',
	onChangeColor4: () => {},
	color5: '',
	onChangeColor5: () => {},
	color6: '',
	onChangeColor6: () => {},
	color7: '',
	onChangeColor7: () => {},
	color8: '',
	onChangeColor8: () => {},
	color9: '',
	onChangeColor9: () => {},
	color10: '',
	onChangeColor10: () => {},
	multiOpacity1: '',
	onChangeMultiOpacity1: () => {},
	multiOpacity2: '',
	onChangeMultiOpacity2: () => {},
	multiOpacity3: '',
	onChangeMultiOpacity3: () => {},
	multiOpacity4: '',
	onChangeMultiOpacity4: () => {},
	multiOpacity5: '',
	onChangeMultiOpacity5: () => {},
	multiOpacity6: '',
	onChangeMultiOpacity6: () => {},
	multiOpacity7: '',
	onChangeMultiOpacity7: () => {},
	multiOpacity8: '',
	onChangeMultiOpacity8: () => {},
	multiOpacity9: '',
	onChangeMultiOpacity9: () => {},
	multiOpacity10: '',
	onChangeMultiOpacity10: () => {},

	borderRadius: '',
	onChangeBorderRadius: () => {},
	padding: '',
	onChangePadding: () => {},
	shadow: '',
	onChangeShadow: () => {},
	outlineWidth: '',
	onChangeOutlineWidth: () => {},
	backgroundColorType: '',
	onChangeBackgroundColorType: () => {},
	backgroundColor: '',
	onChangeBackgroundColor: () => {},
	backgroundColor2: '',
	onChangeBackgroundColor2: () => {},
	backgroundColorGradientDirection: '',
	onChangeBackgroundColorGradientDirection: () => {},

	size: '',
	tabletSize: '',
	mobileSize: '',
	sizeMax: 300,
	onChangeSize: () => {},
	onChangeTabletSize: () => {},
	onChangeMobileSize: () => {},
	opacity: '',
	onChangeOpacity: () => {},
	rotation: '',
	onChangeRotation: () => {},

	showBackgroundShape: '',
	onChangeShowBackgroundShape: () => {},
	backgroundShape: '',
	onChangeBackgroundShape: () => {},
	backgroundShapeSize: '',
	onChangeBackgroundShapeSize: () => {},
	backgroundShapeColor: '',
	onChangeBackgroundShapeColor: () => {},
	backgroundShapeOffsetHorizontal: '',
	onChangeBackgroundShapeHorizontalOffset: () => {},
	backgroundShapeOffsetVertical: '',
	onChangeBackgroundShapeVerticalOffset: () => {},
}

export default IconControls
