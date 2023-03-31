/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

const SECONDS = 1
const SECONDS_IN_MINUTE = SECONDS * 60
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60
const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24

class _StackableCountdown {
	constructor( el ) {
		this.el = el
		this.blockId = el.getAttribute( 'data-block-id' )
		this.countdownInterval
		this.date = Date.parse( el.getAttribute( 'data-stk-countdown-date' ) )
		this.countdownType = el.getAttribute( 'data-stk-countdown-type' )
		this.duration = parseInt( el.getAttribute( 'data-stk-countdown-duration' ), 10 )
		this.restartInterval = parseFloat( el.getAttribute( 'data-stk-countdown-restart-interval' ) ) || 0
		this.action = el.getAttribute( 'data-stk-countdown-action' )
		this.timezone = el.getAttribute( 'data-stk-countdown-timezone' ) ? { timeZone: el.getAttribute( 'data-stk-countdown-timezone' ) } : {}
		this.isDoubleDigit = el.getAttribute( 'data-stk-countdown-is-double-digit' ) === 'true' ? true : false

		// This will check if the timer reaches 0 since calculating remaining time left prevents the timer from going to 0
		this.tempDate = undefined
		this.counter = false

		this.day = el.querySelector( '.stk-block-countdown__digit-day' )
		this.hour = el.querySelector( '.stk-block-countdown__digit-hour' )
		this.minute = el.querySelector( '.stk-block-countdown__digit-minute' )
		this.second = el.querySelector( '.stk-block-countdown__digit-second' )

		this.timer = this.el.querySelector( '.stk-block-countdown__container' )
		this.message = this.el.querySelector( '.stk-block-countdown__message' )
	}

	clearTimer = () => {
		clearInterval( this.countdownInterval )
	}

	addZero = number => {
		if ( this.isDoubleDigit ) {
			const a = number <= 0 ? 0 : number
			return number < 10 ? '0' + a : number
		}
		return number <= 0 ? 0 : number
	}

	saveTimeRemaining = number => {
		sessionStorage.setItem( this.blockId, number )
	}

	preCountDown = () => {
		const timer = sessionStorage.getItem( this.blockId )

		const daysLeft = Math.floor( timer / SECONDS_IN_DAY )
		const hoursLeft = Math.floor( ( timer % SECONDS_IN_DAY ) / SECONDS_IN_HOUR )
		const minutesLeft = Math.floor( ( timer % SECONDS_IN_HOUR ) / SECONDS_IN_MINUTE )
		const secondsLeft = Math.floor( ( timer % SECONDS_IN_MINUTE ) / SECONDS )

		if ( this.day ) {
			this.day.textContent = this.addZero( daysLeft )
		}

		if ( this.hour ) {
			this.hour.textContent = this.addZero( hoursLeft )
		}

		if ( this.minute ) {
			this.minute.textContent = this.addZero( minutesLeft )
		}

		if ( this.second ) {
			this.second.textContent = this.addZero( secondsLeft )
		}
	}

	countDown = () => {
		// Convert date being compared to to desired timezone
		let timer = Math.floor( this.date / 1000 ) - Math.floor( Date.parse( new Date().toLocaleString( 'en-US', this.timezone ) ) / 1000 )

		let isRestarting = false
		let restartLeft = 0

		checker: if ( this.countdownType === 'recurring' ) {
			// countdownDate becomes startDate for recurring
			const hasStarted = Date.parse( new Date().toLocaleString( 'en-US', this.timezone ) ) > this.date
			const left = this.tempDate - Date.now() - Math.floor( this.restartInterval * SECONDS_IN_HOUR * 1000 )

			if ( left <= 0 ) {
				this.counter = true
				timer = 0
				break checker
			}

			if ( hasStarted ) {
				// Calculate where to start the timer since this is an open timer
				const interval = this.duration + Math.floor( this.restartInterval * SECONDS_IN_HOUR )
				const index = Math.floor( ( ( ( Date.now() / 1000 ) - ( this.date / 1000 ) ) ) / ( interval ) ) + 1
				const b = ( ( index * interval ) + Math.floor( this.date / 1000 ) ) - Math.floor( Date.now() / 1000 )
				this.tempDate = this.date + ( ( index * interval * 1000 ) )
				if ( b > ( this.restartInterval * SECONDS_IN_HOUR ) ) {
					timer = b - Math.floor( this.restartInterval * SECONDS_IN_HOUR )
				} else {
					isRestarting = true
					restartLeft = b
					timer = 0
					this.counter = true
				}
			} else {
				timer = hasStarted ? ( this.duration + Math.floor( this.date / 1000 ) ) - Math.floor( Date.now() / 1000 ) : this.duration
			}
		}

		this.saveTimeRemaining( timer )

		const daysLeft = Math.floor( timer / SECONDS_IN_DAY )
		const hoursLeft = Math.floor( ( timer % SECONDS_IN_DAY ) / SECONDS_IN_HOUR )
		const minutesLeft = Math.floor( ( timer % SECONDS_IN_HOUR ) / SECONDS_IN_MINUTE )
		const secondsLeft = Math.floor( ( timer % SECONDS_IN_MINUTE ) / SECONDS )

		// If null, do not show text
		if ( this.day ) {
			this.day.textContent = this.addZero( daysLeft )
		}

		if ( this.hour ) {
			this.hour.textContent = this.addZero( hoursLeft )
		}

		if ( this.minute ) {
			this.minute.textContent = this.addZero( minutesLeft )
		}

		if ( this.second ) {
			this.second.textContent = this.addZero( secondsLeft )
		}

		if ( timer <= 0 || this.counter ) {
			this.clearTimer()
			if ( this.countdownType === 'recurring' ) {
				this.tempDate = undefined
				this.counter = false
				const a = isRestarting ? restartLeft : this.restartInterval * SECONDS_IN_HOUR
				this.saveTimeRemaining( this.duration )
				const tempCallback = () => {
					this.preCountDown()
					this.countdownInterval = setInterval( this.countDown.bind( this ), 1000 )
				}
				setTimeout( tempCallback, a * 1000 )
			}
			if ( this.action === 'hide' ) {
				this.el.style.display = 'none'
			}
			if ( this.action === 'showMessage' ) {
				this.timer.setAttribute( 'style', 'display:none !important' )
				this.message.setAttribute( 'style', 'display:block !important' )
			}
		}
	}

	init = () => {
		if ( this.countdownType === 'dueDate' ) {
			this.preCountDown()
		}
		this.countdownInterval = setInterval( this.countDown.bind( this ), 1000 )
	}
}

class StackableCountdown {
	init = () => {
		const countdownBlocks = document.querySelectorAll( '.stk-block-countdown' )
		countdownBlocks.forEach( el => {
			new _StackableCountdown( el ).init()
		} )
	}
}

window.stackableCountdown = new StackableCountdown()
domReady( window.stackableCountdown.init )
