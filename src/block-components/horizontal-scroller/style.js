import { BlockCss } from '~stackable/components'

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

export const Style = props => {
	return <Styles { ...props } />
}

Style.Content = props => {
	return <Styles { ...props } />
}
