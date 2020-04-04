import {
	Slider, Handles, Rail,
} from 'react-compound-slider'
import {
	SliderRail, Handle,
} from './slider-components'
import { isEqual } from 'lodash'
import { fixColumnWidths } from './util'

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
	let changedIndex = 0
	let direction
	newValues.some( ( newValue, i ) => {
		if ( newValue !== oldValues[ i ] ) {
			changedIndex = i
			direction = newValue > oldValues[ i ] ? 'right' : 'left'
			return true
		}
		return false
	} )

	return [ changedIndex, direction ]
}

const valuesAreInvalid = inputValues => {
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

const ColumnSlider = props => {
	return (
		<Slider
			className="ugb-column-widths-control__columns-slider"
			rootStyle={ sliderStyle }
			mode={ ( oldValuesObj, newValuesObj ) => {
				const oldValues = oldValuesObj.map( o => o.val )
				const newValues = newValuesObj.map( o => o.val )
				if ( isEqual( oldValues, newValues ) ) {
					return newValuesObj
				}

				if ( valuesAreInvalid( newValues ) ) {
					const [ changedIndex, direction ] = getMovementVector( oldValues, newValues )
					const fixedValues = fixValues( newValues, changedIndex, direction )
					fixedValues.forEach( ( value, i ) => {
						newValuesObj[ i ].val = value
					} )
				}

				return newValuesObj
			} }
			step={ 1 }
			onUpdate={ values => props.onChange( convertValuesToColumns( values ) ) }
			domain={ domain } // [min, max]
			values={ convertColumnsToValues( props.value ) } // slider values
		>
			<Rail>
				{ ( { getRailProps } ) => <SliderRail getRailProps={ getRailProps } /> }
			</Rail>
			<Handles>
				{ ( { handles, getHandleProps } ) => (
					<div className="slider-handles">
						{ handles.map( handle => (
							<Handle
								key={ handle.id }
								handle={ handle }
								domain={ domain }
								getHandleProps={ getHandleProps }
							/>
						) ) }
					</div>
				) }
			</Handles>
		</Slider>
	)
}

ColumnSlider.defaultProps = {
	onChange: () => {},
	value: [],
}

export default ColumnSlider
