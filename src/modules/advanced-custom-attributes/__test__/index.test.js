import { CustomAttributesControl } from '../'
import {
	render, act, fireEvent,
} from '@testing-library/react'

describe( 'CustomAttributesControl', () => {
	it( 'should catch attribute errors.', async () => {
		const dummyProps = {
			label: 'Custom Attributes',
			value: [],
			onChange: jest.fn(),
		}

		const {
			getByTestId, getByText, container,
		} = render( <CustomAttributesControl { ...dummyProps } /> )
		expect( getByText( 'Custom Attributes' ) ).toBeTruthy()

		const invalidInputs = [
			'test',
			'key=value',
			'key="value" key2=invalid',
			'style="color: red;"',
			'dangerouslySetInnerHTML="content"',
			'ref="sample ref"',
		]

		invalidInputs.forEach( async value => {
			await act( async () => {
				fireEvent.change( getByTestId( 'custom-attributes' ), { target: { value } } )
				await new Promise( r => setTimeout( r, 500 ) )
			} )
			expect( container.querySelector( '.stk-custom-attributes-control__has-error' ) ).toBeTruthy()
			expect( dummyProps.value ).toEqual( [] )
		} )
	} )
} )
