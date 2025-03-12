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
import { BORDER_CONTROLS, IMAGE_SHADOWS } from '~stackable/block-components'
import { i18n } from 'stackable'
import { useDeviceType, useBlockLayoutDefaults } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
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
					{ __( 'Globally style spacings and borders across all our blocks.', i18n ) }
					&nbsp;
					<a href="https://docs.wpstackable.com/article/648-how-to-use-global-styles?utm_source=wp-global-settings&utm_campaign=learnmore&utm_medium=gutenberg" target="_docs">
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
						const confirmReset = window.confirm( sprintf( __( 'Are you sure you want to reset all %s styles to their default values?', i18n ), __( 'Global Spacing & Borders', i18n ) ) )
						if ( ! confirmReset ) {
							return
						}

						saveSettings( {} )
					} }
					text={ __( 'Reset All', i18n ) }
				/>

				<SectionSettings
					title={ __( 'Margins', i18n ) }
					description={ __( 'These styles are applied to all our Blocks.', i18n ) }
				>
					<AdvancedRangeControl
						label={ __( 'Block Margin Bottom', i18n ) }
						responsive="all"
						sliderMin={ [ 0, 0 ] }
						sliderMax={ [ 200, 100 ] }
						placeholder="24"
						units={ [ 'px', '%' ] }
						unit={ getValue( 'block-margin-bottom', STATES.RESPONSIVE_UNIT ) || 'px' }
						onChangeUnit={ value => onChange( 'block-margin-bottom', value, STATES.RESPONSIVE_UNIT ) }
						value={ getValue( 'block-margin-bottom', STATES.RESPONSIVE ) }
						onChange={ value => onChange( 'block-margin-bottom', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( 'block-margin-bottom', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( 'block-margin-bottom', 'mobile' ) }
						helpTooltip={ {
							video: 'advanced-block-margin',
							description: __( 'Sets the block margin bottom, i.e. the space outside the block between the block border and the next block.', i18n ),
						} }
					/>
				</SectionSettings>

				<SectionSettings
					title={ __( 'Columns', i18n ) }
					description={ __( 'These styles are applied to Inner Column blocks.', i18n ) }
				>
					<AdvancedRangeControl
						label={ __( ' Inner Column Spacing', i18n ) }
						responsive="all"
						min={ [ 0, 0 ] }
						sliderMax={ [ 200, 30 ] }
						placeholder="12"
						units={ [ 'px', 'em', 'vw' ] }
						unit={ getValue( 'column-margin', STATES.RESPONSIVE_UNIT ) || 'px' }
						onChangeUnit={ value => onChange( 'column-margin', value, STATES.RESPONSIVE_UNIT ) }
						value={ getValue( 'column-margin', STATES.RESPONSIVE ) }
						onChange={ value => onChange( 'column-margin', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( 'column-margin', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( 'column-margin', 'mobile' ) }
						helpTooltip={ {
							// Add a working video
							description: __( 'Sets column paddings, the space inside the block between the block elements and the column container border', i18n ),
						} }
					/>
					<AdvancedRangeControl
						label={ __( 'Column Gap', i18n ) }
						responsive="all"
						min={ 0 }
						sliderMax={ 100 }
						placeholder="0"
						value={ getValue( 'columns-column-gap', STATES.RESPONSIVE ) }
						onChange={ value => onChange( 'columns-column-gap', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( 'columns-column-gap', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( 'columns-column-gap', 'mobile' ) }
						helpTooltip={ {
							video: 'column-gap',
							description: __( 'Sets the distance between two or more columns', i18n ),
						} }
					/>
					<AdvancedRangeControl
						label={ __( 'Row Gap', i18n ) }
						responsive="all"
						min={ 0 }
						sliderMax={ 100 }
						placeholder="0"
						value={ getValue( 'columns-row-gap', STATES.RESPONSIVE ) }
						onChange={ value => onChange( 'columns-row-gap', value, STATES.RESPONSIVE ) }
						hasTabletValue={ getHasDeviceValue( 'columns-row-gap', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( 'columns-row-gap', 'mobile' ) }
						helpTooltip={ {
							// TODO: Add a working video
							description: __( 'Sets the distance between two or more columns', i18n ),
						} }
					/>
				</SectionSettings>

				<SectionSettings
					title={ __( 'Background', i18n ) }
					description={ __( 'These styles are applied to blocks that have the "Background" option enabled in the Style Tab.', i18n ) }
				>
					<FourRangeControl
						label={ __( 'Padding', i18n ) }
						placeholder="24"
						responsive="all"
						hover="all"
						forceUpdateHoverState={ true }
						min={ [ 0, 0, 0 ] }
						sliderMax={ [ 200, 30, 100 ] }
						units={ [ 'px', 'em', '%' ] }
						unit={ getValue( 'block-background-padding', STATES.ALL_UNIT ) || 'px' }
						onChangeUnit={ value => onChange( 'block-background-padding', value, STATES.ALL_UNIT ) }
						top={ getValue( 'block-background-padding', STATES.ALL )?.top }
						right={ getValue( 'block-background-padding', STATES.ALL )?.right }
						bottom={ getValue( 'block-background-padding', STATES.ALL )?.bottom }
						left={ getValue( 'block-background-padding', STATES.ALL )?.left }
						onChange={ value => onChange( 'block-background-padding', value, STATES.ALL ) }
						hasHoverStateValue={ getHasHoverStateValues( 'block-background-padding', true ) }
						hasTabletValue={ getHasDeviceValue( 'block-background-padding', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( 'block-background-padding', 'mobile' ) }
						helpTooltip={ {
							video: 'inner-block-padding',
							description: __( 'Sets the block paddings, i.e the space between the inner columns and the block border', i18n ),
						} }
					/>
					<AdvancedToolbarControl
						label={ __( 'Borders', i18n ) }
						controls={ BORDER_CONTROLS }
						className="ugb-border-controls__border-type-toolbar"
						isSmall={ true }
						value={ getValue( 'block-background-border-style' ) }
						onChange={ value => onChange( 'block-background-border-style', value ) }
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
						top={ getValue( 'block-background-border-width', STATES.ALL )?.top }
						right={ getValue( 'block-background-border-width', STATES.ALL )?.right }
						bottom={ getValue( 'block-background-border-width', STATES.ALL )?.bottom }
						left={ getValue( 'block-background-border-width', STATES.ALL )?.left }
						onChange={ value => onChange( 'block-background-border-width', value, STATES.ALL ) }
						hasHoverStateValue={ getHasHoverStateValues( 'block-background-border-width', true ) }
						hasTabletValue={ getHasDeviceValue( 'block-background-border-width', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( 'block-background-border-width', 'mobile' ) }
					/>
					<FourRangeControl
						label={ __( 'Border Radius', i18n ) }
						min={ 0 }
						isCorner={ true }
						sliderMax={ 50 }
						responsive="all"
						placeholder="0"
						onChange={ value => onChange( 'block-background-border-radius', value, STATES.RESPONSIVE ) }
						top={ getValue( 'block-background-border-radius', STATES.RESPONSIVE )?.top }
						right={ getValue( 'block-background-border-radius', STATES.RESPONSIVE )?.right }
						bottom={ getValue( 'block-background-border-radius', STATES.RESPONSIVE )?.bottom }
						left={ getValue( 'block-background-border-radius', STATES.RESPONSIVE )?.left }
						hasTabletValue={ getHasDeviceValue( 'block-background-border-radius', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( 'block-background-border-radius', 'mobile' ) }
						helpTooltip={ {
							video: 'general-border-radius',
							description: __( 'Adjusts the radius of block corners to make them more rounded', i18n ),
						} }
					/>
					<ShadowControl
						label={ __( 'Shadow / Outline', i18n ) }
						hover="all"
						forceUpdateHoverState={ true }
						value={ valueCallback( getValue( 'block-background-box-shadow', STATES.HOVER ) || '' ) }
						onChange={ value => onChange( 'block-background-box-shadow', changeCallback( value ), STATES.HOVER ) }
						shadowFilterValue={ getValue( 'block-background-box-shadow', STATES.HOVER ) || '' }
						shadowFilterOnChange={ value => onChange( 'block-background-box-shadow', value, STATES.HOVER ) }
						hasHoverStateValue={ getHasHoverStateValues( 'block-background-box-shadow' ) }
					/>
				</SectionSettings>

				<SectionSettings
					title={ __( 'Containers', i18n ) }
					description={ __( 'These styles are applied to blocks that have the "Container" option enabled in the Layout Tab.', i18n ) }
				>
					<FourRangeControl
						label={ __( 'Padding', i18n ) }
						responsive="all"
						hover="all"
						forceUpdateHoverState={ true }
						min={ [ 0, 0, 0 ] }
						sliderMax={ [ 200, 30, 100 ] }
						units={ [ 'px', 'em', '%' ] }
						unit={ getValue( 'container-padding', STATES.ALL_UNIT ) || 'px' }
						onChangeUnit={ value => onChange( 'container-padding', value, STATES.ALL_UNIT ) }
						top={ getValue( 'container-padding', STATES.ALL )?.top }
						right={ getValue( 'container-padding', STATES.ALL )?.right }
						bottom={ getValue( 'container-padding', STATES.ALL )?.bottom }
						left={ getValue( 'container-padding', STATES.ALL )?.left }
						onChange={ value => onChange( 'container-padding', value, STATES.ALL ) }
						hasHoverStateValue={ getHasHoverStateValues( 'container-padding', true ) }
						hasTabletValue={ getHasDeviceValue( 'container-padding', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( 'container-padding', 'mobile' ) }
						placeholder="32"
						helpTooltip={ {
							video: 'inner-block-padding',
							description: __( 'Sets the block paddings, i.e the space between the inner columns and the block border', i18n ),
						} }

					/>
					<AdvancedToolbarControl
						label={ __( 'Borders', i18n ) }
						controls={ BORDER_CONTROLS }
						className="ugb-border-controls__border-type-toolbar"
						isSmall={ true }
						value={ getValue( 'container-border-style' ) }
						onChange={ value => onChange( 'container-border-style', value ) }
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
						top={ getValue( 'container-border-width', STATES.ALL )?.top }
						right={ getValue( 'container-border-width', STATES.ALL )?.right }
						bottom={ getValue( 'container-border-width', STATES.ALL )?.bottom }
						left={ getValue( 'container-border-width', STATES.ALL )?.left }
						onChange={ value => onChange( 'container-border-width', value, STATES.ALL ) }
						hasHoverStateValue={ getHasHoverStateValues( 'container-border-width', true ) }
						hasTabletValue={ getHasDeviceValue( 'container-border-width', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( 'container-border-width', 'mobile' ) }
					/>
					<FourRangeControl
						label={ __( 'Border Radius', i18n ) }
						min={ 0 }
						isCorner={ true }
						sliderMax={ 50 }
						responsive="all"
						placeholder="0"
						onChange={ value => onChange( 'container-border-radius', value, STATES.RESPONSIVE ) }
						top={ getValue( 'container-border-radius', STATES.RESPONSIVE )?.top }
						right={ getValue( 'container-border-radius', STATES.RESPONSIVE )?.right }
						bottom={ getValue( 'container-border-radius', STATES.RESPONSIVE )?.bottom }
						left={ getValue( 'container-border-radius', STATES.RESPONSIVE )?.left }
						hasTabletValue={ getHasDeviceValue( 'container-border-radius', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( 'container-border-radius', 'mobile' ) }
						helpTooltip={ {
							video: 'general-border-radius',
							description: __( 'Adjusts the radius of block corners to make them more rounded', i18n ),
						} }
					/>
					<ShadowControl
						label={ __( 'Shadow / Outline', i18n ) }
						hover="all"
						forceUpdateHoverState={ true }
						value={ valueCallback( getValue( 'container-box-shadow', STATES.HOVER ) || '' ) }
						onChange={ value => onChange( 'container-box-shadow', changeCallback( value ), STATES.HOVER ) }
						shadowFilterValue={ getValue( 'container-box-shadow', STATES.HOVER ) || '' }
						shadowFilterOnChange={ value => onChange( 'container-box-shadow', value, STATES.HOVER ) }
						hasHoverStateValue={ getHasHoverStateValues( 'container-box-shadow' ) }
					/>
				</SectionSettings>

				<SectionSettings
					title={ __( 'Image', i18n ) }
					description={ __( 'These styles are applied to all images in Stackable Blocks.', i18n ) }
				>
					<FourRangeControl
						label={ __( 'Border Radius', i18n ) }
						min={ 0 }
						isCorner={ true }
						sliderMax={ 50 }
						responsive="all"
						placeholder="0"
						onChange={ value => onChange( 'image-border-radius', value, STATES.RESPONSIVE ) }
						top={ getValue( 'image-border-radius', STATES.RESPONSIVE )?.top }
						right={ getValue( 'image-border-radius', STATES.RESPONSIVE )?.right }
						bottom={ getValue( 'image-border-radius', STATES.RESPONSIVE )?.bottom }
						left={ getValue( 'image-border-radius', STATES.RESPONSIVE )?.left }
						hasTabletValue={ getHasDeviceValue( 'image-border-radius', 'tablet' ) }
						hasMobileValue={ getHasDeviceValue( 'image-border-radius', 'mobile' ) }
						helpTooltip={ {
							video: 'image-border-radius',
							description: __( 'Adjusts the radius of image corners to make them more rounded', i18n ),
						} }
					/>
					<ShadowControl
						label={ __( 'Shadow / Outline', i18n ) }
						options={ IMAGE_SHADOWS }
						hover="all"
						isFilter={ true }
						forceUpdateHoverState={ true }
						value={ valueCallback( getValue( 'image-drop-shadow', STATES.HOVER ) || '', true ) }
						onChange={ value => onChange( 'image-drop-shadow', changeCallback( value, true ), STATES.HOVER ) }
						shadowFilterValue={ getValue( 'image-drop-shadow', STATES.HOVER ) }
						shadowFilterOnChange={ value => onChange( 'image-drop-shadow', value, STATES.HOVER ) }
						hasHoverStateValue={ getHasHoverStateValues( 'image-drop-shadow' ) }
						helpTooltip={ {
							video: 'image-shadow',
							title: __( 'Image Shadow', i18n ),
							description: __( 'Adjusts the intensity of the image shadow', i18n ),
						} }
					/>
				</SectionSettings>

			</PanelAdvancedSettings>
		</>
	)
} )

export const GlobalSpacingAndBordersStyles = () => {
	const styles = useBlockLayoutEditorLoader( 'stackable/global-spacing-and-borders' )

	return styles
}

addFilter( 'stackable.resizable-bottom-margin.default', 'stackable/block-layouts', defaultMargin => {
	const deviceType = useDeviceType()
	const { getPlaceholder } = useBlockLayoutDefaults()

	const value = getPlaceholder( 'block-margin-bottom', { device: deviceType.toLowerCase() } )

	return value || defaultMargin
} )
