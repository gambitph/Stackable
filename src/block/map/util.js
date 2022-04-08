import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'
import mapStyleOptions from './map-styles'
import { clamp } from 'lodash'

export const DEFAULT_HEIGHT = 200
// TODO: Find out why this is a magic number that prevents scrollbars and other
// weirdness. Is this the width of the scrollbar?
export const DEFAULT_MIN_HEIGHT = 21
export const DEFAULT_ZOOM = 12
export const DEFAULT_ADDRESS = 'Quezon City'
export const DEFAULT_LOCATION = { lat: 14.680936247180512, lng: 121.04845461073226 }

export const isDefined = ( value = '' ) => {
	return value !== '' && value !== undefined
}

export const getMapStyles = ( { mapStyle, customMapStyle } ) => {
	let styleJSON
	if ( customMapStyle !== '' ) {
		try {
			styleJSON = JSON.parse( customMapStyle )
		} catch ( e ) {
			styleJSON = []
		}
	} else {
		styleJSON = mapStyleOptions.find( style => style.value === mapStyle )?.json || []
	}
	return styleJSON
}

export const getMapOptions = attributes => {
	const {
		isDraggable,
		showFullScreenButton,
		showMapTypeButtons,
		showStreetViewButton,
		showZoomButtons,
	} = attributes

	return {
		center: getLocation( attributes ),
		zoom: getZoom( attributes ),
		fullscreenControl: showFullScreenButton,
		styles: getMapStyles( attributes ),
		zoomControl: showZoomButtons,
		mapTypeControl: showMapTypeButtons,
		streetViewControl: showStreetViewButton,
		draggable: isDraggable,
	}
}

export const getIframe = attributes => {
	const { address, uniqueId } = attributes
	const iframeTitle = __( 'Embedded content from Google Maps Platform.', i18n )
	const src = `https://maps.google.com/maps?q=${ address || DEFAULT_ADDRESS }&t=&z=${ getZoom( attributes ) }&ie=UTF8&output=embed`
	return (
		`<iframe
				title="${ iframeTitle }"
				src="${ src }"
				style="border:0;width:100%;max-width:none;max-height:none;height:100%;"
				aria-hidden="false"
				tabIndex="0"
				allowfullscreen
				loading="lazy"
				class="stk-block-map__embedded-map-${ uniqueId } stk-block-map__embedded-map"
				frameBorder="0"
			></iframe>`
	)
}

export const getZoom = ( { zoom } ) => clamp( parseInt( zoom, 10 ) || DEFAULT_ZOOM, 1, 22 )

export const getLocation = ( { location } ) => isDefined( location ) ? location : DEFAULT_LOCATION

export const initMapLibrary = ( apiKey, callback ) => {
	if ( apiKey ) {
		const apiURL = `https://maps.googleapis.com/maps/api/js?key=${ apiKey }&libraries=places`
		// eslint-disable-next-line no-undef
		if ( typeof google === 'object' && typeof google.maps === 'object' ) {
			callback()
		} else {
			loadScriptAsync( apiURL ).then( () => {
				callback()
			} )
		}
	}
}

const loadScriptAsync = src => {
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
