/**
 * Color Palette Control
 *
 * We need to implement our own until this is resolved:
 * https://github.com/WordPress/gutenberg/issues/13018
 */
/**
 * Internal dependencies
 */
import AdvancedControl, { extractControlProps } from '../base-control2'
import { useControlHandlers } from '../base-control2/hooks'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	ColorIndicator, ColorPalette,
} from '@wordpress/components'
import { compose, ifCondition } from '@wordpress/compose'
import { getColorObjectByColorValue, withColorContext } from '@wordpress/block-editor'
import { Fragment, memo } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import classnames from 'classnames'
import { isPlainObject, compact } from 'lodash'

// translators: first %s: The type of color (e.g. background color), second %s: the color name or value (e.g. red or #ff0000)
const colorIndicatorAriaLabel = __( '(current %s: %s)', i18n )

const ColorPaletteControl = memo( props => {
	const {
		disableCustomColors,
		label,
		className = '',
	} = props

	const [ _value, _onChange ] = useControlHandlers( props.attribute, props.responsive, props.hover )
	const [ _propsToPass, controlProps ] = extractControlProps( props )

	const colors = compact( props.colors.map( color => {
		// Make sure to only get color objects. If null, also return null.
		// This will be removed by lodash's `compact` function.
		if ( ! isPlainObject( color ) ) {
			return null
		}

		return {
			...color,
			name: color.name || color.fallback || color.color || __( 'Untitled Color', i18n ),
		}
	} ) )

	if ( props.hasTransparent ) {
		colors.push( {
			name: __( 'Transparent', i18n ),
			slug: '_stk-transparent', // Make it unique to prevent conflict.
			color: 'transparent',
		} )
	}

	let value = typeof props.value === 'undefined' ? _value : props.value
	const onChange = typeof props.onChange === 'undefined' ? _onChange : props.onChange

	const colorObject = getColorObjectByColorValue( colors, value )
	const colorName = colorObject && colorObject.name
	const ariaLabel = sprintf( colorIndicatorAriaLabel, label.toLowerCase(), colorName || _value )

	if ( typeof value === 'string' && value.includes( '--stk-global-color' ) && value.match( /#[\d\w]{6}/ ) ) {
		value = value.match( /#[\d\w]{6}/ )[ 0 ]
	}

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
		<AdvancedControl
			{ ...controlProps }
			className={ classnames( [ className, 'editor-color-palette-control', 'stk-color-palette-control' ] ) }
			id="editor-color-palette-control"
			label={ labelElement }
		>
			<ColorPalette
				className="editor-color-palette-control__color-palette"
				value={ value }
				onChange={ value => {
					// Allow the selected color to be overridden.
					const colorObject = getColorObjectByColorValue( colors, value )
					onChange( applyFilters( 'stackable.color-palette-control.change', value, colorObject ) )
				} }
				{ ... { colors, disableCustomColors } }
			/>
		</AdvancedControl>
	)
} )

export default compose( [
	withColorContext,
	ifCondition( ( { hasColorsToChoose } ) => hasColorsToChoose ),
] )( ColorPaletteControl )
