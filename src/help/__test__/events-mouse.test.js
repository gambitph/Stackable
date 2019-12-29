import {
	getByText,
	fireEvent,
} from '@testing-library/dom'
import { addAction, removeAction } from '@wordpress/hooks'

import {
	startListening, stopListening, getParentControl,
} from '../events-mouse'

describe( 'getParentControl', () => {
	it( 'should return the parent element with the tip class', () => {
		const panel = document.createElement( 'div' )
		panel.innerHTML = `
		<div class="components-panel__body ugb--help-tip-column ugb-toggle-panel-body">
			<h2 class="components-panel__body-title">
				<button type="button" aria-expanded="false" class="components-button components-panel__body-toggle">
					<span aria-hidden="true"><svg></svg></span>
					Panel title
				</button>
			</h2>
		</div>`

		const title = getByText( panel, 'Panel title' )
		const parent = getParentControl( title )
		expect( parent ).toEqual( panel.querySelector( '.ugb--help-tip-column' ) )
	} )
} )

describe( 'Help Video Snippets', () => {
	let panel

	beforeAll( () => {
		panel = document.createElement( 'div' )
		panel.innerHTML = `
		<div class="components-panel__body ugb--help-tip-column ugb-toggle-panel-body">
			<h2 class="components-panel__body-title">
				<button type="button" aria-expanded="false" class="components-button components-panel__body-toggle">
					<span aria-hidden="true"><svg></svg></span>
					Panel with tip no content
				</button>
			</h2>
		</div>

		<div class="components-panel__body ugb-toggle-panel-body">
			<h2 class="components-panel__body-title">
				<button type="button" aria-expanded="false" class="components-button components-panel__body-toggle">
					<span aria-hidden="true"><svg></svg></span>
					Panel no tip no content
				</button>
			</h2>
		</div>

		<div class="components-panel__body ugb--help-tip-column ugb-toggle-panel-body">
			<h2 class="components-panel__body-title">
				<button type="button" aria-expanded="true" class="components-button components-panel__body-toggle">
					<span aria-hidden="true"><svg></svg></span>
					Panel with tip with content no tip
				</button>
			</h2>
			<div class="components-base-control ugb-advanced-range-control">
				<div class="components-base-control__field">
					<div class="ugb-base-control-multi-label">
						<div class="ugb-base-control-multi-label__label components-base-control__label">Control no tip in panel with tip</div>
						<div class="ugb-base-control-multi-label__responsive"></div>
						<div class="ugb-base-control-multi-label__units"></div>
					</div>
					<div class="components-base-control components-range-control">
						<div class="components-base-control__field">
							<input class="components-range-control__slider" id="inspector-range-control-4" type="range" min="1" max="3" placeholder="" value="2">
							<input class="components-range-control__number" type="number" min="1" max="3" placeholder="" value="2">
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="components-panel__body ugb--help-tip-column ugb-toggle-panel-body">
			<h2 class="components-panel__body-title">
				<button type="button" aria-expanded="true" class="components-button components-panel__body-toggle">
					<span aria-hidden="true"><svg></svg></span>
					Panel with tip with content with tip
				</button>
			</h2>
			<div class="components-base-control ugb-advanced-range-control ugb--help-tip-column">
				<div class="components-base-control__field">
					<div class="ugb-base-control-multi-label">
						<div class="ugb-base-control-multi-label__label components-base-control__label">Control with tip in panel with tip</div>
						<div class="ugb-base-control-multi-label__responsive"></div>
						<div class="ugb-base-control-multi-label__units"></div>
					</div>
					<div class="components-base-control components-range-control">
						<div class="components-base-control__field">
							<input class="components-range-control__slider" id="inspector-range-control-4" type="range" min="1" max="3" placeholder="" value="2">
							<input class="components-range-control__number" type="number" min="1" max="3" placeholder="" value="2">
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="components-panel__body ugb-toggle-panel-body">
			<h2 class="components-panel__body-title">
				<button type="button" aria-expanded="true" class="components-button components-panel__body-toggle">
					<span aria-hidden="true"><svg></svg></span>
					Panel no tip with content no tip
				</button>
			</h2>
			<div class="components-base-control ugb-advanced-range-control">
				<div class="components-base-control__field">
					<div class="ugb-base-control-multi-label">
						<div class="ugb-base-control-multi-label__label components-base-control__label">Control no tip in panel no tip</div>
						<div class="ugb-base-control-multi-label__responsive"></div>
						<div class="ugb-base-control-multi-label__units"></div>
					</div>
					<div class="components-base-control components-range-control">
						<div class="components-base-control__field">
							<input class="components-range-control__slider" id="inspector-range-control-4" type="range" min="1" max="3" placeholder="" value="2">
							<input class="components-range-control__number" type="number" min="1" max="3" placeholder="" value="2">
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="components-panel__body ugb-toggle-panel-body">
			<h2 class="components-panel__body-title">
				<button type="button" aria-expanded="true" class="components-button components-panel__body-toggle">
					<span aria-hidden="true"><svg></svg></span>
					Panel no tip with content with tip
				</button>
			</h2>
			<div class="components-base-control ugb-advanced-range-control ugb--help-tip-column">
				<div class="components-base-control__field">
					<div class="ugb-base-control-multi-label">
						<div class="ugb-base-control-multi-label__label components-base-control__label">Control with tip in panel no tip</div>
						<div class="ugb-base-control-multi-label__responsive"></div>
						<div class="ugb-base-control-multi-label__units"></div>
					</div>
					<div class="components-base-control components-range-control">
						<div class="components-base-control__field">
							<input class="components-range-control__slider" id="inspector-range-control-4" type="range" min="1" max="3" placeholder="" value="2">
							<input class="components-range-control__number" type="number" min="1" max="3" placeholder="" value="2">
						</div>
					</div>
				</div>
			</div>
		</div>`

		document.body.appendChild( panel )
	} )

	afterAll( () => {
		document.body.removeChild( panel )
	} )

	let onClick, onHoverIn, onHoverOut
	beforeEach( () => {
		startListening()
		onClick = jest.fn()
		onHoverIn = jest.fn()
		onHoverOut = jest.fn()

		addAction( 'stackable.help-video.control.click', 'stackable/test', onClick )
		addAction( 'stackable.help-video.control.hover.in', 'stackable/test', onHoverIn )
		addAction( 'stackable.help-video.control.hover.out', 'stackable/test', onHoverOut )
	} )

	afterEach( () => {
		removeAction( 'stackable.help-video.control.click', 'stackable/test' )
		removeAction( 'stackable.help-video.control.hover.in', 'stackable/test' )
		removeAction( 'stackable.help-video.control.hover.out', 'stackable/test' )
		stopListening()
	} )

	it( 'clicking a panel should not trigger anything', () => {
		expect( onClick ).toHaveBeenCalledTimes( 0 )
		getByText( document.body, 'Panel no tip no content' ).click()
		expect( onClick ).toHaveBeenCalledTimes( 0 )
		getByText( document.body, 'Panel with tip no content' ).click()
		expect( onClick ).toHaveBeenCalledTimes( 0 )
		getByText( document.body, 'Panel with tip with content no tip' ).click()
		expect( onClick ).toHaveBeenCalledTimes( 0 )
		getByText( document.body, 'Panel with tip with content with tip' ).click()
		expect( onClick ).toHaveBeenCalledTimes( 0 )
		getByText( document.body, 'Panel no tip with content no tip' ).click()
		expect( onClick ).toHaveBeenCalledTimes( 0 )
		getByText( document.body, 'Panel no tip with content with tip' ).click()
		expect( onClick ).toHaveBeenCalledTimes( 0 )
	} )

	it( 'hovering a panel without a help tip should not trigger', () => {
		expect( onHoverIn ).toHaveBeenCalledTimes( 0 )
		fireEvent.mouseOver( getByText( document.body, 'Panel no tip no content' ) )
		expect( onHoverIn ).toHaveBeenCalledTimes( 0 )
		fireEvent.mouseOver( getByText( document.body, 'Panel no tip with content no tip' ) )
		expect( onHoverIn ).toHaveBeenCalledTimes( 0 )
		fireEvent.mouseOver( getByText( document.body, 'Panel no tip with content with tip' ) )
		expect( onHoverIn ).toHaveBeenCalledTimes( 0 )

		expect( onHoverOut ).toHaveBeenCalledTimes( 0 )
		fireEvent.mouseOut( getByText( document.body, 'Panel no tip no content' ) )
		expect( onHoverOut ).toHaveBeenCalledTimes( 0 )
		fireEvent.mouseOut( getByText( document.body, 'Panel no tip with content no tip' ) )
		expect( onHoverOut ).toHaveBeenCalledTimes( 0 )
		fireEvent.mouseOut( getByText( document.body, 'Panel no tip with content with tip' ) )
		expect( onHoverOut ).toHaveBeenCalledTimes( 0 )
	} )

	it( 'hovering a panel with a help tip should trigger', () => {
		const panel = getByText( document.body, 'Panel with tip no content' )
		const panelParent = getParentControl( panel )

		expect( onHoverIn ).toHaveBeenCalledTimes( 0 )
		fireEvent.mouseOver( panel )
		expect( onHoverIn ).toHaveBeenCalledTimes( 1 )
		expect( onHoverIn ).toHaveBeenLastCalledWith( panel, panelParent )

		expect( onHoverOut ).toHaveBeenCalledTimes( 0 )
		fireEvent.mouseOut( panel )
		expect( onHoverOut ).toHaveBeenCalledTimes( 1 )
	} )

	it( 'clicking a control without a help tip should not trigger', () => {
		expect( onClick ).toHaveBeenCalledTimes( 0 )
		getByText( document.body, 'Control no tip in panel with tip' ).click()
		expect( onClick ).toHaveBeenCalledTimes( 0 )
		getByText( document.body, 'Control no tip in panel no tip' ).click()
		expect( onClick ).toHaveBeenCalledTimes( 0 )
	} )

	it( 'clicking a control with a tip should trigger', () => {
		let control = getByText( document.body, 'Control with tip in panel with tip' )
		let controlParent = getParentControl( control )

		expect( onClick ).toHaveBeenCalledTimes( 0 )
		control.click()
		expect( onClick ).toHaveBeenCalledTimes( 1 )
		expect( onClick ).toHaveBeenLastCalledWith( control, controlParent )

		control = getByText( document.body, 'Control with tip in panel no tip' )
		controlParent = getParentControl( control )

		expect( onClick ).toHaveBeenCalledTimes( 1 )
		control.click()
		expect( onClick ).toHaveBeenCalledTimes( 2 )
		expect( onClick ).toHaveBeenLastCalledWith( control, controlParent )
	} )

	it( 'hovering a control without a help tip should not trigger', () => {
		expect( onHoverIn ).toHaveBeenCalledTimes( 0 )
		fireEvent.mouseOver( getByText( document.body, 'Control no tip in panel with tip' ) )
		expect( onHoverIn ).toHaveBeenCalledTimes( 0 )
		fireEvent.mouseOver( getByText( document.body, 'Control no tip in panel no tip' ) )
		expect( onHoverIn ).toHaveBeenCalledTimes( 0 )

		expect( onHoverOut ).toHaveBeenCalledTimes( 0 )
		fireEvent.mouseOut( getByText( document.body, 'Control no tip in panel with tip' ) )
		expect( onHoverOut ).toHaveBeenCalledTimes( 0 )
		fireEvent.mouseOut( getByText( document.body, 'Control no tip in panel no tip' ) )
		expect( onHoverOut ).toHaveBeenCalledTimes( 0 )
	} )

	it( 'hovering a control with a help tip should trigger', () => {
		let control = getByText( document.body, 'Control with tip in panel with tip' )
		let controlParent = getParentControl( control )

		expect( onHoverIn ).toHaveBeenCalledTimes( 0 )
		fireEvent.mouseOver( control )
		expect( onHoverIn ).toHaveBeenCalledTimes( 1 )
		expect( onHoverIn ).toHaveBeenLastCalledWith( control, controlParent )

		expect( onHoverOut ).toHaveBeenCalledTimes( 0 )
		fireEvent.mouseOut( control )
		expect( onHoverOut ).toHaveBeenCalledTimes( 1 )

		control = getByText( document.body, 'Control with tip in panel no tip' )
		controlParent = getParentControl( control )

		expect( onHoverIn ).toHaveBeenCalledTimes( 1 )
		fireEvent.mouseOver( control )
		expect( onHoverIn ).toHaveBeenCalledTimes( 2 )
		expect( onHoverIn ).toHaveBeenLastCalledWith( control, controlParent )

		expect( onHoverOut ).toHaveBeenCalledTimes( 1 )
		fireEvent.mouseOut( control )
		expect( onHoverOut ).toHaveBeenCalledTimes( 2 )
	} )
} )
