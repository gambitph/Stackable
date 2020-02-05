import DesignLibraryListItem from '../design-library-list-item'
import {
	render, fireEvent, wait,
} from '@testing-library/react'
import { getDesign } from '~stackable/design-library'

jest.mock( '~stackable/design-library' )

describe( 'DesignLibraryListItem', () => {
	it( 'renders', () => {
		const {
			getByText, getByRole,
		} = render( <DesignLibraryListItem
			image="http://test.com/img.jpg"
			label="My Design"
		/> )
		expect( getByRole( 'img' ) ).toBeTruthy()
		expect( getByRole( 'img' ).getAttribute( 'src' ) ).toEqual( 'http://test.com/img.jpg' )
		expect( getByText( 'My Design' ) ).toBeTruthy()
	} )

	it( 'shows premium tag if design is premium', () => {
		const { getByText } = render( <DesignLibraryListItem
			image="http://test.com/img.jpg"
			label="My Design"
			plan="premium"
			isPro={ false }
		/> )
		expect( getByText( 'premium' ) ).toBeTruthy()
	} )

	it( 'does not show premium tag if design is free', () => {
		const { queryByTestId } = render( <DesignLibraryListItem
			image="http://test.com/img.jpg"
			label="My Design"
			plan="free"
		/> )
		expect( queryByTestId( 'premium-tag' ) ).toBeNull()
	} )

	it( 'if premium, do not show premium tag if design is premium', () => {
		const { queryByText } = render( <DesignLibraryListItem
			image="http://test.com/img.jpg"
			label="My Design"
			plan="premium"
			isPro={ true }
		/> )
		expect( queryByText( 'premium' ) ).toBeNull()
	} )

	it( 'shows premium link instead of design name on hover if design is premium', () => {
		const {
			getByText, queryByText, getByRole,
		} = render( <DesignLibraryListItem
			image="http://test.com/img.jpg"
			label="My Design"
			plan="premium"
			premiumLabel="Upgrade"
			isPro={ false }
		/> )
		expect( getByText( 'My Design' ) ).toBeTruthy()
		expect( queryByText( 'Upgrade' ) ).toBeNull()
		fireEvent.mouseEnter( getByRole( 'img' ) )
		expect( queryByText( 'My Design' ) ).toBeNull()
		expect( getByText( 'Upgrade' ) ).toBeTruthy()
		fireEvent.mouseLeave( getByRole( 'img' ) )
		expect( getByText( 'My Design' ) ).toBeTruthy()
		expect( queryByText( 'Upgrade' ) ).toBeNull()
	} )

	it( 'if premium, do not show premium link instead of design name on hover if design is premium', () => {
		const {
			getByText, queryByText, getByRole,
		} = render( <DesignLibraryListItem
			image="http://test.com/img.jpg"
			label="My Design"
			plan="premium"
			premiumLabel="Upgrade"
			isPro={ true }
		/> )
		expect( getByText( 'My Design' ) ).toBeTruthy()
		expect( queryByText( 'Upgrade' ) ).toBeNull()
		fireEvent.mouseEnter( getByRole( 'img' ) )
		expect( getByText( 'My Design' ) ).toBeTruthy()
		expect( queryByText( 'Upgrade' ) ).toBeNull()
	} )

	it( 'triggers onClick', async () => {
		getDesign.mockReturnValue( Promise.resolve( true ) )

		const onClick = jest.fn()
		const {
			getByRole,
		} = render( <DesignLibraryListItem
			image="http://test.com/img.jpg"
			label="My Design"
			plan="free"
			onClick={ onClick }
		/> )

		expect( onClick ).toHaveBeenCalledTimes( 0 )

		fireEvent.click( getByRole( 'button' ) )
		await wait()

		expect( onClick ).toHaveBeenCalledTimes( 1 )
	} )

	it( 'trigger onClick should not fire on premium designs', async () => {
		getDesign.mockReturnValue( Promise.resolve( true ) )

		const onClick = jest.fn()
		const {
			getByRole,
		} = render( <DesignLibraryListItem
			image="http://test.com/img.jpg"
			label="My Design"
			plan="premium"
			onClick={ onClick }
		/> )

		expect( onClick ).toHaveBeenCalledTimes( 0 )

		fireEvent.click( getByRole( 'button' ) )
		await wait()

		expect( onClick ).toHaveBeenCalledTimes( 0 )
	} )

	it( 'if premium, trigger onClick on premium designs', async () => {
		getDesign.mockReturnValue( Promise.resolve( true ) )

		const onClick = jest.fn()
		const {
			getByRole,
		} = render( <DesignLibraryListItem
			image="http://test.com/img.jpg"
			label="My Design"
			plan="premium"
			onClick={ onClick }
			isPro={ true }
		/> )

		expect( onClick ).toHaveBeenCalledTimes( 0 )

		fireEvent.click( getByRole( 'button' ) )
		await wait()

		expect( onClick ).toHaveBeenCalledTimes( 1 )
	} )

	it( 'should show spinner when busy', async () => {
		getDesign.mockReturnValue( Promise.resolve( true ) )

		const onClick = jest.fn()
		const {
			getByRole,
			queryByTestId,
			getByTestId,
		} = render( <DesignLibraryListItem
			image="http://test.com/img.jpg"
			label="My Design"
			plan="free"
			onClick={ onClick }
		/> )

		expect( queryByTestId( 'spinner' ) ).toBeNull()

		fireEvent.click( getByRole( 'button' ) )
		expect( getByTestId( 'spinner' ) ).toBeTruthy()
		await wait()

		expect( queryByTestId( 'spinner' ) ).toBeNull()
	} )
} )
