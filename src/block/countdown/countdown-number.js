import { useEffect, useState } from '@wordpress/element'

const SECONDS = 1000
const SECONDS_IN_MINUTE = SECONDS * 60
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60
const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24

const addZero = ( number, isDoubleDigit ) => {
	if ( isDoubleDigit ) {
		return number < 10 ? '0' + number : number
	}
	return number
}

const getDuration = ( days, hours, minutes, seconds ) => {
	let a = 0
	if ( ! isNaN( days ) ) {
		a = a + ( days * SECONDS_IN_DAY )
	}
	if ( ! isNaN( hours ) ) {
		a = a + ( hours * SECONDS_IN_HOUR )
	}
	if ( ! isNaN( minutes ) ) {
		a = a + ( minutes * SECONDS_IN_MINUTE )
	}
	if ( ! isNaN( seconds ) ) {
		a = a + ( seconds * SECONDS )
	}

	return a + Date.now()
}

export const CountdownNumber = props => {
	const [ value, setValue ] = useState( '00' )
	useEffect( () => {
		if ( ! props.datetime ) {
			setValue( 0 )
		}
		const dueDate = isNaN( props.datetime ) ? Date.parse( props.datetime ) : props.datetime
		const duration = getDuration( props.daysLeft, props.hoursLeft, props.minutesLeft, props.secondsLeft )
		const interval = setInterval( () => {
			const difference = props.countdownType === 'dueDate' ? dueDate - Date.now() : duration - Date.now()
			if ( difference <= 0 ) {
				return
			}

			switch ( props.type ) {
				case 'days':
					setValue( addZero( Math.floor( difference / SECONDS_IN_DAY ), props.isDoubleDigit ) )
					break
				case 'hours':
					setValue( addZero( Math.floor( ( difference % SECONDS_IN_DAY ) / SECONDS_IN_HOUR ), props.isDoubleDigit ) )
					break
				case 'minutes':
					setValue( addZero( Math.floor( ( difference % SECONDS_IN_HOUR ) / SECONDS_IN_MINUTE ), props.isDoubleDigit ) )
					break
				default:
					setValue( addZero( Math.floor( ( difference % SECONDS_IN_MINUTE ) / SECONDS ), props.isDoubleDigit ) )
				  // code block
			  }
			  difference - 1000
		}, 1000 )
		return () => {
			clearInterval( interval )
		}
	}, [ props.datetime, props.countdownType, props.daysLeft, props.hoursLeft, props.minutesLeft, props.secondsLeft, props.isDoubleDigit ] )

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
