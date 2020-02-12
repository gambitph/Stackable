import ModalDesignLibrary from '..'
import { render, wait } from '@testing-library/react'
import { getAllBlocks, getDesigns } from '~stackable/design-library'
import { select } from '@wordpress/data'

jest.mock( '~stackable/design-library' )
jest.mock( '@wordpress/data' )

describe( 'ModalDesignLibrary', () => {
	beforeAll( () => {
		select.mockImplementation( () => {
			return {
				getBlockType: name => {
					return {
						title: `My ${ name } Design`,
					}
				},
			}
		} )
		getAllBlocks.mockReturnValue( Promise.resolve( [ 'ugb/header', 'ugb/feature' ] ) )
		getDesigns.mockReturnValue( Promise.resolve( [ {
			block: 'ugb/header',
			type: 'block',
			plan: 'free',
			label: 'Header Design 1',
		}, {
			block: 'ugb/feature',
			type: 'block',
			plan: 'free',
			label: 'Feature Design 1',
		}, {
			block: 'ugb/feature',
			type: 'block',
			plan: 'premium',
			label: 'Feature Design 2',
		} ] ) )
	} )

	it( 'should render', async () => {
		const {
			getByTestId, getByText, getByLabelText,
		} = render( <ModalDesignLibrary /> )

		await wait()

		expect( getByTestId( 'input-search' ) ).toBeTruthy()
		expect( getByLabelText( /red/ ) ).toBeTruthy()
		expect( getByText( 'Light' ) ).toBeTruthy()
		expect( getByText( 'My ugb/header Design' ) ).toBeTruthy()
		expect( getByText( 'Header Design 1' ) ).toBeTruthy()
	} )
} )
