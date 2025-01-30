/**
 * Internal dependencies
 */
import TableOfContentsList from './table-of-contents-list'
import { linearToNestedHeadingList } from './util'
import {
	getResponsiveClasses, BlockDiv, CustomCSS, getTypographyClasses, getAlignmentClasses, Typography,
} from '~stackable/block-components'
import { withVersion } from '~stackable/higher-order'

/**
 * External dependencies
 */

import { isEmpty } from 'lodash'
import { version as VERSION } from 'stackable'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { compose } from '@wordpress/compose'
import { applyFilters } from '@wordpress/hooks'

export const Save = props => {
	const {
		attributes,
		className,
	} = props

	const responsiveClass = getResponsiveClasses( attributes )
	const textClasses = getTypographyClasses( attributes )
	const blockAlignmentClass = getAlignmentClasses( attributes )
	const { headings } = attributes

	const titleTextClasses = getTypographyClasses( attributes, 'title%s' )

	const { listType } = attributes
	const tagName = isEmpty( listType ) || listType === 'unordered' || listType === 'none' ? 'ul' : 'ol'

	const blockClassNames = classnames( applyFilters( 'stackable.table-of-contents.save.blockClasses', [
		className,
		'stk-block-table-of-contents',
		blockAlignmentClass,
		responsiveClass,
	], textClasses, props ) )

	const tableOfContentsClassNames = applyFilters( 'stackable.table-of-contents.save.tableOfContentsClasses', classnames( [
		'stk-table-of-contents__table',
		textClasses,
	] ), props )

	const titleClassNames = classnames( [
		'stk-table-of-contents__title',
		titleTextClasses,
	] )

	const allowedLevels = [ 1, 2, 3, 4, 5, 6 ].filter(
		n => attributes[ `includeH${ n }` ]
	)
	const filteredHeadlingList = headings.filter( heading => allowedLevels.includes( heading.tag ) )

	const nestedHeadingList = linearToNestedHeadingList( filteredHeadlingList )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
			version={ props.version }
		>
			{ attributes.generatedCss && <style>{ attributes.generatedCss }</style> }
			<CustomCSS.Content attributes={ attributes } />
			{ attributes.titleShow && <Typography.Content
				className={ titleClassNames }
				attrNameTemplate="title%s"
				attributes={ attributes }
			/> }
			<TableOfContentsList.Content
				className={ tableOfContentsClassNames }
				nestedHeadingList={ nestedHeadingList }
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
