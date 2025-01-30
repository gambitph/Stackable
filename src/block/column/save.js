/**
 * External dependencies
 */
import classnames from 'classnames/dedupe'
import { withVersion } from '~stackable/higher-order'
import { version as VERSION } from 'stackable'
import {
	BlockDiv,
	BlockLink,
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
		columnClass,
		responsiveClass,
	], props ) )

	const contentClassNames = classnames( [
		columnWrapperClass,
		'stk-block-column__content',
	] )

	const innerClassNames = applyFilters( 'stackable.column.save.innerClassNames',
		classnames( [
			blockAlignmentClass,
			'stk-block-content',
			'stk-inner-blocks',
			`stk-${ attributes.uniqueId }-inner-blocks`,
			{ 'stk--align-last-block-to-bottom': props.attributes.alignLastBlockToBottom },
		] ),
		props
	)

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
			version={ props.version }
			data-v={ props.attributes.version }
		>
			{ attributes.generatedCss && <style>{ attributes.generatedCss }</style> }
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
