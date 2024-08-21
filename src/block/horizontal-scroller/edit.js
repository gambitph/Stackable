/**
 * Internal dependencies
 */
import BlockStyles from './style'

/**
 * External dependencies
 */
import { version as VERSION, i18n } from 'stackable'
import classnames from 'classnames'
import {
	ColumnInnerBlocks,
	GroupPlaceholder,
	InspectorTabs,
	PanelAdvancedSettings,
	InspectorStyleControls,
	AdvancedRangeControl,
	AdvancedSelectControl,
	ColorPaletteControl,
	InspectorLayoutControls,
	ControlSeparator,
} from '~stackable/components'

import {
	BlockDiv,
	ColumnsControl,
	useGeneratedCss,
	MarginBottom,
	Alignment,
	getAlignmentClasses,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Transform,
	getContentAlignmentClasses,
} from '~stackable/block-components'
import { useBlockContext } from '~stackable/hooks'
import {
	withBlockAttributeContext,
	withBlockWrapperIsHovered,
	withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'
import { memo } from '@wordpress/element'

const ALLOWED_INNER_BLOCKS = [ 'stackable/column' ]
const TEMPLATE = [
	[ 'stackable/column' ],
	[ 'stackable/column' ],
	[ 'stackable/column' ],
]

const Edit = props => {
	 const {
		 className,
		 clientId,
		 setAttributes,
	 } = props

	 const {
		showScrollbar,
		scrollbarHeight,
	 } = props.attributes

	 useGeneratedCss( props.attributes )

	 const blockAlignmentClass = getAlignmentClasses( props.attributes )
	 const { hasInnerBlocks } = useBlockContext()
	 const [ columnProviderValue, columnTooltipClass ] = ColumnInnerBlocks.useContext()

	 const blockClassNames = classnames( [
		 className,
		 'stk-block-horizontal-scroller editor',
		 columnTooltipClass,
	 ] )

	 const contentClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
	 ], getContentAlignmentClasses( props.attributes, 'horizontal-scroller' ), {
		'stk--with-scrollbar': showScrollbar,
	 } )

	 return (
		 <>
			<InspectorControls
				setAttributes={ setAttributes }
				showScrollbar={ showScrollbar }
				scrollbarHeight={ scrollbarHeight }
			/>

			 <BlockDiv
				 blockHoverClass={ props.blockHoverClass }
				 clientId={ props.clientId }
				 attributes={ props.attributes }
				 className={ blockClassNames }
			 >
				 <BlockStyles
					 version={ VERSION }
					 blockState={ props.blockState }
					 clientId={ clientId }
				 />
				 <CustomCSS mainBlockClass="stk-block-horizontal-scroller" />

				 { ! hasInnerBlocks && <GroupPlaceholder /> }
				<div
					className={ contentClassNames }
					data-align={ ! props.attributes.contentAlign ? undefined // Only needed in the backend
							 : props.attributes.contentAlign === 'alignwide' ? 'wide'
								 : props.attributes.contentAlign === 'alignfull' ? 'full' : undefined }
				>
					<ColumnInnerBlocks
						providerValue={ columnProviderValue }
						orientation="horizontal"
						renderAppender={ false }
						template={ props.attributes.templateLock ? undefined : TEMPLATE }
						allowedBlocks={ ALLOWED_INNER_BLOCKS }
						templateLock={ props.attributes.templateLock || false }
					/>
				</div>
			 </BlockDiv>
			 { props.isHovered && hasInnerBlocks && <MarginBottom /> }
		 </>
	 )
}

const InspectorControls = memo( props => {
	return (
		<>
			<InspectorTabs />

			<InspectorLayoutControls>
				<ColumnsControl sliderMax={ 10 } />
				<AdvancedSelectControl
					label={ __( 'Snapping', i18n ) }
					attribute="horizontalScrollerSnap"
					options={ [
						{ value: 'start', label: __( 'Snap to Start', i18n ) },
						{ value: 'center', label: __( 'Snap to Center', i18n ) },
						{ value: 'none', label: __( 'No Snapping', i18n ) },
					] }
					default="center"
				/>
				<ControlSeparator />
				<AdvancedRangeControl
					label={ __( 'Item Width', i18n ) }
					attribute="horizontalScrollerColumnWidth"
					responsive="all"
					units={ [ 'px', 'em', '%', 'vw' ] }
					min={ [ 0, 0, 0 ] }
					sliderMax={ [ 500, 40, 100 ] }
					step={ [ 1, 0.1, 1 ] }
					placeholder={ 300 }
				/>
				<AdvancedRangeControl
					label={ __( 'Height', i18n ) }
					attribute="horizontalScrollerHeight"
					min="0"
					sliderMin={ 0 }
					sliderMax={ 500 }
					step="1"
					placeholder="auto"
				/>
				<AdvancedRangeControl
					label={ __( 'Inner Column Spacing', i18n ) }
					attribute="columnSpacing"
					responsive="all"
					units={ [ 'px', 'em', 'vw' ] }
					defaultLocked={ true }
					min={ [ 0, 0 ] }
					sliderMax={ [ 200, 30 ] }
					placeholder="12"
				/>
				<AdvancedRangeControl
					label={ __( 'Gap', i18n ) }
					attribute="horizontalScrollerColumnGap"
					responsive="all"
					min={ 0 }
					sliderMax={ 100 }
					placeholder="0"
				/>
				<AdvancedRangeControl
					label={ __( 'Left Offset', i18n ) }
					attribute="horizontalScrollerLeftOffset"
					responsive="all"
					units={ [ 'px', 'em', '%' ] }
					min={ [ 0, 0, 0 ] }
					sliderMax={ [ 500, 40, 50 ] }
					step={ [ 1, 0.1, 1 ] }
				/>
				<ControlSeparator />
			</InspectorLayoutControls>
			<Alignment.InspectorControls hasRowAlignment={ true } />

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'Scrollbar', i18n ) }
					initialOpen={ false }
					hasToggle
					checked={ props.showScrollbar }
					onChange={ showScrollbar => props.setAttributes( { showScrollbar } ) }
				>
					<AdvancedRangeControl
						label={ __( 'Height', i18n ) }
						attribute="scrollbarHeight"
						min="0"
						sliderMin={ 0 }
						sliderMax={ 25 }
						step="1"
						placeholder="10"
					/>
					<ColorPaletteControl
						label={ __( 'Track Color', i18n ) }
						attribute="scrollbarTrackColor"
					/>
					<ColorPaletteControl
						label={ __( 'Thumb Color', i18n ) }
						attribute="scrollbarThumbColor"
					/>
					<AdvancedRangeControl
						label={ __( 'Thumb Radius', i18n ) }
						attribute="scrollbarThumbRadius"
						allowReset={ true }
						min="0"
						units={ [ 'px', '%', 'rem' ] }
						step="1"
						sliderMax={ Math.ceil( ( props.scrollbarHeight || 10 ) / 2 ) }
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>

			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-horizontal-scroller" />
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
