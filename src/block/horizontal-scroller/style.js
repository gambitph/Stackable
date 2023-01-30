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
import { BlockCssCompiler, BlockCss } from '~stackable/components'

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
		versionAdded: '3.6.1',
		versionDeprecated: '',
	}

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=".%s-horizontal-scroller"
				styleRule="--stk-column-gap"
				attrName="horizontalScrollerColumnGap"
				key="horizontalScrollerColumnGap-save"
				format="%spx"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector=".%s-horizontal-scroller > .block-editor-inner-blocks > .block-editor-block-list__layout"
				styleRule="--stk-column-gap"
				attrName="horizontalScrollerColumnGap"
				key="horizontalScrollerColumnGap"
				format="%spx"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=".%s-horizontal-scroller"
				styleRule="--stk-column-width"
				attrName="horizontalScrollerColumnWidth"
				key="horizontalScrollerColumnWidth-save"
				hasUnits="px"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector=".%s-horizontal-scroller > .block-editor-inner-blocks > .block-editor-block-list__layout"
				styleRule="--stk-column-width"
				attrName="horizontalScrollerColumnWidth"
				key="horizontalScrollerColumnWidth"
				hasUnits="px"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=".%s-horizontal-scroller"
				styleRule="--stk-column-height"
				attrName="horizontalScrollerHeight"
				key="horizontalScrollerHeight-save"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector=".%s-horizontal-scroller > .block-editor-inner-blocks > .block-editor-block-list__layout"
				styleRule="--stk-column-height"
				attrName="horizontalScrollerHeight"
				key="horizontalScrollerHeight"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=".%s-horizontal-scroller"
				styleRule="--stk-left-offset"
				attrName="horizontalScrollerLeftOffset"
				key="horizontalScrollerLeftOffset-save"
				hasUnits="px"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector=".%s-horizontal-scroller > .block-editor-inner-blocks > .block-editor-block-list__layout"
				styleRule="--stk-left-offset"
				attrName="horizontalScrollerLeftOffset"
				key="horizontalScrollerLeftOffset"
				hasUnits="px"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=".%s-horizontal-scroller"
				styleRule="--stk-snapping"
				attrName="horizontalScrollerSnap"
				key="horizontalScrollerSnap-save"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector=".%s-horizontal-scroller > .block-editor-inner-blocks > .block-editor-block-list__layout"
				styleRule="--stk-snapping"
				attrName="horizontalScrollerSnap"
				key="horizontalScrollerSnap"
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
