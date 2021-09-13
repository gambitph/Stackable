/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

const isPanelOpen = el => {
	return el.classList.contains( 'ugb-accordion--open' )
}

const toggleAccordion = ( el, skipAdjacent = false ) => {
	const content = el.querySelector( '.ugb-accordion__text, .ugb-accordion__content' )

	// Clear any animations currently happening.
	clearTimeout( el.aTimeout )

	if ( ! isPanelOpen( el ) ) {
		// Set the max height to animate.
		content.style.maxHeight = el.getAttribute( 'data-height' )

		// After the animation, remove the max-height so that just incase it's
		// wrong, we can still show the rest of the contents.
		el.aTimeout = setTimeout( () => {
			content.style.maxHeight = ''
		}, 350 )
	} else {
		// Remember the current height of the open state.
		el.setAttribute( 'data-height', `${ content.clientHeight + 50 }px` )
		// We need to set the maxHeight first because we previously cleared it.
		content.style.maxHeight = el.getAttribute( 'data-height' )

		// Set the height to 0 in a setTimeout to animate the closing.
		el.aTimeout = setTimeout( () => {
			content.style.maxHeight = 0
		}, 1 )
	}

	// Set the accordion classes.
	el.setAttribute( 'aria-expanded', ! isPanelOpen( el ) ? 'true' : 'false' )
	el.classList.toggle( 'ugb-accordion--open' )

	// This is true if called by an adjacent close.
	if ( skipAdjacent ) {
		return
	}

	// Close other adjacent accordions if needed.
	if ( el.classList.contains( 'ugb-accordion--single-open' ) ) {
		let adjacent = el.nextElementSibling
		while ( adjacent && adjacent.classList.contains( 'ugb-accordion' ) ) {
			if ( isPanelOpen( adjacent ) ) {
				toggleAccordion( adjacent, true )
			}
			// forceCloseAccordion( adjacent )
			adjacent = adjacent.nextElementSibling
		}
		adjacent = el.previousElementSibling
		while ( adjacent && adjacent.classList.contains( 'ugb-accordion' ) ) {
			if ( isPanelOpen( adjacent ) ) {
				toggleAccordion( adjacent, true )
			}
			// forceCloseAccordion( adjacent )
			adjacent = adjacent.previousElementSibling
		}
	}
}

const detectMaxHeight = el => {
	const isOpen = el.classList.contains( 'ugb-accordion--open' )
	const content = el.querySelector( '.ugb-accordion__text, .ugb-accordion__content' )

	// Open the accordion if needed.
	if ( ! isOpen ) {
		el.style.display = 'none'
		content.style.maxHeight = 'none'
		el.classList.toggle( 'ugb-accordion--open' )
		el.style.display = ''
	}

	// Get the height in its open state.
	const contentHeight = el.querySelector( '.ugb-accordion__text, .ugb-accordion__content' ).clientHeight
	el.setAttribute( 'data-height', `${ contentHeight + 50 }px` )

	// Bring back the previous state.
	if ( ! isOpen ) {
		el.style.display = 'none'
		el.classList.toggle( 'ugb-accordion--open' )
		content.style.maxHeight = ''
		el.style.display = ''
	}
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
	document.querySelectorAll( '.ugb-accordion--v2' ).forEach( el => init( el ) )
}

domReady( initAll )
