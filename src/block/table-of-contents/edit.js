/**
 * Internal dependencies
 */
import { TableOfContentsStyles } from './style'
import { generateAnchor } from './autogenerate-anchors'
import TableOfContentsList from './table-of-contents-list'
import {
	getAllBlocks,
	getUpdatedHeadings,
	linearToNestedHeadingList,
} from './util'

/***
 * External dependencies
 */
import classnames from 'classnames'
import {
	isEqual, debounce, uniqueId, isEmpty, cloneDeep,
} from 'lodash'
import { i18n, version as VERSION } from 'stackable'
import {
	InspectorTabs,
	InspectorStyleControls,
	PanelAdvancedSettings,
	AdvancedRangeControl,
	AdvancedToggleControl,
	AdvancedSelectControl,
} from '~stackable/components'
import { useBlockHoverClass } from '~stackable/hooks'
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
	getAlignmentClasses,
	Transform,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import {
	Button,
	Card,
	CardBody,
} from '@wordpress/components'
import { useSelect, useDispatch } from '@wordpress/data'
import {
	Fragment, useEffect, useState, useCallback,
} from '@wordpress/element'
import {
	__, _x, sprintf,
} from '@wordpress/i18n'
import { RichText } from '@wordpress/block-editor'
import { applyFilters } from '@wordpress/hooks'

const listTypeOptions = [
	{
		label: __( 'Unordered', i18n ),
		value: 'unordered',
	},
	{
		label: __( 'None', i18n ),
		value: 'none',
	},
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
	<Card>
		<CardBody>
			{
				__(
					'Start adding Heading blocks to create a table of contents. Supported heading blocks will be linked here.',
					i18n
				) }
		</CardBody>
	</Card>
)

const HeadingsControls = () => (
	[ 'H1', 'H2', 'H3', 'H4', 'H5', 'H6' ].map( heading =>
		<AdvancedToggleControl
			key={ heading }
			label={ sprintf( _x( 'Include %s', '%s is a heading level, e.g. H1', i18n ), heading ) }
			attribute={ `include${ heading }` }
			defaultValue={ 'H1' !== heading }
		/>
	)
)

const Notice = ( { autoGenerateAnchors } ) => {
	return (
		<Card className="stk-table-of-contents__empty-anchor">
			<CardBody isShady>
				{ __(
					'You have one or more headings without an anchor id. Anchor ids are required for the Table of Contents block to work.',
					i18n
				) }
				<br />
				<br />
				<Button
					isPrimary
					onClick={ autoGenerateAnchors }
				>
					{ __( 'Auto-generate missing anchor ids', i18n ) }
				</Button>
			</CardBody>
		</Card>
	)
}

