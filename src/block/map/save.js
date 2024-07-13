/**
 * Internal dependencies
 */
import {
	getMapStyles,
	getIconOptions,
	DEFAULT_ZOOM,
	DEFAULT_LOCATION,
	DEFAULT_ADDRESS,
} from './util'
import BlockStyles from './style'
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
import { applyFilters } from '@wordpress/hooks'

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
	let tempLocation = location
	const blockClassNames = classnames( [
		props.className,
		'stk-block-map',
		responsiveClass,
		blockAlignmentClass,
	], {
		'stk--uses-api-key': usesApiKey,
	} )

	if ( address.startsWith( '!#stk_dynamic/' ) ) {
		tempLocation = address
	}

	const styles = getMapStyles( attributes )
	const mapOptions = {
		center: tempLocation || DEFAULT_LOCATION,
		zoom: zoom || DEFAULT_ZOOM,
		styles: styles.length ? styles : undefined,
		gestureHandling: isDraggable ? undefined : 'none',
		fullscreenControl: showFullScreenButton,
		mapTypeControl: showMapTypeButtons,
		streetViewControl: showStreetViewButton,
		zoomControl: showZoomButtons,
	}

	const markerOptions = showMarker ? {
		position: location || DEFAULT_LOCATION,
		title: address || undefined,
	} : false

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
			version={ props.version }
		>
			<BlockStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			{ usesApiKey
				? (
					<div
						data-map-options={ JSON.stringify( mapOptions ) }
						data-marker-options={ JSON.stringify( markerOptions ) }
						data-icon-options={ JSON.stringify(
							applyFilters(
								'stackable.map.icon-options',
								getIconOptions( attributes ),
								attributes,
								props
							)
						) }
						className="stk-block-map__canvas"
					/>
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

