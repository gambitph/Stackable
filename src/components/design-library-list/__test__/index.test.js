import DesignLibraryList from '../'
import {
	render, fireEvent, wait,
} from '@testing-library/react'
import { getDesigns, getDesign } from '~stackable/design-library'

jest.mock( '~stackable/design-library' )

describe( 'DesignLibraryList', () => {
	it( 'renders', async () => {
		getDesigns.mockReturnValue( Promise.resolve( [ {
			image: 'https://test.com/img.jpg',
			label: 'My Design',
		}, {
			image: 'https://test.com/img2.jpg',
			label: 'My Other Design',
		} ] ) )

		const {
			getByText, getAllByRole, getByTestId, queryByTestId,
		} = render( <DesignLibraryList /> )

		// Display a spinner when loading data.
		expect( getByTestId( 'spinner' ) ).toBeTruthy()
		await wait()

		// Data has loaded, remove spinner.
		expect( queryByTestId( 'spinner' ) ).toBeNull()

		// Images.
		expect( getAllByRole( 'img' ).length ).toBe( 2 )
		expect( getAllByRole( 'img' )[ 0 ].getAttribute( 'src' ) ).toEqual( 'https://test.com/img.jpg' )
		expect( getAllByRole( 'img' )[ 1 ].getAttribute( 'src' ) ).toEqual( 'https://test.com/img2.jpg' )

		// Labels.
		expect( getByText( 'My Design' ) ).toBeTruthy()
		expect( getByText( 'My Other Design' ) ).toBeTruthy()
	} )

	it( 'shows a no designs found note', async () => {
		// No designs available.
		getDesigns.mockReturnValue( Promise.resolve( [] ) )

		const { getByTestId } = render( <DesignLibraryList /> )

		await wait()

		// Data has loaded, remove spinner.
		expect( getByTestId( 'nothing-found-note' ) ).toBeTruthy()
	} )

	it( 'no search field by default', async () => {
		const { queryByPlaceholderText } = render(
			<DesignLibraryList searchPlaceholder="Search" />
		)
		expect( queryByPlaceholderText( 'Search' ) ).toBeNull()
		await wait()
	} )

	it( 'shows search field', async () => {
		const { getByPlaceholderText, getByDisplayValue } = render(
			<DesignLibraryList
				hasSearch={ true }
				searchPlaceholder="Search"
				search="Search term" />
		)
		expect( getByPlaceholderText( 'Search' ) ).toBeTruthy()
		expect( getByDisplayValue( 'Search term' ) ).toBeTruthy()
		await wait()
	} )

	it( 'triggers onSelect', async () => {
		getDesigns.mockReturnValue( Promise.resolve( [ {
			image: 'https://test.com/img.jpg',
			label: 'My Design',
		}, {
			image: 'https://test.com/img2.jpg',
			label: 'My Other Design',
		} ] ) )

		getDesign.mockReturnValueOnce( Promise.resolve( 'design-1' ) )
		getDesign.mockReturnValueOnce( Promise.resolve( 'design-2' ) )

		const onSelect = jest.fn()
		const {
			getAllByRole,
		} = render( <DesignLibraryList onSelect={ onSelect } /> )

		await wait()

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
