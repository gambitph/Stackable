/**
 * Internal dependencies
 */
import { TableOfContentsStyles } from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import {
	getResponsiveClasses, BlockDiv, CustomCSS, getTypographyClasses, getAlignmentClasses,
} from '~stackable/block-components'
import { withVersion } from '~stackable/higher-order'
import { version as VERSION } from 'stackable'
import TableOfContentsList from './table-of-contents-list'
import { linearToNestedHeadingList } from './util'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'

export const Save = props => {
	const {
		attributes,
		className,
	} = props

	const responsiveClass = getResponsiveClasses( attributes )
	const textClasses = getTypographyClasses( attributes )
	const blockAlignmentClass = getAlignmentClasses( attributes )
	const { headings } = attributes

	const tagName = attributes.ordered ? 'ol' : 'ul'

	const blockClassNames = classnames( [
		className,
		'stk-block-table-of-contents',
		blockAlignmentClass,
		responsiveClass,
		textClasses,
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<TableOfContentsStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			<div className="stk-table-of-contents__title">Table of Contents</div>
			<TableOfContentsList.Content
				nestedHeadingList={ linearToNestedHeadingList( headings ) }
				listTag={ tagName }
			 />
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
