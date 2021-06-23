/**
 * Internal dependencies
 */
import ImageDesignBasic from './images/basic.png'
import ImageDesignList from './images/list.png'
import ImageDesignHorizontalCard from './images/horizontal-card.png'
import ImageDesignImageCard from './images/image-card.png'
import ImageDesignPortfolio from './images/portfolio.png'
import ImageDesignPortfolio2 from './images/portfolio2.png'
import ImageDesignVerticalCard from './images/vertical-card.png'
import ImageDesignVerticalCard2 from './images/vertical-card2.png'
import createStyles from './style'
import { showOptions } from './util'
import TaxonomyControl from './taxonomy-control'

/**
 * External dependencies
 */
import {
	AdvancedToggleControl,
	DesignPanelBody,
	ProControlButton,
	ProControl,
	BlockContainer,
	ContentAlignControl,
	ColumnPaddingControl,
	BackgroundControlsHelper,
	PanelAdvancedSettings,
	TypographyControlHelper,
	ImageSizeControl,
	ColorPaletteControl,
	HeadingButtonsControl,
	AlignButtonsControl,
	ResponsiveControl,
	PanelSpacingBody,
	AdvancedRangeControl,
	AdvancedSelectControl,
	DivBackground,
	ButtonEditHelper,
	ButtonIconPopoverControl,
	BorderControlsHelper,
} from '~stackable/components'
import {
	createTypographyAttributeNames,
	createResponsiveAttributeNames,
} from '~stackable/util'
import {
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector,
	withContentAlignReseter,
	withBlockStyles,
	withClickOpenInspector,
} from '~stackable/higher-order'
import {
	i18n, showProNotice,
} from 'stackable'
import {
	isEmpty,
	isUndefined,
	pickBy,
	uniqBy,
} from 'lodash'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { dateI18n, format } from '@wordpress/date'
import {
	Placeholder,
	Spinner,
	TextControl,
} from '@wordpress/components'
import {
	__, sprintf, _x,
} from '@wordpress/i18n'
import { decodeEntities } from '@wordpress/htmlEntities'
import { useSelect } from '@wordpress/data'
import { applyFilters, addFilter } from '@wordpress/hooks'
import { compose } from '@wordpress/compose'

const META_SEPARATORS = {
	dot: '·',
	space: ' ',
	comma: ',',
	dash: '—',
	pipe: '|',
}

addFilter( 'stackable.blog-posts.edit.layouts', 'default', layouts => {
	const newLayouts = [
		{
			label: __( 'Basic', i18n ), value: 'basic', image: ImageDesignBasic,
		},
		{
			label: __( 'List', i18n ), value: 'list', image: ImageDesignList,
		},
		{
			label: __( 'Portfolio', i18n ), value: 'portfolio', image: ImageDesignPortfolio, premium: true,
		},
		{
			label: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Portfolio', i18n ), 2 ), value: 'portfolio2', image: ImageDesignPortfolio2, premium: true,
		},
		{
			label: __( 'Vertical Card', i18n ), value: 'vertical-card', image: ImageDesignVerticalCard, premium: true,
		},
		{
			label: __( 'Horizontal Card', i18n ), value: 'horizontal-card', image: ImageDesignHorizontalCard, premium: true,
		},
		{
			label: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Vertical Card', i18n ), 2 ), value: 'vertical-card2', image: ImageDesignVerticalCard2, premium: true,
		},
		{
			label: __( 'Image Card', i18n ), value: 'image-card', image: ImageDesignImageCard, premium: true,
		},
	]

	return [
		...layouts,
		...newLayouts,
	]
} )

addFilter( 'stackable.blog-posts.edit.inspector.layout.before', 'stackable/blog-posts', ( output, props ) => {
	const { setAttributes } = props
	const {
		design = 'basic',
	} = props.attributes

	return (
		<Fragment>
			{ output }
			<DesignPanelBody
				initialOpen={ true }
				selected={ design }
				options={ applyFilters( 'stackable.blog-posts.edit.layouts', [] ) }
				onChange={ design => setAttributes( { design } ) }
			>
				{ showProNotice && <ProControlButton /> }
			</DesignPanelBody>
		</Fragment>
	)
} )

