/**
 * Internal dependencies
 */
import {
	DEFAULT_ICON_ANCHOR_POSITION_X,
	DEFAULT_ICON_ANCHOR_POSITION_Y,
	DEFAULT_ICON_OPACITY,
	DEFAULT_ICON_ROTATION,
	DEFAULT_ICON_SIZE,
	DEFAULT_ICON_COLOR,
	getIframe,
	getLocation,
	getMapStyles,
	getPathFromSvg,
	getZoom,
} from './util'
import { MapStyles } from './style'

/**
 * External dependencies
 */
import { withVersion } from '~stackable/higher-order'
import classnames from 'classnames'
import { version as VERSION } from 'stackable'
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
		address,
		icon,
		iconAnchorPositionX,
		iconAnchorPositionY,
		iconColor1,
		iconOpacity,
		iconRotation,
		iconSize,
		isDraggable,
		showFullScreenButton,
		showMapTypeButtons,
		showMarker,
		showStreetViewButton,
		showZoomButtons,
		usesApiKey,
	} = attributes

	const responsiveClass = getResponsiveClasses( props.attributes )

	const blockClassNames = classnames( [
		propsToPass.className,
		'stk-block-map',
		responsiveClass,
	] )

	const dataAttributes = {
		'data-value-zero': 0,
		'data-icon-path': getPathFromSvg( icon ),
		'data-icon-scale': ( parseInt( iconSize, 10 ) / 100 ) || ( DEFAULT_ICON_SIZE / 100 ),
		'data-icon-color': iconColor1 || DEFAULT_ICON_COLOR,
		'data-icon-anchor-position-x': parseInt( iconAnchorPositionX, 10 ) || DEFAULT_ICON_ANCHOR_POSITION_X,
		'data-icon-anchor-position-y': parseInt( iconAnchorPositionY ) || DEFAULT_ICON_ANCHOR_POSITION_Y,
		'data-icon-opacity': parseFloat( iconOpacity, 10 ) || DEFAULT_ICON_OPACITY,
		'data-icon-rotation': parseInt( iconRotation ) || DEFAULT_ICON_ROTATION,
		'data-is-draggable': isDraggable,
		'data-location': JSON.stringify( getLocation( attributes ) ),
		'data-map-style': JSON.stringify( getMapStyles( attributes ) ),
		'data-show-full-screen-button': showFullScreenButton,
		'data-show-map-type-buttons': showMapTypeButtons,
		'data-show-marker': showMarker,
		'data-marker-title': address,
		'data-show-street-view-button': showStreetViewButton,
		'data-show-zoom-buttons': showZoomButtons,
		'data-zoom': getZoom( attributes ),
	}

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<MapStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			{ usesApiKey ? (
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

