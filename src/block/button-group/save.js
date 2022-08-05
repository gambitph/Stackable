/**
 * Internal dependencies
 */
import { ButtonGroupStyles } from './style'

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
} from '~stackable/block-components'
import { applyFilters } from '@wordpress/hooks'

export const Save = props => {
	const {
		attributes,
	} = props

	const {
		flexWrap = '',
		collapseOn = '',
	} = attributes

	const rowClass = getRowClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const responsiveClass = getResponsiveClasses( props.attributes )
	const flexWrapClass = flexWrap ? 'stk-block-button-group--flex-wrap' : flexWrap

	const blockClassName = classnames(
		applyFilters( 'stackable.buttonGroup.save.blockClassNames', [
			props.className,
			'stk-block-button-group',
			responsiveClass,
			flexWrapClass,
		],
		props
		)
	 )

	const contentClassNames = classnames( [
		rowClass,
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
		'stk-button-group',
		{
			[ `stk--collapse-on-${ collapseOn }` ]: collapseOn,
		},
	] )

	return (
		<BlockDiv.Content
			className={ blockClassName }
			attributes={ attributes }
		>
			<ButtonGroupStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			<div className={ contentClassNames }>
				<InnerBlocks.Content />
			</div>
		</BlockDiv.Content>
	)
}

export default withVersion( VERSION )( Save )
