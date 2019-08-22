/**
 * Color Palette Control
 *
 * We need to implement our own until this is resolved:
 * https://github.com/WordPress/gutenberg/issues/13018
 */
/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	BaseControl, ColorIndicator, ColorPalette,
} from '@wordpress/components'
import { compose, ifCondition } from '@wordpress/compose'
import { getColorObjectByColorValue, withColorContext } from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element'

/**
 * External dependencies
 */
import { i18n } from 'stackable'

// translators: first %s: The type of color (e.g. background color), second %s: the color name or value (e.g. red or #ff0000)
const colorIndicatorAriaLabel = __( '(current %s: %s)', i18n )

const ColorPaletteControl = ( {
	colors,
	disableCustomColors,
	label,
	onChange,
	value,
} ) => {
	const colorObject = getColorObjectByColorValue( colors, value )
	const colorName = colorObject && colorObject.name
	const ariaLabel = sprintf( colorIndicatorAriaLabel, label.toLowerCase(), colorName || value )

	const labelElement = (
		<Fragment>
			{ label }
			{ value && (
				<ColorIndicator
					colorValue={ value }
					aria-label={ ariaLabel }
				/>
			) }
		</Fragment>
	)

	return (
		<BaseControl
			className="editor-color-palette-control"
			id="editor-color-palette-control"
			label={ labelElement }>
			<ColorPalette
				className="editor-color-palette-control__color-palette"
				value={ value }
				onChange={ onChange }
				{ ... { colors, disableCustomColors } }
			/>
		</BaseControl>
	)
}

export default compose( [
	withColorContext,
	ifCondition( ( { hasColorsToChoose } ) => hasColorsToChoose ),
] )( ColorPaletteControl )
