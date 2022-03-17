/**
 * Internal dependencies
 */
import BlockStyles from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { withVersion } from '~stackable/higher-order'
import { version as VERSION } from 'stackable'
import {
	BlockDiv,
	CustomCSS,
	getResponsiveClasses,
	getAlignmentClasses,
	BlockLink,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { RawHTML } from '@wordpress/element'

export const Save = props => {
	const {
		attributes,
	} = props

	const responsiveClass = getResponsiveClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	const blockClassNames = classnames( [
		props.className,
		'stk-block-map',
		responsiveClass,
		blockAlignmentClass,
	] )

	const content = `<iframe
				title="test"
				src="https://maps.google.com/maps?q=14.633600461871746, 121.04300214414138&t=&z=12&ie=UTF8&iwloc=&output=embed"
				className="stk-map"
				height="300"
				frameBorder="0"
				style="border:0;width: 100%; max-width: none;"
				allowFullScreen=""
				aria-hidden="false"
				tabIndex="0"
			></iframe>`

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<BlockStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			<RawHTML>{ content }</RawHTML>
			<BlockLink.Content attributes={ attributes } />
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
