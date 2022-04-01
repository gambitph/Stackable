import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'
import mapStyleOptions from './map-styles'

export const DEFAULT_HEIGHT = 300
export const DEFAULT_MIN_HEIGHT = 0
export const DEFAULT_ZOOM = 12
export const DEFAULT_ADDRESS = 'Quezon City'
export const DEFAULT_LOCATION = { lat: 14.584696402657487, lng: 120.9817962698239 }
export const DEFAULT_ICON_SIZE = 10
export const DEFAULT_ICON_OPACITY = 1.0
export const DEFAULT_ICON_COLOR = '#000000'
export const DEFAULT_ICON_ROTATION = 0
export const DEFAULT_ICON_ANCHOR_POSITION_X = 0
export const DEFAULT_ICON_ANCHOR_POSITION_Y = 0

export const isDefined = ( value = '' ) => {
	return value !== '' && value !== undefined
}

export const latLngToString = latLng => `${ latLng.lat },${ latLng.lng }`

export const isLatLng = value => {
	// @see https://stackoverflow.com/questions/3518504/regular-expression-for-matching-latitude-longitude-coordinates
	if ( typeof value === 'object' ) {
		value = latLngToString( value )
	}
	return value.trim().match( /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/ )
}

export const getSnapYBetween = ( value, snapDiff = 50 ) => {
	return [
		Math.floor( value / snapDiff ) * snapDiff,
		Math.ceil( value / snapDiff ) * snapDiff,
	]
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
	const { address, height } = attributes
	const iframeTitle = __( 'Embedded content from Google Maps.', i18n )
	const src = `https://maps.google.com/maps?q=${ address || DEFAULT_ADDRESS }&t=&z=${ getZoom( attributes ) }&ie=UTF8&output=embed`
	return (
		`<iframe
				title="${ iframeTitle }"
				src="${ src }"
				style="border:0;width:100%;max-width:none;max-height:none;height:${ height || DEFAULT_HEIGHT }px;"
				aria-hidden="false"
				tabIndex="0"
				allowfullscreen
				loading="lazy"
			></iframe>`
	)
}

export const getZoom = ( { zoom } ) => isDefined( zoom ) ? zoom : DEFAULT_ZOOM

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

export const getPathFromSvg = svg => {
	const div = document.createElement( 'div' )
	div.innerHTML = svg
	try {
		return div.firstChild.firstChild.getAttribute( 'd' )
	} catch ( e ) {
		return ''
	}
}
