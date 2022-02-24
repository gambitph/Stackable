/**
 * Internal dependencies
 */
import { TableOfContentsStyles } from './style'

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
	useSelect,
} from '@wordpress/data'
import {
	Fragment, useEffect, useState,
} from '@wordpress/element'
import {
	__,
} from '@wordpress/i18n'

import {
	getUpdatedHeadings,
	linearToNestedHeadingList,
} from './util'

import TableOfContentsList from './table-of-contents-list'
import { Button } from '@wordpress/components'

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
	const { getEditedPostContent } = useSelect( 'core/editor' )
	const [ headings, setHeadings ] = useState( attributes.headings )

	const toggleItemVisibility = anchor => {
		const updatedHeadings = headings.map( heading => ( { ...heading, isExcluded: heading.anchor === anchor ? ! heading.isExcluded : heading.isExcluded } ) )
		setHeadings( updatedHeadings )
	}

	const updateContent = ( anchor, customContent ) => {
		const updatedHeadings = headings.map( heading => ( { ...heading, customContent: heading.anchor === anchor ? customContent : heading.customContent } ) )
		setHeadings( updatedHeadings )
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
				setHeadings( editorHeadings ) // TODO: change this to silently update the attribute
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
			setHeadings( headings ) // TODO: change this to silently update the attribute
		}
	}, [ getEditorDom, headings.length ] )

	// Update headings attribute when the headings state changes
	useEffect( debounce( () => {
		if ( ! isEqual( attributes.headings, headings ) ) {
			setAttributes( { headings } )
		}
	}, 301 ), [ headings ] )

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

					{ ! ordered && (
						<AdvancedRangeControl
							label={ __( 'Icon Rotation', i18n ) }
							attribute="iconRotation"
							min={ 0 }
							max={ 360 }
							allowReset={ true }
							placeholder="0"
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
					<div className="stk-table-of-contents__empty-anchor">
						<span>{ __( 'You have one or more headings without an anchor id. Anchor ids are required for the Table of Contents block to work.', i18n ) }</span>
						<br />
						<Button
							isSecondary
							onClick={ () => {
								console.log( 'Generating now' ) // eslint-disable-line no-console
							} }
						>
							{ __( 'Auto-generate missing anchor ids', i18n ) }
						</Button>
					</div>
				) }
				<TableOfContentsList
					nestedHeadingList={ nestedHeadingList }
					isSelected={ isSelected }
					listTag={ tagName }
					toggleItemVisibility={ toggleItemVisibility }
					updateContent={ updateContent }
				/>
				{ headings.length === 0 && (
					<div className="stk-table-of-contents__placeholder">
						<p><em>
							{ __(
								'Adding Heading blocks to add entries.',
								'stackable-ultimate-gutenberg-blocks'
							) }
						</em></p>
					</div>
				) }
			</BlockDiv>
			<MarginBottom />
		</Fragment>
	)
}

export default withQueryLoopContext( Edit )
