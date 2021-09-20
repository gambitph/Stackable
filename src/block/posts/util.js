/** External dependencies
 */
import striptags from 'striptags'
import { compact } from 'lodash'
import classnames from 'classnames'
import { i18n } from 'stackable'
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
import { dateI18n, format } from '@wordpress/date'
import { decodeEntities } from '@wordpress/html-entities'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

/**
 * Internal dependencies
 */
import variations from './variations'

export const META_SEPARATORS = {
	dot: '·',
	space: ' ',
	comma: ',',
	dash: '—',
	pipe: '|',
}

export const CONTENTS = [
	{
		label: __( 'Featured Image', i18n ),
		value: 'featured-image',
	},
	{
		label: __( 'Title', i18n ),
		value: 'title',
	},
	{
		label: __( 'Meta', i18n ),
		value: 'meta',
	},
	{
		label: __( 'Category', i18n ),
		value: 'category',
	},
	{
		label: __( 'Excerpt', i18n ),
		value: 'excerpt',
	},
	{
		label: __( 'Read More Button', i18n ),
		value: 'readmore',
	},
]

export const generateRenderPostItem = attributes => {
	const {
		className = '',
		categoryHighlighted = false,
		imageSize,
		metaSeparator,
		excerptLength,
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

	return ( post, idx ) => {
		const {
			featured_image_urls: featuredImageUrls,
			title: _title,
			category_list: categoryList,
			author_info: authorInfo,
			date_gmt: dateGmt,
			comments_num: commentsNum,
			post_excerpt_stackable: postExcerptStackable,
		} = post

		const featuredImgSrc = featuredImageUrls?.[ imageSize || 'full' ]?.[ 0 ]

		const enableHeight = ! [ 'portfolio', 'portfolio-2', 'horizontal' ].includes( style?.name )
		const enableWidth = [ 'list', 'horizontal' ].includes( style?.name )

		const featuredImage = !! featuredImgSrc && (
			<Image
				src={ featuredImgSrc }
				alt={ __( 'featured', i18n ) }
				hasRemove={ false }
				enableClickToEdit={ false }
				defaultWidth={ 100 }
				defaultHeight={ 300 }
				enableWidth={ enableWidth }
				widthResizePosition={ style?.name === 'horizontal'
					? 'left'
					: 'right' }
				enableDiagonal={ style?.name === 'list' }
				enableHeight={ enableHeight }
				hasTooltip={ enableHeight }
				heightResizePosition={ style?.name === 'vertical-card-2'
					? 'top'
					: 'bottom'
				}
			/>
		)

		const title = (
			<Typography
				defaultTag="h3"
				attrNameTemplate="title%s"
				className={ titleClassNames }
				value={ decodeEntities( _title.rendered.trim() ) || __( '(Untitled)', i18n ) }
				editable={ false }
			/>
		)

		const category = categoryList && (
			<div className={ categoryClassNames }>
				{ categoryHighlighted ? (
					<a // eslint-disable-line jsx-a11y/anchor-is-valid
						href="#"
						className="stk-button"
					>
						<Typography
							tagName="span"
							className="stk-button__inner-text"
							attrNameTemplate="category%s"
							value={ striptags( categoryList ) }
							editable={ false }
						/>
					</a>
				) : (
					<Typography
						tagName="a"
						attrNameTemplate="category%s"
						value={ striptags( categoryList ) }
						editable={ false }
					/>
				) }
			</div>
		)

		const separator = <span className="stk-block-posts__meta-sep">{ META_SEPARATORS[ metaSeparator || 'dot' ] }</span>
		const author = authorInfo?.name && <span>{ authorInfo.name }</span>
		const date = dateGmt && (
			<time dateTime={ format( 'c', dateGmt ) }>
				{ dateI18n( 'F d, Y', dateGmt ) }
			</time>
		)
		const comments = <span>{ commentsNum }</span>

		// Trim the excerpt.
		let excerptString = postExcerptStackable.split( ' ' )
		if ( excerptString.length > ( excerptLength || 55 ) ) {
			excerptString = excerptString.slice( 0, excerptLength || 55 ).join( ' ' ) + '...'
		} else {
			excerptString = post.postExcerptStackable
		}

		const excerpt = excerptString && (
			<div
				className={ excerptClassNames }
				dangerouslySetInnerHTML={ { __html: excerptString } }
			/>
		)

		const readmore = (
			<Typography
				identifier={ 'read-more-' + idx }
				tagName="a"
				attrNameTemplate="readmore%s"
				className={ readmoreClassNames }
				defaultValue={ __( 'Continue Reading', i18n ) }
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
			'stackable.posts.edit.item.output',
			output,
			style?.name,
			attributes,
			{
				...contentFactory,
			}
		)

		return (
			<ContainerDiv className={ itemClassNames } key={ idx }>
				{ output }
			</ContainerDiv>
		)
	}
}

generateRenderPostItem.save = attributes => {
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
			<ContainerDiv.Content className={ itemClassNames } attributes={ attributes }>
				{ output }
			</ContainerDiv.Content>
			{ '<!–- /stk-end:post/template –->' }
		</>
	)
}
