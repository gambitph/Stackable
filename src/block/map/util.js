/**
 * Internal dependencies
 */
import mapStyleOptions from './map-styles'

/**
 * External dependencies
 */
import { createElementFromHTMLString } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const DEFAULT_HEIGHT = 350
export const DEFAULT_ZOOM = 12
export const DEFAULT_ADDRESS = 'Quezon City'
export const DEFAULT_LOCATION = { lat: 14.680936247180512, lng: 121.04845461073226 }
export const DEFAULT_ICON_SIZE = 40
export const DEFAULT_ICON_OPACITY = 1.0
export const DEFAULT_ICON_COLOR = '#000000'
export const DEFAULT_ICON_ROTATION = 0
export const DEFAULT_ICON_ANCHOR_POSITION_X = 0
export const DEFAULT_ICON_ANCHOR_POSITION_Y = 0

export const getMapStyles = ( { mapStyle, customMapStyle } ) => {
	let styleJSON
	if ( customMapStyle ) {
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

export const getIconOptions = ( attributes, isDeprecated ) => {
	const {
		icon,
		iconColor1,
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

	if ( isDeprecated ) {
		// Deprecate this since sets the fill to the default color black, even when no color is selected.
		svgEl.firstElementChild.setAttribute( 'fill', 'currentColor' )
	} else if ( iconColor1 ) {
		// Apply the fill directly to the SVG shapes
		const svgShapes = svgEl.querySelectorAll( 'g,path,rect,polygon,ellipse' )
		svgShapes.forEach( svgShape => {
			svgShape.setAttribute( 'style', `fill: ${ iconColor1 }` )
		} )
	}

	const svgIconSize = iconSize ? parseInt( iconSize, 10 ) : DEFAULT_ICON_SIZE
	svgEl.setAttribute( 'height', svgIconSize )
	svgEl.setAttribute( 'width', svgIconSize )
	svgEl.setAttribute( 'style', `color: ${ iconColor1 || DEFAULT_ICON_COLOR }; opacity: ${ iconOpacity || iconOpacity === 0 ? parseFloat( iconOpacity, 10 ) : DEFAULT_ICON_OPACITY }` )
	svgEl.setAttribute( 'transform', `rotate(${ iconRotation || iconRotation === 0 ? parseInt( iconRotation, 10 ) : DEFAULT_ICON_ROTATION })` )

	if ( iconColor1 ) {
		// Apply the fill directly to the SVG shapes
		const svgShapes = svgEl.querySelectorAll( 'g,path,rect,polygon,ellipse' )
		svgShapes.forEach( svgShape => {
			svgShape.setAttribute( 'style', `fill: ${ iconColor1 }` )
		} )
	}

	const serializedString = new XMLSerializer().serializeToString( svgEl ) //eslint-disable-line no-undef
	const iconUrl = `data:image/svg+xml;base64,${ window.btoa( serializedString ) }`
	const iconOptions = { url: iconUrl }
	const iconXPos = (
		iconAnchorPositionX || iconAnchorPositionX === 0
			? parseInt( iconAnchorPositionX, 10 )
			: DEFAULT_ICON_ANCHOR_POSITION_X
	) + ( svgIconSize / 2 )
	const iconYPos = (
		iconAnchorPositionY || iconAnchorPositionY === 0
			? parseInt( iconAnchorPositionY, 10 )
			: DEFAULT_ICON_ANCHOR_POSITION_Y
	) + svgIconSize

	iconOptions.anchor = { x: iconXPos, y: iconYPos }
	return iconOptions
}

let loaderPromise = null

export const initMapLibrary = ( apiKey, callback ) => {
	if ( apiKey ) {
		// If the Google Map API has already loaded.
		if ( typeof window?.google === 'object' && typeof window?.google.maps === 'object' ) {
			callback()
		// If the Google Map API hasn't yet loaded, but we already loaded the script and are waiting for it to load.
		} else if ( loaderPromise ) {
			loaderPromise.then( callback )
		} else {
			loaderPromise = loadScriptAsync( apiKey ).then( callback )
		}
	}
}

const loadScriptAsync = apiKey => {
	return new Promise( resolve => {
		if ( document.querySelector( 'script#stackable-google-map' ) ) {
			resolve()
			return
		}
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
