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
	useDeviceType,
} from '~stackable/hooks'

/**
 * External dependencies
 */
import { isEqual } from 'lodash'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'

const AdvancedRangeControl = props => {
	const [ value, onChange ] = useControlHandlers( props.attribute, props.responsive, props.hover, props.valueCallback, props.changeCallback )
	const [ propsToPass, controlProps ] = extractControlProps( props )

	const deviceType = useDeviceType()
	const [ currentHoverState ] = useBlockHoverState()
	const hasUnits = !! props.units?.length
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

	// If this supports dynamic content, then the value should be saved as a String.
	// Important, the attribute type for this option should be a string.
	const _onChange = value => {
		const onChangeFunc = typeof props.onChange === 'undefined' ? onChange : props.onChange
		let newValue = props.isDynamic ? value.toString() : value

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
				/>
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
}

export default memo( AdvancedRangeControl, isEqual )
