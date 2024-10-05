/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	AdvancedToolbarControl,
	AlignButtonsControl,
	ControlSeparator,
	InspectorLayoutControls,
	AdvancedRangeControl,
} from '~stackable/components'
import {
	useBlockAttributesContext,
	useBlockSetAttributesContext,
	useDeviceType,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import {
	AlignmentToolbar,
	BlockControls,
} from '@wordpress/block-editor'
import { memo } from '@wordpress/element'
import { sprintf, __ } from '@wordpress/i18n'
import { addFilter } from '@wordpress/hooks'
import { useSelect } from '@wordpress/data'

const ALIGN_OPTIONS = [
	{
		align: 'left',
		title: __( 'Align Left', i18n ),
		icon: 'editor-alignleft',
	},
	{
		align: 'center',
		title: __( 'Align Center', i18n ),
		icon: 'editor-aligncenter',
	},
	{
		align: 'right',
		title: __( 'Align Right', i18n ),
		icon: 'editor-alignright',
	},
	{
		align: 'justify',
		title: __( 'Justified', i18n ),
		icon: 'editor-justify',
	},
]

const ALIGN_OPTIONS_NO_JUSTIFY = ALIGN_OPTIONS.filter( option => option.align !== 'justify' )

export const Edit = memo( props => {
	const {
		contentAlign,
		columnJustify,
		innerBlockOrientation,
		innerBlockWrap,
		containerWidth,
		containerWidthTablet,
		containerWidthMobile,
		alignLastBlockToBottom,
		innerBlockRowGap,
		innerBlockColumnGap,
	} = useBlockAttributesContext( attributes => {
		return {
			contentAlign: attributes.contentAlign,
			columnJustify: attributes.columnJustify,
			innerBlockOrientation: attributes.innerBlockOrientation,
			innerBlockWrap: attributes.innerBlockWrap,
			containerWidth: attributes.containerWidth,
			containerWidthTablet: attributes.containerWidthTablet,
			containerWidthMobile: attributes.containerWidthMobile,
			alignLastBlockToBottom: attributes.alignLastBlockToBottom,
			innerBlockRowGap: attributes.innerBlockRowGap,
			innerBlockColumnGap: attributes.innerBlockColumnGap,
		}
	} )
	const setAttributes = useBlockSetAttributesContext()
	const deviceType = useDeviceType()

	const {
		labelContentAlign = sprintf( __( '%s Alignment', i18n ), __( 'Content', i18n ) ),
		enableContentAlign = true,
	} = props

	const containerSize = props.hasContainerSize && <>
		<ControlSeparator />
		{ props.hasContainerHeight &&
			<AdvancedRangeControl
				label={ __( 'Content Min. Height', i18n ) }
				attribute="containerHeight"
				responsive="all"
				units={ [ 'px', 'vh' ] }
				min={ [ 0, 0 ] }
				sliderMax={ [ 1000, 100 ] }
				step={ [ 1, 1 ] }
				allowReset={ true }
				placeholder="0"
				visualGuide={ { selector: '.stk-%s-container', highlight: 'outline' } }
			/>
		}
		<AdvancedRangeControl
			label={ __( 'Content Max Width', i18n ) }
			attribute="containerWidth"
			responsive="all"
			units={ [ 'px', '%', 'vw' ] }
			min={ [ 0, 0 ] }
			sliderMax={ [ 1500, 100 ] }
			step={ [ 1, 1 ] }
			allowReset={ true }
			placeholder=""
			initialPosition="1500"
			visualGuide={ { selector: '.stk-%s-container', highlight: 'outline' } }
		/>

		{ (
			( containerWidth !== '' && deviceType === 'Desktop' ) ||
			( ( containerWidth !== '' || containerWidthTablet !== '' ) && deviceType === 'Tablet' ) ||
			( ( containerWidth !== '' || containerWidthTablet !== '' || containerWidthMobile !== '' ) && deviceType === 'Mobile' )
		) &&
			<AdvancedToolbarControl
				label={ __( 'Content Horizontal Align', i18n ) }
				attribute="containerHorizontalAlign"
				responsive="all"
				controls="horizontal"
				helpTooltip={ {
					video: 'content-horizontal-align',
					description: __( 'Sets the placement of the column container to left, center or right. Not available when block width is set to full width.', i18n ),

				} }
				visualGuide={ { selector: '.stk-%s-container', highlight: 'outline' } }
			/>
		}
	</>

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={ contentAlign }
					onChange={ contentAlign => setAttributes( { contentAlign } ) }
					alignmentControls={ props.hasContentJustify ? ALIGN_OPTIONS : ALIGN_OPTIONS_NO_JUSTIFY }
				/>

			</BlockControls>
			<InspectorLayoutControls>
				{ props.containerSizePriority < 5 && containerSize }
				{ enableContentAlign && <AlignButtonsControl
					label={ labelContentAlign }
					attribute="contentAlign"
					responsive="all"
					justified={ props.hasContentJustify }
					helpTooltip={ {
						video: 'alignment-all',
						description: __( 'Adjusts the placement of all content in the block to align left, center or right', i18n ),
					} }
				/> }
				{ props.hasColumnJustify &&
					<AdvancedToolbarControl
						label={ sprintf( __( '%s Justify', i18n ), __( 'Column', i18n ) ) }
						attribute="columnJustify"
						responsive="all"
						controls="flex-horizontal"
						disableTablet={ ! columnJustify }
						disableMobile={ ! columnJustify }
						helpTooltip={ {
							video: 'content-horizontal-align',
							description: __( 'Sets the horizontal position and spacing of the inner columns.', i18n ),
						} }
						visualGuide={ {
							selector: '.stk-%s-column > * > * > [data-type]',
							highlight: 'outline',
						} }
						help={ __( 'Column contents need to be narrow for effect to show.', i18n ) }
					/>
				}
				{ props.hasColumnAlignment &&
					<AdvancedToolbarControl
						label={ sprintf( __( '%s Alignment', i18n ), __( 'Column', i18n ) ) }
						attribute="columnAlign"
						responsive="all"
						controls="flex-vertical"
						helpTooltip={ {
							video: 'column-vertical-align',
							description: __( 'Sets the vertical position of the inner columns relative to the columns block.', i18n ),
						} }
						visualGuide={ {
							// The 2nd selector (after the comma) is to select
							// the parent Columns block where this Inner Column
							// block belongs to.
							selector: ', .stk-block-columns:has( > .stk-inner-blocks > * > * > [data-type="stackable/column"] > * > .stk-%s)',
							highlight: 'outline-second-offset',
						} }
					/>
				}
				{ props.hasRowAlignment &&
					<AdvancedToolbarControl
						label={ sprintf( __( '%s Alignment', i18n ), __( 'Column', i18n ) ) }
						attribute="rowAlign"
						responsive="all"
						controls="flex-vertical"
						helpTooltip={ {
							video: 'column-vertical-align',
							description: __( 'Sets the vertical position of the inner columns relative to the columns block.', i18n ),
						} }
						visualGuide={ { selector: '.stk-%s-column > * > * > [data-type]', highlight: 'outline' } }
					/>
				}
				{ props.containerSizePriority === 5 && containerSize }
				{ ( props.hasColumnAlignment || props.hasBlockAlignment ) && <ControlSeparator /> }
				{ ( props.hasColumnAlignment || props.hasBlockAlignment ) &&
					<AdvancedToolbarControl
						label={ sprintf( __( '%s Direction', i18n ), __( 'Inner Block', i18n ) ) }
						controls={ [
							{
								value: 'horizontal',
								title: __( 'Horizontal', i18n ),
							},
							{
								value: '',
								title: __( 'Vertical', i18n ),
							},
						] }
						attribute="innerBlockOrientation"
						onChange={ value => {
							const newAttributes = {
								innerBlockOrientation: value,
							}
							if ( value === '' ) { // Vertical.
								newAttributes.innerBlockJustify = ''
							} else { // Horizontal
								newAttributes.innerBlockAlign = ''
							}
							setAttributes( newAttributes )
						} }
					/>
				}
				{ ( props.hasColumnAlignment || props.hasBlockAlignment ) &&
					<AdvancedToolbarControl
						label={ sprintf( __( '%s Justify', i18n ), __( 'Inner Block', i18n ) ) }
						attribute="innerBlockJustify"
						responsive="all"
						controls={ innerBlockOrientation ? 'flex-horizontal' : 'horizontal' }
						visualGuide={ {
							selector: '.stk-%s-container, .stk-%s-container > * > .block-editor-block-list__layout > [data-type]',
							highlight: 'outline-first-offset',
						} }
						helpTooltip={ {
							// TODO: Add a working video
							description: __( 'Sets the horizontal/vertical position and spacing of the inner blocks.', i18n ),
						} }
					/>
				}
				{ ( props.hasColumnAlignment || props.hasBlockAlignment ) &&
					<AdvancedToolbarControl
						label={ sprintf( __( '%s Alignment', i18n ), __( 'Inner Block', i18n ) ) }
						attribute="innerBlockAlign"
						responsive="all"
						controls={ innerBlockOrientation ? 'vertical' : 'flex-justify-vertical' }
						disabled={ alignLastBlockToBottom ? 'all' : undefined }
						visualGuide={ {
							selector: '.stk-%s-container, .stk-%s-container > * > .block-editor-block-list__layout > [data-type]',
							highlight: 'outline-first-offset',
						} }
						helpTooltip={ {
							// TODO: Add a working video
							description: __( 'Aligns the horizontal/vertical position of the inner blocks.', i18n ),
						} }
						help={ __( 'Set Content Min. Height for alignment to display properly', i18n ) }
					/>
				}
				{ innerBlockOrientation &&
					<AdvancedToolbarControl
						label={ __( 'Inner Block Wrapping', i18n ) }
						controls={ [
							{
								value: '',
								title: __( 'No Wrap', i18n ),
							},
							{
								value: 'wrap',
								title: __( 'Wrap', i18n ),
							},
						] }
						attribute="innerBlockWrap"
					/>
				}
				{ innerBlockOrientation && // This is "column gap" when the blocks are horizontal.
					<AdvancedRangeControl
						label={ innerBlockWrap === 'wrap'
							? sprintf( __( '%s %s', i18n ), __( 'Inner Block', i18n ), __( 'Column Gap', i18n ) )
							: sprintf( __( '%s %s', i18n ), __( 'Inner Block', i18n ), __( 'Gap', i18n ) )
						}
						responsive="all"
						min={ 0 }
						sliderMax={ 100 }
						placeholder="24"
						attribute="innerBlockColumnGap"
						helpTooltip={ {
							// TODO: Add a working video
							description: __( 'Sets the gap between the columns of inner blocks.', i18n ),
						} }
						visualGuide={
							innerBlockWrap !== 'wrap'
								? {
									selector: '.stk-%s-container > * > .block-editor-block-list__layout',
									highlight: 'column-gap',
									value: innerBlockColumnGap,
								}
								: null
						}
					/>
				}
				{ ( props.hasColumnAlignment || props.hasBlockAlignment ) && ! innerBlockOrientation && // This is "row gap" when the blocks are vertical.
					<AdvancedRangeControl
						label={ sprintf( __( '%s %s', i18n ), __( 'Inner Block', i18n ), __( 'Gap', i18n ) ) }
						responsive="all"
						min={ 0 }
						sliderMax={ 100 }
						placeholder="0"
						attribute="innerBlockRowGap"
						helpTooltip={ {
							// TODO: Add a working video
							description: __( 'Sets the gap between inner blocks.', i18n ),
						} }
						visualGuide={ {
							selector: '.stk-%s-container > * > .block-editor-block-list__layout',
							highlight: 'row-gap',
							value: innerBlockRowGap,
						} }
					/>
				}
				{ ( innerBlockOrientation && innerBlockWrap === 'wrap' ) &&
					<AdvancedRangeControl
						label={ sprintf( __( '%s %s', i18n ), __( 'Inner Block', i18n ), __( 'Row Gap', i18n ) ) }
						responsive="all"
						min={ 0 }
						sliderMax={ 100 }
						placeholder="0"
						attribute="innerBlockRowGap"
						helpTooltip={ {
							// TODO: Add a working video
							description: __( 'Sets the gap between the rows of inner blocks.', i18n ),
						} }
					/>
				}
			</InspectorLayoutControls>
		</>
	)
} )

// Add additional classes when browser is Firefox to fix alignment
const userAgent = navigator?.userAgent
if ( userAgent && userAgent.indexOf( 'Firefox' ) !== -1 ) {
	addFilter( 'stackable.block-components.block-div.classnames', 'alignment-editor-has-polyfill', ( classes, props ) => {
		// Use WP's block edit context since our useBlockContext might still be updating when a block is removed
		const innerBlocks = useSelect( select => {
			return select( 'core/block-editor' ).getBlock( props.clientId )?.innerBlocks || []
		}, [ props.clientId ] )

		if ( innerBlocks.length > 0 ) {
			for ( let i = 0; i < innerBlocks.length; i++ ) {
				const { blockMargin } = innerBlocks[ i ].attributes
				if ( blockMargin && ( blockMargin.top === 'auto' || blockMargin.bottom === 'auto' ) ) {
					classes.push( 'stk--alignment-polyfill' )
				}
			}
		}
		return classes
	} )
}

Edit.defaultProps = {
	hasColumnJustify: false,
	hasRowAlignment: false,
	hasColumnAlignment: false,
	hasBlockAlignment: false,
	hasContentJustify: false,
	hasContainerSize: false,
	hasContainerHeight: true,
	containerSizePriority: 5,
}
