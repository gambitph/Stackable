/**
 * Internal dependencies
 */
import RangeControl from './range-control'
import { useControlHandlers } from '../base-control2/hooks'
import AdvancedControl, { extractControlProps } from '../base-control2'
import DynamicContentControl, { useDynamicContentControlProps } from '../dynamic-content-control'
import { ResetButton } from '../base-control2/reset-button'
import {
	useAttributeName,
	useBlockAttributesContext,
	useBlockHoverState,
	useBlockSetAttributesContext,
	useDeviceType,
} from '~stackable/hooks'
import { extractNumbersAndUnits } from '~stackable/util'

/**
 * External dependencies
 */
import { isEqual } from 'lodash'

/**
 * WordPress dependencies
 */
import { memo, useState } from '@wordpress/element'
import { Button } from '@wordpress/components'
import { settings } from '@wordpress/icons'
import { dispatch } from '@wordpress/data'

const AdvancedRangeControl = props => {
	const [ value, onChange ] = useControlHandlers( props.attribute, props.responsive, props.hover, props.valueCallback, props.changeCallback )
	const [ propsToPass, controlProps ] = extractControlProps( props )

	const deviceType = useDeviceType()
	const [ currentHoverState ] = useBlockHoverState()
	const hasUnits = !! props.units?.length
	const setAttributes = useBlockSetAttributesContext()
	const unitAttrName = useAttributeName( `${ props.attribute }Unit`, props.responsive, props.hover )
	const {
		unitAttribute,
		_valueDesktop,
		_valueTablet,
		_unitDesktop,
		_unitTablet,
	} = useBlockAttributesContext( attributes => {
		return {
			unitAttribute: attributes[ unitAttrName ],
			_valueDesktop: attributes[ `${ props.attribute }` ],
			_valueTablet: attributes[ `${ props.attribute }Tablet` ],
			_unitDesktop: attributes[ `${ props.attribute }Unit` ],
			_unitTablet: attributes[ `${ props.attribute }UnitTablet` ],
		}
	} )

	const unit = typeof props.unit === 'string'
		? ( props.unit || props.units?.[ 0 ] || 'px' )
		: ( unitAttribute || '' )

	// Change the min, max & step values depending on the unit used.
	if ( hasUnits ) {
		const i = props.units.indexOf( unit ) < 0 ? 0 : props.units.indexOf( unit )
		if ( Array.isArray( props.min ) ) {
			propsToPass.min = props.min[ i ]
		}
		if ( Array.isArray( props.max ) ) {
			propsToPass.max = props.max[ i ]
		}
		if ( Array.isArray( props.sliderMin ) ) {
			propsToPass.sliderMin = props.sliderMin[ i ]
		}
		if ( Array.isArray( props.sliderMax ) ) {
			propsToPass.sliderMax = props.sliderMax[ i ]
		}
		if ( Array.isArray( props.step ) ) {
			propsToPass.step = props.step[ i ]
		}
		propsToPass.initialPosition = props.initialPosition !== '' ? props.initialPosition : props.placeholder

		// If the unit was not the default, remove the placeholder.
		if ( i !== 0 ) {
			propsToPass.initialPosition = ''
			propsToPass.placeholder = ''
		}
	}

	// Change placeholder based on inherited value
	if ( deviceType === 'Mobile' && _valueTablet && _valueTablet !== '' ) {
		propsToPass.initialPosition = unitAttribute === _unitTablet ? _valueTablet : ''
		propsToPass.placeholder = unitAttribute === _unitTablet ? _valueTablet : ''
	} else if ( ( deviceType === 'Mobile' || deviceType === 'Tablet' ) && _valueDesktop && _valueDesktop !== '' ) {
		propsToPass.initialPosition = unitAttribute === _unitDesktop ? _valueDesktop : ''
		propsToPass.placeholder = unitAttribute === _unitDesktop ? _valueDesktop : ''
	}

	// Remove the placeholder.
	if ( ! props.forcePlaceholder && currentHoverState !== 'normal' ) {
		propsToPass.initialPosition = ''
		propsToPass.placeholder = ''
	}

	let placeholderRender = props.placeholderRender
	if ( currentHoverState !== 'normal' || ( hasUnits && unit !== props.units[ 0 ] ) ) {
		placeholderRender = null
	}

	// Is value at first render the same as a step value? If so, do mark mode
	// at the start, or show custom
	let isMarkValue = !! props.marks
	if ( props.marks && value ) {
		const valueToCheck = value + ( props.hasCSSVariableValue ? '' : unit )
		// Check if the current value exsits in the marks
		isMarkValue = isMarkValue && props.marks.some( mark => mark.value === valueToCheck )
	}
	const [ isMarkMode, setIsMarkMode ] = useState( isMarkValue )

	// If this supports dynamic content and can have CSS variables, the value should be saved as a String.
	// Important, the attribute type for this option should be a string.
	const _onChange = value => {
		const onChangeFunc = typeof props.onChange === 'undefined' ? onChange : props.onChange
		let newValue = props.isDynamic || props.hasCSSVariableValue ? value.toString() : value

		// On reset, allow overriding the value.
		if ( newValue === '' ) {
			// Reset should also change from mark mode
			if ( isMarkMode ) {
				setIsMarkMode( false )
			}
			const overrideValue = props.onOverrideReset?.()
			if ( typeof overrideValue !== 'undefined' ) {
				newValue = overrideValue
			}
		}
		onChangeFunc( newValue )
	}

	const derivedValue = typeof props.value === 'undefined' ? value : props.value

	const dynamicContentProps = useDynamicContentControlProps( {
		value: derivedValue,
		onChange: _onChange,
	} )

	// Support for steps. Modify the props to make the range control show steps.
	if ( props.marks && isMarkMode ) {
		// Steps only have 1 increment values
		propsToPass.min = 0
		propsToPass.max = props.marks.length - 1
		propsToPass.sliderMax = props.marks.length - 1
		propsToPass.step = 1

		// Show the marks and names
		propsToPass.marks = props.marks.reduce( ( acc, mark, index ) => {
			return [
				{
					value: index,
					name: undefined,
				},
				...acc,
			]
		}, [] )
		propsToPass.renderTooltipContent = value => {
			return props.marks[ value ]?.name || ''
		}

		// Other necessary props for steps.
		propsToPass.withInputField = false
		controlProps.units = false
	} else {
		propsToPass.marks = undefined
	}

	if ( props.marks ) {
		controlProps.className = controlProps.className || ''
		controlProps.className += 'stk-range-control--with-marks'
		controlProps.className += isMarkMode ? ' stk-range-control--mark-mode' : ''
	}

	if ( props.isCustomPreset ) {
		controlProps.className = controlProps.className || ''
		controlProps.className += 'stk-preset-controls'
	}

	// We need to change the way we handle the value and onChange if we're doing marks
	// Convert to float if the attribute is string to work with the slider
	let rangeValue = propsToPass.isDynamic || props.hasCSSVariableValue ? parseFloat( derivedValue ) : derivedValue
	let rangeOnChange = _onChange
	if ( isMarkMode ) {
		rangeValue = props.marks.findIndex( mark => {
			const [ _value, _unit ] = extractNumbersAndUnits( mark.value )[ 0 ]
			return _value === derivedValue
		} )
		rangeOnChange = ( value, property = 'value' ) => {
			if ( value === '' ) {
				return _onChange( value )
			}
			// Extract the unit and value.
			const markValue = props.marks[ value ]?.[ property ] || '0'
			let [ newValue, unit ] = extractNumbersAndUnits( markValue )[ 0 ]

			// If the attribute has no units (only support px), and the
			// preset units are rem or em, convert to px
			if ( ! hasUnits && ( unit === 'rem' || unit === 'em' ) ) {
				newValue = `${ parseFloat( newValue ) * 16 }`
				unit = 'px'
			}

			// Update the unit.
			if ( unit ) {
				dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
				setAttributes( { [ unitAttrName ]: unit } )
			}

			_onChange( newValue )
		}
	}

	return (
		<AdvancedControl { ...controlProps }>
			<DynamicContentControl
				enable={ propsToPass.isDynamic }
				controlHasTooltip
				{ ...dynamicContentProps }
			>
				<RangeControl
					{ ...propsToPass }
					value={ rangeValue }
					onChange={ rangeOnChange }
					allowReset={ false }
					placeholderRender={ placeholderRender }
					__nextHasNoMarginBottom
				>
					{ props.allowCustom && props.marks && (
						<Button
							className="stk-range-control__custom-button"
							size="small"
							variant="tertiary"
							onClick={ () => {
								// Set the value when changing from mark mode to custom
								if ( isMarkMode && rangeValue !== -1 ) {
									rangeOnChange( rangeValue, 'size' )
								}
								setIsMarkMode( ! isMarkMode )
							} }
							icon={ settings }
						>
						</Button>
					) }
				</RangeControl>
			</DynamicContentControl>
			<ResetButton
				// Allow running own reset for custom preset controls since
				// unit is also needed to be reset
				allowReset={ props.allowReset }
				showReset={ props.showReset }
				value={ derivedValue }
				default={ props.default }
				onChange={ props.onReset ? props.onReset : _onChange }
			/>
		</AdvancedControl>
	)
}

AdvancedRangeControl.defaultProps = {
	allowReset: true,
	onReset: undefined,
	showReset: undefined,
	isDynamic: false,
	default: '',

	attribute: '',
	responsive: false,
	hover: false,

	value: undefined,
	onChange: undefined,
	onOverrideReset: undefined,
	forcePlaceholder: false,

	marks: undefined, // [{ value: '14px', name: 'S' }, { value: '16px', name: 'M' }]
	allowCustom: true,
	hasCSSVariableValue: false, // If the attribute can have CSS variable value (string attribute)
	isCustomPreset: false,
}

export default memo( AdvancedRangeControl, isEqual )
