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
import { applyFilters } from '@wordpress/hooks'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import classnames from 'classnames'

// translators: first %s: The type of color (e.g. background color), second %s: the color name or value (e.g. red or #ff0000)
const colorIndicatorAriaLabel = __( '(current %s: %s)', i18n )

const ColorPaletteControl = props => {
	const {
		disableCustomColors,
		label,
		onChange,
		value,
		className = '',
	} = props

	const colors = props.colors.map( color => {
		return {
			...color,
			name: color.name || color.fallback || color.color || __( 'Untitled Color', i18n ),
		}
	} )
	const colorObject = getColorObjectByColorValue( colors, value )
	const colorName = colorObject && colorObject.name
	const ariaLabel = sprintf( colorIndicatorAriaLabel, label.toLowerCase(), colorName || value )

	let _value = value
	if ( _value.match( /stk-global-color\(/g ) && _value.match( /#(.*?(?=\)))/g ) ) {
		_value = _value.match( /#(.*?(?=\)))/g )[ 0 ]
	}

	const labelElement = (
		<Fragment>
			{ label }
			{ _value && (
				<ColorIndicator
					colorValue={ _value }
					aria-label={ ariaLabel }
				/>
			) }
		</Fragment>
	)

	return (
		<BaseControl
			className={ classnames( [ className, 'editor-color-palette-control' ] ) }
			id="editor-color-palette-control"
			label={ labelElement }>
			<ColorPalette
				className="editor-color-palette-control__color-palette"
				value={ _value }
				onChange={ value => {
					// Allow the selected color to be overridden.
					const colorObject = getColorObjectByColorValue( colors, value )
					onChange( applyFilters( 'stackable.color-palette-control.change', value, colorObject ) )
				} }
				{ ... { colors, disableCustomColors } }
			/>
		</BaseControl>
	)
}

export default compose( [
	withColorContext,
	ifCondition( ( { hasColorsToChoose } ) => hasColorsToChoose ),
] )( ColorPaletteControl )
