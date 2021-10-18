/**
 * External dependencies
 */
import { compact } from 'lodash'
import classnames from 'classnames'
import {
	Image,
	ContainerDiv,
	Typography,
	getTypographyClasses,
} from '~stackable/block-components'
import { getBlockStyle } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

/**
 * Internal dependencies
 */
import variations from '../variations'

export const generateRenderPostItem = attributes => {
	const {
		imageHasLink = true,
		className = '',
		authorShow = true,
		dateShow = true,
		commentsShow = true,
		imageShow = true,
		categoryShow = true,
		titleShow = true,
		metaShow = true,
		excerptShow = true,
		readmoreShow = true,
		contentOrder = [],
	} = attributes

	const style = getBlockStyle( variations, className )

	const itemClassNames = classnames( [
		'stk-block-posts__item',
	] )

	const titleClassNames = classnames(
		'stk-block-posts__title',
		getTypographyClasses( attributes, 'title%s' )
	)

	const categoryClassNames = classnames(
		'stk-block-posts__category',
		'stk-subtitle',
		getTypographyClasses( attributes, 'category%s' )
	)

	const excerptClassNames = classnames(
		'stk-block-posts__excerpt',
		getTypographyClasses( attributes, 'excerpt%s' )
	)

	const metaClassNames = classnames(
		'stk-block-posts__meta',
		'stk-subtitle',
		getTypographyClasses( attributes, 'meta%s' )
	)

	const readmoreClassNames = classnames(
		'stk-block-posts__readmore',
		getTypographyClasses( attributes, 'readmore%s' )
	)

	let featuredImage = <Image.Content />
	if ( imageHasLink ) {
		featuredImage = <a href="!#postLink!#" className="stk-block-posts__image-link">{ featuredImage }</a>
	}

	const title = (
		<Typography.Content
			defaultTag="h3"
			attrNameTemplate="title%s"
			className={ titleClassNames }
			value="<a href='!#postLink!#'>!#title!#</a>"
		/>
	)

	const category = (
		<Typography.Content
			tagName="div"
			attrNameTemplate="category%s"
			className={ categoryClassNames }
			value="!#category!#"
		/>
	)

	const separator = <span className="stk-block-posts__meta-sep">!#metaSeparator!#</span>
	const author = <span>!#authorName!#</span>
	const date = (
		<time dateTime="!#dateTime!#" >
			!#date!#
		</time>
	)
	const comments = <span>!#commentsNum!#</span>

	// Trim the excerpt.
	const excerpt = (
		<div
			className={ excerptClassNames }
			dangerouslySetInnerHTML={ { __html: '!#excerpt!#' } }
		/>
	)

	const readmore = (
		<Typography.Content
			tagName="a"
			href="!#postLink!#"
			attrNameTemplate="readmore%s"
			className={ readmoreClassNames }
			value="!#readmoreText!#"
		/>
	)

	const meta = ( authorShow || dateShow || commentsShow ) && (
		<aside className={ metaClassNames }>
			{ authorShow && author }
			{ authorShow && author && ( ( dateShow && date ) || ( commentsShow && comments ) ) && separator }
			{ dateShow && date }
			{ ( ( authorShow && author ) || ( dateShow && date ) ) && commentsShow && comments && separator }
			{ commentsShow && comments }
		</aside>
	)

	const contentFactory = {
		'featured-image': imageShow && featuredImage,
		title: titleShow && title,
		category: categoryShow && category,
		meta: metaShow && meta,
		excerpt: excerptShow && excerpt,
		readmore: readmoreShow && readmore,
	}

	const contents = contentOrder.map( key => {
		const comp = contentFactory[ key ]
		return comp
	} )

	let output = (
		<article>
			{ compact( contents ).map( content => content ) }
		</article>
	)

	output = applyFilters(
		'stackable.posts.save.item.output',
		output,
		style?.name,
		attributes,
		{
			...contentFactory,
		}
	)

	return (
		<>
			{ '<!–- /stk-start:posts/template –->' }
			<div className={ itemClassNames }>
				<ContainerDiv.Content attributes={ attributes }>
					{ output }
				</ContainerDiv.Content>
			</div>
			{ '<!–- /stk-end:post/template –->' }
		</>
	)
}
