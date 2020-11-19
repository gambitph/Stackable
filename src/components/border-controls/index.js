/**
 * External dependencies
 */
import {
	ButtonIconPopoverControl,
	ColorPaletteControl,
	AdvancedToolbarControl,
	SpacingControl,
} from '~stackable/components'
import { i18n } from 'stackable'
import { max } from 'lodash'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'

const BorderControls = props => {
	return (
		<Fragment>
			<ButtonIconPopoverControl
				label={ __( 'Border', i18n ) }
				popoverLabel={ __( 'Border', i18n ) }
				onReset={ props.onResetBorder }
				allowReset={ props.borderType ||
					(
						props.borderType &&
						(
							props.borderWidthTop || props.borderWidthRight || props.borderWidthBottom || props.borderWidthLeft ||
							props.tabletBorderWidthTop || props.tabletBorderWidthRight || props.tabletBorderWidthBottom || props.tabletBorderWidthLeft ||
							props.mobileBorderWidthTop || props.mobileBorderWidthRight || props.mobileBorderWidthBottom || props.mobileBorderWidthLeft ||
							props.borderColor
						)
					)
				}
				renderCustomPreview={ () => {
					if ( ! props.borderType ) {
						return null
					}
					return (
						<div
							className="ugb-border-controls__border-preview"
							style={ {
								borderStyle: props.borderType,
								borderWidth: max( [ props.borderWidthTop, props.borderWidthRight, props.borderWidthBottom, props.borderWidthLeft ] ),
								borderColor: props.borderColor,
							} }
						/>
					)
				} }
			>
				{ props.onChangeBorderType &&
					<AdvancedToolbarControl
						controls={ [
							{
								value: '',
								title: __( 'None', i18n ),
							},
							{
								value: 'solid',
								title: __( 'Solid', i18n ),
							},
							{
								value: 'dashed',
								title: __( 'Dashed', i18n ),
							},
							{
								value: 'dotted',
								title: __( 'Dotted', i18n ),
							},
						] }
						className="ugb-border-controls__border-type-toolbar"
						value={ props.borderType }
						onChange={ props.onChangeBorderType }
						fullwidth={ true }
						isSmall={ true }
					/>
				}
				{ props.onChangeBorderWidth &&
					<SpacingControl
						label={ __( 'Border Width' ) }
						units={ [ 'px' ] }
						min={ 0 }
						max={ 99 }
						step={ 1 }
						sliderMax={ 5 }
						defaultLocked={ true }

						valueDesktop={ {
							top: props.borderWidthTop,
							right: props.borderWidthRight,
							bottom: props.borderWidthBottom,
							left: props.borderWidthLeft,
						} }
						onChangeDesktop={
							( {
								top, right, bottom, left,
							} ) => {
								props.onChangeBorderWidth( {
									top: ! top && top !== 0 ? '' : parseInt( top, 10 ),
									right: ! right && right !== 0 ? '' : parseInt( right, 10 ),
									bottom: ! bottom && bottom !== 0 ? '' : parseInt( bottom, 10 ),
									left: ! left && left !== 0 ? '' : parseInt( left, 10 ),
									borderType: ! props.borderType ? 'solid' : undefined,
								} )
							}
						}

						valueTablet={ {
							top: props.tabletBorderWidthTop,
							right: props.tabletBorderWidthRight,
							bottom: props.tabletBorderWidthBottom,
							left: props.tabletBorderWidthLeft,
						} }
						onChangeTablet={
							( {
								top, right, bottom, left,
							} ) => {
								props.onChangeTabletBorderWidth( {
									top: ! top && top !== 0 ? '' : parseInt( top, 10 ),
									right: ! right && right !== 0 ? '' : parseInt( right, 10 ),
									bottom: ! bottom && bottom !== 0 ? '' : parseInt( bottom, 10 ),
									left: ! left && left !== 0 ? '' : parseInt( left, 10 ),
								} )
							}
						}

						valueMobile={ {
							top: props.mobileBorderWidthTop,
							right: props.mobileBorderWidthRight,
							bottom: props.mobileBorderWidthBottom,
							left: props.mobileBorderWidthLeft,
						} }
						onChangeMobile={
							( {
								top, right, bottom, left,
							} ) => {
								props.onChangeMobileBorderWidth( {
									top: ! top && top !== 0 ? '' : parseInt( top, 10 ),
									right: ! right && right !== 0 ? '' : parseInt( right, 10 ),
									bottom: ! bottom && bottom !== 0 ? '' : parseInt( bottom, 10 ),
									left: ! left && left !== 0 ? '' : parseInt( left, 10 ),
								} )
							}
						}

						placeholderTop="0"
						placeholderLeft="0"
						placeholderBottom="0"
						placeholderRight="0"
					/>
				}

				{ props.onChangeBorderColor &&
					<ColorPaletteControl
						value={ props.borderColor }
						onChange={ color => {
							props.onChangeBorderColor( {
								color,
								borderType: ! props.borderType ? 'solid' : undefined,
							} )
						} }
						label={ __( 'Border Color', i18n ) }
					/>
				}
			</ButtonIconPopoverControl>
		</Fragment>
	)
}

BorderControls.defaultProps = {
	onResetBorder: () => {},
	borderType: '',
	onChangeBorderType: () => {},

	borderWidthTop: '',
	borderWidthRight: '',
	borderWidthBottom: '',
	borderWidthLeft: '',
	tabletBorderWidthTop: '',
	tabletBorderWidthRight: '',
	tabletBorderWidthBottom: '',
	tabletBorderWidthLeft: '',
	mobileBorderWidthTop: '',
	mobileBorderWidthRight: '',
	mobileBorderWidthBottom: '',
	mobileBorderWidthLeft: '',
	onChangeBorderWidth: () => {},
	onChangeTabletBorderWidth: () => {},
	onChangeMobileBorderWidth: () => {},

	borderColor: '',
	onChangeBorderColor: () => {},
}

export default BorderControls
