/**
 * Internal dependencies
 */
import { TableOfContentsStyles } from './style'
import TableOfContentsList from './table-of-contents-list'
import { linearToNestedHeadingList } from './util'
import {
	getResponsiveClasses, BlockDiv, CustomCSS, getTypographyClasses, getAlignmentClasses,
} from '~stackable/block-components'
import { withVersion } from '~stackable/higher-order'

/**
 * External dependencies
 */
import { version as VERSION } from 'stackable'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { compose } from '@wordpress/compose'

export const Save = props => {
	const {
		attributes,
		className,
	} = props

	const responsiveClass = getResponsiveClasses( attributes )
	const textClasses = getTypographyClasses( attributes )
	const blockAlignmentClass = getAlignmentClasses( attributes )
	const {
		headings, isSmoothScroll,
	} = attributes

	const tagName = attributes.ordered ? 'ol' : 'ul'

	const blockClassNames = classnames( [
		className,
		'stk-block-table-of-contents',
		blockAlignmentClass,
		responsiveClass,
		textClasses,
	] )

	const allowedLevels = [ 1, 2, 3, 4, 5, 6 ].filter(
		n => attributes[ `includeH${ n }` ]
	)
	const filteredHeadlingList = headings.filter( heading => allowedLevels.includes( heading.level ) )

	const nestedHeadingList = linearToNestedHeadingList( filteredHeadlingList )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<TableOfContentsStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			<TableOfContentsList.Content
				nestedHeadingList={ nestedHeadingList }
				isSmoothScroll={ isSmoothScroll }
				listTag={ tagName }
				h1={ attributes.includeH1 }
				h2={ attributes.includeH2 }
				h3={ attributes.includeH3 }
				h4={ attributes.includeH4 }
				h5={ attributes.includeH5 }
				h6={ attributes.includeH6 }
			 />
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
