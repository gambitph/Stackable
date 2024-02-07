/**
 * Internal dependencies
 */
import { IconListStyles } from './style'
import { IconSvgDef } from './util'

/**
 * External dependencies
 */
import classnames from 'classnames'
import {
	getResponsiveClasses, BlockDiv, CustomCSS, getTypographyClasses, getAlignmentClasses,
} from '~stackable/block-components'
import { withVersion } from '~stackable/higher-order'
import { version as VERSION } from 'stackable'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { InnerBlocks } from '@wordpress/block-editor'

export const Save = props => {
	const {
		attributes,
		className,
	} = props

	const responsiveClass = getResponsiveClasses( attributes )
	const textClasses = getTypographyClasses( attributes )
	const blockAlignmentClass = getAlignmentClasses( attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-icon-list',
		blockAlignmentClass,
		responsiveClass,
		textClasses,
	] )
	const tagNameClassNames = classnames( [
		attributes.ordered ? 'stk-block-icon-list__ol' : 'stk-block-icon-list__ul',
		attributes.listDisplayStyle && attributes.listDisplayStyle === 'grid' ? 'stk-block-icon-list--grid' : 'stk-block-icon-list--column',
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
			version={ props.version }
		>
			<IconListStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			{ ! attributes.ordered && <IconSvgDef icon={ attributes.icon } uniqueId={ attributes.uniqueId } /> }
			<div className={ tagNameClassNames } role="list">
				{ !! attributes.listFullWidth &&
					<div className="stk-block-icon-list__group" role="group">
						<InnerBlocks.Content />
					</div> }
				{ ! attributes.listFullWidth && <InnerBlocks.Content /> }
			</div>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
