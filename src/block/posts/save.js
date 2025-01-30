/**
 * Internal dependencies
 */
import { generateRenderPostItem } from './util'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { withVersion } from '~stackable/higher-order'
import { version as VERSION } from 'stackable'
import {
	BlockDiv,
	CustomCSS,
	getResponsiveClasses,
	getAlignmentClasses,
	getContentAlignmentClasses,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { InnerBlocks } from '@wordpress/block-editor'

export const Save = props => {
	const {
		version,
		className,
		attributes,
	} = props

	const responsiveClass = getResponsiveClasses( props.attributes )
	const blockAlignmentClasses = getAlignmentClasses( props.attributes )

	const wrapperClassNames = classnames(
		'stk-inner-blocks',
		getContentAlignmentClasses( attributes ),
	)

	const blockClassNames = classnames( [
		className,
		'stk-block-posts',
		responsiveClass,
		blockAlignmentClasses,
	], {
		'stk--has-container': attributes.hasContainer,
	} )

	const contentClassNames = classnames( [
		'stk-block-posts__items',
	] )

	const innerClassNames = classnames( [
		'stk-inner-blocks',
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
			version={ props.version }
			data-v={ props.attributes.version }
		>
			{ attributes.generatedCss && <style>{ attributes.generatedCss }</style> }
			<CustomCSS.Content attributes={ attributes } />
			<div className={ wrapperClassNames }>
				<div className={ contentClassNames }>
					{ generateRenderPostItem.save( {
						...attributes,
						className: className || attributes.className,
					}, version ) }
				</div>
				<div className={ innerClassNames }>
					<InnerBlocks.Content />
				</div>
			</div>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
