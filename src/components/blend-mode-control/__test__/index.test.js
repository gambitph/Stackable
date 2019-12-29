import BlendModeControl from '../index'
import { render, fireEvent } from '@testing-library/react'

describe( 'BlendModeControl', () => {
	it( 'renders', () => {
		const wrapper = render( <BlendModeControl label="Blend Title" /> )
		expect( wrapper.getByText( 'Blend Title' ) ).toBeTruthy()
		expect( wrapper.getByText( 'Multiply' ) ).toBeTruthy()
		expect( wrapper.getByRole( 'listbox' ) ).toBeTruthy()
	} )

	it( 'triggers onChange', () => {
		const onChange = jest.fn()
		const wrapper = render( <BlendModeControl onChange={ onChange } /> )
		expect( onChange ).toHaveBeenCalledTimes( 0 )
		fireEvent.change( wrapper.getByRole( 'listbox' ), { target: { value: 'Multiply' } } )
		expect( onChange ).toHaveBeenCalledTimes( 1 )
	} )
} )
