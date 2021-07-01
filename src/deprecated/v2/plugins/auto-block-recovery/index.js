/**
 * Runs the auto-attempt recovery when the block editor starts.
 */
import domReady from '@wordpress/dom-ready'
import { autoAttemptRecovery } from './attempt-recovery'

export const initAutoAttemptRecovery = () => {
	if ( window._wpLoadBlockEditor ) {
		window._wpLoadBlockEditor.then( function() {
			autoAttemptRecovery()
		} )
	}
}

domReady( initAutoAttemptRecovery )
