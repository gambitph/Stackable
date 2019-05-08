import './designs'
import CategorySelect from './category-select';
import CategoriesList from './categories-list';
import {
	AlignmentToolbar, BlockControls, InspectorControls, PanelColorSettings,
} from '@wordpress/editor'
import { dateI18n, format } from '@wordpress/date'
import { DesignPanelBody, ProControl, ProControlButton } from '@stackable/components/'
import { isUndefined, pickBy, get } from 'lodash'
import {
	PanelBody,
	Placeholder,
	QueryControls,
	RangeControl,
	SelectControl,
	Spinner,
	TextControl,
	ToggleControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { decodeEntities } from '@wordpress/htmlEntities'
import { Fragment } from '@wordpress/element'
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

export const _edit = props => {
	const {
		attributes,
		setAttributes,
		latestPosts,
		className,
		terms,
		postTypes,
		postTypeTaxonomies,
	} = props;
	const {
		contentAlign,
		columns,
		order,
		orderBy,
		postsToShow,
		displayFeaturedImage,
		featuredImageShape,
		displayTitle,
		displayTaxonomy,
		displayComments,
		displayAuthor,
		displayDate,
		displayExcerpt,
		displayReadMoreLink,
		readMoreText,
		design,
		borderRadius,
		shadow,
		taxQuery,
		accentColor,
		postType,
	} = attributes;

	const hasPosts = Array.isArray( latestPosts ) && latestPosts.length
	const mainClasses = classnames( [
		className,
		'ugb-blog-posts',
		`ugb-blog-posts--columns-${ columns }`,
		`ugb-blog-posts--feature-image-shape-${ featuredImageShape }`,
		`ugb-blog-posts--design-${ design }`,
	], applyFilters( 'stackable.blog-posts.mainclasses', {
		[ `ugb-blog-posts--align-${ contentAlign }` ]: contentAlign,
	}, design, props ) )

	const mainStyles = {
		'--s-accent-color': accentColor ? accentColor : undefined,
	}

	const featuredImageClasses = classnames( [
		'ugb-blog-posts__featured-image',
	], {
		[ `ugb--shadow-${ shadow }` ]: shadow !== 3,
	} )

	const featuredImageStyle = {
		borderRadius: borderRadius !== 12 ? borderRadius : undefined,
	}

	const show = applyFilters( 'stackable.blog-posts.edit.show', {
		featuredImage: true,
	}, design, props );

	const termEntries = Object.entries( terms );
	const taxonomyEntries = Object.entries( postTypeTaxonomies );

	const displayTaxonomyOptions = [ { label: __( 'None' ), value: '' } ]
		.concat( taxonomyEntries
			.map( ( [ value, { name } ] ) => ( { value, label: name } ) )
	);

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
				{ applyFilters( 'stackable.blog-posts.edit.designs.before', null, props ) }
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
				{ applyFilters( 'stackable.blog-posts.edit.designs.after', null, props ) }
				{ showProNotice && <ProControlButton /> }
			</DesignPanelBody>
			<PanelBody title={ __( 'Posts Settings' ) }>
				<SelectControl
					label={ __( 'Post Type' ) }
					value={ postType }
					options={ postTypes.map( ( { name, slug } ) => ( { value: slug, label: name } ) ) }
					onChange={ postType => {
						setAttributes( {
							postType,
							taxQuery: {},
						} )
					} }
				/>
				{ Array.isArray( termEntries ) && termEntries.map( ( [ taxonomy, terms ] ) => {
					const restBase = get( postTypeTaxonomies, [ taxonomy, 'rest_base' ], '' );
					return Array.isArray( terms ) && <CategorySelect
						label={ get( postTypeTaxonomies, [ taxonomy, 'name' ], '' ) }
						categoriesList={ terms }
						selectedCategoryId={ get( taxQuery, restBase, '' ) }
						noOptionLabel={ __( 'All' ) }
						onChange={ ( term ) => {
							setAttributes( {
								taxQuery: {
									...taxQuery,
									[ restBase ]: term,
								}
							})
						} }
					/>
				} ) }
				<QueryControls
					{ ...{ order, orderBy } }
					numberOfItems={ postsToShow }
					onOrderChange={ order => setAttributes( { order } ) }
					onOrderByChange={ orderBy => setAttributes( { orderBy } ) }
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
				<SelectControl
					label={ __( 'Display Taxonomy' ) }
					options={ displayTaxonomyOptions }
					value={ displayTaxonomy }
					onChange={ displayTaxonomy => setAttributes( { displayTaxonomy: displayTaxonomy === '' ? null : displayTaxonomy } ) }
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
			/>
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
			{ applyFilters( 'stackable.blog-posts.edit.inspector.after', null, design, props ) }
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
				{ applyFilters( 'stackable.blog-posts.edit.output.before', null, design, props ) }
				{ displayPosts.map( ( post, i ) => {
					const sizeName = featuredImageShape !== 'full' && columns < 2 ? `${ featuredImageShape }_large` : featuredImageShape
					const featuredImageSrc = get( post, [ 'featured_image_urls', sizeName, 0 ] );

					// Ready the different blog post components.
					const { terms_list } = post;
					const displayTerms = get( terms_list, displayTaxonomy, [] );
					const taxonomies = displayTerms && (
						<CategoriesList
							terms={ displayTerms }
							separator=", "
						/>
					);
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
							{ taxonomies }
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
						...props,
						i,
						image,
						featuredImageSrc,
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
				{ applyFilters( 'stackable.blog-posts.edit.output.after', null, design, props ) }
			</div>
		</Fragment>
	)
}

const edit = withSelect( ( select, props ) => {
	const {
		postsToShow,
		order,
		orderBy,
		postType,
		taxQuery,
		displayCategory,
	} = props.attributes;
	let { displayTaxonomy } = props.attributes;
	const { getEntityRecords, getPostTypes, getTaxonomies } = select( 'core' );

	const postTypes = getPostTypes() || [];
	const allTaxonomies = getTaxonomies() || [];

	const postTypeTaxonomies = allTaxonomies
		.filter( taxonomy => taxonomy.hierarchical === true
			&& taxonomy.types.includes( postType )
			&& taxonomy.visibility.public === true
		)
		.reduce( ( acc, taxonomy ) => {
			return {
				...acc,
				[ taxonomy.slug ]: {
					name: taxonomy.name,
					rest_base: taxonomy.rest_base
				}
			}
		}, {} );

	const latestPostsQuery = pickBy( {
		...taxQuery,
		order,
		orderby: orderBy,
		per_page: postsToShow, // eslint-disable-line camelcase
	}, value => ! isUndefined( value ) );

	const termsQuery = {
		per_page: 100,
	};

	const postTypeTaxonomiesSlugs = Object.keys( postTypeTaxonomies );
	const terms = {};
	postTypeTaxonomiesSlugs.forEach( slug => {
		terms[ slug ] = getEntityRecords( 'taxonomy', slug, termsQuery );
	});


	if ( displayCategory === true && displayTaxonomy === '' && postTypeTaxonomiesSlugs.includes( 'category' ) ) {
		// Backwards compatibility
		displayTaxonomy = 'category';
	}

	return {
		latestPosts: getEntityRecords( 'postType', postType, latestPostsQuery ),
		postTypes: postTypes.filter( postType => postType.viewable === true && postType.slug !== 'attachment' ),
		terms,
		postTypeTaxonomies,
		attributes: {
			...props.attributes,
			displayTaxonomy,
		}
	}
} )( _edit );

export default edit
