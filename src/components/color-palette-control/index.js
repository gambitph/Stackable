/**
 * Internal dependencies
 */
import AdvancedControl, { extractControlProps } from '../base-control2'
import { ResetButton } from '../base-control2/reset-button'
import { useControlHandlers } from '../base-control2/hooks'
import { ColorPalettePopup } from './color-palette-popup'

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n'
import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor'
import { memo } from '@wordpress/element'
import {
	Button,
	ColorIndicator,
	Dropdown,
	FlexItem,
	__experimentalHStack as HStack, // eslint-disable-line @wordpress/no-unsafe-wp-apis
} from '@wordpress/components'
import { useSelect } from '@wordpress/data'

/**
 * External dependencies
 */
import { cloneDeep } from 'lodash'
import { i18n } from 'stackable'
import classnames from 'classnames'

const popoverProps = {
	placement: 'left-start',
	offset: 36,
	shift: true,
}

const PASSTHRUOP = v => v

const ColorPaletteControl = memo( props => {
	const {
		label,
		className = '',
	} = props
	const [ _value, _onChange ] = useControlHandlers( props.attribute, props.responsive, props.hover, props.valueCallback, props.changeCallback )
	const [ _propsToPass, controlProps ] = extractControlProps( props )

	const {
		stackableColors,
		stackableGradients,
		hideThemeColors,
		hideDefaultColors,
		hideSiteEditorColors,
	} = useSelect( 'stackable/global-colors' ).getSettings()

	const { colors: groupedColors, gradients: groupedGradients } = useMultipleOriginColorsAndGradients()
	// const test = useMultipleOriginColorsAndGradients()
	// console.log( test )
	let colors = props.isGradient ? cloneDeep( groupedGradients ) : cloneDeep( groupedColors )

	if ( props.isGradient ) {
		if ( stackableGradients && stackableGradients.length ) {
			colors = [
				{
					name: __( 'Global Gradients', i18n ),
					gradients: cloneDeep( stackableGradients ),
					id: 'stk-global-gradients',
				},
				...colors,
			]
		}
	} else if ( stackableColors && stackableColors.length ) {
		colors = [
			{
				name: __( 'Global Colors', i18n ),
				colors: cloneDeep( stackableColors ),
				id: 'stk-global-colors',
			},
			...colors,
		]
	}

	// Filter the colors.
	colors = colors.filter( group => {
		// Since there are no identifying properties for the groups, we'll just use the same names used in Gutenberg.
		if ( hideThemeColors && group.name === _x( 'Theme', 'Indicates this palette comes from the theme.' ) ) {
			return false
		}

		if ( hideDefaultColors && group.name === _x( 'Default', 'Indicates this palette comes from WordPress.' ) ) {
			return false
		}

		if ( hideSiteEditorColors && group.name === _x( 'Custom', 'Indicates this palette comes from the theme.' ) ) {
			return false
		}

		return true
	} )

	const allColors = colors.reduce( ( colors, group ) => {
		return [
			...colors,
			...( group.colors || group.gradients ),
		]
	}, [] )

	let value = typeof props.value === 'undefined' ? _value : props.value
	const onChange = typeof props.onChange === 'undefined' ? _onChange : props.onChange

	if ( typeof value === 'string' && value.includes( '--stk-global-color' ) && value.match( /#[\d\w]{6,}/ ) ) {
		value = value.match( /#[\d\w]{6,}/ )[ 0 ]
	}

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

	const toggleSettings = {
		colorValue: value,
		label: colorLabel,
	}

	const colorPalette = (
		<ColorPalettePopup
			value={ value }
			onChange={ onChange }
			preOnChange={ props.preOnChange }
			colors={ colors }
			isGradient={ props.isGradient }
		/>
	)

	return (
		<AdvancedControl
			{ ...controlProps }
			className={ classnames( [ className, 'editor-color-palette-control', 'stk-color-palette-control' ] ) }
			label={ label }
		>
			{ props.isExpanded && colorPalette }
			{ ! props.isExpanded && (
				<Dropdown
					popoverProps={ popoverProps }
					className="block-editor-tools-panel-color-gradient-settings__dropdown"
					renderToggle={ renderToggle( toggleSettings ) }
					renderContent={ () => (
						<div className="stk-color-palette-control__popover-content">
							{ colorPalette }
						</div>
					) }
				/>
			) }
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
	preOnChange: PASSTHRUOP,
	isExpanded: false,
	isGradient: false,
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
			className="stk-color-indicator block-editor-panel-color-gradient-settings__color-indicator"
			colorValue={ colorValue }
		/>
		<FlexItem
			className="stk-color-name block-editor-panel-color-gradient-settings__color-name"
			title={ label }
		>
			{ label }
		</FlexItem>
	</HStack>
)
