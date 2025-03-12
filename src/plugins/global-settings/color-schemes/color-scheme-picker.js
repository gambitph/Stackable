/**
 * Internal dependencies
 */
import { hoverState } from '../utils'
import { PresetColorSchemesPicker } from './presetColorSchemes'
/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'
import {
	SortablePicker,
	InspectorSubHeader,
	ColorPaletteControl,
	AdvancedTextControl,
	ColorSchemePreview,
	DEFAULT_COLOR_SCHEME_COLORS,
	DEFAULT_BACKGROUND_COLOR_SCHEME_COLORS,
} from '~stackable/components'
import { useBlockHoverState } from '~stackable/hooks'
import { extractColor } from '~stackable/util'

import { useRef } from '@wordpress/element'
import { useSelect, dispatch } from '@wordpress/data'
import { models } from '@wordpress/api'
import { __ } from '@wordpress/i18n'
import { applyFilters, doAction } from '@wordpress/hooks'

let saveTimeout = null

const COLOR_SETTINGS = [ {
	label: __( 'Background Color', i18n ),
	property: 'backgroundColor',
}, {
	label: __( 'Heading Color', i18n ),
	property: 'headingColor',
}, {
	label: __( 'Text Color', i18n ),
	property: 'textColor',
}, {
	label: __( 'Link Color', i18n ),
	property: 'linkColor',
}, {
	label: __( 'Accent Color', i18n ),
	property: 'accentColor',
}, {
	label: __( 'Button Color', i18n ),
	property: 'buttonColor',
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
	} = props

	const { colorSchemes } = useSelect( select => {
		const { colorSchemes: _colorSchemes } = select( 'stackable/global-color-schemes' ).getSettings()
		return {
			colorSchemes: [ ..._colorSchemes ],
		}
	} )

	// console.log( 'colorSchemes', colorSchemes )
	const [ currentHoverState ] = useBlockHoverState( { forceUpdateHoverState: true } )

	const customColorSchemes = applyFilters( 'stackable.global-settings.global-color-schemes.custom-color-schemes', [] )

	const handleAddItem = () => {
		doAction( 'stackable.global-settings.global-color-schemes.custom-color-schemes.add-color-scheme', saveTimeout )
	}

	const currentState = `desktop${ hoverState[ currentHoverState ] }`

	const getDefaultPreviewColors = item => {
		return item.key === 'scheme-default-2' ? DEFAULT_BACKGROUND_COLOR_SCHEME_COLORS : DEFAULT_COLOR_SCHEME_COLORS
	}

	const updateColorSchemes = currentItem => {
		clearTimeout( saveTimeout )

		const customUpdate = applyFilters( 'stackable.global-settings.global-color-schemes.update-color-schemes', currentItem, saveTimeout )

		if ( ! customUpdate ) {
			const updatedColorSchemes = [ ...colorSchemes ]
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

	const onChangeName = name => {
		if ( ! itemInEdit ) {
			return
		}
		const currentItem = { ...itemInEdit }
		currentItem.name = name
		setItemInEdit( currentItem )

		updateColorSchemes( currentItem )
	}

	const onChange = ( property, color ) => {
		if ( ! itemInEdit ) {
			return
		}
		const currentItem = { ...itemInEdit }
		currentItem.colorScheme[ property ][ currentState ] = color
		setItemInEdit( currentItem )

		updateColorSchemes( currentItem )
	}

	const onPresetClick = colors => {
		if ( ! itemInEdit ) {
			return
		}
		const currentItem = { ...itemInEdit }
		Object.entries( colors ).forEach( ( [ property, color ] ) => {
			currentItem.colorScheme[ property ].desktop = color
		} )
		setItemInEdit( currentItem )

		updateColorSchemes( currentItem )
	}

	const ItemPreview = ( { item, withWrapper = false } ) => {
		const defaults = getDefaultPreviewColors( item )

		const backgroundColorStyle = item.colorScheme.backgroundColor.desktop || defaults.backgroundColor.desktop

		const colors = {
			backgroundColor: backgroundColorStyle,
			headingColor: item.colorScheme.headingColor.desktop || defaults.headingColor.desktop,
			textColor: item.colorScheme.textColor.desktop || defaults.textColor.desktop,
			buttonColor: item.colorScheme.buttonColor.desktop || defaults.buttonColor.desktop,
			buttonOutlineColor: item.colorScheme.buttonOutlineColor.desktop || defaults.buttonOutlineColor.desktop,
		}

		const Preview = <ColorSchemePreview colors={ colors } />

		return withWrapper ? <div
			className="stk-global-color-scheme__preview-wrapper"
			style={ { backgroundColor: backgroundColorStyle } }
		> { Preview } </div> : Preview
	}

	const onItemClick = item => {
		setItemInEdit( item )
	}

	const onBack = () => {
		setItemInEdit( null )
	}

	return ( ! itemInEdit ? <SortablePicker
		ref={ ref }
		{ ...props }
		className="stk-global-color-scheme-picker"
		items={ customColorSchemes }
		nonSortableItems={ colorSchemes }
		editableName={ false }
		// onChangeItem={ onChangeColorScheme }
		// onDeleteItem={ onColorSchemeDelete }
		handleAddItem={ handleAddItem }
		// onSortEnd={ onSortEnd }
		ItemPreview={ ItemPreview }
		ItemPicker={ null }
		buttonClassName="stk-global-color-scheme__color-scheme-item"
		enableAddItem={ isPro }
		onItemClick={ onItemClick }
	/> : <>
		<InspectorSubHeader
			title={ __( 'Editing Color Scheme', i18n ) }
			onBack={ onBack }
			showTrash={ false }
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

			<PresetColorSchemesPicker onPresetClick={ onPresetClick } />
		</div>
		{ COLOR_SETTINGS.map( ( settings, index ) => (
			<ColorPaletteControl
				key={ index }
				label={ settings.label }
				value={ itemInEdit?.colorScheme[ settings.property ][ currentState ] }
				colorLabel={ extractColor( itemInEdit?.colorScheme[ settings.property ][ currentState ] ) }
				hover="all"
				forceUpdateHoverState={ true }
				onChange={ color => onChange( settings.property, color ) }
				default={ getDefaultPreviewColors( itemInEdit )[ settings.property ][ currentState ] }
				help={ settings.property === 'backgroundColor' ? __( 'Note: Background color is not used for Base Color Scheme.', i18n ) : '' }
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
