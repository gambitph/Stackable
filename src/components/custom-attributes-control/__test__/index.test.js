import CustomAttributesControl from '../'
import {
	render, act, fireEvent,
} from '@testing-library/react'

describe( 'CustomAttributesControl', () => {
	it( 'should catch attribute errors.', async () => {
		const INVALID_HTML_ATTRIBUTES = [
			'class',
			'className',
			'id',
			'ref',
			'style',
			'dangerouslySetInnerHTML',
		]

		const dummyProps = {
			invalidHtmlAttributes: INVALID_HTML_ATTRIBUTES,
			label: 'Custom Attributes',
			value: [],
			onChange: jest.fn(),
		}

		const {
			getByTestId, getByText,
		} = render( <CustomAttributesControl { ...dummyProps } /> )
		expect( getByText( 'Custom Attributes' ) ).toBeTruthy()

		const invalidInputs = [
			`test`,
			`key=value`,
			`key="value" key2=invalid`,
			`style="color: red;"`,
			`dangerouslySetInnerHTML="content"`,
			`ref="sample ref"`,
			`key="value,'`,
			`key-_!@#="value"`,
			`key="value" key="value"`,
			`key="value"key="value"`,
			`key="<div>"`,
			`key='value'`,
		]

		invalidInputs.forEach( async value => {
			await act( async () => {
				fireEvent.change( getByTestId( 'custom-attributes' ), { target: { value } } )
				await new Promise( r => setTimeout( r, 500 ) )
			} )
			expect( dummyProps.value ).toEqual( [] )
		} )
	} )
} )
