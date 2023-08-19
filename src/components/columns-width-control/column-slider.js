import {
	Slider, Handles, Rail,
} from 'react-compound-slider'
import { SliderRail, Handle } from './slider-components'
import { isEqual } from 'lodash'
import { fixColumnWidths } from './util'
import { useRef, memo } from '@wordpress/element'

const sliderStyle = {
	position: 'relative',
	width: '100%',
}

const MIN = 10
const domain = [ 0, 100 ]

const convertValuesToColumns = values => {
	let current = 0
	return [ ...values, 100 ].map( value => {
		const ret = value - current
		current += ret
		return ret
	} )
}

const convertColumnsToValues = columns => {
	let current = 0
	const poppedColumns = [ ...columns ]
	poppedColumns.pop()
	return columns.reduce( ( values, column, i ) => {
		if ( i === columns.length - 1 ) {
			return values
		}
		const ret = column + current
		current += column
		values.push( ret )
		return values
	}, [] )
}

const getMovementVector = ( oldValues, newValues ) => {
	let direction
	newValues.some( ( newValue, i ) => {
		if ( newValue !== oldValues[ i ] ) {
			direction = newValue > oldValues[ i ] ? 'right' : 'left'
			return true
		}
		return false
	} )

	return direction
}

const getChangedValue = ( oldValues, newValues ) => {
	let value = -1
	// Look for the different value.
	newValues.some( newValue => {
		if ( ! oldValues.includes( newValue ) ) {
			value = newValue
			return true
		}
		return false
	} )
	// Look for the different value in the array
	if ( value === -1 ) {
		newValues.some( ( newValue, i ) => {
			if ( newValue !== oldValues[ i ] ) {
				value = newValue
				return true
			}
			return false
		} )
	}
	return value === -1 ? 0 : value
}

const _valuesAreInvalid = inputValues => {
	const values = [ 0, ...inputValues, 100 ]
	return values.some( ( value, i ) => {
		if ( i === 0 ) {
			return false
		}
		const oldValue = values[ i - 1 ]
		return value - oldValue < MIN
	} )
}

const fixValues = ( values, changedIndex, direction ) => {
	const columns = convertValuesToColumns( values )

	const fixedColumns = fixColumnWidths( columns, direction )

	return convertColumnsToValues( fixedColumns )
}

const ColumnSlider = memo( props => {
	const currentValues = useRef( null )
	const slidingHandleIndex = useRef( 0 )
	const currentSlideValue = useRef( null )
	// onUpdate is called even if we're just adding the value, so we need to
	// keep track if the slider is being slid.
	const isSliding = useRef( false )

	return (
		<Slider
			className="stk-column-widths-control__columns-slider"
			rootStyle={ sliderStyle }
			// The old values object provided by `mode` is not accurate (if you
			// move very fast, it gives odd numbers) so let's keep track of the
			// numbers ourselves.
			onSlideStart={ values => currentValues.current = values }
			mode={ ( _oldValuesObj, newValuesObj ) => {
				isSliding.current = true

				// If the user clicks on the rail, the onSlideStart doesn't get
				// triggered (bug)
				if ( ! currentValues.current || currentValues.current.length !== newValuesObj.length ) {
					currentValues.current = _oldValuesObj.map( o => o.val )
				}

				let newValues = newValuesObj.map( o => o.val )
				if ( isEqual( currentValues.current, newValues ) ) {
					return newValuesObj
				}

				const direction = getMovementVector( currentValues.current, newValues )
				const newValue = getChangedValue( currentValues.current, newValues )

				newValues = [ ...currentValues.current ]
				newValues[ slidingHandleIndex.current ] = newValue

				const fixedValues = fixValues( newValues, slidingHandleIndex.current, direction )

				// Update the current values so we can track it the next movement.
				currentValues.current = fixedValues

				fixedValues.forEach( ( value, i ) => {
					newValuesObj[ i ].val = value
				} )

				return newValuesObj
			} }
			step={ 1 }
			onChange={ () => {
				isSliding.current = false
			} }
			onUpdate={ values => {
				// Only do an update when we're actually sliding the slider
				if ( ! isSliding.current ) {
					return
				}

				if ( ! isEqual( currentSlideValue.current, values ) ) {
					currentSlideValue.current = values
					props.onChange( convertValuesToColumns( values ) )
				}
			} }
			domain={ domain } // [min, max]
			values={ convertColumnsToValues( props.value ) } // slider values
		>
			<Rail>
				{ ( { getRailProps } ) => <SliderRail getRailProps={ getRailProps } /> }
			</Rail>
			<Handles>
				{ ( { handles, getHandleProps } ) => (
					<div className="slider-handles">
						{ handles.map( ( handle, index ) => {
							const _handleProps = getHandleProps( handle.id )
							const handleProps = {
								..._handleProps,
								onMouseDown: ev => {
									slidingHandleIndex.current = index
									return _handleProps.onMouseDown( ev )
								},
								onTouchStart: ev => {
									slidingHandleIndex.current = index
									return _handleProps.onTouchStart( ev )
								},
								onKeyDown: ev => {
									slidingHandleIndex.current = index
									return _handleProps.onKeyDown( ev )
								},
							}

							return (
								<Handle
									key={ handle.id }
									handle={ handle }
									domain={ domain }
									handleProps={ handleProps }
								/>
							)
						} ) }
					</div>
				) }
			</Handles>
		</Slider>
	)
}, isEqual )

ColumnSlider.defaultProps = {
	onChange: () => {},
	value: [],
}

export default ColumnSlider
