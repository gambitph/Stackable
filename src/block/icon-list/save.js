/**
 * Internal dependencies
 */
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

	const wrapList = ! attributes.listFullWidth && attributes.listDisplayStyle !== 'grid'
	const TagName = attributes.ordered ? 'ol' : 'ul'
	const ParentTagName = wrapList ? 'div' : TagName

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
			{ attributes.generatedCss && <style>{ attributes.generatedCss }</style> }
			<CustomCSS.Content attributes={ attributes } />
			{ ! attributes.ordered && <IconSvgDef icon={ attributes.icon } uniqueId={ attributes.uniqueId } /> }
			<ParentTagName className={ tagNameClassNames } >
				{ wrapList &&
					<TagName className="stk-block-icon-list__group">
						<InnerBlocks.Content />
					</TagName>
				}
				{ ! wrapList && <InnerBlocks.Content /> }
			</ParentTagName>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
