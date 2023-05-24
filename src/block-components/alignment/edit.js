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
import { AlignmentToolbar, BlockControls } from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element'
import { sprintf, __ } from '@wordpress/i18n'

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

export const Edit = props => {
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
			units={ [ 'px', '%' ] }
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
				visualGuide={ { selector: '.stk-%s-container', highlight: 'outline' } }
			/>
		}
	</>

	return (
		<Fragment>
			<BlockControls>
				<AlignmentToolbar
					value={ contentAlign }
					onChange={ contentAlign => setAttributes( { contentAlign } ) }
					alignmentControls={ props.hasContentJustify ? ALIGN_OPTIONS : ALIGN_OPTIONS_NO_JUSTIFY }
				/>

			</BlockControls>
			<InspectorLayoutControls>
				{ props.containerSizePriority < 5 && containerSize }
				<AlignButtonsControl
					label={ labelContentAlign }
					attribute="contentAlign"
					responsive="all"
					justified={ props.hasContentJustify }
				/>
				{ props.hasColumnJustify &&
					<AdvancedToolbarControl
						label={ sprintf( __( '%s Justify', i18n ), __( 'Column', i18n ) ) }
						attribute="columnJustify"
						responsive="all"
						controls="flex-horizontal"
						disableTablet={ ! columnJustify }
						disableMobile={ ! columnJustify }
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
					/>
				}
			</InspectorLayoutControls>
		</Fragment>
	)
}

Edit.defaultProps = {
	hasColumnJustify: false,
	hasRowAlignment: false,
	hasColumnAlignment: false,
	hasBlockAlignment: false,
	hasContainerSize: false,
	hasContainerHeight: true,
	containerSizePriority: 5,
}
