/**
 * Internal dependencies
 */
import {
	getIframe,
	getLocation,
	getMapStyles,
	getIconOptions,
	getZoom,
	DEFAULT_HEIGHT,
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
		isDraggable,
		showFullScreenButton,
		showMapTypeButtons,
		showMarker,
		showStreetViewButton,
		showZoomButtons,
		usesApiKey,
		uniqueId,
	} = attributes

	const responsiveClass = getResponsiveClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	const blockClassNames = classnames( [
		props.className,
		'stk-block-map',
		responsiveClass,
		blockAlignmentClass,
	] )

	const dataAttributes = {
		'data-icon-options': JSON.stringify( getIconOptions( attributes ) ),
		'data-is-draggable': isDraggable,
		'data-location': JSON.stringify( getLocation( attributes ) ),
		'data-map-style': JSON.stringify( getMapStyles( attributes ) ),
		'data-show-full-screen-button': showFullScreenButton,
		'data-show-map-type-buttons': showMapTypeButtons,
		'data-show-marker': showMarker,
		'data-marker-title': address,
		'data-show-street-view-button': showStreetViewButton,
		'data-show-zoom-buttons': showZoomButtons,
		'data-unique-id': uniqueId,
		'data-zoom': getZoom( attributes ),
	}

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<MapStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			{ usesApiKey
				? <>
					<div
						style={ { height: DEFAULT_HEIGHT } }
						className={ `stk-block-map__canvas-wrapper stk-block-map__canvas-wrapper-${ uniqueId }` }>
						<div
							{ ...dataAttributes }
							className="stk-block-map__canvas"
						/>
					</div>
					<RawHTML>{ getIframe( attributes ) }</RawHTML>
				</>
				:	<RawHTML>{ getIframe( attributes ) }</RawHTML>
			}

		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )

