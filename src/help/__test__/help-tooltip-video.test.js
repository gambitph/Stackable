import {
	render, act,
} from '@testing-library/react'
import { getByText } from '@testing-library/dom'
import HelpToolTipVideo, { getHelpId } from '../help-tooltip-video'
import { doAction } from '@wordpress/hooks'

jest.useFakeTimers()

// Turn off domReady.
jest.mock( '@wordpress/dom-ready' )

const SAMPLE_DATA = {
	sampleData: {
		video: 'https://sample.com/video.mp4',
		title: 'Sample Title',
		description: 'Sample description',
	},
	sampleData2: {
		video: 'https://sample.com/video.mp4',
		title: 'Sample Title 2',
		description: 'Sample description',
	},
}

describe( 'Help Video Snippets', () => {
	beforeEach( () => {
		console.warn = jest.fn() // eslint-disable-line no-console
		console.error = jest.fn() // eslint-disable-line no-console
	} )

	it( 'should show on trigger', () => {
		const tooltip = render( <HelpToolTipVideo tooltipData={ SAMPLE_DATA } /> )
		expect( tooltip.queryByText( 'Sample Title' ) ).toBeFalsy()
		doAction( 'stackable.help-video.show', 'sampleData' )
		jest.advanceTimersByTime( 1 )
		expect( tooltip.getByText( 'Sample Title' ) ).toBeTruthy()
	} )

	it( 'should hide on trigger', () => {
		const tooltip = render( <HelpToolTipVideo tooltipData={ SAMPLE_DATA } /> )
		expect( tooltip.queryByText( 'Sample Title' ) ).toBeFalsy()
		doAction( 'stackable.help-video.show', 'sampleData' )
		jest.advanceTimersByTime( 1 )
		doAction( 'stackable.help-video.hide', 'sampleData' )
		jest.advanceTimersByTime( 1 )
		expect( tooltip.queryByText( 'Sample Title' ) ).toBeFalsy()
	} )

	it( 'should show next help data when triggered twice', () => {
		const tooltip = render( <HelpToolTipVideo tooltipData={ SAMPLE_DATA } /> )
		expect( tooltip.queryByText( 'Sample Title' ) ).toBeFalsy()
		doAction( 'stackable.help-video.show', 'sampleData' )
		jest.advanceTimersByTime( 1 )
		expect( tooltip.getByText( 'Sample Title' ) ).toBeTruthy()
		doAction( 'stackable.help-video.show', 'sampleData2' )
		jest.advanceTimersByTime( 1 )
		expect( tooltip.getByText( 'Sample Title 2' ) ).toBeTruthy()
	} )

	it( 'should show tip on element', () => {
		const panel = document.createElement( 'div' )
		panel.innerHTML = `
		<div class="components-panel__body ugb--help-tip-sample-data ugb-toggle-panel-body">
			<h2 class="components-panel__body-title">
				<button type="button" aria-expanded="false" class="components-button components-panel__body-toggle">
					<span aria-hidden="true"><svg></svg></span>
					Panel title
				</button>
			</h2>
		</div>`

		act( () => {
			const title = getByText( panel, 'Panel title' )
			const tooltip = render( <HelpToolTipVideo tooltipData={ SAMPLE_DATA } /> )
			expect( tooltip.queryByText( 'Sample Title' ) ).toBeFalsy()
			doAction( 'stackable.help-video.show', title )
			jest.advanceTimersByTime( 1 )
			expect( tooltip.getByText( 'Sample Title' ) ).toBeTruthy()
		} )
	} )
} )

describe( 'getHelpId', () => {
	it( 'should not error', () => {
		expect( getHelpId() ).toBeFalsy()
	} )

	it( 'should return the element with the tip class', () => {
		const panel = document.createElement( 'div' )
		panel.innerHTML = `
		<div class="components-panel__body ugb--help-tip-test-help-tip ugb-toggle-panel-body">
			<h2 class="components-panel__body-title">
				<button type="button" aria-expanded="false" class="components-button components-panel__body-toggle">
					<span aria-hidden="true"><svg></svg></span>
					Panel title
				</button>
			</h2>
		</div>`

		const title = getByText( panel, 'Panel title' )
		expect( getHelpId( title ) ).toBe( 'testHelpTip' )
	} )
} )
