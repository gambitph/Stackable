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
	const {
		attributes,
	} = props

	const blockClassName = classnames( [
		props.className,
		'stk-card-group',
	] )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		'stk-row',
		'stk-block-content',
	], {
		[ `stk-columns-${ props.attributes.numInnerBlocks }` ]: props.attributes.numInnerBlocks && props.attributes.numInnerBlocks > 1,
	} )

	return (
		<BlockDiv.Content
			className={ blockClassName }
			attributes={ attributes }
		>
			<Style.Content
				styleFunc={ createStyles( props.version ) }
				attributes={ attributes }
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
