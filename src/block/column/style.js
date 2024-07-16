/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv,
	Column,
	ContainerDiv,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'
import { BlockCss, BlockCssCompiler } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'

const containerDivOptions = {
	sizeSelector: '.%s-container',
	sizeHorizontalAlignRule: 'margin',
	sizeVerticalAlignRule: 'justifyContent',
	sizeVerticalAlignSelector: '.%s-inner-blocks',
	// sizeVerticalAlignSelectorEdit: '.%s-inner-blocks > .block-editor-inner-blocks > .block-editor-block-list__layout',
	// sizeVerticalAlignSelectorEdit: '.%s-inner-blocks',
}

const callbacks = {
	marginTop: {
		valuePreCallback: value => value?.top,
	},
	marginRight: {
		valuePreCallback: value => value?.right,
	},
	marginBottom: {
		valuePreCallback: value => value?.bottom,
	},
	marginLeft: {
		valuePreCallback: value => value?.left,
	},
}

const _ColumnStyles = props => {
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
				selector=".%s-container"
				styleRule="marginTop"
				attrName="columnSpacing"
				key="columnSpacing-top"
				responsive="all"
				hasUnits="px"
				valuePreCallback={ callbacks.marginTop.valuePreCallback }
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".%s-container"
				styleRule="marginRight"
				attrName="columnSpacing"
				key="columnSpacing-right"
				responsive="all"
				hasUnits="px"
				valuePreCallback={ callbacks.marginRight.valuePreCallback }
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".%s-container"
				styleRule="marginBottom"
				attrName="columnSpacing"
				key="columnSpacing-bottom"
				responsive="all"
				hasUnits="px"
				valuePreCallback={ callbacks.marginBottom.valuePreCallback }
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".%s-container"
				styleRule="marginLeft"
				attrName="columnSpacing"
				key="columnSpacing-left"
				responsive="all"
				hasUnits="px"
				valuePreCallback={ callbacks.marginLeft.valuePreCallback }
			/>

			{
			// The styles below are used purely for the block highligher feature
			// where the edges of the element where the padding will be applied
			// is highlighted.
			}
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector=".%s-container"
				styleRule="--column-spacing-top"
				attrName="columnSpacing"
				key="columnSpacing-top-edit-for-highlight"
				responsive="all"
				hasUnits="px"
				valuePreCallback={ callbacks.marginTop.valuePreCallback }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector=".%s-container"
				styleRule="--column-spacing-right"
				attrName="columnSpacing"
				key="columnSpacing-right-edit-for-highlight"
				responsive="all"
				hasUnits="px"
				valuePreCallback={ callbacks.marginRight.valuePreCallback }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector=".%s-container"
				styleRule="--column-spacing-bottom"
				attrName="columnSpacing"
				key="columnSpacing-bottom-edit-for-highlight"
				responsive="all"
				hasUnits="px"
				valuePreCallback={ callbacks.marginBottom.valuePreCallback }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector=".%s-container"
				styleRule="--column-spacing-left"
				attrName="columnSpacing"
				key="columnSpacing-left-edit-for-highlight"
				responsive="all"
				hasUnits="px"
				valuePreCallback={ callbacks.marginLeft.valuePreCallback }
			/>
		</>
	)
}

const ColumnStyles = memo( _ColumnStyles )
ColumnStyles.Content = _ColumnStyles

const BlockStyles = memo( props => {
	return (
		<>
			<ColumnStyles { ...props } />
			<Alignment.Style
				{ ...props }
				columnAlignSelectorCallback={ ( getAttributes, attributes, clientId ) => `[data-block="${ clientId }"]` }
			/>
			<BlockDiv.Style { ...props } />
			<Column.Style { ...props } />
			<ContainerDiv.Style { ...props } { ...containerDivOptions } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
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

	return (
		<BlockCssCompiler>
			<ColumnStyles.Content { ...props } />
			<Alignment.Style.Content { ...props } />
			<BlockDiv.Style.Content { ...props } />
			<Column.Style.Content { ...props } />
			<ContainerDiv.Style.Content { ...props } { ...containerDivOptions } />
			<EffectsAnimations.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
		</BlockCssCompiler>
	)
}

BlockStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}

export default BlockStyles
