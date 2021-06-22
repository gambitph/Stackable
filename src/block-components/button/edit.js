/*
 * External dependencies
 */
import {
	AdvancedRangeControl2,
	InspectorStyleControls,
	PanelAdvancedSettings,
	BaseControl,
	AdvancedToolbarControl,
	ColorPaletteControl,
	FourRangeControl,
} from '~stackable/components'
import { i18n } from 'stackable'
import {
	useBlockAttributes, useDeviceType, useBlockEl, useBlockHoverState,
} from '~stackable/hooks'
import { getAttributeName } from '~stackable/util'

/**
 * Internal dependencies
 */
import { BorderControls } from '../helpers'
import { LinkControls } from '../helpers/link'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import { useDispatch } from '@wordpress/data'
import { useBlockEditContext } from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element'

export const Edit = () => {
	const deviceType = useDeviceType()
	const { clientId } = useBlockEditContext()
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const attributes = useBlockAttributes( clientId )
	const [ hoverState ] = useBlockHoverState()

	const blockEl = useBlockEl()

	return (
		<Fragment>
			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'Link', i18n ) }
					id="link"
				>
					<LinkControls attrNameTemplate="link%s" />
				</PanelAdvancedSettings>

				<PanelAdvancedSettings
					title={ __( 'Button', i18n ) }
					id="button"
				>

					<Fragment>
						<BaseControl
							id="stk-button-normal-color-type"
						>
							<Fragment>
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
									attribute="buttonBackgroundColorType"
									isSmall={ true }
									fullwidth={ false }
									hover="all"
								/>
								<ColorPaletteControl
									label={ attributes[ getAttributeName( 'buttonBackgroundColorType', deviceType, hoverState ) ] === 'gradient' ? sprintf( __( 'Button Color #%s', i18n ), 1 )
										: __( 'Button Color', i18n ) }
									attribute="buttonBackgroundColor"
									hasTransparent={ attributes.buttonBackgroundColorType !== 'gradient' }
									hover="all"
								/>
								{ attributes[ getAttributeName( 'buttonBackgroundColorType', deviceType, hoverState ) ] === 'gradient' && (
									<Fragment>
										<ColorPaletteControl
											label={ __( 'Button Color #2', i18n ) }
											attribute="buttonBackgroundColor2"
											hover="all"
										/>

										<AdvancedRangeControl2
											label={ __( 'Gradient Direction (degrees)', i18n ) }
											attribute="buttonBackgroundGradientDirection"
											min={ 0 }
											max={ 360 }
											step={ 10 }
											allowReset={ true }
											hover="all"
										/>
									</Fragment>
								) }
							</Fragment>
						</BaseControl>

						<BorderControls
							blockEl={ blockEl }
							blockElSelector=".stk-button__button"
							attrNameTemplate="button%s"
						/>

						{ deviceType === 'Desktop' && (
							<FourRangeControl
								label={ __( 'Button Paddings', i18n ) }
								units={ [ 'px', '%' ] }
								screens="all"
								defaultLocked={ false }
								top={ attributes.buttonPaddingTop }
								bottom={ attributes.buttonPaddingBottom }
								right={ attributes.buttonPaddingRight }
								left={ attributes.buttonPaddingLeft }
								unit={ attributes.buttonPaddingUnit || 'px' }
								sliderMin={ [ 0, 0 ] }
								sliderMax={ [ 40, 100 ] }
								onChange={ paddings => {
									updateBlockAttributes(
										clientId,
										{
											buttonPaddingTop: ! paddings.top && paddings.top !== 0 ? '' : parseInt( paddings.top, 10 ),
											buttonPaddingRight: ! paddings.right && paddings.right !== 0 ? '' : parseInt( paddings.right, 10 ),
											buttonPaddingBottom: ! paddings.bottom && paddings.bottom !== 0 ? '' : parseInt( paddings.bottom, 10 ),
											buttonPaddingLeft: ! paddings.left && paddings.left !== 0 ? '' : parseInt( paddings.left, 10 ),
										} )
								} }
								onChangeUnit={ value => updateBlockAttributes( clientId, { marginUnitMobile: value } ) }
								propsToPassTop={ {
									placeholderRender: () => blockEl.el() && parseFloat( window.getComputedStyle( blockEl.el().querySelector( '.stk-button__button' ) ).paddingTop ),
								} }
								propsToPassBottom={ {
									placeholderRender: () => blockEl.el() && parseFloat( window.getComputedStyle( blockEl.el().querySelector( '.stk-button__button' ) ).paddingBottom ),
								} }
								propsToPassLeft={ {
									placeholderRender: () => blockEl.el() && parseFloat( window.getComputedStyle( blockEl.el().querySelector( '.stk-button__button' ) ).paddingLeft ),
								} }
								propsToPassRight={ {
									placeholderRender: () => blockEl.el() && parseFloat( window.getComputedStyle( blockEl.el().querySelector( '.stk-button__button' ) ).paddingRight ),
								} }
							/>
						) }
						{ deviceType === 'Tablet' && (
							<FourRangeControl
								label={ __( 'Button Paddings', i18n ) }
								units={ [ 'px', '%' ] }
								screens="all"
								defaultLocked={ false }
								top={ attributes.buttonPaddingTopTablet }
								bottom={ attributes.buttonPaddingBottomTablet }
								right={ attributes.buttonPaddingRightTablet }
								left={ attributes.buttonPaddingLeftTablet }
								unit={ attributes.buttonPaddingUnitTablet || 'px' }
								sliderMin={ [ 0, 0 ] }
								sliderMax={ [ 40, 100 ] }
								onChange={ paddings => {
									updateBlockAttributes(
										clientId,
										{
											buttonPaddingTopTablet: ! paddings.top && paddings.top !== 0 ? '' : parseInt( paddings.top, 10 ),
											buttonPaddingRightTablet: ! paddings.right && paddings.right !== 0 ? '' : parseInt( paddings.right, 10 ),
											buttonPaddingBottomTablet: ! paddings.bottom && paddings.bottom !== 0 ? '' : parseInt( paddings.bottom, 10 ),
											buttonPaddingLeftTablet: ! paddings.left && paddings.left !== 0 ? '' : parseInt( paddings.left, 10 ),
										} )
								} }
								onChangeUnit={ value => updateBlockAttributes( clientId, { marginUnitMobile: value } ) }
							/>
						) }
						{ deviceType === 'Mobile' && (
							<FourRangeControl
								label={ __( 'Button Paddings', i18n ) }
								units={ [ 'px', '%' ] }
								screens="all"
								defaultLocked={ false }
								top={ attributes.buttonPaddingTopMobile }
								bottom={ attributes.buttonPaddingBottomMobile }
								right={ attributes.buttonPaddingRightMobile }
								left={ attributes.buttonPaddingLeftMobile }
								unit={ attributes.buttonPaddingUnitMobile || 'px' }
								sliderMin={ [ 0, 0 ] }
								sliderMax={ [ 40, 100 ] }
								onChange={ paddings => {
									updateBlockAttributes(
										clientId,
										{
											buttonPaddingTopMobile: ! paddings.top && paddings.top !== 0 ? '' : parseInt( paddings.top, 10 ),
											buttonPaddingRightMobile: ! paddings.right && paddings.right !== 0 ? '' : parseInt( paddings.right, 10 ),
											buttonPaddingBottomMobile: ! paddings.bottom && paddings.bottom !== 0 ? '' : parseInt( paddings.bottom, 10 ),
											buttonPaddingLeftMobile: ! paddings.left && paddings.left !== 0 ? '' : parseInt( paddings.left, 10 ),
										} )
								} }
								onChangeUnit={ value => updateBlockAttributes( clientId, { marginUnitMobile: value } ) }
							/>
						) }
					</Fragment>
				</PanelAdvancedSettings>
			</InspectorStyleControls>
		</Fragment>
	)
}
