/**
 * The Gutenberg RangeControl has a lot of issues / things we do not want. Let's
 * just create our own.
 */

/**
 * Internal dependencies
 */
import Button from '../button'

/**
 * WordPress dependencies
 */
import {
	RangeControl, __experimentalNumberControl as NumberControl, // eslint-disable-line @wordpress/no-unsafe-wp-apis
} from '@wordpress/components'
import {
	useState, useLayoutEffect, useEffect, useCallback, memo,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { clamp } from 'lodash'
import { i18n } from 'stackable'
import { useDeviceType } from '~stackable/hooks'

// NumberControl is only supported in WP 5.5
const isNumberControlSupported = !! NumberControl

export const getPercentageValue = ( value, min, max ) => {
	const percentageValue = ( ( value - min ) / ( max - min ) ) * 100
	return `${ clamp( percentageValue, 0, 100 ) }%`
}

const StackableRangeControl = memo( props => {
	const {
		allowReset,
		withInputField,
		isShiftStepEnabled,
		placeholderRender,
		defaultValue: _defaultValue, // Don't pass this.
		...propsToPass
	} = props

	// We have an internal state for the value so that the user can freely type
	// any number in the number field without any validation and then we can
	// just set the proper value on the onChange prop.
	const [ value, setValue ] = useState( props.value === '' || ( isNaN( props.value ) && props.value !== 'auto' ) ? '' : props.value )

	// Update the internal value state if the prop changes.
	useEffect( () => {
		setValue( props.value === '' || ( isNaN( props.value ) && props.value !== 'auto' ) ? '' : props.value )
	}, [ props.value ] )

	// When the value is changed, set the internal value to it, but provide only
	// a valid number to the onChange event.
	const handleOnChange = useCallback( value => {
		setValue( value )
		if ( typeof value === 'string' && value.toLowerCase() === 'auto' ) {
			props.onChange( value )
			return
		} else if ( ! isNaN( value ) ) {
			const parsedValue = parseFloat( value )
			if ( ! isNaN( parsedValue ) ) {
				props.onChange( clamp( parsedValue, props.min, props.max ) )
				return
			}
		}
		props.onChange( props.resetFallbackValue )
	}, [ props.onChange, props.min, props.max, props.resetFallbackValue ] )

	const handleOnReset = useCallback( () => {
		setValue( props.resetFallbackValue )
		props.onChange( props.resetFallbackValue )
	}, [ props.onChange, props.resetFallbackValue ] )

	// When the number input is blurred, make sure that the value inside the
	// field looks correct.  The number is within min/max and is a number.
	const handleOnBlur = useCallback( () => {
		if ( typeof value === 'string' && value.toLowerCase() === 'auto' ) {
			setValue( value )
			return
		} else if ( ! isNaN( value ) ) {
			const parsedValue = parseFloat( value )
			if ( ! isNaN( parsedValue ) ) {
				setValue( clamp( parsedValue, props.min, props.max ) )
				return
			}
		}
		setValue( props.resetFallbackValue )
	}, [ value, props.min, props.max, props.resetFallbackValue ] )

	/**
	 * We cannot trust the initialPosition of the RangeControl, so we
	 * manually set it via CSS.
	 */
	const classNames = classnames( [
		'ugb-range-control',
		props.className,
	], {
		'ugb-range-control--blank': value === '',
	} )
	const isReset = value === ''
	const initialPosition = props.initialPosition !== null ? props.initialPosition : ( props.placeholder || props.sliderMin || props.min )
	const percentageValue = getPercentageValue(
		isReset ? initialPosition : value,
		props.sliderMin || props.min || 0,
		props.sliderMax || props.max || 100
	)

	// This makes sure that dynamic placeholders can be recomputed after other
	// styles have been applied.
	const [ placeholderValue, setPlaceholderValue ] = useState( props.placeholder )
	useEffect( () => {
		setPlaceholderValue( props.placeholder )
	}, [ props.placeholder ] )
	const deviceType = useDeviceType()
	useLayoutEffect( () => {
		const timeout = setTimeout( () => {
			setPlaceholderValue( ( placeholderRender && ! value )
				? placeholderRender( value )
				: ( props.placeholder !== null ? props.placeholder : initialPosition ) )
		}, 400 )
		return () => clearTimeout( timeout )
	}, [ deviceType, !! value, props.placeholder ] )

	return <div
		className={ classNames }
		style={ { '--ugb-advanced-range-control--width': percentageValue } }
	>
		<RangeControl
			{ ...propsToPass }
			initialPosition=""
			onChange={ handleOnChange }
			withInputField={ false }
			allowReset={ false }
			min={ props.sliderMin !== null
				? props.sliderMin
				: ( props.min === -Infinity ? 0 : props.min ) // Dont' allow Infinity on the slider since it will not move.
			}
			max={ props.sliderMax !== null
				? props.sliderMax
				: ( props.max === Infinity ? 100 : props.max ) // Dont' allow Infinity on the slider since it will not move.
			}
		/>
		{ withInputField && isNumberControlSupported && (
			<NumberControl
				disabled={ props.disabled }
				isShiftStepEnabled={ isShiftStepEnabled }
				max={ props.max }
				min={ props.min }
				onChange={ handleOnChange }
				onBlur={ handleOnBlur }
				shiftStep={ props.shiftStep }
				step={ props.step }
				value={ value }
				placeholder={ placeholderValue }
				type="text"
			/>
		) }
		{ allowReset &&
			<Button
				className="components-range-control__reset"
				disabled={ props.disabled }
				isSecondary
				isSmall
				onClick={ handleOnReset }
			>
				{ __( 'Reset', i18n ) }
			</Button>
		}
	</div>
} )

StackableRangeControl.defaultProps = {
	className: '',
	allowReset: false,
	withInputField: true,
	isShiftStepEnabled: true,
	max: Infinity,
	min: -Infinity,
	sliderMax: null,
	sliderMin: null,
	shiftStep: 10,
	step: 1,
	resetFallbackValue: '',
	placeholder: null,
	placeholderRender: null,
	initialPosition: null,
	onChange: () => {},
}

export default StackableRangeControl
