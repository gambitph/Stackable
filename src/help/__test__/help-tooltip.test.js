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
import { shallow } from 'enzyme'

jest.useFakeTimers()

// Testing <video muted> throws an error.
// @see https://github.com/testing-library/react-testing-library/issues/470#issuecomment-528308230
const renderIgnoringUnstableFlushDiscreteUpdates = component => {
	/* eslint-disable no-console */
	const originalError = console.error
	const error = jest.fn()
	console.error = error
	const result = render( component )
	expect( error ).toHaveBeenCalledTimes( 1 )
	expect( error ).toHaveBeenCalledWith( 'Warning: unstable_flushDiscreteUpdates: Cannot flush updates when React is already rendering.%s', expect.any( String ) )
	console.error = originalError
	/* eslint-enable no-console */
	return result
}

describe( '<HelpToolTip/>', () => {
	it( 'basic rendering', () => {
		act( () => {
			const tooltip = render( <HelpTooltip /> )
			expect( tooltip ).not.toBeNull()
		} )
	} )

	it( 'pass getAnchorRect if provided', async () => {
		act( () => {
			const rectFunc = jest.fn( () => {} )
			const wrapper = shallow( <HelpTooltip getAnchorRect={ rectFunc } /> )
			expect( wrapper.find( 'Popover' ).prop( 'getAnchorRect' ) ).toBe( rectFunc )
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
		act( () => {
			const tooltip = renderIgnoringUnstableFlushDiscreteUpdates( <HelpTooltip videoUrl="https://test.com/video.mp4" /> )
			jest.advanceTimersByTime( 1 )
			expect( tooltip.queryByRole( 'img' ) ).toBeTruthy()
		} )
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
