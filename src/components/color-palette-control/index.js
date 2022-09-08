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
import { ColorIndicator, ColorPalette } from '@wordpress/components'
import { compose, ifCondition } from '@wordpress/compose'
import { getColorObjectByColorValue, withColorContext } from '@wordpress/block-editor'
import {
	Fragment, memo, useState, useEffect, useCallback,
} from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import classnames from 'classnames'
import {
	isPlainObject, compact, debounce,
} from 'lodash'

// translators: first %s: The type of color (e.g. background color), second %s: the color name or value (e.g. red or #ff0000)
const colorIndicatorAriaLabel = __( '(current %s: %s)', i18n )

const ColorPaletteControl = memo( props => {
	const {
		disableCustomColors,
		label,
		className = '',
	} = props

	let value = typeof props.value === 'undefined' ? _value : props.value
	if ( typeof value === 'string' && value.includes( '--stk-global-color' ) && value.match( /#[\d\w]{6}/ ) ) {
		value = value.match( /#[\d\w]{6}/ )[ 0 ]
	}

	const [ colorValue, setColorValue ] = useState( value )

	const [ _value, _onChange ] = useControlHandlers( props.attribute, props.responsive, props.hover, props.valueCallback, props.changeCallback )
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

	const colorChangeHandler = useCallback( debounce( newColor => {
		// Allow the selected color to be overriden.
		const colorObject = getColorObjectByColorValue( colors, newColor )
		const changeHandler = typeof props.onChange === 'undefined' ? _onChange : props.onChange
		changeHandler( applyFilters( 'stackable.color-palette-control.change', newColor, colorObject ) )
	}, 750 ), [] )

	useEffect( () => {
		colorChangeHandler( colorValue )
	}, [ colorValue ] )

	const colorObject = getColorObjectByColorValue( colors, colorValue )
	const colorName = colorObject && colorObject.name
	const ariaLabel = sprintf( colorIndicatorAriaLabel, label.toLowerCase(), colorName || _value )

	const labelElement = (
		<Fragment>
			{ label }
			{ colorValue && (
				<ColorIndicator
					colorValue={ colorValue }
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
				value={ colorValue }
				onChange={ setColorValue }
				{ ... { colors, disableCustomColors } }
			/>
		</AdvancedControl>
	)
} )

export default compose( [
	withColorContext,
	ifCondition( ( { hasColorsToChoose } ) => hasColorsToChoose ),
] )( ColorPaletteControl )
