import {
	startListening as startListeningMouseEvents,
	stopListening as stopListeningMouseEvents,
	getParentControl,
} from './events-mouse'

import {
	doAction, addAction, removeAction,
} from '@wordpress/hooks'

const HOVER_TIMEOUT = 1500

let helpTimeout
let state = {
	show: false,
	controlEl: null,
	target: null,
}

const startHelpTimeout = ( el, controlEl ) => {
	helpTimeout = setTimeout( () => {
		showHelp( el, controlEl )
	}, HOVER_TIMEOUT )
}

const stopHelpTimeout = () => {
	if ( helpTimeout ) {
		clearTimeout( helpTimeout )
	}
	helpTimeout = null
}

const showHelp = ( el, controlEl ) => {
	state = {
		...state,
		show: true,
		controlEl,
		target: el,
	}
	doAction( 'stackable.help-video.show', el )
}

const hideHelp = () => {
	state.show = false
	doAction( 'stackable.help-video.hide' )
}

export const startListening = () => {
	startListeningMouseEvents()

	// If hovered long enough on a control label, show the tooltip.
	addAction( 'stackable.help-video.control.hover.in', 'stackable/help/hoverin', startHelpTimeout )
	addAction( 'stackable.help-video.control.hover.out', 'stackable/help/hoverout', stopHelpTimeout )

	// When a control label is clicked, show the tooltip.
	addAction( 'stackable.help-video.control.click', 'stackable/help/click', ( el, controlEl ) => {
		// Show the tooltip if nothing's shown yet.
		if ( ! state.show ) {
			return showHelp( el, controlEl )
		}

		if ( el === state.target ) {
			// If the label of the open tooltip is clicked, close the tooltip.
			hideHelp()
		} else {
			// If the another label is clicked, show that one instead.
			showHelp( el, controlEl )
		}
	} )

	// Track clicks outside the tooltip and outside the current control which the tooltip belongs to.
	// Close the tooltip if clicked outside these areas.
	document.body.addEventListener( 'click', ev => {
		if ( state.show ) {
			if ( ! ev.target.closest( '.ugb-help-tooltip-video' ) && getParentControl( ev.target ) !== state.controlEl ) {
				hideHelp()
			}
		}
	} )
}

export const stopListening = () => {
	stopListeningMouseEvents()
	removeAction( 'stackable.help-video.control.hover.in', 'stackable/help/hoverin' )
	removeAction( 'stackable.help-video.control.hover.out', 'stackable/help/hoverout' )
	removeAction( 'stackable.help-video.control.click', 'stackable/help/click' )
}
