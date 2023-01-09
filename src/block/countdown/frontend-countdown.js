/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

const SECONDS = 1000
const SECONDS_IN_MINUTE = SECONDS * 60
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60
const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24

class StackableCountdown {
	callback = ( el, end ) => {
		const day = el.querySelector( '.stk-block-countdown__digit_day' )
		const hour = el.querySelector( '.stk-block-countdown__digit_hour' )
		const minute = el.querySelector( '.stk-block-countdown__digit_minute' )
		const second = el.querySelector( '.stk-block-countdown__digit_second' )

		const difference = end - Date.now()

		if ( difference <= 0 ) {
			day.innerHTML = 0
			hour.innerHTML = 0
			minute.innerHTML = 0
			second.innerHTML = 0
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
			const elsDate = el.getAttribute( 'enddate' )
			const end = Date.parse( elsDate )
			setInterval( this.callback, 1000, el, end )
		} )
	}
}

window.stackableCountUp = new StackableCountdown()
domReady( window.stackableCountUp.init )
