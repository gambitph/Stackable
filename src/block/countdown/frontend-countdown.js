/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'
import { date } from '@wordpress/date'

const SECONDS = 1
const SECONDS_IN_MINUTE = SECONDS * 60
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60
const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24

class StackableCountdown {
	constructor( el ) {
		this.el = el
		this.blockId = el.getAttribute( 'data-block-id' )
		this.countdownInterval
	}

	clearTimer = () => {
		clearInterval( this.countdownInterval )
	}

	addZero = ( number, isDoubleDigit ) => {
		if ( isDoubleDigit ) {
			const a = number <= 0 ? 0 : number
			return number < 10 ? '0' + a : number
		}
		return number <= 0 ? 0 : number
	}

	saveTimeRemaining = number => {
		sessionStorage.setItem( this.blockId, number )
	}

	preCountDown = isDoubleDigit => {
		const day = this.el.querySelector( '.stk-block-countdown__digit_day' )
		const hour = this.el.querySelector( '.stk-block-countdown__digit_hour' )
		const minute = this.el.querySelector( '.stk-block-countdown__digit_minute' )
		const second = this.el.querySelector( '.stk-block-countdown__digit_second' )

		const timer = sessionStorage.getItem( this.blockId )

		const daysLeft = Math.floor( timer / SECONDS_IN_DAY )
		const hoursLeft = Math.floor( ( timer % SECONDS_IN_DAY ) / SECONDS_IN_HOUR )
		const minutesLeft = Math.floor( ( timer % SECONDS_IN_HOUR ) / SECONDS_IN_MINUTE )
		const secondsLeft = Math.floor( ( timer % SECONDS_IN_MINUTE ) / SECONDS )

		if ( day ) {
			day.textContent = this.addZero( daysLeft, isDoubleDigit )
		}

		if ( hour ) {
			hour.textContent = this.addZero( hoursLeft, isDoubleDigit )
		}

		if ( minute ) {
			minute.textContent = this.addZero( minutesLeft, isDoubleDigit )
		}

		if ( second ) {
			second.textContent = this.addZero( secondsLeft, isDoubleDigit )
		}
	}

	countDown = ( countdownDate, isDoubleDigit, timezone, action, duration = 0, countdownType = 'dueDate', restartInterval = 0 ) => {
		const day = this.el.querySelector( '.stk-block-countdown__digit_day' )
		const hour = this.el.querySelector( '.stk-block-countdown__digit_hour' )
		const minute = this.el.querySelector( '.stk-block-countdown__digit_minute' )
		const second = this.el.querySelector( '.stk-block-countdown__digit_second' )
		let tempTimezone = timezone

		// Timezone can be a string number
		if ( ! isNaN( timezone ) ) {
			tempTimezone = parseInt( timezone )
		}

		// Convert date being compared to to desired timezone
		let timer = Math.floor( countdownDate / 1000 ) - Math.floor( Date.parse( date( 'Y-m-d\\TH:i:s', Date.now(), tempTimezone ) ) / 1000 )
		let isRestarting = false
		let restartLeft = 0

		if ( countdownType === 'recurring' ) {
			// countdownDate becomes startDate for recurring
			const diff = Date.now() > countdownDate

			if ( diff ) {
				// Calculate where to start the timer since this is an open timer
				const interval = duration + ( restartInterval * SECONDS_IN_HOUR )
				const index = Math.floor( ( ( ( Date.now() / 1000 ) - ( countdownDate / 1000 ) ) ) / ( interval ) ) + 1
				const b = Math.floor( ( ( index * interval ) + Math.floor( countdownDate / 1000 ) ) - Math.floor( Date.now() / 1000 ) )
				if ( b > ( restartInterval * SECONDS_IN_HOUR ) ) {
					timer = b - ( restartInterval * SECONDS_IN_HOUR )
				} else {
					isRestarting = true
					restartLeft = b
					timer = 0
				}
			} else {
				timer = diff ? ( duration + Math.floor( countdownDate / 1000 ) ) - Math.floor( Date.now() / 1000 ) : duration
			}
		}

		this.saveTimeRemaining( timer )

		const daysLeft = Math.floor( timer / SECONDS_IN_DAY )
		const hoursLeft = Math.floor( ( timer % SECONDS_IN_DAY ) / SECONDS_IN_HOUR )
		const minutesLeft = Math.floor( ( timer % SECONDS_IN_HOUR ) / SECONDS_IN_MINUTE )
		const secondsLeft = Math.floor( ( timer % SECONDS_IN_MINUTE ) / SECONDS )

		// If null, do not show text
		if ( day ) {
			day.textContent = this.addZero( daysLeft, isDoubleDigit )
		}

		if ( hour ) {
			hour.textContent = this.addZero( hoursLeft, isDoubleDigit )
		}

		if ( minute ) {
			minute.textContent = this.addZero( minutesLeft, isDoubleDigit )
		}

		if ( second ) {
			second.textContent = this.addZero( secondsLeft, isDoubleDigit )
		}

		if ( timer <= 0 ) {
			this.clearTimer()
			if ( countdownType === 'recurring' ) {
				const a = isRestarting ? restartLeft : restartInterval
				const tempCallback = () => {
					this.countdownInterval = setInterval( this.countDown.bind( this ), 1000, Date.now(), isDoubleDigit, '', '', duration, countdownType, restartInterval, timezone )
				}
				setTimeout( tempCallback, a * 1000 )
			}
			if ( action === 'hide' ) {
				this.el.style.display = 'none'
			}
			if ( action === 'showMessage' ) {
				const timer = this.el.querySelector( '.stk-block-countdown__container' )
				const message = this.el.querySelector( '.stk-block-countdown__message' )
				timer.style.display = 'none'
				message.style.display = 'block'
			}
		}
	}

	init = () => {
		 // Note duration for recurring,
		const date = Date.parse( this.el.getAttribute( 'data-stk-countdown-date' ) )
		const countdownType = this.el.getAttribute( 'data-stk-countdown-type' )
		const duration = parseInt( this.el.getAttribute( 'data-stk-countdown-duration' ) )
		const restartInterval = parseInt( this.el.getAttribute( 'data-stk-countdown-restart-interval' ) ) || 0
		const action = this.el.getAttribute( 'data-stk-countdown-action' )
		const timezone = this.el.getAttribute( 'data-stk-countdown-timezone' )
		const isDoubleDigit = this.el.getAttribute( 'data-stk-countdown-is-double-digit' ) === 'true' ? true : false

		if ( countdownType === 'dueDate' ) {
			this.preCountDown( isDoubleDigit )
			this.countdownInterval = setInterval( this.countDown.bind( this ), 1000, date, isDoubleDigit, timezone, action )
		} else {
			this.countdownInterval = setInterval( this.countDown.bind( this ), 1000, date, isDoubleDigit, '', '', duration, countdownType, restartInterval )
		}
	}
}

const test = document.querySelectorAll( '.stk-block-countdown' )

test.forEach( el => {
	domReady( new StackableCountdown( el ).init )
} )
