/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

const SECONDS = 1000
const SECONDS_IN_MINUTE = SECONDS * 60
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60
const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24

class StackableCountdown {
	constructor( el ) {
		this.el = el
		this.countDown
	}

	callback = ( startDate, endDate, countdownType, duration = 0 ) => {
		const day = this.el.querySelector( '.stk-block-countdown__digit_day' )
		const hour = this.el.querySelector( '.stk-block-countdown__digit_hour' )
		const minute = this.el.querySelector( '.stk-block-countdown__digit_minute' )
		const second = this.el.querySelector( '.stk-block-countdown__digit_second' )

		const difference = endDate - Date.now()

		if ( countdownType === 'recurring' && Date.now() <= startDate ) {
			return
		}

		if ( difference <= 0 ) {
			clearInterval( this.countDown )
			if ( countdownType === 'recurring' ) {
				this.countDown = setInterval( this.callback, 1000, Date.now(), Date.now() + duration, countdownType, duration, )
			}
			return
		}

		const days = Math.floor( difference / SECONDS_IN_DAY )
		const hours = Math.floor( ( difference % SECONDS_IN_DAY ) / SECONDS_IN_HOUR )
		const minutes = Math.floor( ( difference % SECONDS_IN_HOUR ) / SECONDS_IN_MINUTE )
		const seconds = Math.floor( ( difference % SECONDS_IN_MINUTE ) / SECONDS )

		day.innerHTML = days
		hour.innerHTML = hours
		minute.innerHTML = minutes
		second.innerHTML = seconds
	}

	init = () => {
		 // Note duration for recurring,
		const date = Date.parse( this.el.getAttribute( 'data-stk-countdown-date' ) )
		const countdownType = this.el.getAttribute( 'data-stk-countdown-type' )
		const duration = parseInt( this.el.getAttribute( 'data-stk-countdown-duration' ) )
		// const restartInterval = 5 //parseInt( this.el.getAttribute( 'data-stk-countdown-restart-interval' ) )
		if ( countdownType === 'dueDate' ) {
			this.countDown = setInterval( this.callback, 1000, Date.now(), date, countdownType )
		} else {
			const index = Math.floor( ( Date.now() - date ) / duration ) + 1
			const nextEnd = ( index * duration ) + date
			this.countDown = setInterval( this.callback, 1000, Date.now(), nextEnd, countdownType, duration )
		}
	}
}

window.stackableCountdown = document.querySelectorAll( '.stk-block-countdown' )
window.stackableCountdown.forEach( el => {
	domReady( new StackableCountdown( el ).init )
} )
