/**
 * Internal dependencies
 */
import { IconLabelStyles } from './style'

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
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { compose } from '@wordpress/compose'
import { applyFilters } from '@wordpress/hooks'

export const Save = props => {
	const {
		attributes, className,
	} = props

	const rowClass = getRowClasses( attributes )
	const blockAlignmentClass = getAlignmentClasses( attributes )
	const responsiveClass = getResponsiveClasses( attributes )

	const blockClassNames = classnames( applyFilters( 'stackable.icon-label.save.blockClassNames', [
		className,
		'stk-block-icon-label',
		'stk-block-icon-label--v2',
		responsiveClass,
	], props )
	)

	const contentClassNames = classnames( [
		rowClass,
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
			version={ props.version }
			data-v={ props.attributes.version }
		>
			<IconLabelStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			<div className={ contentClassNames }>
				<InnerBlocks.Content />
			</div>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
