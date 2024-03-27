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
import { applyFilters } from '@wordpress/hooks'
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
			version={ props.version }
			data-nofullscreen={ attributes.videoFullscreen ? null : '' }
			data-nodownload={ attributes.videoDownload ? null : '' }
			data-loop={ attributes.videoLoop ? '' : null }
		>
			<IconLabelStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			{ applyFilters( 'stackable.video-popup.save.div.content', (
				<div
					className={ contentClassNames }
					aria-label={ attributes.ariaLabel || __( 'Play Video', i18n ) }
					tabIndex="0"
					role="button"
				>
					<InnerBlocks.Content />
				</div>
			), props, contentClassNames ) }

		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
