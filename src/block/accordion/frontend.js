import domReady from '@wordpress/dom-ready'

export const openAccordion = el => {
	el.classList.toggle( 'ugb-accordion--open' )
	el.setAttribute( 'aria-expanded', el.classList.contains( 'ugb-accordion--open' ) ? 'true' : 'false' )
}

let instanceID = 1
export const init = el => {
	const a = el.querySelector( '.ugb-accordion__heading' )
	a.addEventListener( 'click', ev => {
		ev.preventDefault()
		openAccordion( el )
	} )
	a.addEventListener( 'keypress', ev => {
		ev.preventDefault()
		openAccordion( el )
	} )

	// Accessibility: https://www.w3.org/TR/wai-aria-practices/examples/accordion/accordion.html
	const heading = el.querySelector( '.ugb-accordion__heading h4' )
	const text = el.querySelector( '.ugb-accordion__text' )
	heading.setAttribute( 'id', `ugb-accordion-${ instanceID }__heading` )
	heading.setAttribute( 'aria-controls', `ugb-accordion-${ instanceID }__text` )
	text.setAttribute( 'id', `ugb-accordion-${ instanceID }__text` )
	text.setAttribute( 'aria-labelledby', `ugb-accordion-${ instanceID }__heading` )
	instanceID++
}

export const initAll = () => {
	const elems = document.querySelectorAll( '.ugb-accordion' )
	Array.prototype.forEach.call( elems, el => init( el ) )
}

domReady( initAll )
