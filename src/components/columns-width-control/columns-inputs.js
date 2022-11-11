import classNames from 'classnames'
import { fixColumnWidths, columnWidthSum } from './util'

const gridTemplateColumns = columns => {
	return columns.map( column => {
		return ( column / 100 * columns.length ).toFixed( 2 ) + 'fr'
	} ).join( ' ' )
}

const isBlank = columns => columns.every( column => ! column )

const ColumnsInputs = props => {
	const style = {
		gridTemplateColumns: gridTemplateColumns( props.value ),
		gridAutoFlow: isBlank( props.value ) ? 'column' : undefined,
		justifyContent: isBlank( props.value ) ? 'space-around' : undefined,
	}
	const className = classNames( 'stk-column-widths-control__columns-input', {
		'stk-column-widths--many': props.value?.length && props.value.length > 4,
	} )

	return (
		<div className={ className } style={ style }>
			{ props.value.map( ( column, i ) => {
				return (
					<input
						key={ i }
						className="components-column-widths-control__number"
						type="number"
						step="any"
						value={ column ? column : '' }
						// Update the value, but don't really adjust things
						// since we want the user to finish inputting the number
						// they want.
						onChange={ event => {
							const value = event.target.value
							const newValue = value.includes( '.' ) ? parseFloat( parseFloat( value ).toFixed( 3 ) ) : parseInt( value, 10 )
							const values = [ ...props.value ]
							values[ i ] = isNaN( newValue ) ? '' : newValue
							props.onChange( values )
						} }
						// On blur, start fixing the inputs made by the user.
						onBlur={ () => {
							// Fix and invalid values first.
							const resultingValues = fixColumnWidths( props.value )
							// Get how many surpassed 100.
							const extra = 100 - columnWidthSum( resultingValues )
							// Put the different on the adjacent column,
							// essentially it's like we moved one column slider
							// handle.
							if ( i < props.value.length - 1 ) {
								resultingValues[ i + 1 ] += extra
							} else {
								resultingValues[ i - 1 ] += extra
							}
							// Fix the column resulting width.
							props.onChange( fixColumnWidths( resultingValues ) )
						} }
					/>
				)
			} ) }
		</div>
	)
}

ColumnsInputs.defaultProps = {
	onChange: () => {},
	value: [],
}

export default ColumnsInputs
