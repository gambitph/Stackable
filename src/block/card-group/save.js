/**
 * Internal dependencies
 */
import createStyles from './style'

/**
 * External dependencies
 */
import { withVersion } from '~stackable/higher-order'
import { version as VERSION } from 'stackable'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { compose } from '@wordpress/compose'
import { BlockDiv, Style } from '~stackable/block-components'

export const Save = props => {
	const blockClassName = classnames( [
		'stk-card-group',
	] )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		'stk-row',
		'stk-block-content',
	] )

	return (
		<BlockDiv.Content
			className={ blockClassName }
			blockProps={ props }
		>
			<Style.Content
				styleFunc={ createStyles( props.version ) }
				blockProps={ props }
			/>
			<div className={ contentClassNames }>
				<InnerBlocks.Content />
			</div>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
