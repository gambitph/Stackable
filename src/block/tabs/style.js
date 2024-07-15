/**
 * External dependencies
 */
import {
	Advanced,
	// Alignment,
	BlockDiv,
	EffectsAnimations,
	MarginBottom,
	Separator,
	Transform,
	// Columns,
} from '~stackable/block-components'
// import { useBlockAttributesContext } from '~stackable/hooks'
import { BlockCss, BlockCssCompiler } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'
// import { applyFilters } from '@wordpress/hooks'

// const alignmentOptions = {
// 	editorSelectorCallback: getAttribute => `.stk--block-align-${ getAttribute( 'uniqueId' ) } > .block-editor-inner-blocks > .block-editor-block-list__layout`,
// }

const _Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="--tabs-gap"
				attrName="tabPanelOffset"
				key="tabPanelOffset"
				format="%spx"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".%s .stk-block-tab-content .stk-block-content .stk-block-column[hidden]"
				renderIn="save"
				styleRule="display"
				attrName="equalTabHeight"
				key="equalTabHeight"
				valueCallback={ value => {
					return value ? undefined : 'none'
				} }
				responsive="all"
			/>
		</>
	)
}

const Styles = memo( _Styles )
Styles.Content = _Styles

const BlockStyles = memo( props => {
	// const columnArrangement = useBlockAttributesContext( attributes => attributes.columnArrangementMobile || attributes.columnArrangementTablet )
	// const numColumns = ( columnArrangement || '' ).split( ',' ).length

	// const ColumnOrderStyle = applyFilters( 'stackable.block-component.columns.column-order-style', null )

	return (
		<>
			{ /* <Alignment.Style { ...props } { ...alignmentOptions } /> */ }
			<BlockDiv.Style { ...props } />
			<MarginBottom.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<Separator.Style { ...props } />
			{ /* <Columns.Style { ...props } /> */ }
			<Styles { ...props } />
			{ /* { ColumnOrderStyle && <ColumnOrderStyle { ...props } numColumns={ numColumns } /> } */ }
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

	// const numColumns = ( props.attributes.columnArrangementMobile || props.attributes.columnArrangementTablet || '' ).split( ',' ).length
	// const ColumnOrderStyle = applyFilters( 'stackable.block-component.columns.column-order-style', null )

	return (
		<BlockCssCompiler>
			{ /* <Alignment.Style.Content { ...props } { ...alignmentOptions } /> */ }
			<BlockDiv.Style.Content { ...props } />
			<MarginBottom.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<EffectsAnimations.Style.Content { ...props } />
			<Separator.Style.Content { ...props } />
			{ /* <Columns.Style.Content { ...props } /> */ }
			<Styles.Content { ...props } />
			{ /* { ColumnOrderStyle && <ColumnOrderStyle { ...props } numColumns={ numColumns } /> } */ }
		</BlockCssCompiler>
	)
}

BlockStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}

export default BlockStyles
