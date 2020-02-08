import { render } from '@testing-library/react'
import ControlSeparator from '..'

describe( 'ControlSeparator', () => {
	it( 'should render', () => {
		const { getByRole } = render( <ControlSeparator /> )
		expect( getByRole( 'separator' ) ).toBeTruthy()
	} )
} )
