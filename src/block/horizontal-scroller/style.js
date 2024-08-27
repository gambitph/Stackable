/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv,
	EffectsAnimations,
	MarginBottom,
	Transform,
} from '~stackable/block-components'
// import { useBlockAttributesContext } from '~stackable/hooks'
import { BlockStyleGenerator } from '~stackable/components'

/**
 * WordPress dependencies
 */
// import { applyFilters } from '@wordpress/hooks'

const blockStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

blockStyles.addBlockStyles( 'columnSpacing', [ {
	selector: '.%s-horizontal-scroller',
	styleRule: '--stk-columns-spacing',
	attrName: 'columnSpacing',
	key: 'columnSpacing',
	hasUnits: 'px',
	responsive: 'all',
} ] )

blockStyles.addBlockStyles( 'horizontalScrollerColumnGap', [ {
	selector: '.%s-horizontal-scroller',
	styleRule: '--stk-column-gap',
	attrName: 'horizontalScrollerColumnGap',
	key: 'horizontalScrollerColumnGap-save',
	format: '%spx',
	responsive: 'all',
} ] )

blockStyles.addBlockStyles( 'horizontalScrollerColumnWidth', [ {
	selector: '.%s-horizontal-scroller',
	styleRule: '--stk-column-width',
	attrName: 'horizontalScrollerColumnWidth',
	key: 'horizontalScrollerColumnWidth-save',
	hasUnits: 'px',
	responsive: 'all',
} ] )

blockStyles.addBlockStyles( 'horizontalScrollerHeight', [ {
	selector: '.%s-horizontal-scroller',
	styleRule: '--stk-column-height',
	attrName: 'horizontalScrollerHeight',
	key: 'horizontalScrollerHeight-save',
	format: '%spx',
} ] )

blockStyles.addBlockStyles( 'horizontalScrollerLeftOffset', [ {
	selector: '.%s-horizontal-scroller',
	styleRule: '--stk-left-offset',
	attrName: 'horizontalScrollerLeftOffset',
	key: 'horizontalScrollerLeftOffset-save',
	hasUnits: 'px',
	responsive: 'all',
} ] )

blockStyles.addBlockStyles( 'horizontalScrollerSnap', [ {
	selector: '.%s-horizontal-scroller',
	styleRule: '--stk-snapping',
	attrName: 'horizontalScrollerSnap',
	key: 'horizontalScrollerSnap-save',
} ] )

blockStyles.addBlockStyles( 'scrollbarHeight', [ {
	selector: '.%s-horizontal-scroller',
	styleRule: '--stk-scrollbar-height',
	attrName: 'scrollbarHeight',
	key: 'scrollbarHeight',
	format: '%spx',
	enabledCallback: getAttribute => getAttribute( 'showScrollbar' ),
	dependencies: [ 'showScrollbar' ],
}, {
	selector: '.%s-horizontal-scroller',
	styleRule: '--stk-scrollbar-height-firefox',
	attrName: 'scrollbarHeight',
	key: 'scrollbarHeightFirefox',
	valueCallback: value => {
		return value === 0 ? 'none' : ( value < 10 ? 'thin' : 'auto' )
	},
	enabledCallback: getAttribute => getAttribute( 'showScrollbar' ),
	dependencies: [ 'showScrollbar' ],
} ] )

blockStyles.addBlockStyles( 'scrollbarTrackColor', [ {
	selector: '.%s-horizontal-scroller',
	styleRule: '--stk-scrollbar-track-color',
	attrName: 'scrollbarTrackColor',
	key: 'scrollbarTrackColor',
	enabledCallback: getAttribute => getAttribute( 'showScrollbar' ),
	dependencies: [ 'showScrollbar' ],
} ] )

blockStyles.addBlockStyles( 'scrollbarThumbColor', [ {
	selector: '.%s-horizontal-scroller',
	styleRule: '--stk-scrollbar-thumb-color',
	attrName: 'scrollbarThumbColor',
	key: 'scrollbarThumbColor',
	enabledCallback: getAttribute => getAttribute( 'showScrollbar' ),
	dependencies: [ 'showScrollbar' ],
} ] )

blockStyles.addBlockStyles( 'scrollbarThumbRadius', [ {
	selector: '.%s-horizontal-scroller',
	styleRule: '--stk-scrollbar-thumb-radius',
	attrName: 'scrollbarThumbRadius',
	key: 'scrollbarThumbRadius',
	hasUnits: 'px',
	enabledCallback: getAttribute => getAttribute( 'showScrollbar' ),
	dependencies: [ 'showScrollbar' ],
} ] )

Alignment.Style.addStyles( blockStyles, {
	editorSelectorCallback: getAttribute => `.stk--block-align-${ getAttribute( 'uniqueId' ) } > .block-editor-inner-blocks > .block-editor-block-list__layout`,
} )
BlockDiv.Style.addStyles( blockStyles )
MarginBottom.Style.addStyles( blockStyles )
Advanced.Style.addStyles( blockStyles )
Transform.Style.addStyles( blockStyles )
EffectsAnimations.Style.addStyles( blockStyles )

// const columnArrangement = useBlockAttributesContext( attributes => attributes.columnArrangementMobile || attributes.columnArrangementTablet )
// const numColumns = ( columnArrangement || '' ).split( ',' ).length

// const ColumnOrderStyle = applyFilters( 'stackable.block-component.columns.column-order-style', null )
// { ColumnOrderStyle && <ColumnOrderStyle { ...props } numColumns={ numColumns } /> }

export default blockStyles
