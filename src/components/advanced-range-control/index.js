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

	// Is value at first render the same as a step value?
	const isMarkValue = props.marks && true
	const [ isMarkMode, setIsMarkMode ] = useState( isMarkValue )

	// If this supports dynamic content, then the value should be saved as a String.
	// Important, the attribute type for this option should be a string.
	const _onChange = value => {
		const onChangeFunc = typeof props.onChange === 'undefined' ? onChange : props.onChange
		let newValue = props.isDynamic ? value.toString() : value

		// Support for steps. For steps, the value is an index, but the actual value is in the marks.
		if ( newValue !== '' && isMarkMode && props.marks ) {
			// Extract the unit and value.
			const markValue = props.marks[ value ]?.value || '0'
			const [ _newValue, unit ] = extractNumberAndUnit( markValue )
			newValue = _newValue

			// Update the unit.
			dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
			setAttributes( { [ unitAttrName ]: unit } )
		}

		// On reset, allow overriding the value.
		if ( newValue === '' ) {
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
		propsToPass.min = 0
		propsToPass.max = props.marks.length - 1
		propsToPass.sliderMax = props.marks.length - 1
		propsToPass.step = 1

		// Show the marks and labels
		propsToPass.marks = props.marks.reduce( ( acc, mark, index ) => {
			return [
				{
					value: index,
					label: undefined,
				},
				...acc,
			]
		}, [] )
		propsToPass.renderTooltipContent = value => {
			return props.marks[ value ]?.label || ''
		}

		// Other necessary props for steps.
		propsToPass.withInputField = false
	} else {
		propsToPass.marks = undefined
	}

	if ( props.marks ) {
		controlProps.className = controlProps.className || ''
		controlProps.className += 'stk-range-control--with-marks'
		controlProps.className += isMarkMode ? ' stk-range-control--mark-mode' : ''
	}

	if ( isMarkMode ) {
		controlProps.units = false
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
					value={ propsToPass.isDynamic ? parseFloat( derivedValue ) : derivedValue }
					onChange={ _onChange }
					allowReset={ false }
					placeholderRender={ placeholderRender }
					__nextHasNoMarginBottom
				>
					{ props.allowCustom && props.marks && (
						<Button
							className="stk-range-control__custom-button"
							size="small"
							variant="tertiary"
							onClick={ () => setIsMarkMode( ! isMarkMode ) }
							icon={ settings }
						>
						</Button>
					) }
				</RangeControl>
			</DynamicContentControl>
			<ResetButton
				allowReset={ props.allowReset }
				value={ derivedValue }
				default={ props.default }
				onChange={ _onChange }
			/>
		</AdvancedControl>
	)
}

AdvancedRangeControl.defaultProps = {
	allowReset: true,
	isDynamic: false,
	default: '',

	attribute: '',
	responsive: false,
	hover: false,

	value: undefined,
	onChange: undefined,
	onOverrideReset: undefined,
	forcePlaceholder: false,

	marks: undefined, // [{ value: '14px', label: 'S' }, { value: '16px', label: 'M' }]
	allowCustom: true,
}

export default memo( AdvancedRangeControl, isEqual )

// The value can be in the format '10px' or '10.0em' or '10rem'.
// Return an array with the number and the unit.
const extractNumberAndUnit = value => {
	// Match the last characters that are not numbers.
	const matches = value.match( /([\d.]+)(\D*)$/ )
	if ( ! matches ) {
		return [ value, '' ]
	}
	return [ matches[ 1 ], matches[ 2 ] ]
}
