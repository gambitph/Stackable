/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

const DEFAULT_LOCATION = { lat: 14.584696402657487, lng: 120.9817962698239 }
class StackableMap {
	init = () => {
		const apiKey = window.stackable.googleApiKey

		if ( apiKey ) {
			const apiURL = `https://maps.googleapis.com/maps/api/js?key=${ apiKey }&libraries=places`
			// eslint-disable-next-line no-undef
			if ( typeof google === 'object' && typeof google.maps === 'object' ) {
				this.initMap()
			} else {
				this.loadScriptAsync( apiURL ).then( this.initMap )
			}
		}
	};

	loadScriptAsync = src => {
		return new Promise( resolve => {
			const tag = document.createElement( 'script' )
			tag.id = 'stackable-google-map'
			tag.src = src
			tag.async = true
			tag.onload = () => {
				resolve()
			}
			const firstScriptTag = document.getElementsByTagName( 'script' )[ 0 ]
			firstScriptTag.parentNode.insertBefore( tag, firstScriptTag )
		} )
	}

	initMap = () => {
		[].forEach.call( document.querySelectorAll( '.stk-block-map__canvas' ), mapCanvas => {
			const {
				icon,
				isDraggable,
				location,
				mapStyle,
				placeId,
				showFullScreenButton,
				showMapTypeButtons,
				showMarker,
				showStreetViewButton,
				showZoomButtons,
				zoom,
			} = mapCanvas.dataset

			let parsedLocation
			try {
				parsedLocation = JSON.parse( location )
			} catch ( e ) {
				parsedLocation = DEFAULT_LOCATION
			}

			let parsedStyles
			try {
				parsedStyles = JSON.parse( mapStyle )
			} catch ( e ) {
				parsedStyles = mapStyle
			}

			console.log( {
				icon,
				isDraggable,
				location,
				mapStyle,
				placeId,
				showFullScreenButton,
				showMapTypeButtons,
				showMarker,
				showStreetViewButton,
				showZoomButtons,
				zoom,
			} )
			const mapOptions = {
				center: parsedLocation,
				fullscreenControl: showFullScreenButton === 'true',
				styles: parsedStyles,
				zoomControl: showZoomButtons === 'true',
				mapTypeControl: showMapTypeButtons === 'true',
				streetViewControl: showStreetViewButton === 'true',
				draggable: isDraggable === 'true',
				zoom: parseInt( zoom, 10 ),
			}

			console.log( mapOptions )
			// eslint-disable-next-line no-undef
			const map = new google.maps.Map( mapCanvas, mapOptions )
			if ( showMarker === 'true' ) {
				console.log( map )
				// TODO: add marker
			}
		} )
	};
}

window.stackableMap = new StackableMap()
domReady( window.stackableMap.init )
