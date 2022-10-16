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
import { attributeHasValue } from '~stackable/util'

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

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		attributes,
	} = props

	return (
		<>
			{ attributeHasValue( 'iconGap', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector="li"
					styleRule="paddingInlineStart"
					attrName="iconGap"
					responsive="all"
					format="%spx"
				/>
			}
			{ attributeHasValue( 'listType', attributes ) &&
				<BlockCss
					{ ...propsToPass }
					selector="ul"
					styleRule="listStyleType"
					attrName="listType"
					valueCallback={ value => ( value === 'none' ? 'none' : undefined ) }
				/>
			}
			{ attributeHasValue( 'listType', attributes ) &&
				<BlockCss
					{ ...propsToPass }
					selector="ol"
					styleRule="listStyleType"
					attrName="listType"
					valueCallback={ value =>
						isEmpty( value ) || value === 'none' || value === 'unordered'
							? undefined
							: value }
				/>
			}
			{ attributeHasValue( 'columns', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector=".stk-table-of-contents__table"
					styleRule="columnCount"
					attrName="columns"
					responsive="all"
				/>
			}
			{ attributeHasValue( 'columnGap', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector=".stk-table-of-contents__table"
					styleRule="columnGap"
					attrName="columnGap"
					responsive="all"
					format="%spx"
				/>
			}
			{ attributeHasValue( 'rowGap', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					renderIn="save"
					selector="li"
					styleRule="marginBottom"
					attrName="rowGap"
					responsive="all"
					format="%spx"
				/>
			}
			{ attributeHasValue( 'rowGap', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					renderIn="edit"
					selector=".stk-block-table-of-contents__list-item-inner"
					styleRule="marginBottom"
					attrName="rowGap"
					responsive="all"
					format="%spx"
				/>
			}
			{ attributeHasValue( 'rowGap', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector=".stk-table-of-contents__table ul"
					styleRule="marginTop"
					attrName="rowGap"
					responsive="all"
					format="%spx"
				/>
			}
			{ attributeHasValue( 'indentation', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ [ 'ul', 'ol' ] }
					styleRule="paddingLeft"
					attrName="indentation"
					responsive="all"
					format="%spx"
				/>
			}
			{ attributeHasValue( 'color', attributes, { hasHover: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector="li a"
					hover="all"
					styleRule="color"
					attrName="color"
				/>
			}
			{ attributeHasValue( 'listAlignment', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ [ 'li' ] }
					styleRule="marginInline"
					attrName="listAlignment"
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
			}
			{ attributeHasValue( 'isSmoothScroll', attributes ) &&
				<BlockCss
					{ ...propsToPass }
					selector="html"
					styleRule="scroll-behavior"
					attrName="isSmoothScroll"
					valueCallback={ value => ( value ? 'smooth' : undefined ) }
				/>
			}
			{ attributeHasValue( 'scrollTopOffset', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector="html"
					styleRule="scroll-padding-top"
					attrName="scrollTopOffset"
					responsive="all"
					format={ '%spx' }
				/>
			}
			{ attributeHasValue( 'fontSize', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					// This fixes the issue where the bullet becomes small when a global font size is set.
					renderIn="edit"
					selector=".%s.%s li"
					styleRule="fontSize"
					attrName="fontSize"
					responsive="all"
					format="%spx"
				/>
			}
		</>
	)
}

export const TableOfContentsStyles = memo( props => {
	return (
		<>
			<Alignment.Style { ...props } />
			<Typography.Style { ...props } { ...typographyOptions } />
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
			<Typography.Style.Content { ...props } options={ typographyOptions } />
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
