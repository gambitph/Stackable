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
	useSetting,
} from '@wordpress/block-editor'
import { memo, useMemo } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'
import {
	Button,
	ColorIndicator,
	ColorPalette,
	Dropdown,
	FlexItem,
	__experimentalHStack as HStack, // eslint-disable-line @wordpress/no-unsafe-wp-apis
} from '@wordpress/components'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import classnames from 'classnames'
import { isPlainObject, compact } from 'lodash'
import { ResetButton } from '../base-control2/reset-button'

const popoverProps = {
	placement: 'left-start',
	offset: 36,
	shift: true,
}

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

	const toggleSettings = {
		colorValue: value,
		label: colorName || value,
	}

	return (
		<AdvancedControl
			{ ...controlProps }
			className={ classnames( [ className, 'editor-color-palette-control', 'stk-color-palette-control' ] ) }
			label={ label }
		>
			<Dropdown
				popoverProps={ popoverProps }
				className="block-editor-tools-panel-color-gradient-settings__dropdown"
				renderToggle={ renderToggle( toggleSettings ) }
				renderContent={ () => (
					<div className="stk-color-palette-control__popover-content">
						<ColorPalette
							value={ value }
							onChange={ value => {
								// Allow the selected color to be overridden.
								const colorObject = getColorObjectByColorValue( colors, value )
								onChange( applyFilters( 'stackable.color-palette-control.change', value, colorObject ) )
							} }
							label={ colorName || value }
							clearable={ false }
							{ ...{ colors, disableCustomColors } }
						/>
					</div>
				) }
			/>
			<ResetButton
				allowReset={ props.allowReset }
				value={ value }
				default={ props.default }
				onChange={ onChange }
			/>
		</AdvancedControl>
	)
} )

ColorPaletteControl.defaultProps = {
	allowReset: true,
	default: '',

	attribute: '',

	value: undefined,
	onChange: undefined,
}

export default ColorPaletteControl

const renderToggle =
	settings =>
		( { onToggle, isOpen } ) => {
			const { colorValue, label } = settings

			const toggleProps = {
				onClick: onToggle,
				className: classnames(
					'block-editor-panel-color-gradient-settings__dropdown',
					{ 'is-open': isOpen }
				),
				'aria-expanded': isOpen,
			}

			return (
				<Button { ...toggleProps }>
					<LabeledColorIndicator
						colorValue={ colorValue }
						label={ label }
					/>
				</Button>
			)
		}

const LabeledColorIndicator = ( { colorValue, label } ) => (
	<HStack justify="flex-start">
		<ColorIndicator
			className="block-editor-panel-color-gradient-settings__color-indicator"
			colorValue={ colorValue }
		/>
		<FlexItem
			className="block-editor-panel-color-gradient-settings__color-name"
			title={ label }
		>
			{ label }
		</FlexItem>
	</HStack>
)
