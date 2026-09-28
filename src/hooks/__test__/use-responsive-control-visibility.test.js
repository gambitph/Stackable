import useResponsiveControlVisibility, {
	isResponsiveControlVisible,
	normalizeResponsiveScreens,
	ResponsiveControlFilterProvider,
} from '../use-responsive-control-visibility'
import useCoreResponsiveEditing from '../use-core-responsive-editing'
import { useDeviceType } from '../use-device-type'
import { render } from '@testing-library/react'

jest.mock( '../use-core-responsive-editing' )
jest.mock( '../use-device-type' )

const Visibility = ( { responsive } ) => {
	return useResponsiveControlVisibility( responsive ) ? 'visible' : 'hidden'
}

describe( 'responsive control visibility', () => {
	it( 'shows every control when responsive editing is disabled', () => {
		expect( isResponsiveControlVisible( {
			deviceType: 'Mobile',
			isResponsiveEditing: false,
			responsive: false,
		} ) ).toBe( true )
	} )

	it( 'shows every control on desktop', () => {
		expect( isResponsiveControlVisible( {
			deviceType: 'Desktop',
			isResponsiveEditing: true,
			responsive: false,
		} ) ).toBe( true )
	} )

	it.each( [
		[ 'Tablet', 'all', true ],
		[ 'Tablet', [ 'desktop', 'tablet' ], true ],
		[ 'Tablet', [ 'desktop', 'mobile' ], false ],
		[ 'Tablet', false, false ],
		[ 'Mobile', 'all', true ],
		[ 'Mobile', [ 'desktop', 'mobile' ], true ],
		[ 'Mobile', [ 'desktop', 'tablet' ], false ],
		[ 'Mobile', false, false ],
	] )( 'filters %s controls using %p capability', ( deviceType, responsive, expected ) => {
		expect( isResponsiveControlVisible( {
			deviceType,
			isResponsiveEditing: true,
			responsive,
		} ) ).toBe( expected )
	} )

	it( 'shows controls when the editor does not expose a device type', () => {
		expect( isResponsiveControlVisible( {
			deviceType: undefined,
			isResponsiveEditing: true,
			responsive: false,
		} ) ).toBe( true )
	} )

	it( 'normalizes the all shortcut and rejects unsupported capability values', () => {
		expect( normalizeResponsiveScreens( 'all' ) ).toEqual( [ 'desktop', 'tablet', 'mobile' ] )
		expect( normalizeResponsiveScreens( [ 'tablet' ] ) ).toEqual( [ 'tablet' ] )
		expect( normalizeResponsiveScreens( false ) ).toEqual( [] )
	} )

	it( 'limits filtering to controls inside a responsive filter provider', () => {
		useCoreResponsiveEditing.mockReturnValue( true )
		useDeviceType.mockReturnValue( 'Tablet' )

		const { getByTestId } = render(
			<>
				<div data-testid="outside">
					<Visibility responsive={ false } />
				</div>
				<ResponsiveControlFilterProvider>
					<div data-testid="inside">
						<Visibility responsive={ false } />
					</div>
				</ResponsiveControlFilterProvider>
			</>
		)

		expect( getByTestId( 'outside' ).textContent ).toBe( 'visible' )
		expect( getByTestId( 'inside' ).textContent ).toBe( 'hidden' )
	} )
} )
