import ResponsiveControlVisibility, {
	ResponsivePanelControlProvider,
	useResponsivePanelControls,
} from '../'
import useResponsiveControlVisibility from '~stackable/hooks/use-responsive-control-visibility'
import { render } from '@testing-library/react'

jest.mock( '~stackable/hooks/use-responsive-control-visibility' )

const Panel = ( { children } ) => {
	const { registerControl, shouldHide } = useResponsivePanelControls()

	return (
		<ResponsivePanelControlProvider value={ registerControl }>
			<div data-testid="panel" hidden={ shouldHide }>
				{ children }
			</div>
		</ResponsivePanelControlProvider>
	)
}

describe( 'ResponsiveControlVisibility', () => {
	it( 'renders supported controls and keeps their panel visible', () => {
		useResponsiveControlVisibility.mockReturnValue( true )
		const { getByTestId, getByText } = render(
			<Panel>
				<ResponsiveControlVisibility responsive="all">
					<span>Responsive control</span>
				</ResponsiveControlVisibility>
			</Panel>
		)

		expect( getByText( 'Responsive control' ) ).toBeTruthy()
		expect( getByTestId( 'panel' ).hidden ).toBe( false )
	} )

	it( 'filters unsupported controls and hides an empty panel', () => {
		useResponsiveControlVisibility.mockReturnValue( false )
		const { getByTestId, queryByText } = render(
			<Panel>
				<ResponsiveControlVisibility responsive={ false }>
					<span>Desktop control</span>
				</ResponsiveControlVisibility>
			</Panel>
		)

		expect( queryByText( 'Desktop control' ) ).toBeNull()
		expect( getByTestId( 'panel' ).hidden ).toBe( true )
	} )
} )
