/**
 * Internal dependencies
 */
import './store'
import blockLayoutDefaults from './defaults.json'

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
} from '~stackable/components'
import {
	useBlockLayoutEditorLoader,
	useBlockLayoutInspectorUtils,
	LayoutSettings,
	STATES,
} from '../utils'
import { BORDER_CONTROLS } from '~stackable/block-components'
import { i18n } from 'stackable'

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
					{ __( 'Manage how Stackable blocks look when they\'re inserted.', i18n ) }
					&nbsp;
					<a href="https://docs.wpstackable.com/article/480-how-to-use-block-defaults?utm_source=wp-global-settings&utm_campaign=learnmore&utm_medium=gutenberg" target="_docs">
						{ __( 'Learn more about Block Defaults', i18n ) }
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

				<LayoutSettings
					title={ __( 'Buttons', i18n ) }
					description={ __( 'These styles are applied to Button Blocks.', i18n ) }
				>
					<AdvancedRangeControl
						label={ __( 'Min. Button Height', i18n ) }
						responsive="all"
						min={ 0 }
						max={ 100 }
						placeholder=""
						value={ getValue( '--stk-button-min-height', STATES.RESPONSIVE ) }
						onChange={ value => onChange( '--stk-button-min-height', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( '--stk-button-min-height', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( '--stk-button-min-height', 'mobile' ) }
					/>
					<FourRangeControl
						label={ __( 'Button Padding', i18n ) }
						units={ [ 'px', '%' ] }
						responsive="all"
						sliderMin={ [ 0, 0 ] }
						sliderMax={ [ 40, 100 ] }
						vhMode={ true }
						unit={ getValue( '--stk-button-padding', STATES.RESPONSIVE_UNIT ) || 'px' }
						onChangeUnit={ value => onChange( '--stk-button-padding', value, STATES.RESPONSIVE_UNIT ) }
						top={ getValue( '--stk-button-padding', STATES.RESPONSIVE )?.top }
						right={ getValue( '--stk-button-padding', STATES.RESPONSIVE )?.right }
						bottom={ getValue( '--stk-button-padding', STATES.RESPONSIVE )?.bottom }
						left={ getValue( '--stk-button-padding', STATES.RESPONSIVE )?.left }
						onChange={ value => onChange( '--stk-button-padding', value, STATES.RESPONSIVE ) }
						placeholderTop="12"
						placeholderBottom="12"
						placeholderLeft="16"
						placeholderRight="16"
						hasTabletValue={ getHasDeviceValue( '--stk-button-padding', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( '--stk-button-padding', 'mobile' ) }
						helpTooltip={ {
							// TODO: Add a working video
							title: __( 'Button padding', i18n ),
							description: __( 'Adjusts the space between the button text and button borders', i18n ),
						} }
					/>
					<AdvancedToolbarControl
						label={ __( 'Borders', i18n ) }
						controls={ BORDER_CONTROLS }
						className="ugb-border-controls__border-type-toolbar"
						isSmall={ true }
						value={ getValue( '--stk-button-border-style' ) }
						onChange={ value => onChange( '--stk-button-border-style', value ) }
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
						top={ getValue( '--stk-button-border-width', STATES.ALL )?.top }
						right={ getValue( '--stk-button-border-width', STATES.ALL )?.right }
						bottom={ getValue( '--stk-button-border-width', STATES.ALL )?.bottom }
						left={ getValue( '--stk-button-border-width', STATES.ALL )?.left }
						onChange={ value => onChange( '--stk-button-border-width', value, STATES.ALL ) }
						hasHoverStateValue={ getHasHoverStateValues( '--stk-button-border-width', true ) }
						hasTabletValue={ getHasDeviceValue( '--stk-button-border-width', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( '--stk-button-border-width', 'mobile' ) }
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
						top={ getValue( '--stk-button-ghost-border-width', STATES.ALL )?.top }
						right={ getValue( '--stk-button-ghost-border-width', STATES.ALL )?.right }
						bottom={ getValue( '--stk-button-ghost-border-width', STATES.ALL )?.bottom }
						left={ getValue( '--stk-button-ghost-border-width', STATES.ALL )?.left }
						onChange={ value => onChange( '--stk-button-ghost-border-width', value, STATES.ALL ) }
						hasHoverStateValue={ getHasHoverStateValues( '--stk-button-ghost-border-width', true ) }
						hasTabletValue={ getHasDeviceValue( '--stk-button-ghost-border-width', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( '--stk-button-ghost-border-width', 'mobile' ) }
					/>
					<FourRangeControl
						label={ __( 'Border Radius', i18n ) }
						min={ 0 }
						isCorner={ true }
						sliderMax={ 50 }
						responsive="all"
						placeholder="0"
						onChange={ value => onChange( '--stk-button-border-radius', value, STATES.RESPONSIVE ) }
						top={ getValue( '--stk-button-border-radius', STATES.RESPONSIVE )?.top }
						right={ getValue( '--stk-button-border-radius', STATES.RESPONSIVE )?.right }
						bottom={ getValue( '--stk-button-border-radius', STATES.RESPONSIVE )?.bottom }
						left={ getValue( '--stk-button-border-radius', STATES.RESPONSIVE )?.left }
						hasTabletValue={ getHasDeviceValue( '--stk-button-border-radius', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( '--stk-button-border-radius', 'mobile' ) }
						helpTooltip={ {
							video: 'general-border-radius',
							description: __( 'Adjusts the radius of block corners to make them more rounded', i18n ),
						} }
					/>
					<ShadowControl
						label={ __( 'Shadow / Outline', i18n ) }
						hover="all"
						forceUpdateHoverState={ true }
						value={ valueCallback( getValue( '--stk-button-box-shadow', STATES.HOVER ) || '' ) }
						onChange={ value => onChange( '--stk-button-box-shadow', changeCallback( value ), STATES.HOVER ) }
						shadowFilterValue={ getValue( '--stk-button-box-shadow', STATES.HOVER ) || '' }
						shadowFilterOnChange={ value => onChange( '--stk-button-box-shadow', value, STATES.HOVER ) }
						hasHoverStateValue={ getHasHoverStateValues( '--stk-button-box-shadow' ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Icon Size', i18n ) }
						placeholder="24"
						min={ 0 }
						step={ 1 }
						sliderMax={ 100 }
						responsive="all"
						value={ getValue( '--stk-button-icon-size', STATES.RESPONSIVE ) }
						onChange={ value => onChange( '--stk-button-icon-size', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( '--stk-button-icon-size', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( '--stk-button-icon-size', 'mobile' ) }

					/>
					<AdvancedRangeControl
						label={ __( 'Icon Gap', i18n ) }
						placeholder="8"
						responsive="all"
						min={ 0 }
						sliderMax={ 50 }
						value={ getValue( '--stk-button-icon-gap', STATES.RESPONSIVE ) }
						onChange={ value => onChange( '--stk-button-icon-gap', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( '--stk-button-icon-gap', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( '--stk-button-icon-gap', 'mobile' ) }
					/>

					<AdvancedRangeControl
						label={ __( 'Column Gap', i18n ) }
						placeholder="12"
						responsive="all"
						min="0"
						sliderMax="50"
						value={ getValue( '--stk-button-column-gap', STATES.RESPONSIVE ) }
						onChange={ value => onChange( '--stk-button-column-gap', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( '--stk-button-column-gap', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( '--stk-button-column-gap', 'mobile' ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Row Gap', i18n ) }
						placeholder="12"
						responsive="all"
						min="0"
						sliderMax="50"
						value={ getValue( '--stk-button-row-gap', STATES.RESPONSIVE ) }
						onChange={ value => onChange( '--stk-button-row-gap', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( '--stk-button-row-gap', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( '--stk-button-row-gap', 'mobile' ) }
					/>
				</LayoutSettings>

				<LayoutSettings
					title={ __( 'Icon Buttons', i18n ) }
					description={ __( 'These are additional settings that apply to Icon Button Blocks.', i18n ) }
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
						unit={ getValue( '--stk-icon-button-padding', STATES.RESPONSIVE_UNIT ) || 'px' }
						onChangeUnit={ value => onChange( '--stk-icon-button-padding', value, STATES.RESPONSIVE_UNIT ) }
						top={ getValue( '--stk-icon-button-padding', STATES.RESPONSIVE )?.top }
						right={ getValue( '--stk-icon-button-padding', STATES.RESPONSIVE )?.right }
						bottom={ getValue( '--stk-icon-button-padding', STATES.RESPONSIVE )?.bottom }
						left={ getValue( '--stk-icon-button-padding', STATES.RESPONSIVE )?.left }
						onChange={ value => onChange( '--stk-icon-button-padding', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( '--stk-icon-button-padding', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( '--stk-icon-button-padding', 'mobile' ) }
						helpTooltip={ {
							// TODO: Add a working video
							title: __( 'Button padding', i18n ),
							description: __( 'Adjusts the space between the button text and button borders', i18n ),
						} }
					/>
				</LayoutSettings>
				<LayoutSettings
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
						value={ getValue( '--stk-icon-list-size', STATES.RESPONSIVE ) }
						onChange={ value => onChange( '--stk-icon-list-size', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( '--stk-icon-list-size', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( '--stk-icon-list-size', 'mobile' ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Row Gap', i18n ) }
						min="0"
						sliderMax="50"
						responsive="all"
						placeholder="0"
						value={ getValue( '--stk-icon-list-row-gap', STATES.RESPONSIVE ) }
						onChange={ value => onChange( '--stk-icon-list-row-gap', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( '--stk-icon-list-row-gap', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( '--stk-icon-list-row-gap', 'mobile' ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Icon Gap', i18n ) }
						min="0"
						sliderMax="20"
						placeholder="8"
						responsive="all"
						value={ getValue( '--stk-icon-list-icon-gap', STATES.RESPONSIVE ) }
						onChange={ value => onChange( '--stk-icon-list-icon-gap', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( '--stk-icon-list-icon-gap', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( '--stk-icon-list-icon-gap', 'mobile' ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Indentation', i18n ) }
						min="0"
						sliderMax="50"
						placeholder="0"
						responsive="all"
						value={ getValue( '--stk-icon-list-indentation', STATES.RESPONSIVE ) }
						onChange={ value => onChange( '--stk-icon-list-indentation', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( '--stk-icon-list-indentation', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( '--stk-icon-list-indentation', 'mobile' ) }
					/>
				</LayoutSettings>

				<LayoutSettings
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
						value={ getValue( '--stk-icon-size', STATES.RESPONSIVE ) }
						onChange={ value => onChange( '--stk-icon-size', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( '--stk-icon-size', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( '--stk-icon-size', 'mobile' ) }
					/>
				</LayoutSettings>

			</PanelAdvancedSettings>
		</>
	)
} )

export const GlobalButtonsAndIconsStyles = () => {
	const defaults = { ...blockLayoutDefaults }
	const styles = useBlockLayoutEditorLoader( 'stackable/global-buttons-and-icons', defaults )

	return styles
}
