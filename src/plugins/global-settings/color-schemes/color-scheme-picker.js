/**
 * Internal dependencies
 */
import { hoverState } from '../utils'
import PRESET_COLOR_SCHEMES from './preset-color-schemes.json'
/**
 * External dependencies
 */
import {
	i18n, isPro, showProNotice,
} from 'stackable'
import {
	SortablePicker,
	InspectorSubHeader,
	ColorPaletteControl,
	AdvancedTextControl,
	ColorSchemePreview,
	ColorSchemePresetPicker,
	DEFAULT_COLOR_SCHEME_COLORS,
	AdvancedToggleControl,
	ProControlButton,
	ControlSeparator,
} from '~stackable/components'
import { useBlockHoverState } from '~stackable/hooks'
import { extractColor } from '~stackable/util'
import { cloneDeep, isEqual } from 'lodash'

import {
	useRef, useState, useEffect,
} from '@wordpress/element'
import { useSelect, dispatch } from '@wordpress/data'
import { models } from '@wordpress/api'
import { __, sprintf } from '@wordpress/i18n'
import { applyFilters, doAction } from '@wordpress/hooks'

let saveTimeout = null

const PRESETS = [ ...PRESET_COLOR_SCHEMES ]

const COLOR_SETTINGS = [ {
	label: __( 'Background Color', i18n ),
	property: 'backgroundColor',
	disabledTooltip: {
		gradient: sprintf( __( 'The %s cannot be changed in any hover state when using a gradient.', i18n ),
			__( 'Background Color', i18n ) ),
		'parent-hover': sprintf( __( 'Changing the %s is not allowed for %s state.', i18n ),
			__( 'Background Color', i18n ), __( 'parent-hover', i18n ) ),
	},
}, {
	label: __( 'Heading Color', i18n ),
	property: 'headingColor',
	disabledTooltip: {
		hover: sprintf( __( 'Changing the %s is not allowed for %s state.', i18n ),
			__( 'Heading Color', i18n ), __( 'hover', i18n ) ),
	},
}, {
	label: __( 'Text Color', i18n ),
	property: 'textColor',
	disabledTooltip: {
		hover: sprintf( __( 'Changing the %s is not allowed for %s state.', i18n ),
			__( 'Text Color', i18n ), __( 'hover', i18n ) ),
	},
}, {
	label: __( 'Link Color', i18n ),
	property: 'linkColor',
}, {
	label: __( 'Accent Color', i18n ),
	property: 'accentColor',
	disabledTooltip: {
		hover: sprintf( __( 'Changing the %s is not allowed for %s state.', i18n ),
			__( 'Text Color', i18n ), __( 'hover', i18n ) ),
	},
}, {
	label: __( 'Button Color', i18n ),
	property: 'buttonBackgroundColor',
}, {
	label: __( 'Button Text Color', i18n ),
	property: 'buttonTextColor',
}, {
	label: __( 'Button Outline Color', i18n ),
	property: 'buttonOutlineColor',
} ]

