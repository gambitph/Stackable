/**
 * Internal dependencies
 */

import { BlockDiv } from '~stackable/block-components'
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import { withVersion } from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { InnerBlocks } from '@wordpress/block-editor'

const Save = props => {
	const {
		className,
		attributes,
	} = props

	const blockClassNames = classnames( [
		className,
		'stk-block-tab-content',
	] )

	//this is the thing
	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<div className="stk-block-tab-content__wrapper">
				<InnerBlocks.Content />
			</div>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
