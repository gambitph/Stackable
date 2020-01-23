/**
 * Internal dependencies
 */
import { startListening } from './events-show'
import HelpToolTipVideo from './help-tooltip-video'
import withWelcomeTutorialModal from './welcome-tutorial-video'

/**
 * External dependencies
 */
import { displayWelcomeVideo } from 'stackable'

/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'
import { render } from '@wordpress/element'
import { addFilter } from '@wordpress/hooks'

domReady( () => {
	// Don't do this for old browsers.
	if ( ! Element.prototype.closest ) {
		return
	}

	startListening()
	const helpContainer = document.createElement( 'DIV' )
	document.querySelector( 'body' ).appendChild( helpContainer )
	render( <HelpToolTipVideo />, helpContainer )
} )

// Initialize the welcome tutorial modal video.
if ( displayWelcomeVideo ) {
	addFilter( 'editor.BlockEdit', 'stackable/with-welcome-tutorial-modal', withWelcomeTutorialModal )
}
