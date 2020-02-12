import { render, fireEvent } from '@testing-library/react'
import ColorList from '../color-list'

describe( 'ColorList', () => {
	const colors = {
		red: {
			color: '#f44336',
			name: 'red',
		},
		green: {
			color: '#4caf50',
			name: 'green',
		},
		yellow: {
			color: '#ffeb3b',
			name: 'yellow',
		},
	}

	it( 'should render colors', () => {
		const { getByLabelText } = render( <ColorList colors={ colors } /> )

		expect( getByLabelText( /red/ ) ).toHaveStyle( { color: '#f44336' } )
		expect( getByLabelText( /green/ ) ).toHaveStyle( { color: '#4caf50' } )
		expect( getByLabelText( /yellow/ ) ).toHaveStyle( { color: '#ffeb3b' } )

		expect( getByLabelText( /red/ ) ).toHaveAttribute( 'aria-pressed', 'false' )
		expect( getByLabelText( /green/ ) ).toHaveAttribute( 'aria-pressed', 'false' )
		expect( getByLabelText( /yellow/ ) ).toHaveAttribute( 'aria-pressed', 'false' )
	} )

	it( 'should trigger onSelect', () => {
		const onSelect = jest.fn()
		const { getByLabelText } = render( <ColorList colors={ colors } onSelect={ onSelect } /> )

		expect( onSelect ).toHaveBeenCalledTimes( 0 )

		fireEvent.click( getByLabelText( /red/ ) )
		expect( onSelect ).toHaveBeenCalledWith( [ 'red' ] )

		expect( getByLabelText( /red/ ) ).toHaveAttribute( 'aria-pressed', 'true' )
		expect( getByLabelText( /green/ ) ).toHaveAttribute( 'aria-pressed', 'false' )
		expect( getByLabelText( /yellow/ ) ).toHaveAttribute( 'aria-pressed', 'false' )

		fireEvent.click( getByLabelText( /red/ ) )
		expect( onSelect ).toHaveBeenCalledWith( [] )

		expect( getByLabelText( /red/ ) ).toHaveAttribute( 'aria-pressed', 'false' )
		expect( getByLabelText( /green/ ) ).toHaveAttribute( 'aria-pressed', 'false' )
		expect( getByLabelText( /yellow/ ) ).toHaveAttribute( 'aria-pressed', 'false' )

		fireEvent.click( getByLabelText( /green/ ) )
		expect( onSelect ).toHaveBeenCalledWith( [ 'green' ] )
		fireEvent.click( getByLabelText( /yellow/ ) )
		expect( onSelect ).toHaveBeenCalledWith( [ 'green', 'yellow' ] )

		expect( getByLabelText( /red/ ) ).toHaveAttribute( 'aria-pressed', 'false' )
		expect( getByLabelText( /green/ ) ).toHaveAttribute( 'aria-pressed', 'true' )
		expect( getByLabelText( /yellow/ ) ).toHaveAttribute( 'aria-pressed', 'true' )

		fireEvent.click( getByLabelText( /green/ ) )
		expect( onSelect ).toHaveBeenCalledWith( [ 'yellow' ] )
		fireEvent.click( getByLabelText( /yellow/ ) )
		expect( onSelect ).toHaveBeenCalledWith( [] )
	} )
} )
