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
	getAlignmentClasses,
	getResponsiveClasses,
	getRowClasses,
	Separator,
	getSeparatorClasses,
	getContentAlignmentClasses,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { compose } from '@wordpress/compose'
import { applyFilters } from '@wordpress/hooks'

export const Save = props => {
	const {
		attributes,
	} = props

	const rowClass = getRowClasses( props.attributes )
	const separatorClass = getSeparatorClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const responsiveClass = getResponsiveClasses( props.attributes )

	const blockClassNames = classnames(
		applyFilters( 'stackable.feature-grid.save.blockClassNames', [
			[
				props.className,
				'stk-block-feature-grid',
				'stk-block-columns', // We need to add the columns class to make fit all and column gap to work properly.
				responsiveClass,
				separatorClass,
				{
					'stk--column-wrap-desktop': attributes.columnWrapDesktop,
				},
			],
		], props )
	)

	const contentClassNames = classnames( [
		rowClass,
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
	], getContentAlignmentClasses( attributes ) )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
			version={ props.version }
		>
			<BlockStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			<Separator.Content attributes={ attributes }>
				<div className={ contentClassNames }>
					<InnerBlocks.Content />
				</div>
			</Separator.Content>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
