import './designs'
import {
	AlignmentToolbar, BlockControls, InspectorControls, PanelColorSettings,
} from '@wordpress/block-editor'
import { Component, Fragment } from '@wordpress/element'
import { dateI18n, format } from '@wordpress/date'
import { DesignPanelBody, ProControl, ProControlButton } from '@stackable/components/'
import { isUndefined, pickBy } from 'lodash'
import {
	PanelBody, Placeholder, QueryControls, RangeControl, SelectControl, Spinner, TextControl, ToggleControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { addQueryArgs } from '@wordpress/url'
import apiFetch from '@wordpress/api-fetch'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { decodeEntities } from '@wordpress/htmlEntities'
import ImageDesignBasic from './images/basic.png'
import ImageDesignList from './images/list.png'
import { showProNotice } from 'stackable'
import { withSelect } from '@wordpress/data'

const featuredImageShapes = [
	{ value: 'full', label: __( 'Full-sized' ) },
	{ value: 'square', label: __( 'Square' ) },
	{ value: 'landscape', label: __( 'Landscape' ) },
	{ value: 'portrait', label: __( 'Portrait' ) },
]

const CATEGORIES_LIST_QUERY = {
	per_page: -1, // eslint-disable-line camelcase
}

class Edit extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			categoriesList: [],
		}
	}

	componentWillMount() {
		this.isStillMounted = true
		this.fetchRequest = apiFetch( {
			path: addQueryArgs( `/wp/v2/categories`, CATEGORIES_LIST_QUERY ),
		} ).then(
			categoriesList => {
				if ( this.isStillMounted ) {
					this.setState( { categoriesList } )
				}
			}
		).catch(
			() => {
				if ( this.isStillMounted ) {
					this.setState( { categoriesList: [] } )
				}
			}
		)
	}

	componentWillUnmount() {
		this.isStillMounted = false
	}

	render() {
		// export const _edit = props => {
		const {
			attributes, setAttributes, latestPosts, className,
		} = this.props
		const { categoriesList } = this.state
		const {
			contentAlign = '',
			columns = 2,
			order = 'desc',
			orderBy = 'date',
			categories = '',
			postsToShow = 6,
			displayFeaturedImage = true,
			featuredImageShape = 'landscape',
			displayTitle = true,
			displayCategory = true,
			displayComments = true,
			displayAuthor = true,
			displayDate = true,
			displayExcerpt = true,
			displayReadMoreLink = false,
			readMoreText = '',
			design = 'basic',
			borderRadius = 12,
			shadow = 3,
			accentColor = '',
		} = attributes

		const hasPosts = Array.isArray( latestPosts ) && latestPosts.length
		const mainClasses = classnames( [
			className,
			'ugb-blog-posts',
			`ugb-blog-posts--columns-${ columns }`,
			`ugb-blog-posts--feature-image-shape-${ featuredImageShape }`,
			`ugb-blog-posts--design-${ design }`,
		], applyFilters( 'stackable.blog-posts.mainclasses', {
			[ `ugb-blog-posts--align-${ contentAlign }` ]: contentAlign,
		}, design, this.props ) )

		const mainStyles = {
			'--s-accent-color': accentColor ? accentColor : undefined,
		}

		const featuredImageClasses = classnames( [
			'ugb-blog-posts__featured-image',
		], {
			[ `ugb--shadow-${ shadow }` ]: shadow !== '',
		} )

		const featuredImageStyle = {
			borderRadius: borderRadius !== '' ? borderRadius : undefined,
		}

		const show = applyFilters( 'stackable.blog-posts.edit.show', {
			featuredImage: true,
		}, design, this.props )

		const inspectorControls = (
			<InspectorControls>
				<DesignPanelBody
					initialOpen={ true }
					selected={ design }
					options={ applyFilters( 'stackable.blog-posts.edit.designs', [
						{
							label: 'Basic', value: 'basic', image: ImageDesignBasic,
						},
						{
							label: 'List', value: 'list', image: ImageDesignList,
						},
					] ) }
					onChange={ design => {
						setAttributes( { design } )
					} }
				>
					{ applyFilters( 'stackable.blog-posts.edit.designs.before', null, this.props ) }
					<RangeControl
						label={ __( 'Border Radius' ) }
						value={ borderRadius }
						onChange={ borderRadius => setAttributes( { borderRadius } ) }
						min={ 0 }
						max={ 50 }
					/>
					<RangeControl
						label={ __( 'Shadow / Outline' ) }
						value={ shadow }
						onChange={ shadow => setAttributes( { shadow } ) }
						min={ 0 }
						max={ 9 }
					/>
					{ applyFilters( 'stackable.blog-posts.edit.designs.after', null, this.props ) }
					{ showProNotice && <ProControlButton /> }
				</DesignPanelBody>
				<PanelBody title={ __( 'Posts Settings' ) }>
					<QueryControls
						{ ...{ order, orderBy } }
						numberOfItems={ postsToShow }
						categoriesList={ categoriesList }
						selectedCategoryId={ categories }
						onOrderChange={ order => setAttributes( { order } ) }
						onOrderByChange={ orderBy => setAttributes( { orderBy } ) }
						onCategoryChange={ value => setAttributes( { categories: '' !== value ? value : undefined } ) }
						onNumberOfItemsChange={ postsToShow => setAttributes( { postsToShow } ) }
					/>
					<RangeControl
						label={ __( 'Columns' ) }
						value={ columns }
						onChange={ columns => setAttributes( { columns } ) }
						min={ 1 }
						max={ 4 }
					/>
					<ToggleControl
						label={ __( 'Display Title' ) }
						checked={ displayTitle }
						onChange={ displayTitle => setAttributes( { displayTitle } ) }
					/>
					{ show.featuredImage &&
						<Fragment>
							<ToggleControl
								label={ __( 'Display Featured Image' ) }
								checked={ displayFeaturedImage }
								onChange={ displayFeaturedImage => setAttributes( { displayFeaturedImage } ) }
							/>
							{ displayFeaturedImage &&
							<SelectControl
								label={ __( 'Featured Image Shape' ) }
								options={ featuredImageShapes }
								value={ featuredImageShape }
								onChange={ featuredImageShape => setAttributes( { featuredImageShape } ) }
							/>
							}
						</Fragment>
					}
					<ToggleControl
						label={ __( 'Display Excerpt' ) }
						checked={ displayExcerpt }
						onChange={ displayExcerpt => setAttributes( { displayExcerpt } ) }
					/>
					<ToggleControl
						label={ __( 'Display Category' ) }
						checked={ displayCategory }
						onChange={ displayCategory => setAttributes( { displayCategory } ) }
					/>
					<ToggleControl
						label={ __( 'Display Date' ) }
						checked={ displayDate }
						onChange={ displayDate => setAttributes( { displayDate } ) }
					/>
					<ToggleControl
						label={ __( 'Display Author' ) }
						checked={ displayAuthor }
						onChange={ displayAuthor => setAttributes( { displayAuthor } ) }
					/>
					<ToggleControl
						label={ __( 'Display Comments' ) }
						checked={ displayComments }
						onChange={ displayComments => setAttributes( { displayComments } ) }
					/>
					<ToggleControl
						label={ __( 'Display Continue Reading Link' ) }
						checked={ displayReadMoreLink }
						onChange={ displayReadMoreLink => setAttributes( { displayReadMoreLink } ) }
					/>
					{ displayReadMoreLink &&
					<TextControl
						label={ __( 'Customize Read More Link' ) }
						type="text"
						value={ readMoreText }
						onChange={ readMoreText => setAttributes( { readMoreText } ) }
					/>
					}
				</PanelBody>
				<PanelColorSettings
					initialOpen={ true }
					title={ __( 'Color Settings' ) }
					colorSettings={ [
						{
							value: accentColor,
							onChange: accentColor => setAttributes( { accentColor } ),
							label: __( 'Accent Color' ),
						},
					] }
				></PanelColorSettings>
				{ showProNotice &&
					<PanelBody
						initialOpen={ false }
						title={ __( 'Custom CSS' ) }
					>
						<ProControl
							title={ __( 'Say Hello to Custom CSS 👋' ) }
							description={ __( 'Further tweak this block by adding guided custom CSS rules. This feature is only available on Stackable Premium' ) }
						/>
					</PanelBody>
				}
				{ applyFilters( 'stackable.blog-posts.edit.inspector.after', null, design, this.props ) }
			</InspectorControls>
		)

		if ( ! hasPosts ) {
			return (
				<Fragment>
					{ inspectorControls }
					<Placeholder
						icon="admin-post"
						label={ __( 'Posts' ) }
					>
						{ ! Array.isArray( latestPosts ) ?
							<Spinner /> :
							__( 'No posts found.' )
						}
					</Placeholder>
				</Fragment>
			)
		}

		// Removing posts from display should be instant.
		const displayPosts = latestPosts.length > postsToShow ?
			latestPosts.slice( 0, postsToShow ) :
			latestPosts

		return (
			<Fragment>
				{ inspectorControls }
				<BlockControls>
					<AlignmentToolbar
						value={ contentAlign }
						onChange={ contentAlign => setAttributes( { contentAlign } ) }
					/>
				</BlockControls>
				<div className={ mainClasses } style={ mainStyles }>
					{ applyFilters( 'stackable.blog-posts.edit.output.before', null, design, this.props ) }
					{ displayPosts.map( ( post, i ) => {
						const sizeName = featuredImageShape !== 'full' && columns < 2 ? `${ featuredImageShape }_large` : featuredImageShape
						const featuredImageSrc = ( post.featured_image_urls[ sizeName ] || [] )[ 0 ]

						// Ready the different blog post components.
						const category = displayCategory && post.category_list && (
							<div className="ugb-blog-posts__category-list" dangerouslySetInnerHTML={ { __html: post.category_list } } />
						)
						const featuredImage = displayFeaturedImage && featuredImageSrc && (
							<figure className={ featuredImageClasses } style={ featuredImageStyle }>
								<a href={ post.link } target="_blank">
									<img src={ featuredImageSrc } alt={ __( 'featured' ) } />
								</a>
							</figure>
						)
						const image = featuredImageSrc ? featuredImageSrc : ''
						const author = displayAuthor && post.author_info && (
							<span>{ post.author_info.name }</span>
						)
						const date = displayDate && post.date_gmt && (
							<time dateTime={ format( 'c', post.date_gmt ) } className="date">
								{ dateI18n( 'F d, Y', post.date_gmt ) }
							</time>
						)
						const comments = displayComments && (
							<span>{ post.comments_num }</span>
						)
						const title = displayTitle && (
							<h3 className="ugb-blog-posts__title">
								<a href={ post.link }>{ decodeEntities( post.title.rendered.trim() ) || __( '(Untitled)' ) }</a>
							</h3>
						)
						const excerpt = displayExcerpt && post.excerpt && (
							<div className="ugb-blog-posts__excerpt" dangerouslySetInnerHTML={ { __html: post.post_excerpt_stackable } } />
						)
						const readMore = displayReadMoreLink && (
							<p className="ugb-blog-posts__read_more"><a href={ post.link }>{ readMoreText ? readMoreText : __( 'Continue reading' ) }</a></p>
						)

						const defaultEditDesign = (
							<article key={ i } className="ugb-blog-posts__item">
								{ category }
								{ featuredImage }
								{ ( displayDate || displayAuthor || displayComments ) &&
								<aside className="entry-meta ugb-blog-posts__meta">
									{ author }
									{ displayAuthor && ( displayDate || displayComments ) &&
										<span className="ugb-blog-posts__sep">&middot;</span>
									}
									{ date }
									{ displayDate && displayComments &&
										<span className="ugb-blog-posts__sep">&middot;</span>
									}
									{ comments }
								</aside>
								}
								{ title }
								{ excerpt }
								{ readMore }
							</article>
						)

						const passedProps = {
							...this.props,
							i,
							image,
							featuredImageSrc,
							category,
							featuredImage,
							author,
							date,
							comments,
							title,
							excerpt,
							readMore,
						}
						return applyFilters( 'stackable.blog-posts.edit.output', defaultEditDesign, design, passedProps )
					} ) }
					{ applyFilters( 'stackable.blog-posts.edit.output.after', null, design, this.props ) }
				</div>
			</Fragment>
		)
	}
}

export default withSelect( ( select, props ) => {
	const {
		postsToShow = 6,
		order = 'desc',
		orderBy = 'date',
		categories = '',
	} = props.attributes
	const { getEntityRecords } = select( 'core' )
	const latestPostsQuery = pickBy( {
		categories,
		order,
		orderby: orderBy,
		per_page: postsToShow, // eslint-disable-line camelcase
	}, value => ! isUndefined( value ) )
	return {
		latestPosts: getEntityRecords( 'postType', 'post', latestPostsQuery ),
	}
} )( Edit )
