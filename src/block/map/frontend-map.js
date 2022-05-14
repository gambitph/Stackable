/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

class StackableMap {
	init = () => {
		const apiKey = window.stackable.googleApiKey
		// TODO: If no apiKey is found, but the block used an apiKey, display a note that the map is missing the api key.
		if ( apiKey ) {
			// eslint-disable-next-line no-undef
			if ( typeof google === 'object' && typeof google.maps === 'object' ) {
				this.initMap()
			} else {
				this.loadScriptAsync( apiKey ).then( this.initMap )
			}
		}
	}

	loadScriptAsync = apiKey => {
		return new Promise( resolve => {
			const script = document.createElement( 'script' )
			script.id = 'stackable-google-map'
			script.src = `https://maps.googleapis.com/maps/api/js?key=${ apiKey }&libraries=places`
			script.type = 'text/javascript'
			script.async = true
			script.onload = resolve
			document.body.appendChild( script )
		} )
	}

	initMap = () => {
		[].forEach.call( document.querySelectorAll( '.stk-block-map__canvas' ), mapCanvas => {
			// TODO: change this from lots of data-* attributes to just one
			// data-map-options attribute that's a JSON, so we don't need to parse it in
			// the frontend
			const {
				markerTitle,
				iconOptions,
				isDraggable,
				location,
				mapStyle,
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
				parsedLocation = undefined
			}

			let parsedStyles
			try {
				parsedStyles = JSON.parse( mapStyle )
			} catch ( e ) {
				parsedStyles = []
			}

			let parsedIconOptions
			try {
				parsedIconOptions = JSON.parse( iconOptions )
			} catch ( e ) {
				parsedIconOptions = null
			}

			const mapOptions = {
				center: parsedLocation,
				isDraggable: isDraggable === 'true',
				fullscreenControl: showFullScreenButton === 'true',
				styles: parsedStyles,
				zoomControl: showZoomButtons === 'true',
				mapTypeControl: showMapTypeButtons === 'true',
				streetViewControl: showStreetViewButton === 'true',
				draggable: isDraggable === 'true',
				zoom: parseInt( zoom, 10 ),
			}

			// eslint-disable-next-line no-undef
			const map = new google.maps.Map( mapCanvas, mapOptions )
			if ( showMarker === 'true' ) {
				const markerOptions = {
					title: markerTitle,
					map,
					position: parsedLocation,
					clickable: false,
				}

				// eslint-disable-next-line no-undef
				const marker = new google.maps.Marker( markerOptions )

				marker.setIcon( parsedIconOptions )
			}
		} )
	}
}

window.stackableMap = new StackableMap()
domReady( window.stackableMap.init )
