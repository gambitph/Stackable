/**
 * Internal dependencies
 */
import './store'
import {
	LayoutSettings, STATES, hoverState,
} from './utils'

/**
 * External dependencies
 */
import {
	AdvancedToolbarControl,
	AdvancedRangeControl,
	FourRangeControl,
	PanelAdvancedSettings,
	ShadowControl,
	getShadows,
	Button,
	HelpTooltip,
} from '~stackable/components'
import { IMAGE_SHADOWS, BORDER_CONTROLS } from '~stackable/block-components'
import { i18n } from 'stackable'
import { useDeviceType, useBlockHoverState } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { models } from '@wordpress/api'
import { useSelect, dispatch } from '@wordpress/data'
import { addFilter } from '@wordpress/hooks'
import { useState } from '@wordpress/element'
import { isEmpty } from 'lodash'

export { GlobalBlockLayoutStyles } from './editor-loader'

let saveTimeout = null

addFilter( 'stackable.global-settings.inspector', 'stackable/block-layouts', output => {
	const [ isOpen, setIsOpen ] = useState( false )
	const [ displayHoverNotice, setDisplayHoverNotice ] = useState( false )
	const {
		blockLayouts,
	} = useSelect( select => {
		const _blockLayouts = select( 'stackable/global-block-layouts' ).getBlockLayouts()
		return {
			blockLayouts: { ..._blockLayouts },
		}
	}, [] )
	const [ currentHoverState ] = useBlockHoverState( { forceUpdateHoverState: true } )
	const deviceType = useDeviceType()
	const shadows = getShadows()

	const getValue = ( property, {
		responsive = false, hover = false, unit = false,
	} = {} ) => {
		const device = responsive ? deviceType.toLowerCase() : 'desktop'
		const state = hover ? hoverState[ currentHoverState ] : ''
		const withUnit = unit ? 'Unit' : ''
		const deviceState = `${ device }${ state }${ withUnit }`

		return blockLayouts[ property ]?.[ deviceState ]
	}

	const valueCallback = ( value, isImage = false ) => {
		const options = isImage ? IMAGE_SHADOWS : shadows
		return value ? ( options.indexOf( value ) === -1 ? 'custom' : options.indexOf( value ) ) : ''
	}

	const changeCallback = ( index, isImage = false ) => {
		const options = isImage ? IMAGE_SHADOWS : shadows
		return index !== '' ? options[ index ] : index
	}

	const saveSettings = newSettings => {
		clearTimeout( saveTimeout )
		saveTimeout = setTimeout( () => {
			const settings = new models.Settings( { stackable_global_block_layouts: newSettings } ) // eslint-disable-line camelcase
			settings.save()
		}, 300 )

		// Update our store.
		dispatch( 'stackable/global-block-layouts' ).updateBlockLayouts( newSettings )
	}

	const onChange = ( property, _value, {
		responsive = false, hover = false, unit = false,
	} = {} ) => {
		const newSettings = { ...blockLayouts }
		let state = 'desktop'

		if ( responsive ) {
			state = deviceType.toLowerCase()
		}

		if ( hover ) {
			state += hoverState[ currentHoverState ]
		}

		if ( unit ) {
			state += 'Unit'
		}

		// Display the Hover Notice if we're not in normal state and we're not changing the unit.
		if ( currentHoverState !== 'normal' && ! unit ) {
			const disableHoverNotice = localStorage.getItem( 'stk-disable-global-block-layouts-hover-notice' )

			if ( ! disableHoverNotice ) {
				setDisplayHoverNotice( true )
			}
		}

		if ( ! ( property in newSettings ) ) {
			newSettings[ property ] = {}
		}

		if ( _value === '' ||
			( typeof _value === 'object' && Object.values( _value ).every( v => v === '' ) ) ||
			( unit && _value === 'px' ) ) {
			delete newSettings[ property ][ state ]

			if ( Object.keys( newSettings[ property ] ).length === 0 ) {
				delete newSettings[ property ]
			}
		} else if ( typeof _value === 'object' ) {
			const value = {}

			if ( _value.top !== '' ) {
				value.top = _value.top
			}
			if ( _value.right !== '' ) {
				value.right = _value.right
			}
			if ( _value.bottom !== '' ) {
				value.bottom = _value.bottom
			}
			if ( _value.left !== '' ) {
				value.left = _value.left
			}

			newSettings[ property ][ state ] = value
		} else {
			newSettings[ property ][ state ] = _value
		}

		saveSettings( newSettings )
	}

	const getHasDeviceValue = ( property, device ) => {
		if ( property in blockLayouts ) {
			const states = {
				normal: device,
				hover: `${ device }Hover`,
				'parent-hover': `${ device }ParentHover`,
			}

			return blockLayouts[ property ]?.[ states.normal ] !== undefined ||
				blockLayouts[ property ]?.[ states.hover ] !== undefined ||
				blockLayouts[ property ]?.[ states[ 'parent-hover' ] ] !== undefined
		}
		return false
	}

	const getHasHoverStateValues = ( property, responsive = false ) => {
		const values = { hover: false, 'parent-hover': false }

		if ( property in blockLayouts ) {
			const states = {
				hover: `${ responsive ? deviceType.toLowerCase() : 'desktop' }Hover`,
				'parent-hover': `${ responsive ? deviceType.toLowerCase() : 'desktop' }ParentHover`,
			}
			values.hover = blockLayouts[ property ]?.[ states.hover ] !== undefined
			values[ 'parent-hover' ] = blockLayouts[ property ]?.[ states[ 'parent-hover' ] ] !== undefined
		}

		return values
	}

	return (
		<>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Global Block Layouts', i18n ) }
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
							const confirmReset = window.confirm( __( 'Are you sure you want to reset all block layout settings to default values?', i18n ) )
							if ( ! confirmReset ) {
								return
							}

							saveSettings( {} )
						} }
						text={ __( 'Reset All Block Layout Settings', i18n ) }
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

				</LayoutSettings>

				<LayoutSettings title={ __( 'Buttons', i18n ) }>
					<AdvancedRangeControl
						label={ __( 'Min. Button Height', i18n ) }
						responsive="all"
						min={ 0 }
						max={ 100 }
						placeholder="0"
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

				<LayoutSettings title={ __( 'Icon Buttons', i18n ) }>
					<p>
						{ __( 'These are additional settings that apply to Icon Button Blocks.', i18n ) }
					</p>
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

					/>
				</LayoutSettings>
				<LayoutSettings title={ __( 'Icon List', i18n ) }>
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

				<LayoutSettings title={ __( 'Icons', i18n ) }>
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
