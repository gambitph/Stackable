/**
 * Internal dependencies
 */
import { PostsStyles } from './style'
import {
	generateRenderPostItem, CONTENTS,
} from './util'

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
	SortControl,
} from '~stackable/components'
import {
	useBlockHoverClass,
} from '~stackable/hooks'
import {
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
	Typography,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data'
import { Placeholder, Spinner } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

const Edit = props => {
	const {
		attributes,
		className,
		setAttributes,
	} = props

	const {
		postOffset,
		postExclude,
		postInclude,
		postType = 'post',
		numberOfItems = 6,
		orderBy = 'date',
		order = 'desc',
		taxonomyType = '',
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

	const {
		posts, isRequesting, hasPosts,
	} = useSelect( select => {
		const { getEntityRecords } = select( 'core' )
		const { isResolving } = select( 'core/data' )

		const postQuery = pickBy( {
			order,
			orderby: orderBy,
			per_page: numberOfItems, // eslint-disable-line camelcase
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
	] )

	const blockClassNames = classnames( [
		className,
		'stk-block-posts',
		blockHoverClass,
	] )

	const contentOrderOptions = contentOrder.map( value => CONTENTS.find( content => content.value === value )?.label )

	return (
		<>
			<InspectorTabs />

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'General' ) }
					id="general"
					initialOpen={ true }
				>
					<AdvancedRangeControl
						label={ __( 'Columns', i18n ) }
						attribute="columns"
						responsive="all"
						min={ 1 }
						sliderMax={ 4 }
						default={ 2 }
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
			</InspectorStyleControls>
			<Image.InspectorControls
				hasShape={ false }
				hasWidth={ false }
			/>
			<Typography.InspectorControls
				label={ __( 'Title', i18n ) }
				attrNameTemplate="title%s"
				hasTextContent={ false }
				initialOpen={ false }
				hasToggle={ true }
			/>
			<Typography.InspectorControls
				label={ __( 'Category', i18n ) }
				attrNameTemplate="category%s"
				hasTextTag={ false }
				hasTextContent={ false }
				initialOpen={ false }
				hasToggle={ true }
			/>
			<Typography.InspectorControls
				label={ __( 'Excerpt', i18n ) }
				attrNameTemplate="excerpt%s"
				hasTextTag={ false }
				hasTextContent={ false }
				initialOpen={ false }
				hasToggle={ true }
			/>
			<Typography.InspectorControls
				label={ __( 'Meta', i18n ) }
				attrNameTemplate="meta%s"
				hasTextTag={ false }
				hasTextContent={ false }
				initialOpen={ false }
				hasToggle={ true }
			/>
			<Typography.InspectorControls
				label={ __( 'Read More Link', i18n ) }
				attrNameTemplate="readmore%s"
				hasTextTag={ false }
				initialOpen={ false }
				hasToggle={ true }
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
					{ ( posts || [] ).map( generateRenderPostItem( attributes ) ) }
				</BlockDiv>
			) }
		</>
	)
}

export default Edit