const ColorSchemePicker = props => {
	const ref = useRef()
	const {
		itemInEdit,
		setItemInEdit,
		setDisplayHoverNotice,
	} = props

	const { colorSchemes } = useSelect( select => {
		const { colorSchemes: _colorSchemes } = select( 'stackable/global-color-schemes' ).getSettings()
		return {
			colorSchemes: cloneDeep( _colorSchemes ),
		}
	} )

	const presets = applyFilters( 'stackable.global-settings.global-color-schemes.presets', PRESETS )

	const [ subHeaderControls, setSubHeaderControls ] = useState( { showTrash: false, showReset: false } )
	const [ currentHoverState ] = useBlockHoverState( { forceUpdateHoverState: true } )

	const currentState = `desktop${ hoverState[ currentHoverState ] }`

	const showResetButton = item => {
		return ! isEqual( item.colorScheme, DEFAULT_COLOR_SCHEME_COLORS )
	}

	useEffect( () => {
		if ( ! itemInEdit ) {
			setSubHeaderControls( { showTrash: false, showReset: false } )
			return
		}
		const controls = {
			showTrash: ! itemInEdit.key.startsWith( 'scheme-default' ),
			showReset: showResetButton( itemInEdit ),
		}

		setSubHeaderControls( controls )
	}, [ itemInEdit ] )

	// Get the custom color schemes
	const customColorSchemes = applyFilters( 'stackable.global-settings.global-color-schemes.custom-color-schemes', [] )

	// Add a custom color scheme
	const handleAddItem = ( event, scheme = null ) => {
		doAction( 'stackable.global-settings.global-color-schemes.custom-color-schemes.add-color-scheme', scheme, setItemInEdit, saveTimeout )
	}

	// For sorting custom color schemes
	const onSortEnd = props => {
		doAction( 'stackable.global-settings.global-color-schemes.custom-color-schemes.sort-color-schemes', props, saveTimeout )
	}

	const updateColorSchemes = currentItem => {
		clearTimeout( saveTimeout )

		// If the color scheme being edited is a custom color scheme, customUpdate will return true
		const customUpdate = applyFilters( 'stackable.global-settings.global-color-schemes.update-color-schemes', false, currentItem, saveTimeout )

		if ( ! customUpdate ) {
			// Do this only when the color scheme being edited is the default/fixed color schemes (the first two color schemes)
			const updatedColorSchemes = cloneDeep( colorSchemes )
			const currentIndex = colorSchemes.findIndex( c => c.key === currentItem.key )
			updatedColorSchemes[ currentIndex ] = currentItem

			saveTimeout = setTimeout( () => {
				const settings = new models.Settings( { stackable_global_color_schemes: updatedColorSchemes } ) // eslint-disable-line camelcase
				settings.save()
			}, 300 )

			// Update our store.
			dispatch( 'stackable/global-color-schemes' ).updateColorSchemes( updatedColorSchemes )
		}
	}

	const isGradient = value => {
		if ( ! itemInEdit || ! value ) {
			return false
		}

		return value.startsWith( 'linear-' ) || value.startsWith( 'radial-' )
	}

	// For updating the Color Scheme name
	const onChangeName = name => {
		if ( ! itemInEdit ) {
			return
		}
		const currentItem = cloneDeep( itemInEdit )
		currentItem.name = name
		setItemInEdit( currentItem )

		updateColorSchemes( currentItem )
	}

	// For updating the color scheme color set
	const onChange = ( property, color ) => {
		if ( ! itemInEdit ) {
			return
		}

		if ( currentHoverState !== 'normal' ) {
			const disableHoverNotice = localStorage.getItem( 'stk-disable-global-block-color-schemes-hover-notice' )

			if ( ! disableHoverNotice ) {
				setDisplayHoverNotice( true )
			}
		}

		const currentItem = cloneDeep( itemInEdit )
		currentItem.colorScheme[ property ][ currentState ] = color

		if ( property === 'backgroundColor' && isGradient( color ) ) {
			currentItem.colorScheme[ property ].desktopHover = ''
			currentItem.colorScheme[ property ].desktopParentHover = ''
		}

		setItemInEdit( currentItem )

		updateColorSchemes( currentItem )
	}

	// For updating option to show the color scheme in color pickers
	const onChangeShowInPicker = value => {
		if ( ! itemInEdit ) {
			return
		}
		const currentItem = cloneDeep( itemInEdit )
		currentItem.hideInPicker = ! value
		setItemInEdit( currentItem )

		updateColorSchemes( currentItem )
	}

	// Update the current color scheme when a preset is selected.
	const onPresetClick = colors => {
		if ( ! itemInEdit ) {
			return
		}
		const currentItem = cloneDeep( itemInEdit )
		if ( currentHoverState === 'normal' ) {
			currentItem.colorScheme = cloneDeep( DEFAULT_COLOR_SCHEME_COLORS )
		}

		Object.entries( colors ).forEach( ( [ property, color ] ) => {
			if ( isDisabled( property ) ) {
				return
			}
			currentItem.colorScheme[ property ][ currentState ] = color
		} )

		setItemInEdit( currentItem )

		updateColorSchemes( currentItem )
	}

	const onReset = item => {
		// eslint-disable-next-line no-alert
		const confirmReset = window.confirm( __( 'Are you sure you want to reset this color scheme to their default values?', i18n ) )
		if ( ! confirmReset ) {
			return
		}

		const currentItem = cloneDeep( item )
		currentItem.colorScheme = cloneDeep( DEFAULT_COLOR_SCHEME_COLORS )

		if ( itemInEdit ) {
			setItemInEdit( currentItem )
		}
		updateColorSchemes( currentItem )
	}

	const onDeleteItem = item => {
		// If the color scheme to be deleted is a custom color scheme, customDelete will return true
		const customDelete = applyFilters( 'stackable.global-settings.global-color-schemes.delete-color-scheme', false, item, setItemInEdit, saveTimeout )

		if ( ! customDelete ) {
			// Do not delete if it is not a custom color scheme, reset it to the default value instead.
			onReset( item )
		}
	}

	// Duplicate the color scheme being edited
	const onDuplicate = item => {
		// eslint-disable-next-line no-alert
		const confirmDuplicate = window.confirm( __( 'Do you want to duplicate this color scheme?', i18n ) )

		if ( confirmDuplicate ) {
			handleAddItem( null, item )
		}
	}

	// If the property does not have a value for hover/parent-hover states, return the desktop value
	const getInheritedValue = property => {
		if ( property?.[ currentState ] ) {
			return property[ currentState ]
		}

		return property?.desktop
	}

	const ItemPreview = ( { item, withWrapper = false } ) => {
		/**
		 * We have two default color schemes: scheme-default-1 and scheme-default-2
		 * scheme-default-2 is our default color scheme when the block background setting is enabled
		 * so we use --stk-block-background-color as the default background-color for scheme-default-2
		 */
		const defaults = {
			...DEFAULT_COLOR_SCHEME_COLORS,
			...( item.key === 'scheme-default-2'
				? { backgroundColor: { desktop: 'var(--stk-block-background-color)' } }
				: {}
			),
		}

		const backgroundColorStyle = getInheritedValue( item.colorScheme.backgroundColor ) || defaults.backgroundColor.desktop

		const colors = {
			backgroundColor: backgroundColorStyle,
			headingColor: getInheritedValue( item.colorScheme.headingColor ) || defaults.headingColor.desktop,
			textColor: getInheritedValue( item.colorScheme.textColor ) || defaults.textColor.desktop,
			linkColor: getInheritedValue( item.colorScheme.linkColor ) || defaults.linkColor.desktop,
			accentColor: getInheritedValue( item.colorScheme.accentColor ) || defaults.accentColor.desktop,
			buttonBackgroundColor: getInheritedValue( item.colorScheme.buttonBackgroundColor ) || defaults.buttonBackgroundColor.desktop,
			buttonOutlineColor: getInheritedValue( item.colorScheme.buttonOutlineColor ) || defaults.buttonOutlineColor.desktop,
		}

		const Preview = <ColorSchemePreview colors={ colors } withWrapper={ withWrapper } />

		return withWrapper ? <div
			className="stk-global-color-scheme__preview-wrapper"
			style={ { background: backgroundColorStyle } }
		> { Preview } </div> : Preview
	}

	const isDisabled = property => {
		if ( property === 'backgroundColor' ) {
			if ( isGradient( itemInEdit?.colorScheme[ property ]?.desktop ) && currentHoverState !== 'normal' ) {
				return false
			}

			return currentHoverState === 'parent-hover'
		}

		if ( [ 'headingColor', 'textColor', 'accentColor' ].includes( property ) ) {
			return currentHoverState === 'hover'
		}

		return false
	}

	const hasGradientPicker = property => {
		if ( property === 'backgroundColor' || property === 'buttonBackgroundColor' ) {
			return true
		}

		return false
	}

	const getAllowedHover = property => {
		if ( property === 'backgroundColor' && isGradient( itemInEdit?.colorScheme[ property ]?.desktop ) ) {
			return false
		}

		return [ 'normal', 'hover', 'parent-hover' ]
	}

	const getToggleProps = settings => {
		const disabled = isDisabled( settings.property )
		const gradient = isGradient( itemInEdit?.colorScheme[ settings.property ]?.desktop )
		if ( ! disabled || ! settings.disabledTooltip ) {
			return {}
		}

		const useGradientTooltip = gradient && !! settings.disabledTooltip.gradient
		return {
			disabled,
			showTooltip: true,
			__experimentalIsFocusable: true,
			label: useGradientTooltip ? settings.disabledTooltip.gradient
				: settings.disabledTooltip[ currentHoverState ],
		}
	}

	return ( ! itemInEdit ? <SortablePicker
		ref={ ref }
		{ ...props }
		className="stk-global-color-scheme-picker"
		items={ customColorSchemes }
		nonSortableItems={ colorSchemes }
		editableName={ false }
		onDeleteItem={ onDeleteItem }
		handleAddItem={ handleAddItem }
		onSortEnd={ onSortEnd }
		ItemPreview={ ItemPreview }
		ItemPicker={ null }
		buttonClassName="stk-global-color-scheme__color-scheme-item"
		enableAddItem={ isPro }
		onItemClick={ item => setItemInEdit( item ) }
		showResetCallback={ item => showResetButton( item ) }
	/> : <>
		<InspectorSubHeader
			title={ __( 'Edit Color Scheme', i18n ) }
			onBack={ () => setItemInEdit( null ) }
			showTrash={ subHeaderControls.showTrash }
			showReset={ subHeaderControls.showReset }
			showDuplicate={ isPro }
			onTrash={ () => onDeleteItem( itemInEdit ) }
			onReset={ () => onReset( itemInEdit ) }
			onDuplicate={ () => onDuplicate( itemInEdit ) }
		/>
		<div className="stk-global-color-scheme__edit-panel-preview">
			<p> { __( 'Editing this scheme will also change all blocks that currently use this color scheme.', i18n ) } </p>

			<ItemPreview item={ itemInEdit } withWrapper={ true } />
			<AdvancedTextControl
				label={ __( 'Color Scheme Name', i18n ) }
				hasPanelModifiedIndicator={ false }
				value={ itemInEdit?.name }
				allowReset={ false }
				{ ...{
					readOnly: itemInEdit?.key === 'scheme-default-1' ? true : false,
					onChange: itemInEdit?.key === 'scheme-default-1' ? null : name => onChangeName( name ),
				} }
			/>
		</div>

		<ColorSchemePresetPicker
			label={ __( 'Color Scheme Presets', i18n ) }
			presets={ presets }
			onPresetClick={ onPresetClick }
		/>
		{ showProNotice && <ProControlButton type="color-schemes" /> }
		<ControlSeparator />

		<AdvancedToggleControl
			label={ __( 'Show Scheme Colors in Color Pickers', i18n ) }
			checked={ ! itemInEdit?.hideInPicker }
			defaultValue={ true }
			onChange={ value => onChangeShowInPicker( value ) }
		/>

		{ COLOR_SETTINGS.map( ( settings, index ) => (
			<ColorPaletteControl
				key={ index }
				label={ settings.label }
				value={ itemInEdit?.colorScheme[ settings.property ][ currentState ] }
				colorLabel={ extractColor( itemInEdit?.colorScheme[ settings.property ][ currentState ] ) }
				hover={ getAllowedHover( settings.property ) }
				forceUpdateHoverState={ true }
				onChange={ color => onChange( settings.property, color ) }
				help={ settings.property === 'backgroundColor' ? __( 'Note: Background color is not used for Base Color Scheme.', i18n ) : '' }
				hasGradientPicker={ hasGradientPicker( settings.property ) }
				enableGradient={ currentHoverState === 'normal' || settings.property === 'buttonBackgroundColor' }
				additionalToggleProps={ getToggleProps( settings ) }
				allowReset={ ! isDisabled( settings.property ) }
			/>
		) ) }
	</>
	)
}

ColorSchemePicker.defaultProps = {
	className: '',
	label: '',
	onReset: () => {},
}

export default ColorSchemePicker
