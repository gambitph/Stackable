import DesignLibraryList from '../'
import {
	render, fireEvent, wait,
} from '@testing-library/react'
import { getDesign } from '~stackable/design-library'

jest.mock( '~stackable/design-library' )

describe( 'DesignLibraryList', () => {
	it( 'renders', () => {
		const designs = [ {
			image: 'https://test.com/img.jpg',
			label: 'My Design',
		}, {
			image: 'https://test.com/img2.jpg',
			label: 'My Other Design',
		} ]

		const {
			getByText, getAllByRole, queryByTestId,
		} = render( <DesignLibraryList designs={ designs } /> )

		// Spinner
		expect( queryByTestId( 'spinner' ) ).toBeNull()

		// Images.
		expect( getAllByRole( 'img' ).length ).toBe( 2 )
		expect( getAllByRole( 'img' )[ 0 ].getAttribute( 'src' ) ).toEqual( 'https://test.com/img.jpg' )
		expect( getAllByRole( 'img' )[ 1 ].getAttribute( 'src' ) ).toEqual( 'https://test.com/img2.jpg' )

		// Labels.
		expect( getByText( 'My Design' ) ).toBeTruthy()
		expect( getByText( 'My Other Design' ) ).toBeTruthy()
	} )

	it( 'shows a no designs found note', () => {
		const { getByTestId } = render( <DesignLibraryList designs={ [] } /> )

		// Data has loaded, remove spinner.
		expect( getByTestId( 'nothing-found-note' ) ).toBeTruthy()
	} )

	it( 'shows a spinner if busy', () => {
		const { getByTestId } = render( <DesignLibraryList isBusy={ true } /> )

		// Data has loaded, remove spinner.
		expect( getByTestId( 'spinner' ) ).toBeTruthy()
	} )

	it( 'triggers onSelect', async () => {
		const designs = [ {
			image: 'https://test.com/img.jpg',
			label: 'My Design',
		}, {
			image: 'https://test.com/img2.jpg',
			label: 'My Other Design',
		} ]

		const onSelect = jest.fn()
		const {
			getAllByRole,
		} = render( <DesignLibraryList designs={ designs } onSelect={ onSelect } /> )

		getDesign.mockReturnValueOnce( Promise.resolve( 'design-1' ) )
		getDesign.mockReturnValueOnce( Promise.resolve( 'design-2' ) )

		// Images.
		expect( onSelect ).toHaveBeenCalledTimes( 0 )
		fireEvent.click( getAllByRole( 'button' )[ 0 ] )
		await wait()
		expect( onSelect ).toHaveBeenCalledTimes( 1 )
		expect( onSelect ).toHaveBeenCalledWith( 'design-1' )

		fireEvent.click( getAllByRole( 'button' )[ 1 ] )
		await wait()
		expect( onSelect ).toHaveBeenCalledTimes( 2 )
		expect( onSelect ).toHaveBeenCalledWith( 'design-2' )
	} )
} )
