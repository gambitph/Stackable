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

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import {
	BlockDiv,
	CustomCSS,
	getAlignmentClasses,
	getResponsiveClasses,
	getRowClasses,
	Separator,
	getSeparatorClasses,
} from '~stackable/block-components'

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
		'stk-block-columns',
		responsiveClass,
		separatorClass,
		'stk-block-columns__inner-container', // `*inner-container` class is required for inner block widths to work properly.
	] )

	const contentClassNames = classnames( [
		rowClass,
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
	], {
		'stk--fit-content': attributes.columnFit,
		alignwide: attributes.contentAlign === 'alignwide', // This will align the columns inside.
		alignfull: attributes.contentAlign === 'alignfull', // This will align the columns inside.
	} )

	return (
		<BlockDiv.Content
			className={ blockClassName }
			attributes={ attributes }
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

export default withVersion( VERSION )( Save )
