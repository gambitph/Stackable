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
	IconControl,
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
	Fragment, useEffect,
} from '@wordpress/element'
import {
	__,
} from '@wordpress/i18n'

import {
	getUpdatedHeadings,
	linearToNestedHeadingList,
} from './util'

import TableOfContentsList from './table-of-contents-list'

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
	{
		label: __( 'None', i18n ),
		value: 'none',
	},
]

const HeadingsControls = () => (
	[ 'H1', 'H2', 'H3', 'H4', 'H5', 'H6' ].map( heading =>
		<AdvancedToggleControl
			key={ heading }
			label={ `Include ${ heading }` }
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
	const { headings } = attributes
	const { getEditedPostContent } = useSelect( 'core/editor' )

	const toggleItemVisibility = anchor => {
		const updatedHeadings = headings.map( heading => ( { ...heading, isExcluded: heading.anchor === anchor ? ! heading.isExcluded : heading.isExcluded } ) )
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
				setAttributes( { headings: editorHeadings } ) // TODO: change this to silently update the attribute
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
			setAttributes( { headings } ) // TODO: change this to silently update the attribute
		}
	 }, [ getEditorDom, headings.length ] )

	// useEffect( () => {
	// 	const updateHeadings = () => {
	// 		const editorDom = getEditorDom()
	// 		if ( editorDom ) {
	// 			const latestHeadings = getHeadingsFromEditorDom( editorDom, attributes )
	// 			if (
	// 				! isEqual( headings.map( h => ( {
	// 					level: h.level, content: h.content,
	// 				} ) ), latestHeadings.map( h => ( {
	// 					level: h.level, content: h.content,
	// 				} ) ) )
	// 			) {
	// 				setAttributes( { headings: latestHeadings } )
	// 			}
	// 		}
	// 	}
	// 	const unsubscribe = wp.data.subscribe( debounce( updateHeadings ) )
	// 	return () => unsubscribe()
	// }, [ attributes.headings, attributes ] )

	// useEffect( () => {
	// 	// setTimeout( () => setAttributes( { headings } ), 0 )
	// }, [ headings ] )
	// 	return () => unsubscribe()
	//  }, [ headings, attributes ] )

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
						<IconControl
							label={ __( 'Icon', i18n ) }
							value={ attributes.icon }
							onChange={ icon => {
								// Reset custom individual icons.
								setAttributes( { icon, icons: [] } )
							} }
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
				<TableOfContentsList
					nestedHeadingList={ linearToNestedHeadingList( headings ) }
					isSelected={ isSelected }
					listTag={ tagName }
					toggleItemVisibility={ toggleItemVisibility }
					h1={ attributes.includeH1 }
					h2={ attributes.includeH2 }
					h3={ attributes.includeH3 }
					h4={ attributes.includeH4 }
					h5={ attributes.includeH5 }
					h6={ attributes.includeH6 }
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
