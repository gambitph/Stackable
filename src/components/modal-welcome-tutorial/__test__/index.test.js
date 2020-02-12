import { render, fireEvent } from '@testing-library/react'
import ModalWelcomeTutorial from '..'

describe( 'ModalWelcomeTutorial', () => {
	it( 'should show the video', () => {
		const { baseElement	} = render( <ModalWelcomeTutorial /> )

		expect( baseElement.querySelector( 'iframe' ) ).toBeTruthy()
	} )

	it( 'should trigger onRequestClose', () => {
		const onRequestClose = jest.fn()
		const {
			getByLabelText, getByTestId,
		} = render( <ModalWelcomeTutorial onRequestClose={ onRequestClose } /> )

		expect( onRequestClose ).toHaveBeenCalledTimes( 0 )
		fireEvent.click( getByLabelText( 'Close dialog' ) )
		expect( onRequestClose ).toHaveBeenCalledTimes( 1 )
		fireEvent.click( getByTestId( 'button-close' ) )
		expect( onRequestClose ).toHaveBeenCalledTimes( 2 )
	} )
} )
