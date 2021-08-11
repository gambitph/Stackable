/**
 * Internal dependencies
 */
import { PostsStyles } from './style'
import { generateRenderPostItem } from './util'

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
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { InnerBlocks } from '@wordpress/block-editor'

export const Save = props => {
	const {
		version,
		className,
		attributes,
	} = props

	const responsiveClass = getResponsiveClasses( props.attributes )
	const blockAlignmentClasses = getAlignmentClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-posts',
		responsiveClass,
		blockAlignmentClasses,
	] )

	const contentClassNames = classnames( [
		'stk-block-posts__items',
	] )

	const innerClassNames = classnames( [
		'stk-inner-blocks',
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<PostsStyles.Content version={ version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			<div className={ contentClassNames }>
				{ generateRenderPostItem.save( attributes ) }
			</div>
			<div className={ innerClassNames }>
				<InnerBlocks.Content />
			</div>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
