import domReady from '@wordpress/dom-ready'

const openAccordion = el => {
	el.classList.toggle( 'ugb-accordion--open' )
	el.setAttribute( 'aria-expanded', el.classList.contains( 'ugb-accordion--open' ) ? 'true' : 'false' )
}

domReady( () => {
	const elems = document.querySelectorAll( '.ugb-accordion' )
	elems.forEach( el => {
		const a = el.querySelector( '.ugb-accordion__heading' )
		a.addEventListener( 'click', ev => {
			ev.preventDefault()
			openAccordion( el )
		} )
		a.addEventListener( 'keypress', ev => {
			ev.preventDefault()
			openAccordion( el )
		} )
	} )
} )
