/**
 * Internal dependencies
 */
import { name, settings } from '../'
import { initAll } from '../frontend'

/**
 * External dependencies
 */
import { getSavedBlockHTML } from '~stackable/test/helpers'
import { fireEvent, getByText } from 'dom-testing-library'

describe( 'Accordion in frontend', () => {
	const attributes = {
		title: 'Accordion Title',
	}

	const savedBlockHTML = getSavedBlockHTML( name, settings, attributes )

	test( 'should open/close on click', () => {
		const container = document.createElement( 'div' )
		document.body.appendChild( container )
		container.innerHTML = savedBlockHTML
		initAll()

		const el = container.children[ 0 ]
		expect( el.classList.contains( 'ugb-accordion--open' ) ).toBeFalsy()
		const title = getByText( container, /Accordion Title/ )

		fireEvent.click( title )
		expect( el.classList.contains( 'ugb-accordion--open' ) ).toBeTruthy()

		fireEvent.keyPress( title, { key: 'space' } )
		expect( el.classList.contains( 'ugb-accordion--open' ) ).toBeFalsy()
	} )

	// TODO: should have different aria labels
	// test( 'should have different aria labels', () => {
	// } )

	// TODO: should open/close multiple accordions
	// test( 'should open/close multiple accordions', () => {

	// } )
} )
