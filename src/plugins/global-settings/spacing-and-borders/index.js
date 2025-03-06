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
import { BORDER_CONTROLS, IMAGE_SHADOWS } from '~stackable/block-components'
import { i18n } from 'stackable'
import { useDeviceType, useBlockLayoutDefaults } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { addFilter } from '@wordpress/hooks'
import { useState } from '@wordpress/element'
import { isEmpty } from 'lodash'

const saveTimeout = null

addFilter( 'stackable.global-settings.inspector', 'stackable/global-spacing-and-borders', output => {
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
		'stackable/global-spacing-and-borders',
		'stackable_global_spacing_and_borders',
		setDisplayHoverNotice,
		saveTimeout
	)

	return (
		<>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Global Spacing & Borders', i18n ) }
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
				{ ! isEmpty( blockLayouts ) &&
					<Button
						className="stk-reset-all-block-layout-settings"
						isTertiary
						onClick={ () => {
							// eslint-disable-next-line no-alert
							const confirmReset = window.confirm( __( 'Are you sure you want to reset all Spacing and Border styles to default values?', i18n ) )
							if ( ! confirmReset ) {
								return
							}

							saveSettings( {} )
						} }
						text={ __( 'Reset All Spacing and Border Settings', i18n ) }
					 />
				}

				<LayoutSettings title={ __( 'Margins', i18n ) }>
					<AdvancedRangeControl
						label={ __( 'Block Margin Bottom', i18n ) }
						responsive="all"
						sliderMin={ [ -50, -50 ] }
						sliderMax={ [ 200, 100 ] }
						placeholder="24"
						units={ [ 'px', '%' ] }
						unit={ getValue( '--stk-block-margin-bottom', STATES.RESPONSIVE_UNIT ) || 'px' }
						onChangeUnit={ value => onChange( '--stk-block-margin-bottom', value, STATES.RESPONSIVE_UNIT ) }
						value={ getValue( '--stk-block-margin-bottom', STATES.RESPONSIVE ) }
						onChange={ value => onChange( '--stk-block-margin-bottom', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( '--stk-block-margin-bottom', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( '--stk-block-margin-bottom', 'mobile' ) }
					/>
				</LayoutSettings>

				<LayoutSettings title={ __( 'Columns', i18n ) }>
					<AdvancedRangeControl
						label={ __( ' Inner Column Spacing', i18n ) }
						responsive="all"
						min={ [ 0, 0 ] }
						sliderMax={ [ 200, 30 ] }
						placeholder="12"
						units={ [ 'px', 'em', 'vw' ] }
						unit={ getValue( '--stk-column-margin', STATES.RESPONSIVE_UNIT ) || 'px' }
						onChangeUnit={ value => onChange( '--stk-column-margin', value, STATES.RESPONSIVE_UNIT ) }
						value={ getValue( '--stk-column-margin', STATES.RESPONSIVE ) }
						onChange={ value => onChange( '--stk-column-margin', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( '--stk-column-margin', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( '--stk-column-margin', 'mobile' ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Column Gap', i18n ) }
						responsive="all"
						min={ 0 }
						sliderMax={ 100 }
						placeholder="0"
						value={ getValue( '--stk-columns-column-gap', STATES.RESPONSIVE ) }
						onChange={ value => onChange( '--stk-columns-column-gap', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( '--stk-columns-column-gap', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( '--stk-columns-column-gap', 'mobile' ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Row Gap', i18n ) }
						responsive="all"
						min={ 0 }
						sliderMax={ 100 }
						placeholder="0"
						value={ getValue( '--stk-columns-row-gap', STATES.RESPONSIVE ) }
						onChange={ value => onChange( '--stk-columns-row-gap', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( '--stk-columns-row-gap', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( '--stk-columns-row-gap', 'mobile' ) }
					/>
				</LayoutSettings>

				<LayoutSettings title={ __( 'Container', i18n ) }>
					<FourRangeControl
						label={ __( 'Padding', i18n ) }
						responsive="all"
						hover="all"
						forceUpdateHoverState={ true }
						min={ [ 0, 0, 0 ] }
						sliderMax={ [ 200, 30, 100 ] }
						units={ [ 'px', 'em', '%' ] }
						unit={ getValue( '--stk-container-padding', STATES.ALL_UNIT ) || 'px' }
						onChangeUnit={ value => onChange( '--stk-container-padding', value, STATES.ALL_UNIT ) }
						top={ getValue( '--stk-container-padding', STATES.ALL )?.top }
						right={ getValue( '--stk-container-padding', STATES.ALL )?.right }
						bottom={ getValue( '--stk-container-padding', STATES.ALL )?.bottom }
						left={ getValue( '--stk-container-padding', STATES.ALL )?.left }
						onChange={ value => onChange( '--stk-container-padding', value, STATES.ALL ) }
						hasHoverStateValue={ getHasHoverStateValues( '--stk-container-padding', true ) }
						hasTabletValue={ getHasDeviceValue( '--stk-container-padding', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( '--stk-container-padding', 'mobile' ) }
						placeholder="32"

					/>
					<AdvancedToolbarControl
						label={ __( 'Borders', i18n ) }
						controls={ BORDER_CONTROLS }
						className="ugb-border-controls__border-type-toolbar"
						isSmall={ true }
						value={ getValue( '--stk-container-border-style' ) }
						onChange={ value => onChange( '--stk-container-border-style', value ) }
					/>
					<FourRangeControl
						label={ __( 'Border Width', i18n ) }
						responsive="all"
						hover="all"
						forceUpdateHoverState={ true }
						min={ 0 }
						max={ 99 }
						step={ 1 }
						sliderMax={ 5 }
						defaultLocked={ true }
						placeholder="1"
						top={ getValue( '--stk-container-border-width', STATES.ALL )?.top }
						right={ getValue( '--stk-container-border-width', STATES.ALL )?.right }
						bottom={ getValue( '--stk-container-border-width', STATES.ALL )?.bottom }
						left={ getValue( '--stk-container-border-width', STATES.ALL )?.left }
						onChange={ value => onChange( '--stk-container-border-width', value, STATES.ALL ) }
						hasHoverStateValue={ getHasHoverStateValues( '--stk-container-border-width', true ) }
						hasTabletValue={ getHasDeviceValue( '--stk-container-border-width', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( '--stk-container-border-width', 'mobile' ) }
					/>
					<FourRangeControl
						label={ __( 'Border Radius', i18n ) }
						min={ 0 }
						isCorner={ true }
						sliderMax={ 50 }
						responsive="all"
						placeholder="0"
						onChange={ value => onChange( '--stk-container-border-radius', value, STATES.RESPONSIVE ) }
						top={ getValue( '--stk-container-border-radius', STATES.RESPONSIVE )?.top }
						right={ getValue( '--stk-container-border-radius', STATES.RESPONSIVE )?.right }
						bottom={ getValue( '--stk-container-border-radius', STATES.RESPONSIVE )?.bottom }
						left={ getValue( '--stk-container-border-radius', STATES.RESPONSIVE )?.left }
						hasTabletValue={ getHasDeviceValue( '--stk-container-border-radius', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( '--stk-container-border-radius', 'mobile' ) }

					/>
					<ShadowControl
						label={ __( 'Shadow / Outline', i18n ) }
						hover="all"
						forceUpdateHoverState={ true }
						value={ valueCallback( getValue( '--stk-container-box-shadow', STATES.HOVER ) || '' ) }
						onChange={ value => onChange( '--stk-container-box-shadow', changeCallback( value ), STATES.HOVER ) }
						shadowFilterValue={ getValue( '--stk-container-box-shadow', STATES.HOVER ) || '' }
						shadowFilterOnChange={ value => onChange( '--stk-container-box-shadow', value, STATES.HOVER ) }
						hasHoverStateValue={ getHasHoverStateValues( '--stk-container-box-shadow' ) }
					/>
				</LayoutSettings>

				<LayoutSettings title={ __( 'Background', i18n ) } >
					<FourRangeControl
						label={ __( 'Padding', i18n ) }
						placeholder="24"
						responsive="all"
						hover="all"
						forceUpdateHoverState={ true }
						min={ [ 0, 0, 0 ] }
						sliderMax={ [ 200, 30, 100 ] }
						units={ [ 'px', 'em', '%' ] }
						unit={ getValue( '--stk-block-background-padding', STATES.ALL_UNIT ) || 'px' }
						onChangeUnit={ value => onChange( '--stk-block-background-padding', value, STATES.ALL_UNIT ) }
						top={ getValue( '--stk-block-background-padding', STATES.ALL )?.top }
						right={ getValue( '--stk-block-background-padding', STATES.ALL )?.right }
						bottom={ getValue( '--stk-block-background-padding', STATES.ALL )?.bottom }
						left={ getValue( '--stk-block-background-padding', STATES.ALL )?.left }
						onChange={ value => onChange( '--stk-block-background-padding', value, STATES.ALL ) }
						hasHoverStateValue={ getHasHoverStateValues( '--stk-block-background-padding', true ) }
						hasTabletValue={ getHasDeviceValue( '--stk-block-background-padding', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( '--stk-block-background-padding', 'mobile' ) }

					/>
					<AdvancedToolbarControl
						label={ __( 'Borders', i18n ) }
						controls={ BORDER_CONTROLS }
						className="ugb-border-controls__border-type-toolbar"
						isSmall={ true }
						value={ getValue( '--stk-block-background-border-style' ) }
						onChange={ value => onChange( '--stk-block-background-border-style', value ) }
					/>
					<FourRangeControl
						label={ __( 'Border Width', i18n ) }
						responsive="all"
						hover="all"
						min={ 0 }
						max={ 99 }
						step={ 1 }
						placeholder="1"
						sliderMax={ 5 }
						defaultLocked={ true }
						forceUpdateHoverState={ true }
						top={ getValue( '--stk-block-background-border-width', STATES.ALL )?.top }
						right={ getValue( '--stk-block-background-border-width', STATES.ALL )?.right }
						bottom={ getValue( '--stk-block-background-border-width', STATES.ALL )?.bottom }
						left={ getValue( '--stk-block-background-border-width', STATES.ALL )?.left }
						onChange={ value => onChange( '--stk-block-background-border-width', value, STATES.ALL ) }
						hasHoverStateValue={ getHasHoverStateValues( '--stk-block-background-border-width', true ) }
						hasTabletValue={ getHasDeviceValue( '--stk-block-background-border-width', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( '--stk-block-background-border-width', 'mobile' ) }
					/>
					<FourRangeControl
						label={ __( 'Border Radius', i18n ) }
						min={ 0 }
						isCorner={ true }
						sliderMax={ 50 }
						responsive="all"
						placeholder="0"
						onChange={ value => onChange( '--stk-block-background-border-radius', value, STATES.RESPONSIVE ) }
						top={ getValue( '--stk-block-background-border-radius', STATES.RESPONSIVE )?.top }
						right={ getValue( '--stk-block-background-border-radius', STATES.RESPONSIVE )?.right }
						bottom={ getValue( '--stk-block-background-border-radius', STATES.RESPONSIVE )?.bottom }
						left={ getValue( '--stk-block-background-border-radius', STATES.RESPONSIVE )?.left }
						hasTabletValue={ getHasDeviceValue( '--stk-block-background-border-radius', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( '--stk-block-background-border-radius', 'mobile' ) }
					/>
					<ShadowControl
						label={ __( 'Shadow / Outline', i18n ) }
						hover="all"
						forceUpdateHoverState={ true }
						value={ valueCallback( getValue( '--stk-block-background-box-shadow', STATES.HOVER ) || '' ) }
						onChange={ value => onChange( '--stk-block-background-box-shadow', changeCallback( value ), STATES.HOVER ) }
						shadowFilterValue={ getValue( '--stk-block-background-box-shadow', STATES.HOVER ) || '' }
						shadowFilterOnChange={ value => onChange( '--stk-block-background-box-shadow', value, STATES.HOVER ) }
						hasHoverStateValue={ getHasHoverStateValues( '--stk-block-background-box-shadow' ) }
					/>
				</LayoutSettings>

				<LayoutSettings title={ __( 'Image', i18n ) }>
					<FourRangeControl
						label={ __( 'Border Radius', i18n ) }
						min={ 0 }
						isCorner={ true }
						sliderMax={ 50 }
						responsive="all"
						placeholder="0"
						onChange={ value => onChange( '--stk-image-border-radius', value, STATES.RESPONSIVE ) }
						top={ getValue( '--stk-image-border-radius', STATES.RESPONSIVE )?.top }
						right={ getValue( '--stk-image-border-radius', STATES.RESPONSIVE )?.right }
						bottom={ getValue( '--stk-image-border-radius', STATES.RESPONSIVE )?.bottom }
						left={ getValue( '--stk-image-border-radius', STATES.RESPONSIVE )?.left }
						hasTabletValue={ getHasDeviceValue( '--stk-image-border-radius', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( '--stk-image-border-radius', 'mobile' ) }
					/>
					<ShadowControl
						label={ __( 'Shadow / Outline', i18n ) }
						options={ IMAGE_SHADOWS }
						hover="all"
						isFilter={ true }
						forceUpdateHoverState={ true }
						value={ valueCallback( getValue( '--stk-image-drop-shadow', STATES.HOVER ) || '', true ) }
						onChange={ value => onChange( '--stk-image-drop-shadow', changeCallback( value, true ), STATES.HOVER ) }
						shadowFilterValue={ getValue( '--stk-image-drop-shadow', STATES.HOVER ) }
						shadowFilterOnChange={ value => onChange( '--stk-image-drop-shadow', value, STATES.HOVER ) }
						hasHoverStateValue={ getHasHoverStateValues( '--stk-image-drop-shadow' ) }
					/>
				</LayoutSettings>

			</PanelAdvancedSettings>
		</>
	)
} )

export const GlobalSpacingAndBordersStyles = () => {
	const defaults = { ...blockLayoutDefaults }
	const styles = useBlockLayoutEditorLoader( 'stackable/global-spacing-and-borders', defaults )

	return styles
}

addFilter( 'stackable.resizable-bottom-margin.default', 'stackable/block-layouts', defaultMargin => {
	const deviceType = useDeviceType()
	const { getPlaceholder } = useBlockLayoutDefaults()

	const value = getPlaceholder( '--stk-block-margin-bottom', { device: deviceType.toLowerCase() } )

	return value || defaultMargin
} )
