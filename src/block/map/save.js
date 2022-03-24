/**
 * Internal dependencies
 */
import {
	isDefined, getMapStyles, getLocation, getIframe, getZoom,
} from './util'
import { MapStyles } from './style'

/**
 * External dependencies
 */
import { withVersion } from '~stackable/higher-order'
import classnames from 'classnames'
import { settings, version as VERSION } from 'stackable'
import {
	BlockDiv,
	CustomCSS,
	getResponsiveClasses,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { compose } from '@wordpress/compose'
import { RawHTML } from '@wordpress/element'

export const Save = props => {
	const {
		attributes,
		...propsToPass
	} = props

	const {
		icon,
		isDraggable,
		placeId,
		showFullScreenButton,
		showMapTypeButtons,
		showMarker,
		showStreetViewButton,
		showZoomButtons,
	} = attributes

	const apiKey = settings.stackable_google_maps_api_key

	const responsiveClass = getResponsiveClasses( props.attributes )

	const blockClassNames = classnames( [
		propsToPass.className,
		'stk-block-map',
		responsiveClass,
	] )

	const dataAttributes = {
		'data-icon': icon,
		'data-is-draggable': isDraggable,
		'data-location': JSON.stringify( getLocation( attributes ) ),
		'data-map-style': JSON.stringify( getMapStyles( attributes ) ),
		'data-place-id': placeId,
		'data-show-full-screen-button': showFullScreenButton,
		'data-show-map-type-buttons': showMapTypeButtons,
		'data-show-marker': showMarker,
		'data-show-street-view-button': showStreetViewButton,
		'data-show-zoom-buttons': showZoomButtons,
		'data-zoom': getZoom( attributes ),
	}

	console.log( dataAttributes )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<MapStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			{ isDefined( apiKey ) ? (
				<div
					{ ...dataAttributes }
					className="stk-block-map__canvas"
				/>
			) : (
				<RawHTML>{ getIframe( attributes ) }</RawHTML>
			) }
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )

