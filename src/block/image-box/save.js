/** Internal dependencies
 */
import { ImageBoxStyles } from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { withVersion } from '~stackable/higher-order'
import { version as VERSION } from 'stackable'
import {
	BlockDiv,
	CustomCSS,
	getAlignmentClasses,
	getResponsiveClasses,
	getRowClasses,
	getContentAlignmentClasses,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { compose } from '@wordpress/compose'
import { BlockLink } from '~stackable/block-components/block-link'

export const Save = props => {
	const {
		attributes,
	} = props

	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const responsiveClass = getResponsiveClasses( props.attributes )
	const rowClass = getRowClasses( props.attributes )

	const blockClassNames = classnames( [
		props.className,
		'stk-block-image-box',
		'stk-block-image-box__inner-container',
		responsiveClass,
		'stk-hover-parent', // Hover parent here to make sure the effect shows even with a block link.
	] )

	const contentClassNames = classnames( [
		'stk-block-content',
		'stk-inner-blocks',
		blockAlignmentClass,
		rowClass,
	], getContentAlignmentClasses( attributes ) )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<ImageBoxStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			<div className={ contentClassNames }>
				<InnerBlocks.Content />
			</div>
			<BlockLink.Content attributes={ attributes } />
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
