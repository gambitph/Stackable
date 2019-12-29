import withHelpTip from '../index'

import { render } from '@testing-library/react'
import { compose } from '@wordpress/compose'

const Test = props => {
	return <div className={ props.className || '' } data-testid="el"></div>
}

describe( 'withHelpTip', () => {
	it( 'should show default help tip class', () => {
		const Test2 = compose( withHelpTip( 'my-test-class' ) )( Test )
		const { getByTestId } = render( <Test2 /> )
		expect( getByTestId( 'el' ).getAttribute( 'class' ).match( /my-test-class/ ) ).toBeTruthy()
	} )

	it( 'should use given help tip class', () => {
		const Test2 = compose( withHelpTip( 'my-test-class' ) )( Test )
		const { getByTestId } = render( <Test2 className="ugb--help-tip-override-test-class" /> )
		expect( getByTestId( 'el' ).getAttribute( 'class' ).match( /my-test-class/ ) ).toBeFalsy()
		expect( getByTestId( 'el' ).getAttribute( 'class' ).match( /override-test-class/ ) ).toBeTruthy()
	} )

	it( 'should allow non-help tip classes', () => {
		const Test2 = compose( withHelpTip( 'my-test-class' ) )( Test )
		const { getByTestId } = render( <Test2 className="override-test-class" /> )
		expect( getByTestId( 'el' ).getAttribute( 'class' ).match( /my-test-class/ ) ).toBeTruthy()
		expect( getByTestId( 'el' ).getAttribute( 'class' ).match( /override-test-class/ ) ).toBeTruthy()
	} )

	it( 'should use given help tip class but allow non-help tip classes', () => {
		const Test2 = compose( withHelpTip( 'my-test-class' ) )( Test )
		const { getByTestId } = render( <Test2 className="ugb--help-tip-override-test-class other-test-class" /> )
		expect( getByTestId( 'el' ).getAttribute( 'class' ).match( /my-test-class/ ) ).toBeFalsy()
		expect( getByTestId( 'el' ).getAttribute( 'class' ).match( /override-test-class/ ) ).toBeTruthy()
		expect( getByTestId( 'el' ).getAttribute( 'class' ).match( /other-test-class/ ) ).toBeTruthy()
	} )
} )
