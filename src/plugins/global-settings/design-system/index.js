/**
 * Internal dependencies
 */
import {
	AdvancedRangeControl, ColorPaletteControl, FourRangeControl, PanelAdvancedSettings, ProControl, ShadowControl,
} from '~stackable/components'
import { DesignSystem } from './editor-loader'
import './store'
import './margin-bottom'

/**
 * External dependencies
 */
import {
	i18n, isPro, showProNotice,
} from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { useSelect, useDispatch } from '@wordpress/data'
import { useAttributeName } from '~stackable/hooks'
import { dispatchUpdateEvent } from '~stackable/hooks/use-update-event'
export { DesignSystem }

addFilter( 'stackable.global-settings.inspector', 'stackable/design-system', output => {
	if ( ! showProNotice && ! isPro ) {
		return output
	}

	// const { deviceType } = useDeviceType()
	const styles = useSelect( select => {
		return select( 'stackable/design-system' ).getStyles()
	} )
	const { updateStyle } = useDispatch( 'stackable/design-system' )

	const marginBottomName = useAttributeName( 'marginBottom', 'all', false )
	const blockBackgroundPaddingName = useAttributeName( 'blockBackgroundPadding', 'all', false )
	const columnMarginName = useAttributeName( 'columnMargin', 'all', false )
	const containerPaddingName = useAttributeName( 'containerPadding', 'all', false )
	const buttonPaddingName = useAttributeName( 'buttonPadding', 'all', false )
	const iconButtonPaddingName = useAttributeName( 'iconButtonPadding', 'all', false )
	const buttonGhostBorderWidthName = useAttributeName( 'buttonGhostBorderWidth', 'all', false )
	const iconSizeName = useAttributeName( 'iconSize', 'all', false )

	return (
		<>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Block Design System', i18n ) }
				id="design-system"
			>
				{ ! isPro &&
					<ProControl
						title={ __( 'Say Hello to Design Systems 👋', i18n ) }
						description={ __( 'Change the timing of your CSS transitions, change the X and Y position, scale or rotate your blocks, perfect for hover animations. This feature is only available on Stackable Premium', i18n ) }
					/>
				}
				{ isPro &&
					<p className="components-base-control__help">
						{ __( 'These are design rules which apply to all Stackable blocks, adjusting these will affect all blocks in your entire site.', i18n ) }
						&nbsp;
						<a href="https://docs.wpstackable.com/article/362-how-to-use-global-colors?utm_source=wp-global-settings&utm_campaign=learnmore&utm_medium=gutenberg" target="_docs">
							{ __( 'Learn more about Design System', i18n ) }
						</a>
					</p>
				}
				{ isPro &&
					applyFilters( 'stackable.design-system.controls', null )
				}
				<PanelAdvancedSettings
					title={ __( 'Blocks', i18n ) }
					isAlt={ true }
					id="design-system"
				>
					<AdvancedRangeControl
						label={ __( 'Bottom Margin', i18n ) }
						responsive="all"
						sliderMin={ 0 }
						sliderMax={ 100 }
						placeholder="24"
						value={ styles[ marginBottomName ] }
						onChange={ value => {
							updateStyle( marginBottomName, value )
							// Trigger an update to all resizable bottom margin components.
							dispatchUpdateEvent( 'stackable.resizable-bottom-margin' )
						} }
					/>
					<ColorPaletteControl
						label={ __( 'Block Background Color', i18n ) }
						value={ styles.blockBackgroundColor }
						onChange={ value => {
							updateStyle( 'blockBackgroundColor', value )
						} }
					/>
					<FourRangeControl
						label={ __( 'Block Background Padding', i18n ) }
						responsive="all"
						units={ [ 'px' ] }
						defaultLocked={ true }
						min={ [ 0 ] }
						sliderMax={ [ 100 ] }
						placeholder={ [ 24 ] }
						className="ugb--help-tip-advanced-block-paddings"
						value={ styles[ blockBackgroundPaddingName ] }
						onChange={ value => {
							updateStyle( blockBackgroundPaddingName, value )
						} }
					/>
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					title={ __( 'Columns', i18n ) }
					isAlt={ true }
					id="design-system"
				>
					<FourRangeControl
						label={ __( 'Column Inner Spacing', i18n ) }
						responsive="all"
						units={ [ 'px' ] }
						defaultLocked={ true }
						min={ [ 0 ] }
						sliderMax={ [ 200 ] }
						placeholder="12"
						value={ styles[ columnMarginName ] }
						onChange={ value => {
							updateStyle( columnMarginName, value )
						} }
					/>
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					title={ __( 'Containers', i18n ) }
					isAlt={ true }
					id="design-system"
				>
					<ColorPaletteControl
						label={ __( 'Background Color', i18n ) }
						value={ styles.containerBackgroundColor }
						onChange={ value => {
							updateStyle( 'containerBackgroundColor', value )
						} }
					/>
					<ColorPaletteControl
						label={ __( 'Text Color', i18n ) }
						value={ styles.containerColor }
						onChange={ value => {
							updateStyle( 'containerColor', value )
						} }
					/>
					<FourRangeControl
						label={ __( 'Container Padding', i18n ) }
						responsive="all"
						units={ [ 'px' ] }
						defaultLocked={ true }
						min={ [ 0 ] }
						sliderMax={ [ 200 ] }
						placeholder="32"
						value={ styles[ containerPaddingName ] }
						onChange={ value => {
							updateStyle( containerPaddingName, value )
						} }
					/>
					<AdvancedRangeControl
						label={ __( 'Border Radius', i18n ) }
						sliderMin={ 0 }
						sliderMax={ 50 }
						placeholder="0"
						value={ styles.containerBorderRadius }
						onChange={ value => {
							updateStyle( 'containerBorderRadius', value )
						} }
					/>
					<ShadowControl
						label={ __( 'Shadow / Outline', i18n ) }
						value={ styles.containerBoxShadow }
						onChange={ value => {
							updateStyle( 'containerBoxShadow', value )
						} }
					/>
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					title={ __( 'Buttons', i18n ) }
					isAlt={ true }
					id="design-system"
				>
					{ /** TODO: hover button color .stk-button:hover:after */ }
					{ /** TODO: to implement hover button styles, maybe refer to src/block-components/button/style.js */ }
					<ColorPaletteControl
						label={ __( 'Button Color', i18n ) }
						value={ styles.buttonBackgroundColor }
						onChange={ value => {
							updateStyle( 'buttonBackgroundColor', value )
						} }
						// hover="all"
					/>
					<ColorPaletteControl
						label={ __( 'Button Text Color', i18n ) }
						value={ styles.buttonTextColor }
						onChange={ value => {
							updateStyle( 'buttonTextColor', value )
						} }
					/>
					{ /** TODO: Missing border radius */ }
					<FourRangeControl
						label={ __( 'Button Padding', i18n ) }
						units={ [ 'px' ] }
						responsive="all"
						defaultLocked={ true }
						sliderMin={ [ 0 ] }
						sliderMax={ [ 40 ] }
						value={ styles[ buttonPaddingName ] }
						onChange={ value => {
							updateStyle( buttonPaddingName, value )
						} }
					/>
					{ /* <AdvancedRangeControl
						label={ __( 'Button Icon Gap', i18n ) }
						sliderMin={ 0 }
						sliderMax={ 50 }
						placeholder="12"
						value={ styles.buttonGap }
						onChange={ value => {
							updateStyle( 'buttonGap', value )
						} }
					/> */ }
					<AdvancedRangeControl
						label={ __( 'Icon Button Padding', i18n ) }
						responsive="all"
						sliderMin={ 0 }
						sliderMax={ 40 }
						placeholder="12"
						value={ styles[ iconButtonPaddingName ] }
						onChange={ value => {
							updateStyle( iconButtonPaddingName, value )
						} }
					/>
					<AdvancedRangeControl
						label={ __( 'Button Ghost Border Width', i18n ) }
						sliderMin={ 0 }
						sliderMax={ 5 }
						placeholder="2"
						value={ styles[ buttonGhostBorderWidthName ] }
						onChange={ value => {
							updateStyle( buttonGhostBorderWidthName, value )
						} }
					/>
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					title={ __( 'Icons', i18n ) }
					isAlt={ true }
					id="design-system"
				>
					<ColorPaletteControl
						label={ __( 'Icon Color', i18n ) }
						value={ styles.iconColor }
						onChange={ value => {
							updateStyle( 'iconColor', value )
						} }
					/>
					<AdvancedRangeControl
						label={ __( 'Icon Size', i18n ) }
						responsive="all"
						min={ 0 }
						sliderMax={ 100 }
						placeholder="36"
						value={ styles[ iconSizeName ] }
						onChange={ value => {
							updateStyle( iconSizeName, value )
						} }
					/>
					{ /* <ColorPaletteControl
						label={ __( 'Icon Shape Color', i18n ) }
						value={ styles.iconShapeColor }
						onChange={ value => {
							updateStyle( 'iconShapeColor', value )
						} }
					/> */ }
				</PanelAdvancedSettings>
			</PanelAdvancedSettings>
		</>
	)
}, 9 )
