/**
 * Internal dependencies
 */
import blockStyles from './style'
import { generateRenderPostItem, CONTENTS } from './util'
import variations from './variations'

/**
 * External dependencies
 */
import classnames from 'classnames'
import {
	version as VERSION, i18n, showProNotice,
} from 'stackable'
import { first, isEqual } from 'lodash'
import {
	InspectorTabs,
	PanelAdvancedSettings,
	AdvancedRangeControl,
	AdvancedSelectControl,
	SortControl,
	TaxonomyControl,
	AdvancedToggleControl,
	ColorPaletteControl,
	ImageSizeControl,
	InspectorLayoutControls,
	InspectorStyleControls,
	ControlSeparator,
	ProControlButton,
	useBlockCssGenerator,
} from '~stackable/components'
import {
	useBlockStyle,
	usePostsQuery,
	useBlockAttributesContext,
	useBlockSetAttributesContext,
} from '~stackable/hooks'
import {
	withBlockAttributeContext,
	withBlockWrapperIsHovered,
	withQueryLoopContext,
} from '~stackable/higher-order'
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
	Typography,
	FlexGapControls,
	MarginBottom,
	Transform,
	ContentAlign,
	getContentAlignmentClasses,
} from '~stackable/block-components'
import { getAttrName } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { Placeholder, Spinner } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { applyFilters, addFilter } from '@wordpress/hooks'
import { InnerBlocks, useBlockEditContext } from '@wordpress/block-editor'
import {
	useMemo, useEffect, memo,
} from '@wordpress/element'
import { useSelect } from '@wordpress/data'
import { compose, useInstanceId } from '@wordpress/compose'

const ALLOWED_INNER_BLOCKS = [
	'stackable/load-more',
	'stackable/pagination',
]

export const DEFAULT_ORDER = [
	'title',
	'featured-image',
	'meta',
	'category',
	'excerpt',
	'readmore',
]

const Edit = props => {
	const {
		clientId,
		attributes,
		name,
		className,
		setAttributes,
	} = props

	const {
		stkQueryId,
		imageSize,
		type = 'post',
		orderBy = 'date',
		order = 'desc',
		taxonomyType = 'category',
		taxonomy = '',
		taxonomyFilterType = '__in',
		contentOrder = DEFAULT_ORDER,
		uniqueId,
	} = attributes

	const blockAlignmentClass = getAlignmentClasses( attributes )
	const blockStyle = useBlockStyle( variations )
	const { getActiveBlockVariation } = useSelect( 'core/blocks' )

	const {
		posts, isRequesting, hasPosts,
	} = usePostsQuery( attributes )

	const instanceId = useInstanceId( Edit )

	const wrapperClassNames = classnames(
		'stk-inner-blocks',
		getContentAlignmentClasses( attributes ),
	)

	const blockClassNames = classnames( [
		className,
		'stk-block-posts',
		blockAlignmentClass,
	], {
		'stk--has-container': attributes.hasContainer,
	} )

	const contentClassNames = classnames( [
		'stk-block-posts__items',
	] )

	const innerClassNames = classnames( [
		'stk-inner-blocks',
	] )

	const contentOrderOptions = contentOrder.map( value => CONTENTS.find( content => content.value === value )?.label )

	const focalPointPlaceholder = useMemo( () => first( posts )?.featured_image_urls?.[ imageSize || 'full' ]?.[ 0 ],
		[ posts?.length ]
	)

	const editorPostItems = useMemo( () => {
		return generateRenderPostItem( attributes, { isHovered: props.isHovered } )
	}, [ attributes, props.isHovered ] )

	useEffect( () => {
		// Set a unique instance ID for the posts block.
		// This is used to give unique identifier to our
		// queries.
		if ( stkQueryId !== instanceId ) {
			setAttributes( { stkQueryId: instanceId } )
		}
	}, [ stkQueryId, instanceId ] )

	const activeVariation = getActiveBlockVariation( name, attributes )
	const defaultContentOrder = activeVariation?.attributes?.contentOrder || DEFAULT_ORDER

	// Generate the CSS styles for the block.
	const blockCss = useBlockCssGenerator( {
		attributes: props.attributes,
		blockStyles,
		clientId: props.clientId,
		context: props.context,
		setAttributes: props.setAttributes,
		blockState: props.blockState,
		version: VERSION,
	} )

	return (
		<>
			<InspectorControls
				setAttributes={ setAttributes }
				blockState={ props.blockState }
				contentOrderOptions={ contentOrderOptions }
				contentOrder={ contentOrder }
				DefaultContentOrder={ defaultContentOrder }
				orderBy={ orderBy }
				order={ order }
				type={ type }
				taxonomyType={ taxonomyType }
				taxonomy={ taxonomy }
				taxonomyFilterType={ taxonomyFilterType }
				blockStyle={ blockStyle }
				focalPointPlaceholder={ focalPointPlaceholder }
			/>

			{ blockCss && <style key="block-css">{ blockCss }</style> }
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
				<BlockDiv
					blockHoverClass={ props.blockHoverClass }
					clientId={ props.clientId }
					attributes={ props.attributes }
					className={ blockClassNames }
					enableVariationPicker={ true }
				>
					<div className={ wrapperClassNames } key={ `posts-wrapper-${ clientId }` }>
						<div className={ contentClassNames } key={ `posts-content-${ clientId }` }>
							{ ( posts || [] ).map( editorPostItems ) }
						</div>
						<div className={ innerClassNames } key={ `posts-inner-${ clientId }` }>
							<InnerBlocks
								allowedBlocks={ ALLOWED_INNER_BLOCKS }
							/>
						</div>
					</div>
				</BlockDiv>
			) }
			{ props.isHovered && ! isRequesting && hasPosts && uniqueId && <MarginBottom /> }
		</>
	)
}