addFilter( 'stackable.blog-posts.edit.inspector.style.before', 'stackable/blog-posts', ( output, props ) => {
	const { setAttributes } = props
	const {
		columns = 2,
		borderRadius = '',
		shadow = '',
		contentOrder = '',
		numberOfItems = 6,
		showImage = true,
		showTitle = true,
		showCategory = true,
		showExcerpt = true,
		showMeta = true,
		showReadmore = false,
		titleTag = '',
		titleColor = '',
		titleHoverColor = '',
		orderBy = 'date',
		order = 'desc',
		postType = 'post',
		taxonomyType = 'category',
		taxonomy = '',
		taxonomyFilterType = '__in',
		imageSize = 'large',
		categoryHighlighted = false,
		categoryColor = '',
		categoryHoverColor = '',
		excerptColor = '',
		excerptLength = 55,
		showAuthor = true,
		showDate = true,
		showComments = true,
		metaColor = '',
		metaSeparator = '',
		readmoreColor = '',
		readmoreHoverColor = '',
		readmoreText = '',
	} = props.attributes

	const show = showOptions( props )

	const labelCategory = __( 'Category', i18n )
	const labelTitle = __( 'Title', i18n )
	const labelMeta = __( 'Meta', i18n )
	const labelExcerpt = __( 'Excerpt', i18n )

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'General', i18n ) }
				initialOpen={ true }
			>
				<AdvancedRangeControl
					label={ __( 'Columns', i18n ) }
					value={ columns }
					onChange={ columns => setAttributes( { columns } ) }
					min={ 1 }
					max={ 4 }
					className="ugb--help-tip-general-columns"
					default={ 2 }
				/>

				{ ! show.columnBackground && show.borderRadius &&
					<AdvancedRangeControl
						label={ __( 'Border Radius', i18n ) }
						value={ borderRadius }
						onChange={ borderRadius => setAttributes( { borderRadius } ) }
						min={ 0 }
						max={ 50 }
						allowReset={ true }
						placeholder="12"
						className="ugb--help-tip-general-border-radius"
					/>
				}
				{ ! show.columnBackground && show.shadow &&
					<AdvancedRangeControl
						label={ __( 'Shadow / Outline', i18n ) }
						value={ shadow }
						onChange={ shadow => setAttributes( { shadow } ) }
						min={ 0 }
						max={ 9 }
						allowReset={ true }
						placeholder="3"
						className="ugb--help-tip-general-shadow"
					/>
				}
				<AdvancedSelectControl
					label={ __( 'Content Order', i18n ) }
					options={ [
						{ label: __( 'Default', i18n ), value: '' },
						{ label: `${ labelCategory } → ${ labelTitle } → ${ labelMeta } → ${ labelExcerpt }`, value: 'category,title,meta,excerpt' },
						{ label: `${ labelCategory } → ${ labelTitle } → ${ labelExcerpt } → ${ labelMeta }`, value: 'category,title,excerpt,meta' },
						{ label: `${ labelTitle } → ${ labelMeta } → ${ labelExcerpt } → ${ labelCategory }`, value: 'title,meta,excerpt,category' },
						{ label: `${ labelTitle } → ${ labelCategory } → ${ labelExcerpt } → ${ labelMeta }`, value: 'title,category,excerpt,meta' },
						{ label: `${ labelMeta } → ${ labelTitle } → ${ labelExcerpt } → ${ labelCategory }`, value: 'meta,title,excerpt,category' },
						{ label: `${ labelMeta } → ${ labelTitle } → ${ labelCategory } → ${ labelExcerpt }`, value: 'meta,title,category,excerpt' },
					] }
					value={ contentOrder }
					onChange={ contentOrder => setAttributes( { contentOrder } ) }
					className="ugb--help-tip-posts-content-order"
				/>
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Posts Settings', i18n ) }
				initialOpen={ false }
			>
				<AdvancedRangeControl
					label={ __( 'Number of items', i18n ) }
					min={ 1 }
					max={ 100 }
					allowReset={ true }
					value={ numberOfItems || 6 }
					onChange={ numberOfItems => setAttributes( { numberOfItems } ) }
					defaultValue={ 6 }
					placeholder="6"
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
					onChange={ value => setAttributes( {
						orderBy: value.split( ',' )[ 0 ],
						order: value.split( ',' )[ 1 ],
					} ) }
					defaultValue="date,desc"
				/>
				<TaxonomyControl
					postType={ postType }
					onChangePostType={ postType => setAttributes( { postType } ) }
					taxonomyType={ taxonomyType }
					onChangeTaxonomyType={ taxonomyType => setAttributes( { taxonomyType } ) }
					taxonomy={ taxonomy }
					onChangeTaxonomy={ taxonomy => setAttributes( { taxonomy } ) }
					taxonomyFilterType={ taxonomyFilterType }
					onChangeTaxonomyFilterType={ taxonomyFilterType => setAttributes( { taxonomyFilterType } ) }
				/>
				{ applyFilters( 'stackable.blog-posts.edit.inspector.style.posts.after', null, props ) }
				{ showProNotice && <ProControlButton type="postsBlock" /> }
			</PanelAdvancedSettings>

			{ show.columnBackground &&
				<PanelAdvancedSettings
					title={ __( 'Container', i18n ) }
					id="column-background"
					initialOpen={ false }
					className="ugb--help-tip-column-background-on-off"
				>
					<ButtonIconPopoverControl
						label={ __( 'Background', i18n ) }
						popoverLabel={ __( 'Background', i18n ) }
						onReset={ () => {
							setAttributes( {
								columnBackgroundColorType: '',
								columnBackgroundColor: '',
								columnBackgroundColor2: '',
								columnBackgroundColorOpacity: '',
								columnBackgroundMediaID: '',
								columnBackgroundMediaUrl: '',
								columnBackgroundTintStrength: '',
								columnFixedBackground: '',
							} )
						} }
						allowReset={ props.attributes.columnBackgroundColor || props.attributes.columnBackgroundMediaUrl }
						hasColorPreview={ props.attributes.columnBackgroundColor }
						hasImagePreview={ props.attributes.columnBackgroundMediaUrl }
						colorPreview={ props.attributes.columnBackgroundColorType === 'gradient' ? [ props.attributes.columnBackgroundColor, props.attributes.columnBackgroundColor2 ] : props.attributes.columnBackgroundColor }
						imageUrlPreview={ props.attributes.columnBackgroundMediaUrl }
					>
						{ ( show.showBackgroundInItem || show.showBackgroundInContent ) &&
						<BackgroundControlsHelper
							attrNameTemplate="column%s"
							setAttributes={ setAttributes }
							blockAttributes={ props.attributes }
							backgroundMediaAllowVideo={ false }
						/>
						}
						{ ! ( show.showBackgroundInItem || show.showBackgroundInContent ) && show.columnBackground &&
						<BackgroundControlsHelper
							attrNameTemplate="column%s"
							setAttributes={ setAttributes }
							blockAttributes={ props.attributes }
							onChangeBackgroundMedia={ false }
							onChangeBackgroundColorOpacity={ false }
							onChangeBackgroundGradientBlendMode={ false }
						/>
						}
					</ButtonIconPopoverControl>

					{ show.border &&
						<BorderControlsHelper
							attrNameTemplate="column%s"
							setAttributes={ setAttributes }
							blockAttributes={ props.attributes }
						/>
					}

					{ show.borderRadius &&
					<AdvancedRangeControl
						label={ __( 'Border Radius', i18n ) }
						value={ borderRadius }
						onChange={ borderRadius => setAttributes( { borderRadius } ) }
						min={ 0 }
						max={ 50 }
						allowReset={ true }
						placeholder="12"
						className="ugb--help-tip-general-border-radius"
					/>
					}

					{ show.shadow &&
					<AdvancedRangeControl
						label={ __( 'Shadow / Outline', i18n ) }
						value={ shadow }
						onChange={ shadow => setAttributes( { shadow } ) }
						min={ 0 }
						max={ 9 }
						allowReset={ true }
						placeholder="3"
						className="ugb--help-tip-general-shadow"
					/>
					}
				</PanelAdvancedSettings>
			}

			<PanelSpacingBody
				initialOpen={ false }
				blockProps={ props }
			>
				<ColumnPaddingControl
					label={ __( 'Paddings', i18n ) }
					setAttributes={ setAttributes }
					attributes={ props.attributes }
				/>
				{ show.imageSpacing &&
					<ResponsiveControl
						attrNameTemplate="image%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Image', i18n ) }
							min={ -50 }
							max={ 100 }
							placeholder="16"
							allowReset={ true }
							className="ugb--help-tip-alignment-image"
						/>
					</ResponsiveControl>
				}
				{ show.categorySpacing &&
					<ResponsiveControl
						attrNameTemplate="category%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Category', i18n ) }
							min={ -50 }
							max={ 100 }
							placeholder="16"
							allowReset={ true }
							className="ugb--help-tip-alignment-description"
						/>
					</ResponsiveControl>
				}
				{ show.titleSpacing &&
					<ResponsiveControl
						attrNameTemplate="title%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Title', i18n ) }
							min={ -50 }
							max={ 100 }
							placeholder="16"
							allowReset={ true }
							className="ugb--help-tip-alignment-title"
						/>
					</ResponsiveControl>
				}
				{ show.excerptSpacing &&
					<ResponsiveControl
						attrNameTemplate="excerpt%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Excerpt', i18n ) }
							min={ -50 }
							max={ 100 }
							placeholder="16"
							allowReset={ true }
							className="ugb--help-tip-alignment-description"
						/>
					</ResponsiveControl>
				}
				{ show.metaSpacing &&
					<ResponsiveControl
						attrNameTemplate="meta%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Meta', i18n ) }
							min={ -50 }
							max={ 100 }
							placeholder="16"
							allowReset={ true }
							className="ugb--help-tip-alignment-description"
						/>
					</ResponsiveControl>
				}
				{ show.readmoreSpacing &&
					<ResponsiveControl
						attrNameTemplate="readmore%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Read More', i18n ) }
							min={ -50 }
							max={ 100 }
							placeholder="16"
							allowReset={ true }
							className="ugb--help-tip-alignment-button"
						/>
					</ResponsiveControl>
				}
				{ show.loadMoreSpacing &&
					<ResponsiveControl
						attrNameTemplate="loadMoreButton%sTopMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Load More', i18n ) }
							min={ -50 }
							max={ 100 }
							placeholder="16"
							allowReset={ true }
							className="ugb--help-tip-alignment-button"
						/>
					</ResponsiveControl>
				}
				{ show.paginationSpacing &&
				<ResponsiveControl
					attrNameTemplate="pagination%sTopMargin"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedRangeControl
						label={ __( 'Pagination', i18n ) }
						min={ -50 }
						max={ 100 }
						placeholder="16"
						allowReset={ true }
						className="ugb--help-tip-alignment-button"
					/>
				</ResponsiveControl>
				}
			</PanelSpacingBody>

			<PanelAdvancedSettings
				title={ __( 'Featured Image', i18n ) }
				id="image"
				checked={ showImage }
				onChange={ showImage => setAttributes( { showImage } ) }
				toggleOnSetAttributes={ [
					'imageSize',
					...createResponsiveAttributeNames( 'Image%sWidth' ),
					...createResponsiveAttributeNames( 'Image%sHeight' ),
				] }
				toggleAttributeName="showTitle"
			>
				<ImageSizeControl
					label={ __( 'Image Size', i18n ) }
					value={ imageSize }
					onChange={ imageSize => setAttributes( { imageSize } ) }
					className="ugb--help-tip-image-size"
				/>
				{ show.imageWidth &&
					<ResponsiveControl
						attrNameTemplate="image%sWidth"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Image Width', i18n ) }
							min={ 0 }
							max={ 600 }
							placeholder="100"
							allowReset={ true }
							className="ugb--help-tip-image-width-crop"
						/>
					</ResponsiveControl>
				}
				{ show.imageHeight &&
					<ResponsiveControl
						attrNameTemplate="image%sHeight"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Image Height', i18n ) }
							min={ 0 }
							max={ 1000 }
							placeholder="500"
							allowReset={ true }
							className="ugb--help-tip-image-height-crop"
						/>
					</ResponsiveControl>
				}
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Category', i18n ) }
				id="category"
				checked={ showCategory }
				onChange={ showCategory => setAttributes( { showCategory } ) }
				toggleOnSetAttributes={ [
					...createTypographyAttributeNames( 'category%s' ),
					'categoryHighlighted',
					'categoryColor',
					'categoryHoverColor',
					...createResponsiveAttributeNames( 'Category%sAlign' ),
				] }
				toggleAttributeName="showCategory"
			>
				<TypographyControlHelper
					attrNameTemplate="category%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
					placeholder="11"
				/>
				<AdvancedToggleControl
					label={ __( 'Highlighted', i18n ) }
					checked={ categoryHighlighted }
					onChange={ categoryHighlighted => setAttributes( { categoryHighlighted } ) }
				/>
				<ColorPaletteControl
					value={ categoryColor }
					onChange={ categoryColor => setAttributes( { categoryColor } ) }
					label={ __( 'Color', i18n ) }
				/>
				<ColorPaletteControl
					value={ categoryHoverColor }
					onChange={ categoryHoverColor => setAttributes( { categoryHoverColor } ) }
					label={ __( 'Hover Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="Category%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-description"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Title', i18n ) }
				id="title"
				checked={ showTitle }
				onChange={ showTitle => setAttributes( { showTitle } ) }
				toggleOnSetAttributes={ [
					...createTypographyAttributeNames( 'title%s' ),
					'titleTag',
					'titleColor',
					'titleHoverColor',
					...createResponsiveAttributeNames( 'Title%sAlign' ),
				] }
				toggleAttributeName="showTitle"
			>
				<HeadingButtonsControl
					value={ titleTag || 'h3' }
					defaultValue="h3"
					onChange={ titleTag => setAttributes( { titleTag } ) }
				/>
				<TypographyControlHelper
					attrNameTemplate="title%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
					htmlTag={ titleTag || 'h3' }
				/>
				<ColorPaletteControl
					value={ titleColor }
					onChange={ titleColor => setAttributes( { titleColor } ) }
					label={ __( 'Text Color', i18n ) }
				/>
				<ColorPaletteControl
					value={ titleHoverColor }
					onChange={ titleHoverColor => setAttributes( { titleHoverColor } ) }
					label={ __( 'Hover Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="Title%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-title"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Excerpt', i18n ) }
				id="excerpt"
				checked={ showExcerpt }
				onChange={ showExcerpt => setAttributes( { showExcerpt } ) }
				toggleOnSetAttributes={ [
					...createTypographyAttributeNames( 'excerpt%s' ),
					'excerptColor',
					'excerptLength',
					...createResponsiveAttributeNames( 'Excerpt%sAlign' ),
				] }
				toggleAttributeName="showExcerpt"
			>
				<AdvancedRangeControl
					label={ __( 'Excerpt Length', i18n ) }
					value={ excerptLength }
					onChange={ excerptLength => setAttributes( { excerptLength } ) }
					min={ 1 }
					max={ 100 }
					allowReset={ true }
					placeholder="55"
				/>
				<TypographyControlHelper
					attrNameTemplate="excerpt%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<ColorPaletteControl
					value={ excerptColor }
					onChange={ excerptColor => setAttributes( { excerptColor } ) }
					label={ __( 'Text Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="Excerpt%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-description"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Meta', i18n ) }
				id="meta"
				checked={ showMeta }
				onChange={ showMeta => setAttributes( { showMeta } ) }
				toggleOnSetAttributes={ [
					'showAuthor',
					'showDate',
					'showComments',
					...createTypographyAttributeNames( 'meta%s' ),
					'metaColor',
					'metaSeparator',
					...createResponsiveAttributeNames( 'Meta%sAlign' ),
				] }
				toggleAttributeName="showMeta"
			>
				<AdvancedToggleControl
					label={ __( 'Show Author', i18n ) }
					checked={ showAuthor }
					onChange={ showAuthor => setAttributes( { showAuthor } ) }
					defaultValue={ true }
				/>
				<AdvancedToggleControl
					label={ __( 'Show Date', i18n ) }
					checked={ showDate }
					onChange={ showDate => setAttributes( { showDate } ) }
					defaultValue={ true }
				/>
				<AdvancedToggleControl
					label={ __( 'Show Comments', i18n ) }
					checked={ showComments }
					onChange={ showComments => setAttributes( { showComments } ) }
					defaultValue={ true }
				/>
				<TypographyControlHelper
					attrNameTemplate="meta%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
					placeholder="11"
				/>
				<ColorPaletteControl
					value={ metaColor }
					onChange={ metaColor => setAttributes( { metaColor } ) }
					label={ __( 'Text Color', i18n ) }
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
					value={ metaSeparator }
					onChange={ metaSeparator => setAttributes( { metaSeparator } ) }
					className="ugb--help-tip-posts-meta-separator"
				/>
				<ResponsiveControl
					attrNameTemplate="Meta%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-description"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Read More Link', i18n ) }
				id="readmore"
				checked={ showReadmore }
				onChange={ showReadmore => setAttributes( { showReadmore } ) }
				toggleOnSetAttributes={ [
					'readmoreText',
					...createTypographyAttributeNames( 'readmore%s' ),
					'readmoreColor',
					'readmoreHoverColor',
					...createResponsiveAttributeNames( 'Readmore%sAlign' ),
				] }
				toggleAttributeName="showReadmore"
			>
				<TextControl
					label={ __( 'Customize Read More Link', i18n ) }
					type="text"
					value={ readmoreText }
					onChange={ readmoreText => setAttributes( { readmoreText } ) }
				/>
				<TypographyControlHelper
					attrNameTemplate="readmore%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<ColorPaletteControl
					value={ readmoreColor }
					onChange={ readmoreColor => setAttributes( { readmoreColor } ) }
					label={ __( 'Text Color', i18n ) }
				/>
				<ColorPaletteControl
					value={ readmoreHoverColor }
					onChange={ readmoreHoverColor => setAttributes( { readmoreHoverColor } ) }
					label={ __( 'Hover Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="Readmore%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-button"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			{ showProNotice && (
				<PanelAdvancedSettings
					title={ __( 'Pagination', i18n ) }
					id="pagination"
					initialOpen={ false }
				>
					<ProControl
						title={ __( 'Say Hello to More Options 👋', i18n ) }
						description={ __( 'Get a load more button, pagination, more post options and Custom Post Types. This feature is only available on Stackable Premium', i18n ) }
					/>
				</PanelAdvancedSettings>
			) }

			{ applyFilters( 'stackable.blog-posts.edit.inspector.style.pagination.after', null, props ) }

			{ showProNotice && (
				<PanelAdvancedSettings
					title={ __( 'Load More Button', i18n ) }
					id="loadmore"
					initialOpen={ false }
				>
					<ProControl
						title={ __( 'Say Hello to More Options 👋', i18n ) }
						description={ __( 'Get a load more button, pagination, more post options and Custom Post Types. This feature is only available on Stackable Premium', i18n ) }
					/>
				</PanelAdvancedSettings>
			) }

			{ applyFilters( 'stackable.blog-posts.edit.inspector.style.read-more.after', null, props ) }

		</Fragment>
	)
} )

