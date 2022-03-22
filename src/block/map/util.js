const isDefined = ( value = '' ) => {
	return value !== '' && value !== undefined
}

const latLngToString = latLng => `${ latLng.lat }, ${ latLng.lng }`

const initMapLibrary = ( apiKey, callback ) => {
	if ( apiKey ) {
		const apiURL = `https://maps.googleapis.com/maps/api/js?key=${ apiKey }&libraries=places&callback=initMap`
		window.initMap = callback
		// eslint-disable-next-line no-undef
		if ( typeof google === 'object' && typeof google.maps === 'object' ) {
			window.initMap()
		} else {
			loadScriptAsync( apiURL ).then( () => {
				window.initMap()
			} )
		}
	}
}

const loadScriptAsync = src => {
	return new Promise( ( resolve, reject ) => {
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

export {
	initMapLibrary, isDefined, latLngToString,
}
