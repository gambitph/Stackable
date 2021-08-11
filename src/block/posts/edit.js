/**
 * Internal dependencies
 */
import { PostsStyles } from './style'
import {
	generateRenderPostItem, CONTENTS,
} from './util'
import { blockStyles } from './block-styles'

/**
 * External dependencies
 */
import {
	pickBy, isEmpty, isUndefined, uniqBy,
} from 'lodash'
import classnames from 'classnames'
import { version as VERSION, i18n } from 'stackable'
import {
	InspectorTabs,
	InspectorStyleControls,
	PanelAdvancedSettings,
	AdvancedRangeControl,
	AdvancedSelectControl,
	SortControl,
	TaxonomyControl,
	AdvancedToggleControl,
} from '~stackable/components'
import {
	useBlockHoverClass, useBlockStyle,
} from '~stackable/hooks'
import {
	getAlignmentClasses,
	BlockDiv,
	Image,
	Alignment,
	Advanced,
	CustomCSS,
	Responsive,
	ContainerDiv,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	BlockStyle,
	Typography,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data'
import { Placeholder, Spinner } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { InnerBlocks } from '@wordpress/block-editor'

const Edit = props => {
	const {
		attributes,
		className,
		setAttributes,
	} = props

	const {
		metaShow = true,
		excerptShow = true,
		showPagination,
		postOffset,
		postExclude,
		postInclude,
		postType = 'post',
		numberOfItems = 6,
		orderBy = 'date',
		order = 'desc',
		taxonomyType = 'category',
		taxonomy = '',
		taxonomyFilterType = '__in',
		contentOrder = [
			'title',
			'meta',
			'category',
			'excerpt',
		],
	} = attributes

	const blockHoverClass = useBlockHoverClass()
	const blockAlignmentClass = getAlignmentClasses( attributes )
	const blockStyle = useBlockStyle( blockStyles )

	const {
		posts, isRequesting, hasPosts,
	} = useSelect( select => {
		const { getEntityRecords } = select( 'core' )
		const { isResolving } = select( 'core/data' )

		const postQuery = pickBy( {
			...applyFilters( 'stackable.posts.postQuery', {
				order,
				orderby: orderBy,
				per_page: numberOfItems, // eslint-disable-line camelcase
			}, attributes ),
		}, value => {
			// Exludes and includes can be empty.
			if ( Array.isArray( value ) ) {
				return ! isEmpty( value )
			}
			// Don't include empty values.
			return ! isUndefined( value ) && value !== ''
		} )

		if ( taxonomy && taxonomyType ) {
			// Categories.
			if ( taxonomyType === 'category' ) {
				postQuery[ taxonomyFilterType === '__in' ? 'categories' : 'categories_exclude' ] = taxonomy
				// Tags.
			} else if ( taxonomyType === 'post_tag' ) {
				postQuery[ taxonomyFilterType === '__in' ? 'tags' : 'tags_exclude' ] = taxonomy
				// Custom taxonomies.
			} else {
				postQuery[ taxonomyFilterType === '__in' ? taxonomyType : `${ taxonomyType }_exclude` ] = taxonomy
			}
		}

		let posts = getEntityRecords( 'postType', postType, postQuery )
		posts = ! Array.isArray( posts ) ? posts : uniqBy( posts, 'id' )

		return {
			posts,
			hasPosts: Array.isArray( posts ) && posts.length,
			isRequesting: isResolving( 'core', 'getEntityRecords', [
				'postType',
				postType,
				postQuery,
			] ),
		}
	}, [
		postType,
		orderBy,
		order,
		taxonomyType,
		taxonomy,
		taxonomyFilterType,
		postOffset,
		postExclude,
		postInclude,
		numberOfItems,
		showPagination,
	] )

	const blockClassNames = classnames( [
		className,
		'stk-block-posts',
		blockHoverClass,
		blockAlignmentClass,
	] )

	const contentClassNames = classnames( [
		'stk-block-posts__items',
	] )

	const innerClassNames = classnames( [
		'stk-inner-blocks',
	] )

	const contentOrderOptions = contentOrder.map( value => CONTENTS.find( content => content.value === value )?.label )

	return (
		<>
			<InspectorTabs />

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<BlockStyle.InspectorControls styles={ blockStyles } />
			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'General' ) }
					id="general"
				>
					<AdvancedRangeControl
						label={ __( 'Columns', i18n ) }
						attribute="columns"
						responsive="all"
						min={ 1 }
						sliderMax={ 4 }
						placeholder="2"
					/>
					<AdvancedRangeControl
						label={ __( 'Column Gap', i18n ) }
						allowRest={ true }
						attribute="columnGap"
						min="0"
						placeholder=""
						sliderMax="50"
						responsive="all"
					/>
					<AdvancedRangeControl
						label={ __( 'Row Gap', i18n ) }
						allowRest={ true }
						attribute="rowGap"
						min="0"
						sliderMax="50"
						responsive="all"
						placeholder=""
					/>
					<SortControl
						label={ __( 'Content Arrangement', i18n ) }
						axis="y"
						values={ contentOrderOptions }
						num={ CONTENTS.length }
						onChange={ order => {
							setAttributes( { contentOrder: order.map( label => CONTENTS.find( content => content.label === label )?.value ) } )
						} }
					/>
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					title={ __( 'Query', i18n ) }
					id="query"
				>
					<AdvancedRangeControl
						label={ __( 'Number of items', i18n ) }
						min={ 1 }
						max={ 100 }
						allowReset={ true }
						attribute="numberOfItems"
						placeholder="6"
						default={ 6 }
					/>
					<AdvancedSelectControl
						label={ __( 'Order by', i18n ) }
						options={ [
							{ label: __( 'Newest to Oldest', i18n ), value: 'date,desc' },
							{ label: __( 'Oldest to Newest', i18n ), value: 'date,asc' },
							{ label: __( 'A → Z', i18n ), value: 'title,asc' },
							{ label: __( 'Z → A', i18n ), value: 'title,desc' },
							{ label: __( 'Last Modified to Oldest', i18n ), value: 'modified,desc' },
							{ label: __( 'Oldest Modified to Last', i18n ), value: 'modified,asc' },
							{ label: __( 'Menu Order', i18n ), value: 'menu_order,asc' },
							{ label: __( 'Random', i18n ), value: 'rand,desc' },
						] }
						value={ `${ orderBy },${ order }` }
						onChange={ value => {
							const [ orderBy, order ] = value.split( ',' )
							setAttributes( {
								orderBy,
								order,
							} )
						} }
						default="date,desc"
					/>
					<TaxonomyControl
						allowReset={ true }
						postType={ postType }
						onChangePostType={ postType => setAttributes( { postType } ) }
						taxonomyType={ taxonomyType }
						onChangeTaxonomyType={ taxonomyType => setAttributes( { taxonomyType } ) }
						taxonomy={ taxonomy }
						onChangeTaxonomy={ taxonomy => setAttributes( { taxonomy } ) }
						taxonomyFilterType={ taxonomyFilterType }
						onChangeTaxonomyFilterType={ taxonomyFilterType => setAttributes( { taxonomyFilterType } ) }
					/>
					{ applyFilters( 'stackable.posts.edit.inspector.style.query', null ) }
				</PanelAdvancedSettings>
			</InspectorStyleControls>
			<Image.InspectorControls
				hasHeight={ ! [ 'portfolio' ].includes( blockStyle ) }
				label={ __( 'Featured Image', i18n ) }
				hasShape={ false }
				hasWidth={ false }
				hasSelector={ false }
				hasAlt={ false }
				hasToggle={ true }
			/>
			<Typography.InspectorControls
				label={ __( 'Title', i18n ) }
				hasToggle={ true }
				attrNameTemplate="title%s"
				hasTextContent={ false }
				hasAlign={ true }
				initialOpen={ false }
			/>
			<Typography.InspectorControls
				label={ __( 'Category', i18n ) }
				hasToggle={ true }
				attrNameTemplate="category%s"
				hasTextContent={ false }
				hasAlign={ true }
				hasTextTag={ false }
				initialOpen={ false }
			/>
			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'Excerpt', i18n ) }
					id="excerpt"
					checked={ excerptShow }
					onChange={ excerptShow => setAttributes( { excerptShow } ) }
				>
					<AdvancedRangeControl
						label={ __( 'Excerpt Length', i18n ) }
						attribute="excerptLength"
						placeholder="55"
						min={ 1 }
						sliderMax={ 100 }
					/>
					<Typography.InspectorControls.Controls
						attrNameTemplate="excerpt%s"
						hasTextTag={ false }
						hasTextContent={ false }
						hasAlign={ true }
					/>
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					title={ __( 'Meta', i18n ) }
					checked={ metaShow }
					onChange={ metaShow => setAttributes( { metaShow } ) }
					id="meta"
				>
					<AdvancedToggleControl
						label={ __( 'Show Author', i18n ) }
						attribute="authorShow"
					/>
					<AdvancedToggleControl
						label={ __( 'Show Date', i18n ) }
						attribute="dateShow"
					/>
					<AdvancedToggleControl
						label={ __( 'Show Comments', i18n ) }
						attribute="commentsShow"
					/>
					<AdvancedSelectControl
						label={ __( 'Separator', i18n ) }
						options={ [
							{ label: __( 'Default (Dot)', i18n ), value: '' },
							{ label: __( 'Space', i18n ), value: 'space' },
							{ label: __( 'Comma', i18n ), value: 'comma' },
							{ label: __( 'Dash', i18n ), value: 'dash' },
							{ label: __( 'Pipe', i18n ), value: 'pipe' },
						] }
						attribute="metaSeparator"
					/>
					<Typography.InspectorControls.Controls
						attrNameTemplate="meta%s"
						hasTextTag={ false }
						hasTextContent={ false }
						hasAlign={ true }
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>
			<Typography.InspectorControls
				label={ __( 'Read More Link', i18n ) }
				attrNameTemplate="readmore%s"
				hasTextTag={ false }
				initialOpen={ false }
				hasToggle={ true }
				hasAlign={ true }
			/>
			<ContainerDiv.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-posts" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<PostsStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-posts" />

			{ ( isRequesting || ! hasPosts ) ? (
				<Placeholder
					icon="admin-post"
					label={ __( 'Posts', i18n ) }
				>
					{ ( ! Array.isArray( posts ) || isRequesting ) ? (
						<Spinner />
					) : (
						__( 'No posts found.', i18n )
					) }
				</Placeholder>
			) : (
				<BlockDiv className={ blockClassNames }>
					<div className={ contentClassNames }>
						{ ( posts || [] ).map( generateRenderPostItem( attributes ) ) }
					</div>
					<div className={ innerClassNames }>
						<InnerBlocks />
					</div>
				</BlockDiv>
			) }
		</>
	)
}

export default Edit
