/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv,
	Column,
	EffectsAnimations,
	Separator,
	Transform,
	ContainerDiv,
	Columns,
} from '~stackable/block-components'
import { BlockCss, BlockCssCompiler } from '~stackable/components'
import { useBlockAttributesContext } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'

const Styles = props => {
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
				renderIn="save"
				selector=".%s-column"
				styleRule="--stk-row-gap"
				attrName="rowGap"
				key="rowGap-save"
				format="%spx"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector=".%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout"
				styleRule="--stk-row-gap"
				attrName="rowGap"
				key="rowGap"
				format="%spx"
				responsive="all"
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
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<ContainerDiv.Style { ...props } />
			<Column.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<Separator.Style { ...props } />
			<Columns.Style { ...props } hasRowGap={ false } />
			{ ColumnOrderStyle && <ColumnOrderStyle { ...props } numColumns={ numColumns } /> }
			<Styles { ...props } />
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
			<Alignment.Style.Content { ...props } />
			<BlockDiv.Style.Content { ...props } />
			<ContainerDiv.Style.Content { ...props } />
			<Column.Style.Content { ...props } />
			<EffectsAnimations.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<Separator.Style.Content { ...props } />
			<Columns.Style.Content
				{ ...props }
				hasRowGap={ false }
				// Override the column desktop wrap rule because the feature has
				// an extra element that we cannot target
				columnWrapDesktopSaveStyleRule="--stk-feature-flex-wrap"
			/>
			{ ColumnOrderStyle && <ColumnOrderStyle { ...props } numColumns={ numColumns } /> }
			<Styles { ...props } />
		</BlockCssCompiler>
	)
}

BlockStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}

export default BlockStyles
