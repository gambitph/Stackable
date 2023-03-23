/**
 * External dependencies
 */
import { isEmpty } from 'lodash'
import {
	Typography, MarginBottom, BlockDiv, Advanced, EffectsAnimations, Alignment, Transform,
} from '~stackable/block-components'
import { BlockCss, BlockCssCompiler } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'

const typographyOptions = {
	selector: [
		'li',
		'ul li a',
		'ol li a',
	],
	hoverSelector: [
		'.%s:hover li',
		'.%s:hover ul li a',
		'.%s:hover ol li a',
	],
}

const titleTypographyOptions = {
	selector: '.stk-table-of-contents__title',
	hoverSelector: '.stk-table-of-contents__title:hover',
	attrNameTemplate: 'title%s',
}

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
				selector="li"
				styleRule="paddingInlineStart"
				attrName="iconGap"
				key="iconGap"
				responsive="all"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector="ul"
				styleRule="listStyleType"
				attrName="listType"
				key="listType"
				valueCallback={ value => ( value === 'none' ? 'none' : undefined ) }
			/>
			<BlockCss
				{ ...propsToPass }
				selector="ol"
				styleRule="listStyleType"
				attrName="listType"
				key="listType-ol"
				valueCallback={ value =>
					isEmpty( value ) || value === 'none' || value === 'unordered'
						? undefined
						: value }
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-table-of-contents__table"
				styleRule="columnCount"
				attrName="columns"
				key="columns"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-table-of-contents__table"
				styleRule="columnGap"
				attrName="columnGap"
				key="columnGap"
				responsive="all"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector="li"
				styleRule="marginBottom"
				attrName="rowGap"
				key="rowGapSave"
				responsive="all"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector=".stk-block-table-of-contents__list-item-inner"
				styleRule="marginBottom"
				attrName="rowGap"
				key="rowGapEdit"
				responsive="all"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-table-of-contents__table ul"
				styleRule="marginTop"
				attrName="rowGap"
				key="rowGap-top"
				responsive="all"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ [ 'ul', 'ol' ] }
				styleRule="paddingLeft"
				attrName="indentation"
				key="indentation"
				responsive="all"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector="li a"
				hover="all"
				styleRule="color"
				attrName="color"
				key="color"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ [ 'li' ] }
				styleRule="marginInline"
				attrName="listAlignment"
				key="listAlignment"
				responsive="all"
				valueCallback={ value =>
					value === 'center'
						? 'auto'
						: value === 'right'
							? 'auto 0'
							: value === 'left'
								? '0 auto'
								: '' }
			/>
			<BlockCss
				{ ...propsToPass }
				selector="html"
				styleRule="scroll-behavior"
				attrName="isSmoothScroll"
				key="isSmoothScroll"
				valueCallback={ value => ( value ? 'smooth' : undefined ) }
			/>
			<BlockCss
				{ ...propsToPass }
				selector="html"
				styleRule="scroll-padding-top"
				attrName="scrollTopOffset"
				key="scrollTopOffset"
				responsive="all"
				format={ '%spx' }
			/>
			<BlockCss
				{ ...propsToPass }
				// This fixes the issue where the bullet becomes small when a global font size is set.
				renderIn="edit"
				selector=".%s.%s li"
				styleRule="fontSize"
				attrName="fontSize"
				key="fontSize"
				responsive="all"
				format="%spx"
			/>
		</>
	)
}

export const TableOfContentsStyles = memo( props => {
	return (
		<>
			<Alignment.Style { ...props } />
			<Typography.Style { ...props } { ...typographyOptions } />
			<Typography.Style { ...props } { ...titleTypographyOptions } />
			<MarginBottom.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<Styles { ...props } />
		</>
	)
} )

TableOfContentsStyles.defaultProps = {
	version: '',
}

TableOfContentsStyles.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	return (
		<BlockCssCompiler>
			<Alignment.Style.Content { ...props } />
			<Typography.Style.Content { ...props } { ...typographyOptions } />
			<Typography.Style.Content { ...props } { ...titleTypographyOptions } />
			<MarginBottom.Style.Content { ...props } />
			<BlockDiv.Style.Content { ...props } />
			<EffectsAnimations.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<Styles { ...props } />
		</BlockCssCompiler>
	)
}

TableOfContentsStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}
