import {
	render, fireEvent, wait,
} from '@testing-library/react'
import { getAllBlocks, getDesigns } from '~stackable/design-library'
import BlockList from '../block-list'
import { select } from '@wordpress/data'

jest.mock( '~stackable/design-library' )
jest.mock( '@wordpress/data' )

describe( 'BlockList', () => {
	beforeEach( () => {
		select.mockImplementation( () => {
			return {
				getBlockType: name => {
					return {
						title: `My ${ name } Design`,
					}
				},
			}
		} )
	} )

	it( 'renders block list', async () => {
		getAllBlocks.mockReturnValue( Promise.resolve( [ 'ugb/header', 'ugb/feature' ] ) )
		getDesigns.mockReturnValue( Promise.resolve( [ {
			block: 'ugb/header',
			type: 'block',
			plan: 'free',
		}, {
			block: 'ugb/feature',
			type: 'block',
			plan: 'free',
		} ] ) )

		const { getByText } = render( <BlockList /> )
		await wait()

		expect( getByText( 'My ugb/header Design' ) ).toBeTruthy()
		expect( getByText( 'My ugb/feature Design' ) ).toBeTruthy()
	} )

	it( 'should show correct design counts', async () => {
		getAllBlocks.mockReturnValue( Promise.resolve( [ 'ugb/header', 'ugb/feature' ] ) )
		getDesigns.mockReturnValue( Promise.resolve( [ {
			block: 'ugb/header',
			type: 'block',
			plan: 'free',
		}, {
			block: 'ugb/feature',
			type: 'block',
			plan: 'free',
		}, {
			block: 'ugb/feature',
			type: 'block',
			plan: 'free',
		} ] ) )

		const { getByTestId, queryByText } = render( <BlockList /> )
		await wait()

		expect( getByTestId( 'all-count' ).textContent ).toEqual( '3' )
		expect( getByTestId( 'ugb/header-count' ).textContent ).toEqual( '1' )
		expect( getByTestId( 'ugb/feature-count' ).textContent ).toEqual( '2' )

		// Free should not show up since all our designs are free.
		expect( queryByText( 'Free Designs' ) ).toBeNull()
	} )

	it( 'should show "free" if we have premium designs', async () => {
		getAllBlocks.mockReturnValue( Promise.resolve( [ 'ugb/header', 'ugb/feature' ] ) )
		getDesigns.mockReturnValue( Promise.resolve( [ {
			block: 'ugb/header',
			type: 'block',
			plan: 'free',
		}, {
			block: 'ugb/feature',
			type: 'block',
			plan: 'free',
		}, {
			block: 'ugb/feature',
			type: 'block',
			plan: 'premium',
		} ] ) )

		const { getByTestId, getByText } = render( <BlockList /> )
		await wait()

		expect( getByText( 'Free Designs' ) ).toBeTruthy()
		expect( getByTestId( 'free-count' ).textContent ).toEqual( '2' )
	} )

	it( 'should call getDesigns with correct params', async () => {
		getDesigns.mockReturnValue( Promise.resolve( [] ) )

		render( <BlockList search="s" mood="light" colors={ [ 'blue' ] } /> )
		await wait()

		expect( getDesigns ).toHaveBeenCalledWith( {
			colors: [ 'blue' ], mood: 'light', search: 's', type: 'block',
		} )
	} )

	it( 'should be selectable', async () => {
		getDesigns.mockReturnValue( Promise.resolve( [ {
			block: 'ugb/header',
			type: 'block',
			plan: 'free',
		}, {
			block: 'ugb/feature',
			type: 'block',
			plan: 'free',
		}, {
			block: 'ugb/feature',
			type: 'block',
			plan: 'premium',
		} ] ) )

		const { getByText } = render( <BlockList /> )
		await wait()

		expect( getByText( 'All Block Designs' ) ).toHaveClass( 'is-active' )
		expect( getByText( 'Free Designs' ) ).not.toHaveClass( 'is-active' )
		expect( getByText( 'My ugb/header Design' ) ).not.toHaveClass( 'is-active' )
		expect( getByText( 'My ugb/feature Design' ) ).not.toHaveClass( 'is-active' )

		fireEvent.click( getByText( 'Free Designs' ) )

		expect( getByText( 'All Block Designs' ) ).not.toHaveClass( 'is-active' )
		expect( getByText( 'Free Designs' ) ).toHaveClass( 'is-active' )
		expect( getByText( 'My ugb/header Design' ) ).not.toHaveClass( 'is-active' )
		expect( getByText( 'My ugb/feature Design' ) ).not.toHaveClass( 'is-active' )

		fireEvent.click( getByText( 'My ugb/header Design' ) )

		expect( getByText( 'All Block Designs' ) ).not.toHaveClass( 'is-active' )
		expect( getByText( 'Free Designs' ) ).not.toHaveClass( 'is-active' )
		expect( getByText( 'My ugb/header Design' ) ).toHaveClass( 'is-active' )
		expect( getByText( 'My ugb/feature Design' ) ).not.toHaveClass( 'is-active' )

		fireEvent.click( getByText( 'All Block Designs' ) )

		expect( getByText( 'All Block Designs' ) ).toHaveClass( 'is-active' )
		expect( getByText( 'Free Designs' ) ).not.toHaveClass( 'is-active' )
		expect( getByText( 'My ugb/header Design' ) ).not.toHaveClass( 'is-active' )
		expect( getByText( 'My ugb/feature Design' ) ).not.toHaveClass( 'is-active' )
	} )

	it( 'should trigger onSelect', async () => {
		getDesigns.mockReturnValue( Promise.resolve( [ {
			block: 'ugb/header',
			type: 'block',
			plan: 'free',
		} ] ) )

		const onSelect = jest.fn()
		const { getByText } = render( <BlockList onSelect={ onSelect } /> )
		await wait()

		expect( onSelect ).toHaveBeenCalledTimes( 0 )
		fireEvent.click( getByText( 'My ugb/header Design' ) )
		expect( onSelect ).toHaveBeenCalledTimes( 1 )
	} )

	it( 'should disable others when forceBlock', async () => {
		getDesigns.mockReturnValue( Promise.resolve( [ {
			block: 'ugb/header',
			type: 'block',
			plan: 'free',
		},
		{
			block: 'ugb/feature',
			type: 'block',
			plan: 'premium',
		} ] ) )

		const onSelect = jest.fn()
		const { getByText, queryByText } = render( <BlockList onSelect={ onSelect } forceBlock={ 'ugb/header' } /> )
		await wait()

		expect( queryByText( 'All Block Designs' ) ).toBeNull()
		expect( queryByText( 'Free Designs' ) ).toBeNull()

		expect( getByText( 'My ugb/header Design' ) ).toHaveClass( 'is-active' )
		expect( getByText( 'My ugb/feature Design' ) ).not.toHaveClass( 'is-active' )

		expect( onSelect ).toHaveBeenCalledTimes( 0 )

		fireEvent.click( getByText( 'My ugb/header Design' ) )
		fireEvent.click( getByText( 'My ugb/feature Design' ) )

		expect( onSelect ).toHaveBeenCalledTimes( 0 )

		expect( getByText( 'My ugb/header Design' ) ).toHaveClass( 'is-active' )
		expect( getByText( 'My ugb/feature Design' ) ).not.toHaveClass( 'is-active' )
	} )
} )
