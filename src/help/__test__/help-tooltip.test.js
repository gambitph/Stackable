/**
 * Internal dependencies
 */
import HelpTooltip from '../help-tooltip'

/**
 * External dependencies
 */
import {
	render, fireEvent, act,
} from '@testing-library/react'

jest.useFakeTimers()

describe( '<HelpToolTip/>', () => {
	it( 'basic rendering', () => {
		act( () => {
			const tooltip = render( <HelpTooltip /> )
			expect( tooltip ).not.toBeNull()
		} )
	} )

	it( 'renders props', () => {
		act( () => {
			const tooltip = render( <HelpTooltip title="My Title" description="My Description" /> )
			jest.advanceTimersByTime( 1 )
			expect( tooltip.getByText( 'My Title' ) ).toBeTruthy()
			expect( tooltip.getByText( 'My Description' ) ).toBeTruthy()
			expect( tooltip.queryByRole( 'link' ) ).toBeFalsy()
			expect( tooltip.queryByRole( 'img' ) ).toBeFalsy()
		} )
	} )

	it( 'renders read more link', () => {
		act( () => {
			const tooltip = render( <HelpTooltip learnMoreUrl="https://test.com" learnMore="More" /> )
			jest.advanceTimersByTime( 1 )
			expect( tooltip.queryByRole( 'link' ) ).toBeTruthy()
			expect( tooltip.getByText( 'More' ) ).toBeTruthy()
		} )
	} )

	it( 'renders video', () => {
		// Prevent video tag errors, they don't mean anything
		console.error = jest.fn() // eslint-disable-line no-console
		const tooltip = render( <HelpTooltip videoUrl="https://test.com/video.mp4" /> )
		expect( tooltip.queryByRole( 'img' ) ).toBeTruthy()
	} )

	it( 'on click close is called', () => {
		act( () => {
			const func = jest.fn( () => {} )
			const tooltip = render( <HelpTooltip onClickClose={ func } /> )
			expect( func ).not.toHaveBeenCalled()
			fireEvent.click( tooltip.getByRole( 'button' ) )
			jest.advanceTimersByTime( 1 )
			expect( func ).toHaveBeenCalled()
		} )
	} )
} )
