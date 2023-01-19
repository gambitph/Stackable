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
		this.countdownInterval
	}

	clearTimer = () => {
		clearInterval( this.countdownInterval )
	}

	countDown = ( countdownDate, timezone, action, duration = 0, countdownType = 'dueDate', restartInterval = 0 ) => {
		const day = this.el.querySelector( '.stk-block-countdown__digit_day' )
		const hour = this.el.querySelector( '.stk-block-countdown__digit_hour' )
		const minute = this.el.querySelector( '.stk-block-countdown__digit_minute' )
		const second = this.el.querySelector( '.stk-block-countdown__digit_second' )

		// Convert to chosen timezone
		const endDate = timezone ? Date.parse( date( 'Y-m-d\\TH:i', countdownDate, timezone ) ) : countdownDate

		let timer = Math.floor( endDate / 1000 ) - Math.floor( Date.parse( date( 'Y-m-d\\TH:i:s', Date.now(), timezone ) ) / 1000 )
		let isRestarting = false
		let restartLeft = 0

		if ( countdownType === 'recurring' ) {
			// endDate becomes startDate for recurring
			const diff = Date.now() > endDate
			if ( diff ) {
				// Calculate where to start the timer since this is an open timer
				const interval = ( duration / 1000 ) + ( restartInterval )
				const index = Math.floor( ( ( ( Date.now() / 1000 ) - ( endDate / 1000 ) ) ) / ( interval ) ) + 1
				const b = Math.floor( ( ( index * interval ) + Math.floor( endDate / 1000 ) ) - Math.floor( Date.now() / 1000 ) )
				if ( b > restartInterval ) {
					timer = b - restartInterval
				} else {
					isRestarting = true
					restartLeft = b
					timer = 0
				}
			} else {
				timer = diff ? Math.floor( ( duration + endDate ) / 1000 ) - Math.floor( Date.now() / 1000 ) : Math.floor( duration / 1000 )
			}
		}

		const daysLeft = Math.floor( timer / SECONDS_IN_DAY )
		const hoursLeft = Math.floor( ( timer % SECONDS_IN_DAY ) / SECONDS_IN_HOUR )
		const minutesLeft = Math.floor( ( timer % SECONDS_IN_HOUR ) / SECONDS_IN_MINUTE )
		const secondsLeft = Math.floor( ( timer % SECONDS_IN_MINUTE ) / SECONDS )

		day.textContent = daysLeft <= 0 ? '00' : daysLeft
		hour.textContent = hoursLeft <= 0 ? '00' : hoursLeft
		minute.textContent = minutesLeft <= 0 ? '00' : minutesLeft
		second.textContent = secondsLeft <= 0 ? '00' : secondsLeft

		if ( timer <= 0 ) {
			this.clearTimer()
			if ( countdownType === 'recurring' ) {
				const a = isRestarting ? restartLeft : restartInterval
				setTimeout( () => {
					this.countdownInterval = setInterval( this.countDown.bind( this ), 1000, Date.now(), '', '', duration, countdownType, restartInterval, timezone )
				}, a * 1000 ).bind( this )
			}
			if ( action === 'hide' ) {
				this.el.style.display = 'none'
			}
			if ( action === 'showMessage' ) {
				const timer = this.el.querySelector( '.stk-block-countdown__container' )
				timer.style.display = 'none'
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

		if ( countdownType === 'dueDate' ) {
			this.countdownInterval = setInterval( this.countDown.bind( this ), 1000, date, timezone, action )
		} else {
			this.countdownInterval = setInterval( this.countDown.bind( this ), 1000, date, '', '', duration, countdownType, restartInterval )
		}
	}
}

const test = document.querySelectorAll( '.stk-block-countdown' )

test.forEach( el => {
	domReady( new StackableCountdown( el ).init )
} )

