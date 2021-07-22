/**
 * Internal dependencies
 */
import BaseControlMultiLabel from '../'
import { render, fireEvent } from '@testing-library/react'

describe( 'Unit switcher', () => {
	it( 'should have a label', () => {
		const { getByText } = render( <BaseControlMultiLabel label="hello" /> )
		expect( getByText( 'hello' ) ).toBeTruthy()
	} )

	it( 'should not display units if single', () => {
		const { queryByRole, queryByText } = render( <BaseControlMultiLabel /> )
		expect( queryByRole( 'button' ) ).toBeNull()
		expect( queryByText( 'px' ) ).toBeNull()
		expect( queryByText( '%' ) ).toBeNull()
	} )

	it( 'should display units if multiple (2 buttons)', () => {
		const { getByText } = render( <BaseControlMultiLabel units={ [ 'px', '%' ] } /> )

		expect( getByText( 'px' ) ).toBeTruthy()
		expect( getByText( '%' ) ).toBeTruthy()
		expect( getByText( 'px' ) ).toHaveClass( 'is-active' )
		expect( getByText( '%' ) ).not.toHaveClass( 'is-active' )
	} )

	it( 'should display units if multiple (3 buttons)', () => {
		const { getByText } = render( <BaseControlMultiLabel unit="em" units={ [ 'px', 'em', '%' ] } /> )

		expect( getByText( 'px' ) ).toBeTruthy()
		expect( getByText( 'em' ) ).toBeTruthy()
		expect( getByText( '%' ) ).toBeTruthy()
		expect( getByText( 'px' ) ).not.toHaveClass( 'is-active' )
		expect( getByText( 'em' ) ).toHaveClass( 'is-active' )
		expect( getByText( '%' ) ).not.toHaveClass( 'is-active' )
	} )

	it( 'should change units', () => {
		const onChange = jest.fn()

		const { getByText } = render( <BaseControlMultiLabel units={ [ 'px', '%' ] } onChangeUnit={ onChange } /> )
		fireEvent.click( getByText( '%' ) )
		expect( onChange ).toHaveBeenCalledWith( '%' )
	} )

	it( 'should not have responsive if only 1 screen', () => {
		const { queryByLabelText } = render( <BaseControlMultiLabel screens={ [ 'desktop' ] } /> )
		expect( queryByLabelText( 'Desktop' ) ).toBeNull()
	} )
} )