const InspectorControls = memo( props => {
	return (
		<>
			<InspectorTabs />

			<InspectorLayoutControls>
				<AdvancedRangeControl
					label={ __( 'Columns', i18n ) }
					attribute="columns"
					responsive="all"
					min={ 1 }
					sliderMax={ 4 }
					placeholder="2"
				/>
				<FlexGapControls />
				<ControlSeparator />
				<SortControl
					label={ __( 'Content Arrangement', i18n ) }
					axis="y"
					values={ props.contentOrderOptions }
					num={ props.contentOrderOptions.length }
					allowReset={ ! isEqual( props.contentOrder, props.defaultContentOrder ) }
					onChange={ order => {
						if ( order ) {
							props.setAttributes( { contentOrder: order.map( label => CONTENTS.find( content => content.label === label )?.value ) } )
						} else {
							props.setAttributes( { contentOrder: props.defaultContentOrder } )
						}
					} }
					helpTooltip={ {
						video: 'posts-content-order',
						description: __( 'Sets the order of the items displayed (category, title, meta, excerpt, read more button, image) for each post', i18n ),
					} }
				/>
				<ControlSeparator />
			</InspectorLayoutControls>

			<ContentAlign.InspectorControls />
			<Alignment.InspectorControls />

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'Query', i18n ) }
					id="query"
					initialOpen={ true }
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
						value={ `${ props.orderBy },${ props.order }` }
						onChange={ value => {
							const [ orderBy, order ] = value.split( ',' )
							props.setAttributes( {
								orderBy,
								order,
							} )
						} }
						default="date,desc"
					/>
					<TaxonomyControl
						allowReset={ true }
						postType={ props.type }
						onChangePostType={ type => props.setAttributes( { type } ) }
						taxonomyType={ props.taxonomyType }
						onChangeTaxonomyType={ taxonomyType => props.setAttributes( { taxonomyType } ) }
						taxonomy={ props.taxonomy }
						onChangeTaxonomy={ taxonomy => props.setAttributes( { taxonomy } ) }
						taxonomyFilterType={ props.taxonomyFilterType }
						onChangeTaxonomyFilterType={ taxonomyFilterType => props.setAttributes( { taxonomyFilterType } ) }
						stkVersion="3"
					/>
					{ showProNotice && <ProControlButton type="posts" /> }
					{ applyFilters( 'stackable.posts.edit.inspector.style.query', null ) }
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					title={ __( 'Spacing', i18n ) }
					id="spacing"
				>
					<AdvancedRangeControl
						label={ __( 'Featured Image', i18n ) }
						attribute="imageSpacing"
						responsive="all"
						min={ 0 }
						sliderMax={ 100 }
						placeholder=""
					/>
					<AdvancedRangeControl
						label={ __( 'Title', i18n ) }
						attribute="titleSpacing"
						responsive="all"
						min={ 0 }
						sliderMax={ 100 }
						placeholder=""
					/>
					<AdvancedRangeControl
						label={ __( 'Category', i18n ) }
						attribute="categorySpacing"
						responsive="all"
						min={ 0 }
						sliderMax={ 100 }
						placeholder=""
					/>
					<AdvancedRangeControl
						label={ __( 'Excerpt', i18n ) }
						attribute="excerptSpacing"
						responsive="all"
						min={ 0 }
						sliderMax={ 100 }
						placeholder=""
					/>
					<AdvancedRangeControl
						label={ __( 'Meta', i18n ) }
						attribute="metaSpacing"
						responsive="all"
						min={ 0 }
						sliderMax={ 100 }
						placeholder=""
					/>
					<AdvancedRangeControl
						label={ __( 'Read More Link', i18n ) }
						attribute="readmoreSpacing"
						responsive="all"
						min={ 0 }
						sliderMax={ 100 }
						placeholder=""
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>

			<BlockDiv.InspectorControls />
			<ContainerDiv.InspectorControls hasContentVerticalAlign={ true } />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<Image.InspectorControls
				{ ...props }
				label={ __( 'Featured Image', i18n ) }
				hasHeight={ ! [ 'portfolio', 'portfolio-2', 'horizontal', 'horizontal-2' ].includes( props.blockStyle ) }
				hasBorderRadius={ ! [ 'portfolio', 'portfolio-2', 'horizontal', 'horizontal-2' ].includes( props.blockStyle ) }
				hasShape={ false }
				hasWidth={ [ 'list', 'horizontal', 'horizontal-2' ].includes( props.blockStyle ) }
				hasAlt={ false }
				hasSelector={ false }
				src={ props.focalPointPlaceholder }
				hasToggle={ true }
				hasAspectRatio={ ! [ 'list', 'horizontal', 'horizontal-2', 'portfolio', 'portfolio-2', 'vertical-card-2' ].includes( props.blockStyle ) }
			/>
			<Typography.InspectorControls
				{ ...props }
				label={ __( 'Title', i18n ) }
				hasToggle={ true }
				attrNameTemplate="title%s"
				hasTextContent={ false }
				hasAlign={ true }
				initialOpen={ false }
			/>
			<Typography.InspectorControls
				{ ...props }
				label={ __( 'Category', i18n ) }
				hasToggle={ true }
				attrNameTemplate="category%s"
				hasTextContent={ false }
				hasAlign={ true }
				hasTextTag={ false }
				initialOpen={ false }
			/>
			<Typography.InspectorControls
				{ ...props }
				label={ __( 'Excerpt', i18n ) }
				hasToggle={ true }
				attrNameTemplate="excerpt%s"
				hasTextTag={ false }
				hasTextContent={ false }
				hasAlign={ true }
				initialOpen={ false }
			/>
			<Typography.InspectorControls
				{ ...props }
				label={ __( 'Meta', i18n ) }
				hasToggle={ true }
				attrNameTemplate="meta%s"
				hasTextTag={ false }
				hasTextContent={ false }
				hasAlign={ true }
				initialOpen={ false }
			/>
			<Typography.InspectorControls
				{ ...props }
				label={ __( 'Read More Link', i18n ) }
				attrNameTemplate="readmore%s"
				hasTextTag={ false }
				hasToggle={ true }
				hasAlign={ true }
				initialOpen={ false }
			/>
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-posts" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />
		</>
	)
} )

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )

