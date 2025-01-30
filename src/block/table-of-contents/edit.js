/**
 * Internal dependencies
 */
import blockStyles from './style'
import { generateAnchor } from './autogenerate-anchors'
import TableOfContentsList from './table-of-contents-list'
import { getUpdatedHeadings, linearToNestedHeadingList } from './util'

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
	RichText,
	useBlockCssGenerator,
} from '~stackable/components'
import {
	withBlockAttributeContext, withBlockWrapperIsHovered, withQueryLoopContext,
} from '~stackable/higher-order'
import {
	Typography,
	BlockDiv,
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
import { compose } from '@wordpress/compose'
import {
	Button,
	Card,
	CardBody,
} from '@wordpress/components'
import { useSelect, dispatch } from '@wordpress/data'
import {
	useEffect, useState, useCallback, memo,
} from '@wordpress/element'
import {
	__, _x, sprintf,
} from '@wordpress/i18n'
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
	const { getBlock } = useSelect( 'core/block-editor' )
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
				// Make sure to also filter excluded headings to avoid
				// comparing heading with wrong index.
				const allowedLevels = [ 1, 2, 3, 4, 5, 6 ].filter(
					n => attributes[ `includeH${ n }` ]
				)
				const editorHeadings = getUpdatedHeadings( getEditorDom, attributes )
					.filter( heading =>
						allowedLevels.includes( heading.tag )
					)
					.map( ( heading, i ) => {
						// Removed any blank customContent so a heading won't show up as blank.
						if ( headings[ i ] && headings[ i ].customContent === '' && typeof headings[ i ].customContent !== 'undefined' ) {
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
				if ( updatedHeadings[ i ] && heading.customContent === '' && typeof updatedHeadings[ i ].customContent !== 'undefined' ) {
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
			dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
			setAttributes( { headings } )
		}
	}, 301 ), [ headings ] )

	const { listType } = attributes
	const tagName = isEmpty( listType ) || listType === 'unordered' || listType === 'none' ? 'ul' : 'ol'

	const textClasses = getTypographyClasses( attributes )
	const blockAlignmentClass = getAlignmentClasses( attributes )

	const titleTextClasses = getTypographyClasses( attributes, 'title%s' )

	const blockClassNames = classnames( [
		className,
		'stk-block-table-of-contents',
		blockAlignmentClass,
	] )

	const tableOfContentsClassNames = classnames( [
		'stk-table-of-contents__table',
		textClasses,
	] )

	const titleClassNames = classnames(
		'stk-table-of-contents__title',
		titleTextClasses
	)

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
			'ugb/heading': 'title',
		} )

		const blocks = headings.map( heading => {
			const block = getBlock( heading.clientId )
			if ( block ) {
				return block
			}

			// If we cannot find the clientId, it means it changed (or the
			// editor was refreshed and clientIds changed), try looking for it
			// in other ways.
			const editorDom = getEditorDom()
			const blockTypes = Object.keys( BLOCK_ANCHOR_CONTENT )
			// Look for the element with the same text
			const blockTypeSelector = blockTypes.map( type => {
				return `[data-type="${ type }"]`
			} ).join( ',' )

			let clientId = null

			// Try looking using the anchor.
			if ( heading.anchor ) {
				let blockEl = editorDom.querySelector( `[id="${ heading.anchor }"]` )
				if ( blockEl ) {
					blockEl = blockEl.closest( blockTypeSelector )
					clientId = blockEl?.getAttribute( 'data-block' )
				}
			}
			// Look for the element with the same text
			if ( ! clientId && heading.content ) {
				Array.from( editorDom.querySelectorAll( blockTypeSelector ) || [] ).some( blockEl => {
					if ( heading.content === blockEl.textContent ) {
						clientId = blockEl.getAttribute( 'data-block' )
						return true
					}
					return false
				} )
			}
			if ( clientId ) {
				return getBlock( clientId )
			}
			return null
		} )

		blocks.forEach( block => {
			if ( block ) {
				const content = block.attributes[ BLOCK_ANCHOR_CONTENT[ block.name ] ]
				const { anchor } = block.attributes
				if ( ! anchor && content ) {
					const anchor = generateAnchor( content, blocks )

					// This side-effect should not create an undo level.
					dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
					dispatch( 'core/block-editor' ).updateBlockAttributes( block.clientId, {
						anchor: anchor !== null ? anchor : uniqueId( 'stk-' ),
					} )
				}
			}
		} )

		// Sometimes this doesn't trigger the headings to be updated.
		setForceUpdateHeadings( forceUpdateHeadings + 1 )
	}, [ headings ] )

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
		<>
			<InspectorControls blockState={ props.blockState } />

			{ blockCss && <style key="block-css">{ blockCss }</style> }
			<CustomCSS mainBlockClass="stk-table-of-contents" />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				{ attributes.titleShow && <Typography
					className={ titleClassNames }
					attrNameTemplate="title%s"
					placeholder={ __( 'Title for This Block', i18n ) }
				/> }
				{ !! headings.length && hasEmptyAnchor && (
					<Notice autoGenerateAnchors={ autoGenerateAnchors } />
				) }
				<TableOfContentsList
					className={ tableOfContentsClassNames }
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
			{ props.isHovered && <MarginBottom /> }
		</>
	)
}

const InspectorControls = memo( props => {
	return (
		<>
			<InspectorTabs hasLayoutPanel={ false } />

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
						placeholder="32"
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

			<Typography.InspectorControls
				{ ...props }
				isMultiline={ true }
				initialOpen={ false }
				hasTextTag={ false }
				hasTextContent={ false }
			/>

			<Typography.InspectorControls
				{ ...props }
				label={ __( 'Title', i18n ) }
				attrNameTemplate="title%s"
				initialOpen={ false }
				hasToggle={ true }
				hasTextTag={ false }
			/>

			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-table-of-contents" />
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
