/**
 * Internal dependencies
 */
import { IconLabelStyles } from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { withVersion } from '~stackable/higher-order'
import { i18n, version as VERSION } from 'stackable'
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
import { __ } from '@wordpress/i18n'

export const Save = props => {
	const {
		attributes, className,
	} = props

	const rowClass = getRowClasses( attributes )
	const blockAlignmentClass = getAlignmentClasses( attributes )
	const responsiveClass = getResponsiveClasses( attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-video-popup',
		responsiveClass,
	] )

	const contentClassNames = classnames( [
		'stk-block-video-popup__overlay',
		rowClass,
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
		'stk-hover-parent',
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
			data-video={ attributes.videoLink }
		>
			<IconLabelStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			<button className={ contentClassNames } aria-label={ __( 'Play Video', i18n ) }>
				<InnerBlocks.Content />
			</button>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
