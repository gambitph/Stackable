/*
 * External dependencies
 */
import {
	InspectorStyleControls,
	PanelAdvancedSettings,
	BaseControl,
	AdvancedToolbarControl,
	ColorPaletteControl,
	AdvancedRangeControl,
	FourRangeControl,
	TabbedLayout,
} from '~stackable/components'
import { i18n } from 'stackable'
import {
	useBlockAttributes, useDeviceType, useBlockEl,
} from '~stackable/hooks'

/**
 * Internal dependencies
 */
import { BorderControls } from '../helpers'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import { useDispatch } from '@wordpress/data'
import {
	ToggleControl,
} from '@wordpress/components'
import { useBlockEditContext } from '@wordpress/block-editor'
import { useState, Fragment } from '@wordpress/element'

export const Edit = () => {
	const deviceType = useDeviceType()

	const { clientId } = useBlockEditContext()
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const attributes = useBlockAttributes( clientId )

	const [ selectedTab, setSelectedTab ] = useState( 'normal' )
	const blockEl = useBlockEl()

	return (

		<Fragment>
			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'Button', i18n ) }
					id="button"
				>

					<TabbedLayout
						options={ [
							{
								label: __( 'Normal', i18n ),
								value: 'normal',
							},
							{
								label: __( 'Hover', i18n ),
								value: 'hover',
							},
						] }
						value={ selectedTab }
						onChange={ setSelectedTab }
					/>

					{ selectedTab === 'normal' && (
						<Fragment>

							<BaseControl
								id="stk-button-normal-color-type"
							>
								<ToggleControl
									label={ __( 'No Background Color' ) }
									checked={ attributes.buttonNoBackgroundColor }
									onChange={ value => updateBlockAttributes( clientId, { buttonNoBackgroundColor: value } ) }
								/>
								{ ! attributes.buttonNoBackgroundColor && (
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
											isSmall={ true }
											fullwidth={ false }
											value={ attributes.buttonBackgroundColorType }
											onChange={ value => updateBlockAttributes( clientId, { buttonBackgroundColorType: value } ) }
										/>
										<ColorPaletteControl
											label={ attributes.buttonBackgroundColorType === 'gradient' ? sprintf( __( 'Button Color #%s', i18n ), 1 )
												: __( 'Button Color', i18n ) }
											value={ attributes.buttonBackgroundColor }
											onChange={ value => updateBlockAttributes( clientId, { buttonBackgroundColor: value } ) }
										/>
										{ attributes.buttonBackgroundColorType === 'gradient' && (
											<Fragment>
												<ColorPaletteControl
													label={ __( 'Button Color #2', i18n ) }
													value={ attributes.buttonBackgroundColor2 }
													onChange={ value => updateBlockAttributes( clientId, { buttonBackgroundColor2: value } ) }
												/>

												<AdvancedRangeControl
													label={ __( 'Gradient Direction (degrees)', i18n ) }
													value={ attributes.buttonBackgroundGradientDirection }
													onChange={ value => updateBlockAttributes( clientId, { buttonBackgroundGradientDirection: value } ) }
													min={ 0 }
													max={ 360 }
													step={ 10 }
													allowReset={ true }
												/>
											</Fragment>
										) }
									</Fragment>
								) }
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
					) }

					{ selectedTab === 'hover' && (
						<Fragment>
							<BaseControl
								id="stk-button-hover-color-type"
							>
								<ToggleControl
									label={ __( 'No Hover Background Color' ) }
									checked={ attributes.buttonHoverNoBackgroundColor }
									onChange={ value => updateBlockAttributes( clientId, { buttonHoverNoBackgroundColor: value } ) }
								/>
								{ ! attributes.buttonHoverNoBackgroundColor && (
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
											isSmall={ true }
											fullwidth={ false }
											value={ attributes.buttonHoverBackgroundColorType }
											onChange={ value => updateBlockAttributes( clientId, { buttonHoverBackgroundColorType: value } ) }
										/>
										<ColorPaletteControl
											label={ attributes.buttonHoverBackgroundColorType === 'gradient' ? sprintf( __( 'Button Hover Color #%s', i18n ), 1 )
												: __( 'Button Hover Color', i18n ) }
											value={ attributes.buttonHoverBackgroundColor }
											onChange={ value => updateBlockAttributes( clientId, { buttonHoverBackgroundColor: value } ) }
										/>
										{ attributes.buttonHoverBackgroundColorType === 'gradient' && (
											<Fragment>
												<ColorPaletteControl
													label={ __( 'Button Hover Color #2', i18n ) }
													value={ attributes.buttonHoverBackgroundColor2 }
													onChange={ value => updateBlockAttributes( clientId, { buttonHoverBackgroundColor2: value } ) }
												/>

												<AdvancedRangeControl
													label={ __( 'Hover Gradient Direction (degrees)', i18n ) }
													value={ attributes.buttonHoverBackgroundGradientDirection }
													onChange={ value => updateBlockAttributes( clientId, { buttonHoverBackgroundGradientDirection: value } ) }
													min={ 0 }
													max={ 360 }
													step={ 10 }
													allowReset={ true }
												/>
											</Fragment>
										) }
									</Fragment>
								) }
							</BaseControl>

							<BorderControls
								attrNameTemplate="buttonHover%s"
								label={ __( 'Hover Border', i18n ) }
								blockEl={ blockEl }
								blockElSelector=".stk-button__button"
							/>

						</Fragment>
					) }
				</PanelAdvancedSettings>
			</InspectorStyleControls>
		</Fragment>
	)
}