// Add hover selector control
addFilter( 'stackable.block-component.typography.color.after', 'stackable/posts', ( output, props ) => {
	const { name } = useBlockEditContext()

	if ( name !== 'stackable/posts' ) {
		return output
	}

	return (
		<>
			{ output }
			<AdvancedToggleControl
				label={ __( 'Apply hover effect when container is hovered', i18n ) }
				attribute={ getAttrName( props.attrNameTemplate, 'hoverStateInContainer' ) }
			/>
		</>
	)
} )

addFilter( 'stackable.block-component.typography.color.after', 'stackable/posts', ( output, props ) => {
	const { name } = useBlockEditContext()
	const categoryHighlighted = useBlockAttributesContext( attributes => attributes.categoryHighlighted )

	if ( name !== 'stackable/posts' ) {
		return output
	}

	if ( props.attrNameTemplate !== 'category%s' ) {
		return output
	}

	return (
		<>
			<AdvancedToggleControl
				label={ __( 'Highlighted', i18n ) }
				attribute="categoryHighlighted"
			/>
			{ categoryHighlighted && (
				<ColorPaletteControl
					label={ __( 'Highlight Color', i18n ) }
					hover="all"
					attribute="categoryHighlightColor"
				/>
			) }
			{ output }
		</>
	)
} )

