/**
 * A popup of a color palette.
 */

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
import { memo } from '@wordpress/element'

export const ColorPalettePopup = memo( props => {
	const {
		onChange,
		preOnChange,
		value,
		colors,
		isGradient,
	} = props

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
			{ isGradient &&
				<GradientPicker
					onChange={ newValue => {
						onChange( preOnChange( newValue, value ) )
					} }
					value={ value.startsWith( 'linear-' ) || value.startsWith( 'radial-' ) ? value : null } // null prevents an error in Spectra
					gradients={ colors }
					clearable={ false }
					__experimentalHasMultipleOrigins={ true }
				/>
			}
			{ ! isGradient &&
				<ColorPicker
					onChange={ newValue => {
						onChange( preOnChange( newValue, value ) )
					} }
					color={ value }
					enableAlpha={ true }
				/>
			}
			{ ! isGradient && // Gradient already has it's own palette list of gradients. No need for this.
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

	isGradient: false,
}
