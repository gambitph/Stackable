/**
 * Internal dependencies
 */
import BlockStyles from './style'

/**
 * External dependencies
 */
import { withVersion } from '~stackable/higher-order'
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import {
	BlockDiv,
	CustomCSS,
	getAlignmentClasses,
	getResponsiveClasses,
	getRowClasses,
	// Separator,
	getSeparatorClasses,
	getContentAlignmentClasses,
	Typography,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { applyFilters } from '@wordpress/hooks'
import { compose } from '@wordpress/compose'

export const Save = props => {
	const {
		attributes,
	} = props

	const rowClass = getRowClasses( props.attributes )
	const separatorClass = getSeparatorClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const responsiveClass = getResponsiveClasses( props.attributes )

	const blockClassName = classnames( [
		props.className,
		'stk-block-timeline',
		responsiveClass,
		separatorClass,
		{
			'stk-block-timeline--left': props.attributes.timelinePosition !== 'right',
			'stk-block-timeline--right': props.attributes.timelinePosition === 'right',
		},
	] )

	const contentClassNames = classnames( applyFilters( 'stackable.new-block.save.contentClassNames', [
		[
			rowClass,
			'stk-inner-blocks',
			blockAlignmentClass,
			'stk-block-content',
		],
		getContentAlignmentClasses( props.attributes ),
	], props ) )

	return (
		<BlockDiv.Content
			className={ blockClassName }
			attributes={ attributes }
			version={ props.version }
		>
			<BlockStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			{ /* <Separator.Content attributes={ attributes }> */ }
			<div className={ contentClassNames }>
				<Typography.Content
					tagName="div"
					className="stk-block-timeline__date"
					attributes={ attributes }
					// onMerge={ mergeBlocks }
					// onRemove={ onRemove }
					// onReplace={ onReplace }
					// onSplit={ onSplit }
				/>
				<div className="stk-block-timeline__middle"></div>
				<div className="stk-block-timeline__content">
					<InnerBlocks.Content />
				</div>
			</div>
			{ /* </Separator.Content> */ }
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
