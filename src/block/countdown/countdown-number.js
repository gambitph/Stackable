import { useEffect, useState } from '@wordpress/element'

const SECONDS = 1000
const SECONDS_IN_MINUTE = SECONDS * 60
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60
const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24

export const CountdownNumber = props => {
	const [ value, setValue ] = useState( '' )
	useEffect( () => {
		if ( ! props.datetime ) {
			setValue( 0 )
		}

		const interval = setInterval( () => {
			const dueDate = isNaN( props.datetime ) ? Date.parse( props.datetime ) : props.datetime
			const difference = dueDate - Date.now()
			if ( difference <= 0 ) {
				return
			}

			switch ( props.type ) {
				case 'days':
					setValue( Math.floor( difference / SECONDS_IN_DAY ) )
				  break
				case 'hours':
					setValue( Math.floor( ( difference % SECONDS_IN_DAY ) / SECONDS_IN_HOUR ) )
				  break
				case 'minutes':
					setValue( Math.floor( ( difference % SECONDS_IN_HOUR ) / SECONDS_IN_MINUTE ) )
					break
				default:
					setValue( Math.floor( ( difference % SECONDS_IN_MINUTE ) / SECONDS ) )
				  // code block
			  }
		}, 1000 )
		return () => {
			clearInterval( interval )
		}
	}, [ props.value, props.datetime ] )

	return <div className={ props.className }>{ value }</div>
}

CountdownNumber.Content = props => {
	return <div className={ props.className }></div>
}

CountdownNumber.defaultProps = {
	datetime: '',
	type: 'seconds',
	value: 0,
}
