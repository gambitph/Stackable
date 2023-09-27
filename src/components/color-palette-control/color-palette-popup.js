/**
 * A popup of a color palette.
 */

/**
 * External dependencies
 */
import { semverCompare } from '~stackable/util'
import { wpVersion } from 'stackable'

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

export const ColorPalettePopup = props => {
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
					gradients={
						wpVersion && semverCompare( wpVersion, '=', '6.1' ) ? allColors // For 6.1 Compatibility
							: colors }
					clearable={ false }
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
			{ ! isGradient && wpVersion && ! semverCompare( wpVersion, '=', '6.1' ) && // Gradient already has it's own palette list of gradients. No need for this.
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
				/>
			}
			{ ! isGradient && wpVersion && semverCompare( wpVersion, '=', '6.1' ) && // For 6.1 Compatibility
				<div className="stk-color-palette-group-container__wp6-1-compatibility">
					{ colors.map( colorGroup => {
						return <>
							<div className="stk-color-palette-group__wp6-1-compatibility">
								<h2 className="stk-color-palette-group__title__wp6-1-compatibility"> { colorGroup.name } </h2>
								<ColorPalette
									value={ value }
									onChange={ newValue => {
										const colorObject = getColorObjectByColorValue( allColors, newValue )
										onChange( preOnChange( applyFilters( 'stackable.color-palette-control.change', newValue, colorObject ), value ) )
									} }
									disableCustomColors={ true }
									label={ colorLabel }
									clearable={ false }
									colors={ colorGroup.colors }
								/>
							</div>
						</>
					}
					) }
				</div>
			}
		</>
	)
}

const NOOP = () => {}

ColorPalettePopup.defaultProps = {
	value: '',
	onChange: NOOP,
	preOnChange: NOOP,

	colors: [],

	isGradient: false,
}
