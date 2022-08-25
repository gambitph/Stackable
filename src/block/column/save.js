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
	ContainerDiv,
	CustomCSS,
	getAlignmentClasses,
	getColumnClasses,
	getResponsiveClasses,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { compose } from '@wordpress/compose'
import { applyFilters } from '@wordpress/hooks'
import { BlockLink } from '~stackable/block-components/block-link'

export const Save = props => {
	const {
		attributes,
	} = props

	const [ columnClass, columnWrapperClass ] = getColumnClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const responsiveClass = getResponsiveClasses( props.attributes )

	const blockClassNames = classnames( applyFilters( 'stackable.column.save.blockClassNames', [
		props.className,
		'stk-block-column',
		'stk-block-column--v2',
		columnClass,
		responsiveClass,
	], props ) )

	const contentClassNames = classnames( [
		columnWrapperClass,
		'stk-block-column__content',
	] )

	const innerClassNames = classnames( applyFilters( 'stackable.column.save.innerClassNames', [
		blockAlignmentClass,
		'stk-block-content',
		'stk-inner-blocks',
		`stk-${ attributes.uniqueId }-inner-blocks`,
	], props ) )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<BlockStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			<ContainerDiv.Content
				className={ contentClassNames }
				attributes={ attributes }
			>
				<div className={ innerClassNames }>
					<InnerBlocks.Content />
				</div>
				<BlockLink.Content attributes={ attributes } />
			</ContainerDiv.Content>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
