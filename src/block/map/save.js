/**
 * Internal dependencies
 */
import {
	getIframe,
	getMapStyles,
	getIconOptions,
	DEFAULT_HEIGHT,
	DEFAULT_ZOOM,
	DEFAULT_LOCATION,
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
	getAlignmentClasses,
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
	] )

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
				: <RawHTML>{ getIframe( attributes ) }</RawHTML>
			}

		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )

