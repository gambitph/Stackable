/**
 * Internal dependencies
 */
import {
	getMapStyles,
	getIconOptions,
	DEFAULT_HEIGHT,
	DEFAULT_ZOOM,
	DEFAULT_LOCATION,
	DEFAULT_ADDRESS,
} from './util'
import { MapStyles } from './style'
import { withVersion } from '~stackable/higher-order'
import {
	BlockDiv,
	CustomCSS,
	getResponsiveClasses,
	getAlignmentClasses,
} from '~stackable/block-components'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { i18n, version as VERSION } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { compose } from '@wordpress/compose'
import { RawHTML } from '@wordpress/element'

export const Save = props => {
	const {
		attributes,
	} = props

	const {
		address,
		location,
		isDraggable,
		showFullScreenButton,
		showMapTypeButtons,
		showMarker,
		showStreetViewButton,
		showZoomButtons,
		usesApiKey,
		zoom,
	} = attributes

	const responsiveClass = getResponsiveClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	const blockClassNames = classnames( [
		props.className,
		'stk-block-map',
		responsiveClass,
		blockAlignmentClass,
	], {
		'stk--uses-api-key': usesApiKey,
	} )

	// TODO: change this from lots of data-* attributes to just one
	// data-map-options attribute that's a JSON, so we don't need to parse it in
	// the frontend
	const dataAttributes = {
		'data-icon-options': JSON.stringify( getIconOptions( attributes ) ),
		'data-is-draggable': isDraggable,
		'data-location': JSON.stringify( location || DEFAULT_LOCATION ),
		'data-map-style': JSON.stringify( getMapStyles( attributes ) ),
		'data-show-full-screen-button': showFullScreenButton,
		'data-show-map-type-buttons': showMapTypeButtons,
		'data-show-marker': showMarker,
		'data-marker-title': address,
		'data-show-street-view-button': showStreetViewButton,
		'data-show-zoom-buttons': showZoomButtons,
		'data-zoom': zoom || DEFAULT_ZOOM,
	}

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<MapStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			{ usesApiKey
				? (
					<div
						style={ { height: DEFAULT_HEIGHT } }
						className={ `stk-block-map__canvas-wrapper` }>
						<div
							{ ...dataAttributes }
							className="stk-block-map__canvas"
						/>
					</div>
				)
				: <RawHTML>{
					`<iframe
						title="${ __( 'Embedded content from Google Maps Platform.', i18n ) }"
						src="https://maps.google.com/maps?q=${ address || DEFAULT_ADDRESS }&t=&z=${ zoom || DEFAULT_ZOOM }&ie=UTF8&output=embed"
						style="border:0;width:100%;max-width:none;max-height:none;height:100%;"
						aria-hidden="false"
						tabIndex="0"
						allowfullscreen
						loading="lazy"
						frameBorder="0"
					></iframe>`
				}</RawHTML>
			}

		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )

