/**
 * A popup of a color palette.
 */

import { AdvancedToolbarControl } from '..'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n'
import { getColorObjectByColorValue } from '@wordpress/block-editor'
import { applyFilters } from '@wordpress/hooks'
import {
	ColorPalette,
	ColorPicker,
	GradientPicker,
} from '@wordpress/components'
import { memo, useState } from '@wordpress/element'

const COLOR_TYPE_CONTROLS = [
	{
		value: '',
		title: __( 'Single', i18n ),
	},
	{
		value: 'gradient',
		title: __( 'Gradient', i18n ),
	},
]

export const ColorPalettePopup = memo( props => {
	const {
		onChange,
		preOnChange,
		value,
		colors,
		gradients,
		isGradient,
	} = props

	const [ tab, setTab ] = useState( value.startsWith( 'linear-' ) || value.startsWith( 'radial-' ) ? 'gradient' : '' )
	const allColors = colors.reduce( ( colors, group ) => {
		return [
			...colors,
			...( group.colors || group.gradients ),
		]
	}, [] )

	let colorLabel,
		colorName = value
	allColors.some( color => {
		if ( color.color === value || color.gradient === value ) {
			colorName = color.name
			colorLabel = color.name
			return true
		}
		return false
	} )

	colorLabel = colorName || ( value === 'transparent' ? 'Transparent' : value )

	return (
		<>
			{ props.hasGradientPicker && <AdvancedToolbarControl
				className="stk-color-palette-popup-control__tabs"
				controls={ COLOR_TYPE_CONTROLS }
				fullwidth={ false }
				allowReset={ false }
				value={ tab }
				onChange={ tab => setTab( tab ) }
				disabled={ props.enableGradient ? [] : [ 'gradient' ] }
			/> }
			{ ( props.hasGradientPicker ? tab : isGradient ) &&
				<GradientPicker
					onChange={ newValue => {
						onChange( preOnChange( newValue, value ) )
					} }
					value={ value.startsWith( 'linear-' ) || value.startsWith( 'radial-' ) ? value : null } // null prevents an error in Spectra
					gradients={ props.hasGradientPicker ? gradients : colors }
					clearable={ false }
					__experimentalHasMultipleOrigins={ true }
				/>
			}
			{ ( props.hasGradientPicker ? ! tab : ! isGradient ) &&
				<ColorPicker
					onChange={ newValue => {
						onChange( preOnChange( newValue, value ) )
					} }
					color={ value }
					enableAlpha={ true }
				/>
			}
			{ ( props.hasGradientPicker ? ! tab : ! isGradient ) && // Gradient already has it's own palette list of gradients. No need for this.
				<ColorPalette
					value={ value }
					onChange={ newValue => {
						const colorObject = getColorObjectByColorValue( allColors, newValue )
						onChange( preOnChange( applyFilters( 'stackable.color-palette-control.change', newValue, colorObject ), value ) )
					} }
					disableCustomColors={ true }
					label={ colorLabel }
					clearable={ false }
					colors={ colors }
					__experimentalHasMultipleOrigins={ true }
				/>
			}
		</>
	)
} )

const NOOP = () => {}
const PASSTHRU = v => v

ColorPalettePopup.defaultProps = {
	value: '',
	onChange: NOOP,
	preOnChange: PASSTHRU,

	colors: [],
	gradients: [],

	isGradient: false,
	hasGradientPicker: false,
	enableGradient: false,
}
