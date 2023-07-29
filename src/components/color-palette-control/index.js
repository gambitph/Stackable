/**
 * Internal dependencies
 */
import AdvancedControl, { extractControlProps } from '../base-control2'
import { ResetButton } from '../base-control2/reset-button'
import { useControlHandlers } from '../base-control2/hooks'

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n'
import {
	getColorObjectByColorValue,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor'
import { memo } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'
import {
	Button,
	ColorIndicator,
	ColorPalette,
	ColorPicker,
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

const ColorPaletteControl = memo( props => {
	const {
		label,
		className = '',
	} = props
	const [ _value, _onChange ] = useControlHandlers( props.attribute, props.responsive, props.hover, props.valueCallback, props.changeCallback )
	const [ _propsToPass, controlProps ] = extractControlProps( props )

	const {
		stackableColors,
		hideThemeColors,
		hideDefaultColors,
		hideSiteEditorColors,
	} = useSelect( 'stackable/global-colors' ).getSettings()

	const { colors: groupedColors } = useMultipleOriginColorsAndGradients()
	let colors = cloneDeep( groupedColors )

	if ( stackableColors && stackableColors.length ) {
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
		if ( hideThemeColors && group.name === _x( 'Theme', 'Indicates this palette comes from the theme.', i18n ) ) {
			return false
		}

		if ( hideDefaultColors && group.name === _x( 'Default', 'Indicates this palette comes from WordPress.', i18n ) ) {
			return false
		}

		if ( hideSiteEditorColors && group.name === _x( 'Custom', 'Indicates this palette comes from the theme.', i18n ) ) {
			return false
		}

		return true
	} )

	// Support for hasTransparent.
	if ( props.hasTransparent && colors.length ) {
		let i = 0
		if ( colors[ i ].id === 'stk-global-colors' && colors.length > 1 ) {
			i++
		}
		colors[ i ].colors.push( {
			name: __( 'Transparent', i18n ),
			slug: '_stk-transparent', // Make it unique to prevent conflict.
			color: 'transparent',
		} )
	}

	const allColors = colors.reduce( ( colors, group ) => {
		return [
			...colors,
			...group.colors,
		]
	}, [] )

	let value = typeof props.value === 'undefined' ? _value : props.value
	const onChange = typeof props.onChange === 'undefined' ? _onChange : props.onChange

	if ( typeof value === 'string' && value.includes( '--stk-global-color' ) && value.match( /#[\d\w]{6,}/ ) ) {
		value = value.match( /#[\d\w]{6,}/ )[ 0 ]
	}

	const colorObject = getColorObjectByColorValue( allColors, value )
	const colorName = colorObject && colorObject.name
	const colorLabel = colorName || ( value === 'transparent' ? 'Transparent' : value )

	const toggleSettings = {
		colorValue: value,
		label: colorLabel,
	}

	const colorPalette = (
		<>
			<ColorPicker
				onChange={ onChange }
				color={ value }
				// enableAlpha={ true }
			/>
			<ColorPalette
				value={ value }
				onChange={ value => {
					// Allow the selected color to be overridden.
					const allColors = colors.reduce( ( colors, group ) => {
						return [
							...colors,
							...group.colors,
						]
					}, [] )

					const colorObject = getColorObjectByColorValue( allColors, value )
					onChange( applyFilters( 'stackable.color-palette-control.change', value, colorObject ) )
				} }
				disableCustomColors={ true }
				label={ colorLabel }
				clearable={ false }
				colors={ colors }
			/>
		</>
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
	isExpanded: false,
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
