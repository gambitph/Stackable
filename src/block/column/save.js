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
	getColumnClasses,
	getResponsiveClasses,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { compose } from '@wordpress/compose'
import { BlockLink } from '~stackable/block-components/block-link'

export const Save = props => {
	const {
		attributes,
	} = props

	const [ columnClass, columnWrapperClass ] = getColumnClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const responsiveClass = getResponsiveClasses( props.attributes )

	const blockClassNames = classnames( [
		props.className,
		'stk-block-column',
		columnClass,
		responsiveClass,
	] )

	const contentClassNames = classnames( [
		'stk-block-content',
		'stk-inner-blocks',
		columnWrapperClass,
		blockAlignmentClass,
		'stk-column__content',
		'stk-hover-parent',
		`stk-${ attributes.uniqueId }-container`,
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<BlockStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			<div className={ contentClassNames }>
				<InnerBlocks.Content />
				<BlockLink.Content attributes={ attributes } />
			</div>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
