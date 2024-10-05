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
	getResponsiveClasses,
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

	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const responsiveClass = getResponsiveClasses( props.attributes )

	const blockClassNames = classnames( [
		props.className,
		'stk-block-pricing-box',
		responsiveClass,
	] )

	const contentClassNames = classnames( [
		'stk-block-pricing-box__content',
	], getContentAlignmentClasses( attributes ) )

	const innerClassNames = classnames( applyFilters( 'stackable.pricing-box.save.innerClassNames',
		[
			'stk-block-content',
			'stk-inner-blocks',
			blockAlignmentClass,
			`stk-${ attributes.uniqueId }-inner-blocks`,
		],
		props
	) )

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
