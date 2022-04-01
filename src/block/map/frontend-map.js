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
				markerTitle,
				iconPath,
				iconColor,
				iconScale,
				iconOpacity,
				iconAnchorPositionX,
				iconAnchorPositionY,
				iconRotation,
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

			const mapOptions = {
				center: undefined,
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
				const markerOption = {
					title: markerTitle,
					map,
					position: parsedLocation,
					clickable: false,
				}

				// eslint-disable-next-line no-undef
				const marker = new google.maps.Marker( markerOption )
				if ( iconPath ) {
					const icon = {
						path: iconPath,
						fillColor: iconColor,
						fillOpacity: parseFloat( iconOpacity, 10 ),
						strokeWeight: 0,
						rotation: parseInt( iconRotation, 10 ),
						scale: parseFloat( iconScale, 10 ),
						// eslint-disable-next-line no-undef
						anchor: new google.maps.Point(
							parseInt( iconAnchorPositionX, 10 ),
							parseInt( iconAnchorPositionY, 10 )
						),
					}
					marker.setIcon( icon )
				}
			}
		} )

		// Clean up the iframes if we are using the API.
		;[].forEach.call( document.querySelectorAll( '.stk-block-map__iframe-wrapper' ), wrapper => {
			wrapper.remove()
		} )
	}
}

window.stackableMap = new StackableMap()
domReady( window.stackableMap.init )
