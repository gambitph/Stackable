/**
 * Internal dependencies
 */
import CodeTextarea from '../'
import { render } from '@testing-library/react'

describe( 'Code Textarea', () => {
	test( 'should render correctly', () => {
		const { getByRole } = render( <CodeTextarea /> )
		expect( getByRole( 'textbox' ) ).toHaveTextContent( '' )
	} )

	test( 'should display value', () => {
		const { getByRole } = render( <CodeTextarea value="abc" /> )
		expect( getByRole( 'textbox' ) ).toHaveTextContent( 'abc' )
	} )
} )
