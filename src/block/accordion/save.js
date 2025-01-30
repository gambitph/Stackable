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

	const blockClassNames = classnames( [
		props.className,
		'stk-block-accordion',
		responsiveClass,
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
	], {
		'stk--is-open': attributes.startOpen,
		'stk--single-open': attributes.onlyOnePanelOpen,
	} )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
			open={ attributes.startOpen || undefined }
			version={ props.version }
		>
			{ attributes.generatedCss && <style>{ attributes.generatedCss }</style> }
			<CustomCSS.Content attributes={ attributes } />
			<InnerBlocks.Content />
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
