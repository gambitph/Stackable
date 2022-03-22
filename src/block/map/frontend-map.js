/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'
import { initMapLibrary } from './util'

class StackableMap {
	init = () => {
		initMapLibrary()
		console.log( 'map is loaded here.' )
	}
}

window.stackableMap = new StackableMap()
domReady( window.stackableMap.init )
