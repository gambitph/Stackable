/**
 * Internal dependencies
 */
import mapStyleOptions from './map-styles'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { clamp } from 'lodash'
import { createElementFromHTMLString } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const DEFAULT_HEIGHT = 250
export const DEFAULT_ZOOM = 12
export const DEFAULT_ADDRESS = 'Quezon City'
export const DEFAULT_LOCATION = { lat: 14.680936247180512, lng: 121.04845461073226 }
export const DEFAULT_ICON_SIZE = 40
export const DEFAULT_ICON_OPACITY = 1.0
export const DEFAULT_ICON_COLOR = '#000000'
export const DEFAULT_ICON_ROTATION = 0
export const DEFAULT_ICON_ANCHOR_POSITION_X = 0
export const DEFAULT_ICON_ANCHOR_POSITION_Y = 0

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

export const getFillColor = ( { iconColor1 } ) => {
	return isDefined( iconColor1 ) ? iconColor1 : DEFAULT_ICON_COLOR
}

export const getIconOptions = attributes => {
	const {
		icon,
		iconSize,
		iconRotation,
		iconOpacity,
		iconAnchorPositionX,
		iconAnchorPositionY,
	} = attributes

	const svgEl = createElementFromHTMLString( icon )

	if ( ! svgEl ) {
		// If we can't use the generated SVG element for any reason we
		// display the default icon.
		return null
	 }

	svgEl.firstElementChild.setAttribute( 'fill', 'currentColor' )
	const svgIconSize = isDefined( iconSize ) ? parseInt( iconSize, 10 ) : DEFAULT_ICON_SIZE
	svgEl.setAttribute( 'height', svgIconSize )
	svgEl.setAttribute( 'width', svgIconSize )
	svgEl.setAttribute( 'style', `color: ${ getFillColor( attributes ) }; opacity: ${ isDefined( iconOpacity ) ? parseFloat( iconOpacity, 10 ) : DEFAULT_ICON_OPACITY }` )
	svgEl.setAttribute( 'transform', `rotate(${ isDefined( iconRotation ) ? parseInt( iconRotation, 10 ) : DEFAULT_ICON_ROTATION })` )

	const serializedString = new XMLSerializer().serializeToString( svgEl ) //eslint-disable-line no-undef
	const iconUrl = `data:image/svg+xml;base64,${ window.btoa( serializedString ) }`
	const iconOptions = { url: iconUrl }
	const iconXPos = (
		isDefined( iconAnchorPositionX )
			? parseInt( iconAnchorPositionX, 10 )
			: DEFAULT_ICON_ANCHOR_POSITION_X
	) + ( svgIconSize / 2 )
	const iconYPos = (
		isDefined( iconAnchorPositionY )
			? parseInt( iconAnchorPositionY, 10 )
			: DEFAULT_ICON_ANCHOR_POSITION_Y
	) + svgIconSize

	iconOptions.anchor = { x: iconXPos, y: iconYPos }
	return iconOptions
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

export const getZoom = ( { zoom } ) => clamp( parseInt( zoom, 10 ) || DEFAULT_ZOOM, 1, 24 )

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