const Edit = props => {
	const {
		attributes,
		setAttributes,
		className,
		isSelected,
	} = props

	const { getEditorDom } = useSelect( 'stackable/editor-dom' )
	const [ headings, setHeadings ] = useState( attributes.headings )
	const { getEditedPostContent } = useSelect( 'core/editor' )
	const { getBlocks } = useSelect( 'core/block-editor' )
	const { __unstableMarkNextChangeAsNotPersistent } = useDispatch( 'core/block-editor' )
	// This is used by the generate anchors button to force the update of heading data.
	const [ forceUpdateHeadings, setForceUpdateHeadings ] = useState( 0 )

	const getClonedHeadings = () => {
		const updatedHeadings = cloneDeep( headings )

		const allowedLevels = [ 1, 2, 3, 4, 5, 6 ].filter(
			n => attributes[ `includeH${ n }` ]
		)
		return updatedHeadings.filter( heading =>
			allowedLevels.includes( heading.tag )
		)
	}

	const toggleItemVisibility = index => {
		const updatedHeadings = getClonedHeadings()

		updatedHeadings[ index ].isExcluded = ! updatedHeadings[ index ].isExcluded
		setHeadings( updatedHeadings )

		// Also set our heading attribute to the updated headings, we need to do
		// a setAttributes here or else editor can't be saved/updated if
		// visibility toggle is the only change.
		setAttributes( { headings: updatedHeadings } )
	}

	// Custom text update handler, if the custom text equals the heading text,
	// then remove the custom text.
	const updateContent = ( index, customContent ) => {
		const updatedHeadings = getClonedHeadings()
		if ( updatedHeadings[ index ].content === customContent ) {
			delete updatedHeadings[ index ].customContent
		} else {
			updatedHeadings[ index ].customContent = customContent
		}

		setHeadings( updatedHeadings )

		// Also set our heading attribute to the updated headings, we need to do
		// a setAttributes here or else editor can't be saved/updated if
		// visibility toggle is the only change.
		setAttributes( { headings: updatedHeadings } )
	}

	// Watch for any heading block changes, update the heading text, level and anchor.
	useEffect( () => {
		let postContent = getEditedPostContent()
		const unsubscribe = wp.data.subscribe( debounce( () => {
			const newPostContent = getEditedPostContent()
			if ( ! isSelected && ! isEqual( postContent, newPostContent ) ) {
				const editorHeadings = getUpdatedHeadings( getEditorDom, attributes ).map( ( heading, i ) => {
					// Removed any blank customContent so a heading won't show up as blank.
					if ( headings[ i ].customContent === '' ) {
						delete headings[ i ].customContent
					}

					return {
						...headings[ i ],
						...heading,
					}
				} )
				setHeadings( editorHeadings )
			}
			postContent = newPostContent
		}, 300 ) )

		return () => unsubscribe()
	}, [ isSelected ] )

	// After adjusting some custom heading text, remove blank ones and set them to the default.
	useEffect( () => {
		if ( ! isSelected ) {
			const updatedHeadings = getClonedHeadings()

			let didUpdate = false
			updatedHeadings.forEach( ( heading, i ) => {
				// Removed any blank customContent so a heading won't show up as blank.
				if ( heading.customContent === '' ) {
					delete updatedHeadings[ i ].customContent
					didUpdate = true
				}
			} )

			if ( didUpdate ) {
				setHeadings( updatedHeadings )
			}
		}
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
			setHeadings( headings )
		}
	}, [ getEditorDom, headings.length ] )

	// Update headings when generate anchors button is clicked.
	useEffect( () => {
		if ( getEditorDom && forceUpdateHeadings ) {
			const headings = getUpdatedHeadings( getEditorDom, attributes ).map( heading => {
				return { ...heading }
			} )
			setHeadings( headings )
		}
	}, [ getEditorDom, forceUpdateHeadings ] )

	// Update headings attribute when the headings state changes
	useEffect( debounce( () => {
		if ( ! isEqual( attributes.headings, headings ) ) {
			__unstableMarkNextChangeAsNotPersistent()
			setAttributes( { headings } )
		}
	}, 301 ), [ headings ] )

	useGeneratedCss( props.attributes )

	const { listType } = attributes
	const tagName = isEmpty( listType ) || listType === 'unordered' || listType === 'none' ? 'ul' : 'ol'

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
	const filteredHeadlingList = headings.filter( heading => allowedLevels.includes( heading.tag ) )

	const nestedHeadingList = linearToNestedHeadingList( filteredHeadlingList )

	const hasEmptyAnchor = headings.some( heading => heading.content && ! heading.anchor )

	const autoGenerateAnchors = useCallback( () => {
		const BLOCK_ANCHOR_CONTENT = applyFilters( 'stackable.table-of-contents.block-anchor-content', {
			'core/heading': 'content',
			'stackable/heading': 'text',
		} )

		const supportedBlocks = Object.keys( BLOCK_ANCHOR_CONTENT )
		const blocks = getAllBlocks( getBlocks ).filter( block => supportedBlocks.includes( block.name ) )

		blocks.map( block => {
			const content = block.attributes[ BLOCK_ANCHOR_CONTENT[ block.name ] ]
			const { anchor } = block.attributes
			if ( ! anchor && content ) {
				const anchor = generateAnchor( content, blocks )
				// This side-effect should not create an undo level.
				block.attributes.anchor = anchor !== null ? anchor : uniqueId( 'stk-' )
			}
			return block
		} )

		// Sometimes this doesn't trigger the headings to be updated.
		setForceUpdateHeadings( forceUpdateHeadings + 1 )
	}, [] )

	// When generating an example block preview, just show a list of headings.
	// @see example.js
	if ( props.attributes.example ) {
		return (
			<RichText
				tagName="ul"
				multiline="li"
				value={ props.attributes.example }
			/>
		)
	}

	return (
		<Fragment>
			<InspectorTabs />

			<BlockDiv.InspectorControls />

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'General', i18n ) }
					initialOpen={ true }
					id="general"
				>
					<HeadingsControls />

					<AdvancedSelectControl
						label={ __( 'List Type', i18n ) }
						attribute="listType"
						options={ listTypeOptions }
					/>

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
						default="32"
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
				</PanelAdvancedSettings>
			</InspectorStyleControls>

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'Scrolling', i18n ) }
					initialOpen={ false }
					id="scrolling"
				>
					<AdvancedToggleControl
						label={ __( 'Use smooth scroll', i18n ) }
						attribute="isSmoothScroll"
					/>
					<AdvancedRangeControl
						label={ __( 'Scroll Top Offset ', i18n ) }
						attribute="scrollTopOffset"
						min={ 0 }
						max={ 200 }
						step={ 1 }
						responsive="all"
						placeholder="0"
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>

			<InspectorStyleControls>
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
					className="stk-table-of-contents__table"
					nestedHeadingList={ nestedHeadingList }
					isSelected={ isSelected }
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