// Add excerpt controls.
addFilter( 'stackable.block-component.typography.before', 'stackable/posts', ( output, props ) => {
	const { name } = useBlockEditContext()
	if ( name !== 'stackable/posts' ) {
		return output
	}

	if ( props.attrNameTemplate !== 'excerpt%s' ) {
		return output
	}

	return (
		<AdvancedRangeControl
			label={ __( 'Excerpt Length', i18n ) }
			attribute="excerptLength"
			placeholder="55"
			min={ 1 }
			sliderMax={ 100 }
		/>
	)
} )

// Add meta controls.
addFilter( 'stackable.block-component.typography.before', 'stackable/posts', ( output, props ) => {
	const { name } = useBlockEditContext()
	if ( name !== 'stackable/posts' ) {
		return output
	}

	if ( props.attrNameTemplate !== 'meta%s' ) {
		return output
	}

	return (
		<>
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
				helpTooltip={ {
					video: 'posts-meta-separator',
					description: __( 'Sets the separators between meta items (dot, space, comma, dash, pipe)', i18n ),
				} }
			/>
		</>
	)
} )

// Add additional image options.
addFilter( 'stackable.block-component.image.before', 'stackable/posts', output => {
	const { name } = useBlockEditContext()
	const imageSize = useBlockAttributesContext( attributes => attributes.imageSize )
	const setAttributes = useBlockSetAttributesContext()

	if ( name !== 'stackable/posts' ) {
		return output
	}

	return (
		<>
			<AdvancedToggleControl
				label={ __( 'Add post links to images', i18n ) }
				attribute="imageHasLink"
			/>
			<ImageSizeControl
				label={ __( 'Image Size', i18n ) }
				value={ imageSize }
				onChange={ imageSize => setAttributes( { imageSize } ) }
				default="full"
				helpTooltip={ {
					video: 'image-size',
					description: __( 'Sets the image display size to thumbnail, medium, large or full size. A smaller image size will also load faster.', i18n ),
				} }
			/>
			<AdvancedToggleControl
				label={ __( 'Apply hover effect when container is hovered', i18n ) }
				attribute="imageHoverStateInContainer"
			/>
		</>
	)
} )
