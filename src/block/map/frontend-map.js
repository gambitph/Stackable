/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

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
		} else {
			this.removeCanvas()
		}
	}

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
				uniqueId,
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

			this.removeIframe( uniqueId )

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

	removeCanvas = () => {
		[].forEach.call( document.querySelectorAll( `.stk-block-map__canvas-wrapper` ), wrapper => {
			wrapper.remove()
		} )
	}
	removeIframe = uniqueId => {
		[].forEach.call( document.querySelectorAll( `.stk-block-map__embedded-map-${ uniqueId }` ), wrapper => {
			wrapper.remove()
		} )
	}
}

window.stackableMap = new StackableMap()
domReady( window.stackableMap.init )
