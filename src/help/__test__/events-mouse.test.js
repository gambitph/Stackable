import { addAction, removeAction } from '@wordpress/hooks'
import {
	startListening, stopListening, getParentControl,
} from '../events-mouse'
import { TextControl, PanelBody } from '@wordpress/components'
import { PanelAdvancedSettings } from '~stackable/components'
import { render, fireEvent } from '@testing-library/react'

describe( 'getParentControl', () => {
	it( 'should return the parent element with the tip class (PanelBody)', () => {
		const { getByText } = render( <PanelBody title="Panel title" className="ugb--help-tip-column" /> )
		const title = getByText( 'Panel title' )
		const parent = getParentControl( title )
		expect( parent.classList.contains( 'ugb--help-tip-column' ) ).toBeTruthy()
	} )

	it( 'should return the parent element with the tip class (PanelAdvancedSettings)', () => {
		const { getByText } = render( <PanelAdvancedSettings title="Panel title" className="ugb--help-tip-column" /> )
		const title = getByText( 'Panel title' )
		const parent = getParentControl( title )
		expect( parent.classList.contains( 'ugb--help-tip-column' ) ).toBeTruthy()
	} )
} )

describe( 'Help Video Snippets', () => {
	let getByText

	const doRender = () => {
		( { getByText } = render(
			<div>
				<PanelAdvancedSettings
					title="Panel with tip no content"
					className="ugb--help-tip-column"
					initialOpen={ true }
				/>
				<PanelAdvancedSettings
					title="Panel no tip no content"
					initialOpen={ true }
				/>
				<PanelAdvancedSettings
					title="Panel with tip with content no tip"
					className="ugb--help-tip-column"
					initialOpen={ true }
				>
					<TextControl label="Control no tip in panel with tip" />
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					title="Panel with tip with content with tip"
					className="ugb--help-tip-column"
					initialOpen={ true }
				>
					<TextControl label="Control with tip in panel with tip" className="ugb--help-tip-column" />
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					title="Panel no tip with content no tip"
					initialOpen={ true }
				>
					<TextControl label="Control no tip in panel no tip" />
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					title="Panel no tip with content with tip"
					initialOpen={ true }
				>
					<TextControl label="Control with tip in panel no tip" className="ugb--help-tip-column" />
				</PanelAdvancedSettings>
			</div>
		) )
	}

	let onClick, onHoverIn, onHoverOut
	beforeEach( () => {
		doRender()
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
		getByText( 'Panel no tip no content' ).click()
		expect( onClick ).toHaveBeenCalledTimes( 0 )
		getByText( 'Panel with tip no content' ).click()
		expect( onClick ).toHaveBeenCalledTimes( 0 )
		getByText( 'Panel with tip with content no tip' ).click()
		expect( onClick ).toHaveBeenCalledTimes( 0 )
		getByText( 'Panel with tip with content with tip' ).click()
		expect( onClick ).toHaveBeenCalledTimes( 0 )
		getByText( 'Panel no tip with content no tip' ).click()
		expect( onClick ).toHaveBeenCalledTimes( 0 )
		getByText( 'Panel no tip with content with tip' ).click()
		expect( onClick ).toHaveBeenCalledTimes( 0 )
	} )

	it( 'hovering a panel without a help tip should not trigger', () => {
		expect( onHoverIn ).toHaveBeenCalledTimes( 0 )
		fireEvent.mouseOver( getByText( 'Panel no tip no content' ) )
		expect( onHoverIn ).toHaveBeenCalledTimes( 0 )
		fireEvent.mouseOver( getByText( 'Panel no tip with content no tip' ) )
		expect( onHoverIn ).toHaveBeenCalledTimes( 0 )
		fireEvent.mouseOver( getByText( 'Panel no tip with content with tip' ) )
		expect( onHoverIn ).toHaveBeenCalledTimes( 0 )

		expect( onHoverOut ).toHaveBeenCalledTimes( 0 )
		fireEvent.mouseOut( getByText( 'Panel no tip no content' ) )
		expect( onHoverOut ).toHaveBeenCalledTimes( 0 )
		fireEvent.mouseOut( getByText( 'Panel no tip with content no tip' ) )
		expect( onHoverOut ).toHaveBeenCalledTimes( 0 )
		fireEvent.mouseOut( getByText( 'Panel no tip with content with tip' ) )
		expect( onHoverOut ).toHaveBeenCalledTimes( 0 )
	} )

	it( 'hovering a panel with a help tip should trigger', () => {
		const panel = getByText( 'Panel with tip no content' )
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
		getByText( 'Control no tip in panel with tip' ).click()
		expect( onClick ).toHaveBeenCalledTimes( 0 )
		getByText( 'Control no tip in panel no tip' ).click()
		expect( onClick ).toHaveBeenCalledTimes( 0 )
	} )

	it( 'clicking a control with a tip should trigger', () => {
		let control = getByText( 'Control with tip in panel with tip' )
		let controlParent = getParentControl( control )

		expect( onClick ).toHaveBeenCalledTimes( 0 )
		control.click()
		expect( onClick ).toHaveBeenCalledTimes( 1 )
		expect( onClick ).toHaveBeenLastCalledWith( control, controlParent )

		control = getByText( 'Control with tip in panel no tip' )
		controlParent = getParentControl( control )

		expect( onClick ).toHaveBeenCalledTimes( 1 )
		control.click()
		expect( onClick ).toHaveBeenCalledTimes( 2 )
		expect( onClick ).toHaveBeenLastCalledWith( control, controlParent )
	} )

	it( 'hovering a control without a help tip should not trigger', () => {
		expect( onHoverIn ).toHaveBeenCalledTimes( 0 )
		fireEvent.mouseOver( getByText( 'Control no tip in panel with tip' ) )
		expect( onHoverIn ).toHaveBeenCalledTimes( 0 )
		fireEvent.mouseOver( getByText( 'Control no tip in panel no tip' ) )
		expect( onHoverIn ).toHaveBeenCalledTimes( 0 )

		expect( onHoverOut ).toHaveBeenCalledTimes( 0 )
		fireEvent.mouseOut( getByText( 'Control no tip in panel with tip' ) )
		expect( onHoverOut ).toHaveBeenCalledTimes( 0 )
		fireEvent.mouseOut( getByText( 'Control no tip in panel no tip' ) )
		expect( onHoverOut ).toHaveBeenCalledTimes( 0 )
	} )

	it( 'hovering a control with a help tip should trigger', () => {
		let control = getByText( 'Control with tip in panel with tip' )
		let controlParent = getParentControl( control )

		expect( onHoverIn ).toHaveBeenCalledTimes( 0 )
		fireEvent.mouseOver( control )
		expect( onHoverIn ).toHaveBeenCalledTimes( 1 )
		expect( onHoverIn ).toHaveBeenLastCalledWith( control, controlParent )

		expect( onHoverOut ).toHaveBeenCalledTimes( 0 )
		fireEvent.mouseOut( control )
		expect( onHoverOut ).toHaveBeenCalledTimes( 1 )

		control = getByText( 'Control with tip in panel no tip' )
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
