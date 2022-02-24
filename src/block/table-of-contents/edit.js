/**
 * Internal dependencies
 */
import { TableOfContentsStyles } from './style'
import { generateAnchor, setAnchor } from './autogenerate-anchors'

/***
 * External dependencies
 */
import classnames from 'classnames'
import { isEqual, debounce } from 'lodash'
import { i18n, version as VERSION } from 'stackable'
import {
	InspectorTabs,
	InspectorStyleControls,
	PanelAdvancedSettings,
	AdvancedRangeControl,
	AdvancedToggleControl,
	ColorPaletteControl,
	AdvancedSelectControl,
	AlignButtonsControl,
} from '~stackable/components'
import {
	useBlockHoverClass,
} from '~stackable/hooks'
import { withQueryLoopContext } from '~stackable/higher-order'
import {
	Typography,
	BlockDiv,
	useGeneratedCss,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	getTypographyClasses,
	ConditionalDisplay,
	MarginBottom,
	Alignment,
	getAlignmentClasses,
	Transform,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import {
	Card,
	CardBody,
	__experimentalText as Text,
} from '@wordpress/components'
import {
	useSelect, useDispatch,
} from '@wordpress/data'
import {
	Fragment, useEffect, useCallback,
} from '@wordpress/element'
import {
	__,
} from '@wordpress/i18n'

import {
	getUpdatedHeadings,
	linearToNestedHeadingList,
} from './util'

import TableOfContentsList from './table-of-contents-list'
import Notice from './notice'

const listTypeOptions = [
	{
		label: __( 'Number', i18n ),
		value: 'decimal',
	},
	{
		label: __( 'Padded Number', i18n ),
		value: 'decimal-leading-zero',
	},
	{
		label: __( 'Lowercase Roman', i18n ),
		value: 'lower-roman',
	},
	{
		label: __( 'Uppercase Roman', i18n ),
		value: 'upper-roman',
	},
	{
		label: __( 'Lowercase Letters', i18n ),
		value: 'lower-alpha',
	},
	{
		label: __( 'Uppercase Letters', i18n ),
		value: 'upper-alpha',
	},
]

const Placeholder = () => (
	<Card className="stk-table-of-contents__placeholder">
		<CardBody>
			<Text>
				{
					__(
						'Start adding Heading blocks to create a table of contents. Supported heading blocks will be linked here.',
						i18n
					) }
			</Text>
		</CardBody>
	</Card>
)

const HeadingsControls = () => (
	[ 'H1', 'H2', 'H3', 'H4', 'H5', 'H6' ].map( heading =>
		<AdvancedToggleControl
			key={ heading }
			label={ `${ __( `Include`, i18n ) } ${ heading }` }
			attribute={ `include${ heading }` }
			defaultValue={ true }
		/>
	)
)

const Edit = props => {
	const {
		attributes,
		setAttributes,
		className,
		isSelected,
	} = props

	const { getEditorDom } = useSelect( 'stackable/editor-dom' )
	const { headings, isSmoothScroll } = attributes
	const { getEditedPostContent } = useSelect( 'core/editor' )
	const { getBlocks } = useSelect( 'core/block-editor' )
	const { __unstableMarkNextChangeAsNotPersistent } = useDispatch( 'core/block-editor' )

	const toggleItemVisibility = anchor => {
		const updatedHeadings = headings.map( heading => ( { ...heading, isExcluded: heading.anchor === anchor ? ! heading.isExcluded : heading.isExcluded } ) )
		setAttributes( { headings: updatedHeadings } )
	}

	const updateContent = ( anchor, customContent ) => {
		const updatedHeadings = headings.map( heading => ( { ...heading, customContent: heading.anchor === anchor ? customContent : heading.customContent } ) )
		setAttributes( { headings: updatedHeadings } )
	}

	// Watch for any heading block changes, update the heading text, level and anchor.
	useEffect( () => {
		let postContent = getEditedPostContent()
		const unsubscribe = wp.data.subscribe( debounce( () => {
			const newPostContent = getEditedPostContent()
			if ( ! isSelected && ! isEqual( postContent, newPostContent ) ) {
				const editorHeadings = getUpdatedHeadings( getEditorDom, attributes ).map( ( heading, i ) => {
					return {
						...headings[ i ],
						...heading,
					}
				} )
				__unstableMarkNextChangeAsNotPersistent()
				setAttributes( { headings: editorHeadings } )
			}
			postContent = newPostContent
		}, 300 ) )

		return () => unsubscribe()
	}, [ isSelected ] )

	// Populate the table of contents on first addition of the toc block.
	useEffect( () => {
		if ( getEditorDom && ! headings.length ) {
			const headings = getUpdatedHeadings( getEditorDom, attributes ).map( heading => {
				return {
					...heading,
					isExcluded: false,
				}
			} )
			__unstableMarkNextChangeAsNotPersistent()
			setAttributes( { headings } )
		}
	 }, [ getEditorDom, headings.length ] )

	useGeneratedCss( props.attributes )

	const { ordered } = attributes
	const tagName = ordered ? 'ol' : 'ul'

	const blockHoverClass = useBlockHoverClass()
	const textClasses = getTypographyClasses( attributes )
	const blockAlignmentClass = getAlignmentClasses( attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-table-of-contents',
		blockAlignmentClass,
		blockHoverClass,
		textClasses,
	] )

	const allowedLevels = [ 1, 2, 3, 4, 5, 6 ].filter(
		n => attributes[ `includeH${ n }` ]
	)
	const filteredHeadlingList = headings.filter( heading => allowedLevels.includes( heading.level ) )

	const nestedHeadingList = linearToNestedHeadingList( filteredHeadlingList )

	const hasEmptyAnchor = headings.some( heading => ! heading.anchor )

	const autoGenerateAnchors = useCallback( () => {
		// This side-effect should not create an undo level.
		__unstableMarkNextChangeAsNotPersistent()
		const blocks = getBlocks()
			.filter( block => 'core/heading' === block.name )

		blocks.map( block => {
			const { clientId, attributes: { anchor, content } } = block
			if ( ! anchor && content ) {
				const anchor = generateAnchor( clientId, content )
				block.attributes.anchor = anchor
				setAnchor( clientId, anchor )
			}
			return block
		} )
		const editorHeadings = getUpdatedHeadings( getEditorDom, attributes ).map( ( heading, i ) => {
			return {
				...headings[ i ],
				...heading,
			}
		} )
		__unstableMarkNextChangeAsNotPersistent()
		setAttributes( { headings: editorHeadings } )
	}, [ getEditorDom, attributes ] )

	return (
		<Fragment>
			<InspectorTabs />

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'General', i18n ) }
					initialOpen={ true }
					id="general"
				>
					<HeadingsControls />

					<AdvancedRangeControl
						label={ __( 'Columns', i18n ) }
						attribute="columns"
						min="1"
						sliderMax="3"
						step="1"
						placeholder="1"
						responsive="all"
					/>

					<AdvancedRangeControl
						label={ __( 'Column Gap', i18n ) }
						attribute="columnGap"
						min="0"
						sliderMax="50"
						responsive="all"
					/>

					<AdvancedRangeControl
						label={ __( 'Row Gap', i18n ) }
						attribute="rowGap"
						min="0"
						sliderMax="50"
						responsive="all"
					/>

					<AdvancedRangeControl
						label={ __( 'Icon Gap', i18n ) }
						attribute="iconGap"
						min="0"
						sliderMax="20"
						responsive="all"
					/>

					<AdvancedRangeControl
						label={ __( 'Indentation', i18n ) }
						attribute="indentation"
						min="0"
						sliderMax="50"
						responsive="all"
						placeholder=""
					/>
					<AlignButtonsControl
						label={ __( 'List Alignment', i18n ) }
						attribute="listAlignment"
						responsive="all"
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'Scrolling', i18n ) }
					initialOpen={ false }
					id="icon-and-markers"
				>
					<AdvancedToggleControl
						label={ __( 'Use smooth scroll', i18n ) }
						attribute="isSmoothScroll"
						defaultValue={ false }
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'Icons & Numbers', i18n ) }
					initialOpen={ false }
					id="icon-and-markers"
				>
					<AdvancedToggleControl
						label={ __( 'Use ordered list', i18n ) }
						attribute="ordered"
					/>

					{ ! ordered && (
						<AdvancedToggleControl
							label={ __( 'Show Icons', i18n ) }
							attribute="showIcons"
							defaultValue={ true }
						/>
					) }

					{ ordered && (
						<AdvancedSelectControl
							label={ __( 'List Type', i18n ) }
							attribute="listType"
							options={ listTypeOptions }
						/>
					) }

					<ColorPaletteControl
						label={ __( 'Color', i18n ) }
						attribute="markerColor"
						hover="all"
					/>

					<AdvancedRangeControl
						label={ __( 'Icon / Number Size', i18n ) }
						attribute="iconSize"
						min={ 0 }
						max={ 5 }
						step={ 0.1 }
						allowReset={ true }
						responsive="all"
						placeholder="1"
					/>

					{ ! ordered && (
						<AdvancedRangeControl
							label={ __( 'Icon Opacity', i18n ) }
							attribute="iconOpacity"
							min={ 0 }
							max={ 1 }
							step={ 0.1 }
							allowReset={ true }
							placeholder="1.0"
							hover="all"
						/>
					) }
				</PanelAdvancedSettings>
			</InspectorStyleControls>

			<Typography.InspectorControls
				isMultiline={ true }
				initialOpen={ false }
				hasTextTag={ false }
				hasTextContent={ false }
			/>

			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-table-of-contents" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<TableOfContentsStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-table-of-contents" />

			<BlockDiv className={ blockClassNames }>
				{ !! headings.length && hasEmptyAnchor && (
					<Notice autoGenerateAnchors={ autoGenerateAnchors } />
				) }
				<TableOfContentsList
					nestedHeadingList={ nestedHeadingList }
					isSelected={ isSelected }
					isSmoothScroll={ isSmoothScroll }
					listTag={ tagName }
					toggleItemVisibility={ toggleItemVisibility }
					updateContent={ updateContent }
				/>
				{ headings.length === 0 && (
					<Placeholder />
				) }
			</BlockDiv>
			<MarginBottom />
		</Fragment>
	)
}

export default withQueryLoopContext( Edit )
