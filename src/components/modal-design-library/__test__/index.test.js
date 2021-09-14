import ModalDesignLibrary from '..'
import {
	render, wait,
} from '@testing-library/react'
import { getAllBlocks, getDesigns } from '~stackable/design-library'
import * as data from '@wordpress/data'

jest.mock( '~stackable/design-library' )
jest.spyOn( data, 'select' )

describe( 'ModalDesignLibrary', () => {
	beforeAll( () => {
		data.select.mockImplementation( () => {
			return {
				getBlockType: name => {
					return {
						title: `My ${ name } Design`,
					}
				},
				getPreference: () => {
					return []
				},
			}
		} )
		getAllBlocks.mockReturnValue( Promise.resolve( [ 'ugb/header', 'ugb/feature' ] ) )
		getDesigns.mockReturnValue( Promise.resolve( [ {
			block: 'ugb/header',
			type: 'block',
			plan: 'free',
			label: 'Header Design 1',
			categories: [],
		}, {
			block: 'ugb/feature',
			type: 'block',
			plan: 'free',
			label: 'Feature Design 1',
			categories: [],
		}, {
			block: 'ugb/feature',
			type: 'block',
			plan: 'premium',
			label: 'Feature Design 2',
			categories: [],
		} ] ) )
	} )

	it( 'should render', async () => {
		const {
			getByTestId, getByText, rerender,
		} = render( <ModalDesignLibrary selectedBlock="ugb/feature" /> )

		await wait()

		expect( getByText( 'Stackable Design Library' ) ).toBeTruthy()
		expect( getByTestId( 'input-search' ) ).toBeTruthy()
		expect( getByText( 'UI Kits' ) ).toBeTruthy()
		expect( getByText( 'Block Designs' ) ).toBeTruthy()
		expect( getByText( 'Feature Design 1' ) ).toBeTruthy()
		expect( getByText( 'Feature Design 2' ) ).toBeTruthy()

		rerender( <ModalDesignLibrary selectedBlock="ugb/header" /> )
		expect( getByText( 'Header Design 1' ) ).toBeTruthy()
	} )
} )
