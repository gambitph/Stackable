/**
 * Internal dependencies
 */
import './store'

/**
 * External dependencies
 */
import {
	AdvancedToolbarControl,
	AdvancedRangeControl,
	FourRangeControl,
	PanelAdvancedSettings,
	ShadowControl,
	Button,
	HelpTooltip,
	SectionSettings,
} from '~stackable/components'
import {
	useBlockLayoutEditorLoader,
	useBlockLayoutInspectorUtils,
	STATES,
} from '../utils'
import { BORDER_CONTROLS } from '~stackable/block-components'
import { i18n } from 'stackable'
import { usePresetControls } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import { addFilter } from '@wordpress/hooks'
import { useState } from '@wordpress/element'
import { isEmpty } from 'lodash'

const saveTimeout = null

addFilter( 'stackable.global-settings.inspector', 'stackable/global-buttons-and-icons', output => {
	const [ isOpen, setIsOpen ] = useState( false )
	const [ displayHoverNotice, setDisplayHoverNotice ] = useState( false )

	const [
		blockLayouts,
		getValue,
		valueCallback,
		changeCallback,
		saveSettings,
		onChange,
		getHasDeviceValue,
		getHasHoverStateValues,
	] = useBlockLayoutInspectorUtils(
		'stackable/global-buttons-and-icons',
		'stackable_global_buttons_and_icons',
		setDisplayHoverNotice,
		saveTimeout
	)

	const sizePresetMarks = usePresetControls( 'spacingSizes' )
		?.getPresetMarks( { addNonePreset: true } ) || null
	const borderRadiusPresetMarks = usePresetControls( 'borderRadius' )
		?.getPresetMarks( { addNonePreset: true } ) || null

	return (
		<>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Global Buttons & Icons', i18n ) }
				onToggle={ isOpen => setIsOpen( isOpen ) }
			>
				{ isOpen && displayHoverNotice && <span className="stk-global-block-layouts-help-tooltip">
					<HelpTooltip
						title={ __( 'Hover States', i18n ) }
						description={ __( 'When editing block layouts in the hover states, select a block to view the applied styles.', i18n ) }
						closeOnEscape={ false }
						showTooltipCheckbox={ false }
						onClose={ () => {
							setDisplayHoverNotice( false )
							localStorage.setItem( 'stk-disable-global-block-layouts-hover-notice', true )
						} }
					/>
				</span>
				}
				<p className="components-base-control__help">
					{ __( 'Globally style buttons and icons across all our blocks.', i18n ) }
					&nbsp;
					<a href="https://docs.wpstackable.com/article/648-how-to-use-global-spacing-borders?utm_source=wp-global-settings&utm_campaign=learnmore&utm_medium=gutenberg" target="_docs">
						{ __( 'Learn more about Global Styles', i18n ) }
					</a>
				</p>
				<Button
					className="stk-reset-all-block-layout-settings"
					variant="secondary"
					isSmall
					disabled={ isEmpty( blockLayouts ) }
					onClick={ () => {
						// eslint-disable-next-line no-alert
						const confirmReset = window.confirm( sprintf( __( 'Are you sure you want to reset all %s styles to their default values?', i18n ), __( 'Global Buttons & Icons', i18n ) ) )
						if ( ! confirmReset ) {
							return
						}

						saveSettings( {} )
					} }
					text={ __( 'Reset All', i18n ) }
				/>

				<SectionSettings
					title={ __( 'Buttons', i18n ) }
					description={ __( 'These styles are applied to Button Blocks.', i18n ) }
				>
					<AdvancedRangeControl
						label={ __( 'Min. Button Height', i18n ) }
						responsive="all"
						min={ 0 }
						max={ 100 }
						placeholder=""
						value={ getValue( 'button-min-height', STATES.RESPONSIVE ) }
						onChange={ value => onChange( 'button-min-height', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( 'button-min-height', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( 'button-min-height', 'mobile' ) }
						marks={ sizePresetMarks }
					/>
					<FourRangeControl
						label={ __( 'Button Padding', i18n ) }
						units={ [ 'px', '%' ] }
						responsive="all"
						sliderMin={ [ 0, 0 ] }
						sliderMax={ [ 40, 100 ] }
						vhMode={ true }
						unit={ getValue( 'button-padding', STATES.RESPONSIVE_UNIT ) || 'px' }
						onChangeUnit={ value => onChange( 'button-padding', value, STATES.RESPONSIVE_UNIT ) }
						top={ getValue( 'button-padding', STATES.RESPONSIVE )?.top }
						right={ getValue( 'button-padding', STATES.RESPONSIVE )?.right }
						bottom={ getValue( 'button-padding', STATES.RESPONSIVE )?.bottom }
						left={ getValue( 'button-padding', STATES.RESPONSIVE )?.left }
						onChange={ value => onChange( 'button-padding', value, STATES.RESPONSIVE ) }
						placeholderTop="12"
						placeholderBottom="12"
						placeholderLeft="16"
						placeholderRight="16"
						hasTabletValue={ getHasDeviceValue( 'button-padding', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( 'button-padding', 'mobile' ) }
						helpTooltip={ {
							// TODO: Add a working video
							title: __( 'Button padding', i18n ),
							description: __( 'Adjusts the space between the button text and button borders', i18n ),
						} }
						marks={ sizePresetMarks }
					/>
					<AdvancedToolbarControl
						label={ __( 'Borders', i18n ) }
						controls={ BORDER_CONTROLS }
						className="ugb-border-controls__border-type-toolbar"
						isSmall={ true }
						value={ getValue( 'button-border-style' ) }
						onChange={ value => onChange( 'button-border-style', value ) }
					/>
					<FourRangeControl
						label={ __( 'Border Width', i18n ) }
						placeholder="1"
						responsive="all"
						hover="all"
						min={ 0 }
						max={ 99 }
						step={ 1 }
						sliderMax={ 5 }
						defaultLocked={ true }
						forceUpdateHoverState={ true }
						top={ getValue( 'button-border-width', STATES.ALL )?.top }
						right={ getValue( 'button-border-width', STATES.ALL )?.right }
						bottom={ getValue( 'button-border-width', STATES.ALL )?.bottom }
						left={ getValue( 'button-border-width', STATES.ALL )?.left }
						onChange={ value => onChange( 'button-border-width', value, STATES.ALL ) }
						hasHoverStateValue={ getHasHoverStateValues( 'button-border-width', true ) }
						hasTabletValue={ getHasDeviceValue( 'button-border-width', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( 'button-border-width', 'mobile' ) }
					/>
					<FourRangeControl
						label={ __( 'Button Ghost Border Width', i18n ) }
						placeholder="2"
						responsive="all"
						hover="all"
						min={ 0 }
						max={ 99 }
						step={ 1 }
						sliderMax={ 5 }
						defaultLocked={ true }
						forceUpdateHoverState={ true }
						top={ getValue( 'button-ghost-border-width', STATES.ALL )?.top }
						right={ getValue( 'button-ghost-border-width', STATES.ALL )?.right }
						bottom={ getValue( 'button-ghost-border-width', STATES.ALL )?.bottom }
						left={ getValue( 'button-ghost-border-width', STATES.ALL )?.left }
						onChange={ value => onChange( 'button-ghost-border-width', value, STATES.ALL ) }
						hasHoverStateValue={ getHasHoverStateValues( 'button-ghost-border-width', true ) }
						hasTabletValue={ getHasDeviceValue( 'button-ghost-border-width', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( 'button-ghost-border-width', 'mobile' ) }
					/>
					<FourRangeControl
						label={ __( 'Border Radius', i18n ) }
						min={ 0 }
						isCorner={ true }
						sliderMax={ 50 }
						responsive="all"
						placeholder="0"
						onChange={ value => onChange( 'button-border-radius', value, STATES.RESPONSIVE ) }
						top={ getValue( 'button-border-radius', STATES.RESPONSIVE )?.top }
						right={ getValue( 'button-border-radius', STATES.RESPONSIVE )?.right }
						bottom={ getValue( 'button-border-radius', STATES.RESPONSIVE )?.bottom }
						left={ getValue( 'button-border-radius', STATES.RESPONSIVE )?.left }
						hasTabletValue={ getHasDeviceValue( 'button-border-radius', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( 'button-border-radius', 'mobile' ) }
						helpTooltip={ {
							video: 'general-border-radius',
							description: __( 'Adjusts the radius of block corners to make them more rounded', i18n ),
						} }
						marks={ borderRadiusPresetMarks }
					/>
					<ShadowControl
						label={ __( 'Shadow / Outline', i18n ) }
						hover="all"
						forceUpdateHoverState={ true }
						value={ valueCallback( getValue( 'button-box-shadow', STATES.HOVER ) || '' ) }
						onChange={ value => onChange( 'button-box-shadow', changeCallback( value ), STATES.HOVER ) }
						shadowFilterValue={ getValue( 'button-box-shadow', STATES.HOVER ) || '' }
						shadowFilterOnChange={ value => onChange( 'button-box-shadow', value, STATES.HOVER ) }
						hasHoverStateValue={ getHasHoverStateValues( 'button-box-shadow' ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Icon Size', i18n ) }
						placeholder="24"
						min={ 0 }
						step={ 1 }
						sliderMax={ 100 }
						responsive="all"
						value={ getValue( 'button-icon-size', STATES.RESPONSIVE ) }
						onChange={ value => onChange( 'button-icon-size', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( 'button-icon-size', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( 'button-icon-size', 'mobile' ) }

					/>
					<AdvancedRangeControl
						label={ __( 'Icon Gap', i18n ) }
						placeholder="8"
						responsive="all"
						min={ 0 }
						sliderMax={ 50 }
						value={ getValue( 'button-icon-gap', STATES.RESPONSIVE ) }
						onChange={ value => onChange( 'button-icon-gap', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( 'button-icon-gap', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( 'button-icon-gap', 'mobile' ) }
					/>

					<AdvancedRangeControl
						label={ __( 'Column Gap', i18n ) }
						placeholder="12"
						responsive="all"
						min="0"
						sliderMax="50"
						value={ getValue( 'button-column-gap', STATES.RESPONSIVE ) }
						onChange={ value => onChange( 'button-column-gap', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( 'button-column-gap', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( 'button-column-gap', 'mobile' ) }
						marks={ sizePresetMarks }
					/>
					<AdvancedRangeControl
						label={ __( 'Row Gap', i18n ) }
						placeholder="12"
						responsive="all"
						min="0"
						sliderMax="50"
						value={ getValue( 'button-row-gap', STATES.RESPONSIVE ) }
						onChange={ value => onChange( 'button-row-gap', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( 'button-row-gap', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( 'button-row-gap', 'mobile' ) }
						marks={ sizePresetMarks }
					/>
				</SectionSettings>

				<SectionSettings
					title={ __( 'Icon Buttons', i18n ) }
					description={ __( 'Additional settings that apply to Icon Button Blocks.', i18n ) }
				>
					<FourRangeControl
						label={ __( ' Button Padding', i18n ) }
						placeholderTop="12"
						placeholderBottom="12"
						placeholderLeft="12"
						placeholderRight="12"
						units={ [ 'px', '%' ] }
						responsive="all"
						vhMode={ true }
						sliderMin={ [ 0, 0 ] }
						sliderMax={ [ 40, 100 ] }
						unit={ getValue( 'icon-button-padding', STATES.RESPONSIVE_UNIT ) || 'px' }
						onChangeUnit={ value => onChange( 'icon-button-padding', value, STATES.RESPONSIVE_UNIT ) }
						top={ getValue( 'icon-button-padding', STATES.RESPONSIVE )?.top }
						right={ getValue( 'icon-button-padding', STATES.RESPONSIVE )?.right }
						bottom={ getValue( 'icon-button-padding', STATES.RESPONSIVE )?.bottom }
						left={ getValue( 'icon-button-padding', STATES.RESPONSIVE )?.left }
						onChange={ value => onChange( 'icon-button-padding', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( 'icon-button-padding', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( 'icon-button-padding', 'mobile' ) }
						helpTooltip={ {
							// TODO: Add a working video
							title: __( 'Button padding', i18n ),
							description: __( 'Adjusts the space between the button text and button borders', i18n ),
						} }
						marks={ sizePresetMarks }
					/>
				</SectionSettings>
				<SectionSettings
					title={ __( 'Icon List', i18n ) }
					description={ __( 'These styles are applied to Icon List Blocks.', i18n ) }
				>
					<AdvancedRangeControl
						label={ __( 'Icon Size', i18n ) }
						min={ 0 }
						max={ 50 }
						step={ 1 }
						placeholder="16"
						responsive="all"
						value={ getValue( 'icon-list-icon-size', STATES.RESPONSIVE ) }
						onChange={ value => onChange( 'icon-list-icon-size', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( 'icon-list-icon-size', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( 'icon-list-icon-size', 'mobile' ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Row Gap', i18n ) }
						min="0"
						sliderMax="50"
						responsive="all"
						placeholder="0"
						value={ getValue( 'icon-list-row-gap', STATES.RESPONSIVE ) }
						onChange={ value => onChange( 'icon-list-row-gap', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( 'icon-list-row-gap', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( 'icon-list-row-gap', 'mobile' ) }
						marks={ sizePresetMarks }
					/>
					<AdvancedRangeControl
						label={ __( 'Icon Gap', i18n ) }
						min="0"
						sliderMax="20"
						placeholder="8"
						responsive="all"
						value={ getValue( 'icon-list-icon-gap', STATES.RESPONSIVE ) }
						onChange={ value => onChange( 'icon-list-icon-gap', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( 'icon-list-icon-gap', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( 'icon-list-icon-gap', 'mobile' ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Indentation', i18n ) }
						min="0"
						sliderMax="50"
						placeholder="0"
						responsive="all"
						value={ getValue( 'icon-list-indentation', STATES.RESPONSIVE ) }
						onChange={ value => onChange( 'icon-list-indentation', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( 'icon-list-indentation', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( 'icon-list-indentation', 'mobile' ) }
					/>
				</SectionSettings>

				<SectionSettings
					title={ __( 'Icons', i18n ) }
					description={ __( 'These styles are applied to Icon Blocks.', i18n ) }
				>
					<AdvancedRangeControl
						label={ __( 'Icon Size', i18n ) }
						responsive="all"
						min={ 0 }
						sliderMax={ 100 }
						step={ 1 }
						placeholder="36"
						value={ getValue( 'icon-size', STATES.RESPONSIVE ) }
						onChange={ value => onChange( 'icon-size', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( 'icon-size', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( 'icon-size', 'mobile' ) }
					/>
				</SectionSettings>

			</PanelAdvancedSettings>
		</>
	)
}, 10 )

export const GlobalButtonsAndIconsStyles = () => {
	const styles = useBlockLayoutEditorLoader( 'stackable/global-buttons-and-icons', 'buttons-and-icons' )

	return styles
}
