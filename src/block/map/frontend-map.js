/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

class StackableMap {
	init = () => {
		const apiKey = window.stackableMapVars && window.stackableMapVars.googleApiKey
		if ( apiKey ) {
			// eslint-disable-next-line no-undef
			if ( typeof window.google === 'object' && typeof window.google.maps === 'object' ) {
				this.initMap()
			} else {
				this.loadScriptAsync( apiKey ).then( this.initMap )
			}
		} else {
			// Display missing api key note if needed.
			[].forEach.call( document.querySelectorAll( '.stk--uses-api-key' ), el => {
				el.classList.add( 'stk--missing-api-key' )
				el.querySelector( '.stk-block-map__canvas' ).innerHTML = window.stackableMapVars.labelMissingMapApiKey
			} )
		}
	}

	loadScriptAsync = apiKey => {
		return new Promise( resolve => {
			const script = document.createElement( 'script' )
			script.id = 'stackable-google-map'
			// Add callback to prevent warnings.
			script.src = `https://maps.googleapis.com/maps/api/js?key=${ apiKey }&libraries=places&callback=Function.prototype`
			script.type = 'text/javascript'
			script.async = true
			script.onload = resolve
			document.body.appendChild( script )
		} )
	}

	initMap = () => {
		[].forEach.call( document.querySelectorAll( '.stk-block-map__canvas' ), mapCanvas => {
			const mapOptions = JSON.parse( mapCanvas.dataset.mapOptions || '{}' )
			const markerOptions = JSON.parse( mapCanvas.dataset.markerOptions || 'false' )
			const markerIconOptions = JSON.parse( mapCanvas.dataset.iconOptions || '{}' )

			// Hello Jami, I implemented a way where it doesnt have to be coordinates only haha.
			// But if you do not like it just: remove the if and other variables, move the block of code outside of the setTimeout,
			// and uncomment the if which is the implementation you originally mentioned

			// eslint-disable-next-line no-undef
			const geocoder = new google.maps.Geocoder()

			let duration = 0
			// If coordinates is just a string, turn it into an object
			if ( typeof mapOptions.center === 'string' ) {
				duration = 500
				geocoder.geocode( {
					address: mapOptions.center,
				}, ( results, status ) => {
					if ( status === 'OK' ) {
						mapOptions.center = {
							lat: parseFloat( results[ 0 ].geometry.location.lat() ),
							lng: parseFloat( results[ 0 ].geometry.location.lng() ),
						}
					}
				} )
			}

			// if ( mapOptions.center.match( /^\s*[-\d.]+(.*?)[, ][-\d.]+/ ) ) { // Check if there's a number comma/space number.
			// 	const [ , lat, , lng ] = mapOptions.center.match( /^\s*([-\d.]+)(.*?)([-\d.]+)/ )
			// 	mapOptions.center = {
			// 		lat: parseFloat( lat ),
			// 		lng: parseFloat( lng ),
			// 	}
			// }

			// Inside a setTimeout since geolocation speed may vary
			setTimeout( () => {
				// eslint-disable-next-line no-undef
				const map = new google.maps.Map( mapCanvas, mapOptions )
				if ( markerOptions ) {
					markerOptions.map = map
					markerOptions.clickable = false

					// eslint-disable-next-line no-undef
					const marker = new google.maps.Marker( markerOptions )
					marker.setIcon( markerIconOptions )
				}
			}, duration )
		} )
	}
}

window.stackableMap = new StackableMap()
domReady( window.stackableMap.init )
