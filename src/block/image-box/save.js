/**
 * External dependencies
 */
import classnames from 'classnames'
import { withVersion } from '~stackable/higher-order'
import { version as VERSION } from 'stackable'
import {
	BlockDiv,
	BlockLink,
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

export const Save = props => {
	const {
		attributes,
	} = props

	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const responsiveClass = getResponsiveClasses( props.attributes )
	const rowClass = getRowClasses( props.attributes )

	const blockClassNames = classnames( [
		props.className,
		'stk-block-image-box',
		responsiveClass,
		'stk-hover-parent', // Hover parent here to make sure the effect shows even with a block link.
	] )

	const contentClassNames = classnames( [
		'stk-block-content',
		'stk-inner-blocks',
		blockAlignmentClass,
		rowClass,
		'stk-block-image-box__content',
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
			version={ props.version }
		>
			{ attributes.generatedCss && <style>{ attributes.generatedCss }</style> }
			<CustomCSS.Content attributes={ attributes } />
			<div className={ contentClassNames }>
				<InnerBlocks.Content />
			</div>
			<BlockLink.Content attributes={ attributes } isHidden={ false } />
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
