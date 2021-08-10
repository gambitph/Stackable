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
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'

export const Save = props => {
	const {
		version,
		className,
		attributes,
	} = props

	const responsiveClass = getResponsiveClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-posts',
		responsiveClass,
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<PostsStyles.Content version={ version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			{ generateRenderPostItem.save( attributes ) }
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
