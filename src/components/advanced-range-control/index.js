/**
 * Internal dependencies
 */
import RangeControl from './range-control'
import { useControlHandlers } from '../base-control2/hooks'
import AdvancedControl, { extractControlProps } from '../base-control2'
import DynamicContentControl, { useDynamicContentControlProps } from '../dynamic-content-control'
import { ResetButton } from '../base-control2/reset-button'
/**
 * External dependencies
 */
import { isEqual } from 'lodash'
import {
	useAttributeName,
	useBlockAttributesContext,
	useBlockHoverState,
	useBlockSetAttributesContext,
	useDeviceType,
} from '~stackable/hooks'
import {
	extractNumbersAndUnits, getCSSVarName, convertToPxIfUnsupported,
} from '~stackable/util'
import { settings as stackableSettings } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	memo, useState, useEffect, useRef,
} from '@wordpress/element'
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

	const isMarkModeDefault = !! ( stackableSettings?.stackable_use_size_presets_by_default ?? true )

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

	let derivedValue = typeof props.value === 'undefined'
		? value : props.value

	// Is value at first render the same as a step value? If so, do mark mode
	// at the start, or show custom
	// If no initial value, use the given default from the settings
	const [ isMarkMode, setIsMarkMode ] = useState( false )
	// Ensure the convesion of value from preset to custom with regards to the unit is donce once.
	const isConversionDone = useRef( false )

	let isMarkValue = !! props.marks && isMarkModeDefault
	if ( props.marks && derivedValue ) {
		// Check if the current value exists in the marks only by their CSS variable name
		// to match in case the fallback size changes.
		const derivedValueCssVarName = getCSSVarName( derivedValue )
		const matchedMark = props.marks.find( mark => getCSSVarName( mark.value ) === derivedValueCssVarName )
		isMarkValue = !! matchedMark
		if ( matchedMark ) {
			derivedValue = matchedMark.value
		}
	}

	// Set the markMode when device type changes
	useEffect( () => {
		setIsMarkMode( isMarkValue )
	}, [ deviceType ] )

	// If this supports dynamic content, the value should be saved as a String.
	// Similar if using marks to accomodate CSS variable
	// Important, the attribute type for this option should be a string.
	const _onChange = value => {
		const onChangeFunc = typeof props.onChange === 'undefined' ? onChange : props.onChange
		let newValue = props.isDynamic || props.marks ? value.toString() : value

		// On reset, allow overriding the value.
		if ( newValue === '' ) {
			const overrideValue = props.onOverrideReset?.()
			if ( typeof overrideValue !== 'undefined' ) {
				newValue = overrideValue
			}
		}
		onChangeFunc( newValue )
	}

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
			return props.marks[ value ]?.name || props.marks[ value ]?.slug || ''
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
	let rangeValue = propsToPass.isDynamic || props.marks ? parseFloat( derivedValue ) : derivedValue
	let rangeOnChange = _onChange
	if ( isMarkMode ) {
		rangeValue = props.marks.findIndex( mark => {
			let _unit, _value
			// If the derivedValue is a CSS variable, compare with mark's CSS variable.
			// Otherwise, the derivedValue is custom from the previous switch from custom to preset mode,
			// so compare with raw size and units to convert to preset.
			if ( typeof derivedValue === 'string' && derivedValue.startsWith( 'var' ) ) {
				[ _value, _unit ] = extractNumbersAndUnits( mark.value )[ 0 ]
			} else {
				[ _value, _unit ] = extractNumbersAndUnits( mark.size )[ 0 ]
			}
			return _value === derivedValue && ( _unit === '' || _unit === unit )
		} )
		rangeValue = rangeValue === -1 ? '' : rangeValue

		rangeOnChange = ( value, property = 'value' ) => {
			if ( value === '' ) {
				return _onChange( value )
			}
			// Extract the unit and value.
			const markValue = props.marks[ value ]?.[ property ] || '0'
			let [ newValue, unit ] = extractNumbersAndUnits( markValue )[ 0 ]

			// If the attribute has no support for rem or em, and the
			// preset units is rem or em, convert to px
			const converted = convertToPxIfUnsupported( props.units, unit, newValue )
			newValue = converted.value
			unit = converted.unit

			// Update the unit.
			if ( unit ) {
				dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
				setAttributes( { [ unitAttrName ]: unit } )
				if ( props.onChangeUnit ) {
					props.onChangeUnit( unit )
				}
			}

			_onChange( newValue )
			isConversionDone.current = false
		}
	} else if ( typeof derivedValue === 'string' && derivedValue.startsWith( 'var' ) ) {
		// If the derivedValue is a preset and currently not in mark mode, the derivedValue is from
		// the previous switch from preset to custom mode. Convert to custom.
		const currentSize = props.marks.find( mark => {
			return derivedValue === mark.value
		} )?.size
		let [ _newValue, _unit ] = extractNumbersAndUnits( currentSize )[ 0 ]

		// If the attribute has no support for rem or em, and the
		// preset units is rem or em, convert to px
		const converted = convertToPxIfUnsupported( props.units, _unit, _newValue )
		_newValue = converted.value
		_unit = converted.unit

		rangeValue = parseFloat( _newValue )

		if ( _unit && ! isConversionDone.current ) {
			dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
			setAttributes( { [ unitAttrName ]: _unit } )
			if ( props.onChangeUnit ) {
				props.onChangeUnit( _unit )
			}
			isConversionDone.current = true
		}
		// Since the actual previous value is a preset, force the new custom value
		// when changing unit
		controlProps.onChangeUnit = ( unit, unitAttrName ) => {
			setAttributes( { [ unitAttrName ]: unit } )
			_onChange( _newValue )
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

	marks: undefined, // [{ value: 'var(--stk-preset-font-size-small', name: 'S' }]
	allowCustom: true,
	isCustomPreset: false,
	isMarkModeDefault: true,
}

export default memo( AdvancedRangeControl, isEqual )
