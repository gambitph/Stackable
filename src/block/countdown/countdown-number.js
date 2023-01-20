import { useEffect, useState } from '@wordpress/element'

const SECONDS = 1000
const SECONDS_IN_MINUTE = SECONDS * 60
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60
const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24

export const CountdownNumber = props => {
	const [ value, setValue ] = useState( '00' )
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
					if ( props.countdownType === 'recurring' ) {
						setValue( props.daysLeft || '00' )
					} else {
						setValue( Math.floor( difference / SECONDS_IN_DAY ) )
					}
					break
				case 'hours':
					if ( props.countdownType === 'recurring' ) {
						setValue( props.hoursLeft || '00' )
					} else {
						setValue( Math.floor( ( difference % SECONDS_IN_DAY ) / SECONDS_IN_HOUR ) )
					}
					break
				case 'minutes':
					if ( props.countdownType === 'recurring' ) {
						setValue( props.minutesLeft || '00' )
					} else {
						setValue( Math.floor( ( difference % SECONDS_IN_HOUR ) / SECONDS_IN_MINUTE ) )
					}
					break
				default:
					if ( props.countdownType === 'recurring' ) {
						setValue( props.secondsLeft || '00' )
					} else {
						setValue( Math.floor( ( difference % SECONDS_IN_MINUTE ) / SECONDS ) )
					}
				  // code block
			  }
		}, 1000 )
		return () => {
			clearInterval( interval )
		}
	}, [ props.value, props.datetime, props.countdownType, props.daysLeft, props.hoursLeft, props.minutesLeft, props.secondsLeft ] )

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
