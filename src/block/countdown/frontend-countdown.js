/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

const SECONDS = 1
const SECONDS_IN_MINUTE = SECONDS * 60
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60
const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24

class StackableCountdown {
	constructor( el ) {
		this.el = el
		this.blockId = el.getAttribute( 'data-block-id' )
		this.countdownInterval
		this.date = Date.parse( el.getAttribute( 'data-stk-countdown-date' ) )
		this.countdownType = el.getAttribute( 'data-stk-countdown-type' )
		this.duration = parseInt( el.getAttribute( 'data-stk-countdown-duration' ), 10 )
		this.restartInterval = parseInt( el.getAttribute( 'data-stk-countdown-restart-interval' ), 10 ) || 0
		this.action = el.getAttribute( 'data-stk-countdown-action' )
		this.timezone = el.getAttribute( 'data-stk-countdown-timezone' ) ? { timezone: el.getAttribute( 'data-stk-countdown-timezone' ) } : {}
		this.isDoubleDigit = el.getAttribute( 'data-stk-countdown-is-double-digit' ) === 'true' ? true : false

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

		if ( this.countdownType === 'recurring' ) {
			// countdownDate becomes startDate for recurring
			const diff = Date.now() > this.date

			if ( diff ) {
				// Calculate where to start the timer since this is an open timer
				const interval = this.duration + ( this.restartInterval * SECONDS_IN_HOUR )
				const index = Math.floor( ( ( ( Date.now() / 1000 ) - ( this.date / 1000 ) ) ) / ( interval ) ) + 1
				const b = Math.floor( ( ( index * interval ) + Math.floor( this.date / 1000 ) ) - Math.floor( Date.now() / 1000 ) )
				if ( b > ( this.restartInterval * SECONDS_IN_HOUR ) ) {
					timer = b - ( this.restartInterval * SECONDS_IN_HOUR )
				} else {
					isRestarting = true
					restartLeft = b
					timer = 0
				}
			} else {
				timer = diff ? ( this.duration + Math.floor( this.date / 1000 ) ) - Math.floor( Date.now() / 1000 ) : this.duration
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

		if ( timer <= 0 ) {
			this.clearTimer()
			if ( this.countdownType === 'recurring' ) {
				const a = isRestarting ? restartLeft : this.restartInterval
				const tempCallback = () => {
					this.date = Date.now()
					this.countdownInterval = setInterval( this.countDown.bind( this ), 1000 )
				}
				setTimeout( tempCallback, a * 1000 )
			}
			if ( this.action === 'hide' ) {
				this.el.style.display = 'none'
			}
			if ( this.action === 'showMessage' ) {
				this.timer.style.display = 'none'
				this.message.style.display = 'block'
			}
		}
	}

	init = () => {
		// Note duration for recurring,
		if ( this.countdownType === 'dueDate' ) {
			this.preCountDown()
			this.countdownInterval = setInterval( this.countDown.bind( this ), 1000 )
		} else {
			this.countdownInterval = setInterval( this.countDown.bind( this ), 1000 )
		}
	}
}

const countdownBlocks = document.querySelectorAll( '.stk-block-countdown' )

countdownBlocks.forEach( el => {
	domReady( new StackableCountdown( el ).init )
} )
