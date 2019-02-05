import { fireEvent, getByText } from 'dom-testing-library'
import { name, settings } from '../'
import { getSavedBlockHTML } from '@stackable/test/helpers'
import { initAll } from '../frontend'
import save from '../save'

describe( 'Accordion in frontend', () => {
	const attributes = {
		heading: 'Accordion Title',
		text: 'Accordion body',
	}

	const savedBlockHTML = getSavedBlockHTML( {
		name,
		settings,
		save,
		attributes,
	} )

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
