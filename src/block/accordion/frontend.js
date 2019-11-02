/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

const toggleAccordion = el => {
	el.classList.toggle( 'ugb-accordion--open' )
	el.setAttribute( 'aria-expanded', el.classList.contains( 'ugb-accordion--open' ) ? 'true' : 'false' )

	// Close other adjacent accordions if needed.
	if ( el.classList.contains( 'ugb-accordion--single-open' ) ) {
		let adjacent = el.nextElementSibling
		while ( adjacent && adjacent.classList.contains( 'ugb-accordion' ) ) {
			forceCloseAccordion( adjacent )
			adjacent = adjacent.nextElementSibling
		}
		adjacent = el.previousElementSibling
		while ( adjacent && adjacent.classList.contains( 'ugb-accordion' ) ) {
			forceCloseAccordion( adjacent )
			adjacent = adjacent.previousElementSibling
		}
	}
}

const forceCloseAccordion = el => {
	el.classList.remove( 'ugb-accordion--open' )
	el.setAttribute( 'aria-expanded', 'false' )
}

const detectMaxHeight = el => {
	const isOpen = el.classList.contains( 'ugb-accordion--open' )

	// Open the accordion if needed.
	if ( ! isOpen ) {
		el.style.display = 'none'
		el.classList.toggle( 'ugb-accordion--open' )
		el.style.display = ''
	}

	// Get the height in its open state.
	const contentHeight = el.querySelector( '.ugb-accordion__text, .ugb-accordion__content' ).clientHeight

	// Bring back the previous state.
	if ( ! isOpen ) {
		el.style.display = 'none'
		el.classList.toggle( 'ugb-accordion--open' )
		el.style.display = ''
	}

	// Set the max height that we'll use
	el.style.setProperty( '--max-height', `${ contentHeight + 50 }px` )
}

let instanceID = 1
const init = el => {
	// Set our max-height variable.
	detectMaxHeight( el )

	const a = el.querySelector( '.ugb-accordion__heading' )
	a.addEventListener( 'click', ev => {
		ev.preventDefault()
		toggleAccordion( el )
	} )
	a.addEventListener( 'keypress', ev => {
		ev.preventDefault()
		toggleAccordion( el )
	} )

	// Accessibility: https://www.w3.org/TR/wai-aria-practices/examples/accordion/accordion.html
	const heading = el.querySelector( '.ugb-accordion__heading h4, .ugb-accordion__title' )
	const content = el.querySelector( '.ugb-accordion__text, .ugb-accordion__content' )

	heading.setAttribute( 'id', `ugb-accordion-${ instanceID }__heading` )
	content.setAttribute( 'id', `ugb-accordion-${ instanceID }__content` )
	heading.setAttribute( 'aria-controls', `ugb-accordion-${ instanceID }__content` )
	content.setAttribute( 'aria-labelledby', `ugb-accordion-${ instanceID }__heading` )
	instanceID++
}

export const initAll = () => {
	document.querySelectorAll( '.ugb-accordion' ).forEach( el => init( el ) )
}

domReady( initAll )
