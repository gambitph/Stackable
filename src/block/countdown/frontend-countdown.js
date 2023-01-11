/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

const SECONDS = 1000
const SECONDS_IN_MINUTE = SECONDS * 60
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60
const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24

class StackableCountdown {
	constructor() {
		this.countDown
	}

	callback = ( el, start, end, countdownType ) => {
		const day = el.querySelector( '.stk-block-countdown__digit_day' )
		const hour = el.querySelector( '.stk-block-countdown__digit_hour' )
		const minute = el.querySelector( '.stk-block-countdown__digit_minute' )
		const second = el.querySelector( '.stk-block-countdown__digit_second' )

		const difference = end - Date.now()

		if ( Date.now() <= start ) {
			return
		}

		if ( difference <= 0 ) {
			clearInterval( this.countDown )
			if ( countdownType === 'recurring' ) {
				const nextEnd = Math.abs( start - end ) + end
				this.countDown = setInterval( this.callback, 1000, el, end, nextEnd, countdownType )
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
		const els = document.querySelectorAll( '.stk-block-countdown' )
		els.forEach( el => {
			const elsEndDate = el.getAttribute( 'data-stk-end-date' )
			const elsStartDate = el.getAttribute( 'data-stk-start-date' )
			const countdownType = el.getAttribute( 'data-stk-countdown-type' )
			const start = Date.parse( elsStartDate )
			const end = countdownType === 'dueDate' ? Date.parse( elsEndDate ) : parseInt( elsEndDate ) + start
			this.countDown = setInterval( this.callback, 1000, el, start, end, countdownType )
		} )
	}
}

window.stackableCountUp = new StackableCountdown()
domReady( window.stackableCountUp.init )
