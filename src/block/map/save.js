/**
 * Internal dependencies
 */
import BlockStyles from './style'
import { latLngToString } from './util'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { withVersion } from '~stackable/higher-order'
import {
	i18n, settings, version as VERSION,
} from 'stackable'
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
		uniqueId,
		attributes,
	} = props

	const {
		zoom,
		location,
	} = attributes

	const apiKey = settings.stackable_google_maps_api_key

	const responsiveClass = getResponsiveClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	const blockClassNames = classnames( [
		props.className,
		'stk-block-map',
		responsiveClass,
		blockAlignmentClass,
	] )

	const defaultLocation = { lat: 14.633600461871746, lng: 121.04300214414138 }

	const iframeTitle = __( 'Embedded content from Google Maps.', i18n )

	//${ isDefined( allowFullScreen ) ? `allow="allowfullscreen 'src'"` : '' }
	const content = (
		`<iframe
				title="${ iframeTitle }"
				src="https://maps.google.com/maps?q=${ location || latLngToString( defaultLocation ) }&t=&z=${ zoom || 12 }&ie=UTF8&output=embed"
				aria-hidden="false"
				tabIndex="0"
			></iframe>`
	)

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<BlockStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			{ apiKey ? (
				<div
					className="stk-block-map__canvas"
					id={ uniqueId }
				/>
			) : (
				<RawHTML>{ content }</RawHTML>
			) }
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
