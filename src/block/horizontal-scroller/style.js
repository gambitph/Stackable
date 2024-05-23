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
import { useBlockAttributesContext } from '~stackable/hooks'
import { BlockCss, BlockCssCompiler } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'

const alignmentOptions = {
	editorSelectorCallback: getAttribute => `.stk--block-align-${ getAttribute( 'uniqueId' ) } > .block-editor-inner-blocks > .block-editor-block-list__layout`,
}

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.6.4',
		versionDeprecated: '',
	}

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				selector=".%s-horizontal-scroller"
				styleRule="--stk-columns-spacing"
				attrName="columnSpacing"
				key="columnSpacing"
				hasUnits="px"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".%s-horizontal-scroller"
				styleRule="--stk-column-gap"
				attrName="horizontalScrollerColumnGap"
				key="horizontalScrollerColumnGap-save"
				format="%spx"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".%s-horizontal-scroller"
				styleRule="--stk-column-width"
				attrName="horizontalScrollerColumnWidth"
				key="horizontalScrollerColumnWidth-save"
				hasUnits="px"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".%s-horizontal-scroller"
				styleRule="--stk-column-height"
				attrName="horizontalScrollerHeight"
				key="horizontalScrollerHeight-save"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".%s-horizontal-scroller"
				styleRule="--stk-left-offset"
				attrName="horizontalScrollerLeftOffset"
				key="horizontalScrollerLeftOffset-save"
				hasUnits="px"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".%s-horizontal-scroller"
				styleRule="--stk-snapping"
				attrName="horizontalScrollerSnap"
				key="horizontalScrollerSnap-save"
			/>

			<BlockCss
				{ ...propsToPass }
				selector=".%s-horizontal-scroller"
				styleRule="--stk-scrollbar-height"
				attrName="scrollbarHeight"
				key="scrollbarHeight"
				format="%spx"
				enabledCallback={ getAttribute => getAttribute( 'showScrollbar' ) }
				dependencies={ [ 'showScrollbar' ] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".%s-horizontal-scroller"
				styleRule="--stk-scrollbar-height-firefox"
				attrName="scrollbarHeight"
				key="scrollbarHeightFirefox"
				valueCallback={ value => {
					return value === 0 ? 'none' : ( value < 10 ? 'thin' : 'auto' )
				} }
				enabledCallback={ getAttribute => getAttribute( 'showScrollbar' ) }
				dependencies={ [ 'showScrollbar' ] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".%s-horizontal-scroller"
				styleRule="--stk-scrollbar-track-color"
				attrName="scrollbarTrackColor"
				key="scrollbarTrackColor"
				enabledCallback={ getAttribute => getAttribute( 'showScrollbar' ) }
				dependencies={ [ 'showScrollbar' ] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".%s-horizontal-scroller"
				styleRule="--stk-scrollbar-thumb-color"
				attrName="scrollbarThumbColor"
				key="scrollbarThumbColor"
				enabledCallback={ getAttribute => getAttribute( 'showScrollbar' ) }
				dependencies={ [ 'showScrollbar' ] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".%s-horizontal-scroller"
				styleRule="--stk-scrollbar-thumb-radius"
				attrName="scrollbarThumbRadius"
				key="scrollbarThumbRadius"
				hasUnits="px"
				enabledCallback={ getAttribute => getAttribute( 'showScrollbar' ) }
				dependencies={ [ 'showScrollbar' ] }
			/>
		</>
	)
}

const BlockStyles = memo( props => {
	const columnArrangement = useBlockAttributesContext( attributes => attributes.columnArrangementMobile || attributes.columnArrangementTablet )
	const numColumns = ( columnArrangement || '' ).split( ',' ).length

	const ColumnOrderStyle = applyFilters( 'stackable.block-component.columns.column-order-style', null )

	return (
		<>
			<Alignment.Style { ...props } { ...alignmentOptions } />
			<BlockDiv.Style { ...props } />
			<MarginBottom.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<Styles { ...props } />
			{ ColumnOrderStyle && <ColumnOrderStyle { ...props } numColumns={ numColumns } /> }
		</>
	)
} )

BlockStyles.defaultProps = {
	version: '',
}

BlockStyles.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	const numColumns = ( props.attributes.columnArrangementMobile || props.attributes.columnArrangementTablet || '' ).split( ',' ).length
	const ColumnOrderStyle = applyFilters( 'stackable.block-component.columns.column-order-style', null )

	return (
		<BlockCssCompiler>
			<Alignment.Style.Content { ...props } { ...alignmentOptions } />
			<BlockDiv.Style.Content { ...props } />
			<MarginBottom.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<EffectsAnimations.Style.Content { ...props } />
			<Styles { ...props } />
			{ ColumnOrderStyle && <ColumnOrderStyle { ...props } numColumns={ numColumns } selector={ '.%s-horizontal-scroller' } /> }
		</BlockCssCompiler>
	)
}

BlockStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}

export default BlockStyles