const Edit = props => {
	const {
		setAttributes,
		className,
		attributes,
	} = props

	const {
		columns = 2,
		design = 'basic',
		shadow = '',
		titleTag = '',
		imageSize = 'large',
		categoryHighlighted = false,
		excerptLength = '',
		metaSeparator = '',
		showImage = true,
		showTitle = true,
		showCategory = true,
		showExcerpt = true,
		showMeta = true,
		showReadmore = false,
		showAuthor = true,
		showDate = true,
		showComments = true,
		showPagination = false,
		readmoreText = '',
		columnBackgroundColor = '',
		columnBackgroundColor2 = '',
		showLoadMoreButton = false,
		numberOfItems = 6,
	} = attributes

	const {
		posts, isRequesting,
	} = useSelect( select => {
		const {
			postType = 'post',
			orderBy = 'date',
			order = 'desc',
			taxonomyType = '',
			taxonomy = '',
			taxonomyFilterType = '__in',
		} = props.attributes
		const { getEntityRecords } = select( 'core' )
		const { isResolving } = select( 'core/data' )

		const postQuery = pickBy( {
			...applyFilters( 'stackable.blog-posts.postQuery', {
				order,
				orderby: orderBy,
				per_page: numberOfItems, // eslint-disable-line camelcase
			}, props ),
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

		const posts = getEntityRecords( 'postType', postType, postQuery )

		return {
			posts: ! Array.isArray( posts ) ? posts : uniqBy( posts, 'id' ),
			isRequesting: isResolving( 'core', 'getEntityRecords', [
				'postType',
				postType,
				postQuery,
			] ),
		}
	}, [
		attributes.postType,
		attributes.orderBy,
		attributes.order,
		attributes.taxonomyType,
		attributes.taxonomy,
		attributes.taxonomyFilterType,
		attributes.postOffset,
		attributes.postExclude,
		attributes.postInclude,
		attributes.numberOfItems,
	] )

	const {
		paginate,
		currentPage,
		pages,
		currentPagePosts = posts,
	} = applyFilters( 'stackable.blog-posts.pagination.hooks', posts, numberOfItems ) || {}

	const show = showOptions( props )
	const hasPosts = Array.isArray( posts ) && posts.length
	const TitleTag = titleTag || 'h3'

	const mainClasses = classnames( [
		className,
		'ugb-blog-posts--v2',
		`ugb-blog-posts--columns-${ columns }`,
		`ugb-blog-posts--design-${ design }`,
	], applyFilters( 'stackable.blog-posts.mainclasses', {
		'ugb-blog-posts--cat-highlighted': categoryHighlighted,
		'ugb-blog-posts--has-bg-color': columnBackgroundColor || columnBackgroundColor2,
	}, props ) )

	const itemClasses = classnames( [
		'ugb-blog-posts__item',
	], {
		[ `ugb--shadow-${ shadow || 3 }` ]: ! show.imageShadow,
	} )

	const featuredImageClasses = classnames( [
		'ugb-blog-posts__featured-image',
	], {
		[ `ugb--shadow-${ shadow || 3 }` ]: show.imageShadow,
	} )

	if ( isRequesting || ! hasPosts ) {
		return (
			<Placeholder
				icon="admin-post"
				label={ __( 'Posts', i18n ) }
			>
				{ ( ! Array.isArray( currentPagePosts ) || isRequesting ) ? (
					<Spinner />
				) : (
					__( 'No posts found.', i18n )
				) }
			</Placeholder>
		)
	}

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ ( currentPagePosts || [] ).map( ( post, i ) => {
					const featuredImageSrc = ( ( post.featured_image_urls && post.featured_image_urls[ imageSize || 'large' ] ) || [] )[ 0 ]
					const featuredImage = featuredImageSrc &&
					<figure className={ featuredImageClasses }>
						{ /* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
						<a><img src={ featuredImageSrc } alt={ __( 'featured', i18n ) } /></a>
					</figure>

					const featuredImageBackground = featuredImageSrc &&
					<div
						className="ugb-blog-posts__featured-image-background"
						style={ { backgroundImage: `url(${ featuredImageSrc })` } }
					/>

					const title = <TitleTag className="ugb-blog-posts__title">
						{ /* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
						<a>{ decodeEntities( post.title.rendered.trim() ) || __( '(Untitled)', i18n ) }</a>
					</TitleTag>

					const category = post.category_list &&
					<div className="ugb-blog-posts__category" dangerouslySetInnerHTML={ { __html: post.category_list.replace( /href=['"].*?['"]/g, '' ) } } />

					const separator = <span className="ugb-blog-posts__sep">{ META_SEPARATORS[ metaSeparator || 'dot' ] }</span>

					const author = post.author_info && post.author_info.name &&
					<span>{ post.author_info.name }</span>

					const date = post.date_gmt &&
					<time dateTime={ format( 'c', post.date_gmt ) } className="ugb-blog-posts__date">
						{ dateI18n( 'F d, Y', post.date_gmt ) }
					</time>

					const comments = <span>{ post.comments_num }</span>

					// Trim the excerpt.
					let excerptString = post.post_excerpt_stackable.split( ' ' )
					if ( excerptString.length > ( excerptLength || 55 ) ) {
						excerptString = excerptString.slice( 0, excerptLength || 55 ).join( ' ' ) + '...'
					} else {
						excerptString = post.post_excerpt_stackable
					}

					const excerpt = excerptString &&
					<div className="ugb-blog-posts__excerpt" dangerouslySetInnerHTML={ { __html: excerptString } } />

					const readmore = <p className="ugb-blog-posts__readmore">
						{ /* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
						<a>{ readmoreText ? readmoreText : __( 'Continue reading', i18n ) }</a>
					</p>

					const meta = ( showAuthor || showDate || showComments ) &&
					<aside className="entry-meta ugb-blog-posts__meta">
						{ showAuthor && author }
						{ showAuthor && author && ( ( showDate && date ) || ( showComments && comments ) ) && separator }
						{ showDate && date }
						{ ( ( showAuthor && author ) || ( showDate && date ) ) && showComments && comments && separator }
						{ showComments && comments }
					</aside>

					const output = applyFilters( 'stackable.blog-posts.edit.output', null, props, {
						itemClasses,
						featuredImageBackground,
						featuredImage,
						category,
						title,
						author,
						separator,
						date,
						comments,
						excerpt,
						readmore,
						meta,
					}, i )
					if ( output ) {
						return output
					}

					return (
						<DivBackground
							tagName="article"
							className={ itemClasses }
							backgroundAttrName="column%s"
							blockProps={ props }
							showBackground={ show.showBackgroundInItem }
							showBackgroundVideo={ false }
							key={ i }
						>
							{ showImage && show.imageAsBackground && featuredImageBackground }
							{ showImage && ! show.imageAsBackground && show.imageOutsideContainer && featuredImage }
							<DivBackground
								className="ugb-blog-posts__content"
								backgroundAttrName="column%s"
								blockProps={ props }
								showBackground={ show.showBackgroundInContent }
								showBackgroundVideo={ false }
							>
								{ showImage && ! show.imageAsBackground && ! show.imageOutsideContainer && featuredImage }
								{ showCategory && category }
								{ showTitle && title }
								{ showMeta && meta }
								{ showExcerpt && excerpt }
								{ showReadmore && readmore }
							</DivBackground>
						</DivBackground>
					)
				} ) }
				{ showLoadMoreButton &&
				<ButtonEditHelper
					containerClassName="ugb-blog-posts__load-more-button"
					attrNameTemplate="loadMoreButton%s"
					setAttributes={ setAttributes }
					blockAttributes={ attributes }
					isSelected={ false }
				/>
				}
				{ applyFilters( 'stackable.blog-posts.edit.output.pagination.after', null, {
					...props,
					showPagination,
					containerClassName: 'ugb-blog-posts__pagination',
					attrNameTemplate: 'pagination%s',
					blockAttributes: attributes,
					paginate,
					currentPage,
					pages,
				} ) }
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector(),
	withContentAlignReseter( [ 'Category%sAlign', 'Title%sAlign', 'Excerpt%sAlign', 'Meta%sAlign', 'Readmore%sAlign' ] ),
	withBlockStyles( createStyles, { editorMode: true } ),
	withClickOpenInspector( [
		[ '.ugb-blog-posts__featured-image', 'image' ],
		[ '.ugb-blog-posts__featured-image img', 'image' ],
		[ '.ugb-blog-posts__category', 'category' ],
		[ '.ugb-blog-posts__title', 'title' ],
		[ '.ugb-blog-posts__excerpt', 'excerpt' ],
		[ '.ugb-blog-posts__meta', 'meta' ],
		[ '.ugb-blog-posts__readmore', 'readmore' ],
		[ '.ugb-blog-posts--design-image-card .ugb-blog-posts__header', 'image' ],
		[ '.ugb-blog-posts__item', 'column-background' ],
		[ '.ugb-blog-posts__load-more-button', 'loadmore' ],
		[ '.ugb-blog-posts__pagination', 'pagination' ],
	] ),
)( Edit )

addFilter( 'stackable.click-open-inspector.listener-override', 'stackable/blog-posts', override => {
	return {
		...override,
		'[data-type="ugb/blog-posts"]': [
			'img',
			'p',
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
			'span',
			'time',
			'aside',
			'figure',
			'div',
		],
	}
} )
