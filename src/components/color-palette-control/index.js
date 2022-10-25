/**
 * Internal dependencies
 */
import AdvancedControl, { extractControlProps } from '../base-control2'
import { useControlHandlers } from '../base-control2/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	getColorObjectByColorValue,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown, // eslint-disable-line @wordpress/no-unsafe-wp-apis
	useSetting,
} from '@wordpress/block-editor'
import { memo, useMemo } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import classnames from 'classnames'
import { isPlainObject, compact } from 'lodash'

const ColorPaletteControl = memo( props => {
	const {
		disableCustomColors,
		label,
		className = '',
	} = props

	const [ _value, _onChange ] = useControlHandlers( props.attribute, props.responsive, props.hover, props.valueCallback, props.changeCallback )
	const [ _propsToPass, controlProps ] = extractControlProps( props )

	const themeColors = useSetting( 'color.palette.theme' )
	const colors = useMemo( () => {
		const colors = compact( themeColors.map( color => {
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

		return colors
	}, [ themeColors, props.hasTransparent ] )

	let value = typeof props.value === 'undefined' ? _value : props.value
	const onChange = typeof props.onChange === 'undefined' ? _onChange : props.onChange

	if ( typeof value === 'string' && value.includes( '--stk-global-color' ) && value.match( /#[\d\w]{6}/ ) ) {
		value = value.match( /#[\d\w]{6}/ )[ 0 ]
	}

	const colorObject = getColorObjectByColorValue( colors, value )
	const colorName = colorObject && colorObject.name

	return (
		<AdvancedControl
			{ ...controlProps }
			className={ classnames( [ className, 'editor-color-palette-control', 'stk-color-palette-control' ] ) }
			label={ label }
		>
			<ColorGradientSettingsDropdown
				__experimentalIsRenderedInSidebar
				settings={ [
					{
						colorValue: value,
						label: colorName || value,
						onColorChange: value => {
							// Allow the selected color to be overridden.
							const colorObject = getColorObjectByColorValue( colors, value )
							onChange( applyFilters( 'stackable.color-palette-control.change', value, colorObject ) )
						},
						isShownByDefault: true,
						enableAlpha: true,
					},
				] }
				colors={ colors }
				disableCustomColors={ disableCustomColors }
			/>
		</AdvancedControl>
	)
} )

export default ColorPaletteControl
