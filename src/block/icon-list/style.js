/**
 * Internal dependencies
 */
// import { convertSVGStringToBase64 } from './util'

/**
 * External dependencies
 */
import {
	Typography, MarginBottom, BlockDiv, Advanced, EffectsAnimations, Alignment, Transform,
} from '~stackable/block-components'
import { useBlockAttributesContext } from '~stackable/hooks'
import { BlockCss, BlockCssCompiler } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'

const typographyOptions = {
	selector: [
		'ul li',
		'ol li',
	],
	hoverSelector: [
		'.%s:hover ul li',
		'.%s:hover ol li',
	],
}

const _Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}

	const columns = props.columns ? props.columns : 1
	const unborderedItems = props.listDisplayStyle === 'grid' ? columns : 1

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-icon-list-item__content"
				styleRule="gap"
				attrName="iconGap"
				key="iconGap"
				responsive="all"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector="ol"
				styleRule="--stk-list-style-type"
				attrName="listType"
				key="listType"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="--stk-icon-list-column-count"
				attrName="columns"
				key="columns"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="--stk-icon-list-column-gap"
				attrName="columnGap"
				key="columnGap"
				responsive="all"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="--stk-icon-list-row-gap"
				attrName="rowGap"
				key="rowGap"
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
				selector=""
				hover="all"
				hoverSelector=".%s:hover"
				styleRule="--stk-icon-list-marker-color"
				attrName="markerColor"
				key="markerColor"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				hover="all"
				hoverSelector=".%s:hover"
				styleRule="--stk-icon-list-icon-opacity"
				attrName="iconOpacity"
				key="iconOpacity"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				hover="all"
				hoverSelector=".%s:hover"
				styleRule="--stk-icon-list-icon-rotation"
				attrName="iconRotation"
				key="iconRotation"
				valueCallback={ value => value + 'deg' }
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="--stk-icon-height"
				attrName="iconSize"
				key="iconSize"
				responsive="all"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector="ul .stk-block-icon-list-item__content .stk--svg-wrapper"
				styleRule="marginRight"
				attrName="iconSize"
				key="iconMarginRight"
				responsive="all"
				valueCallback={ value => value === 0 ? '0px' : undefined }
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-icon-list-item__content"
				styleRule="alignItems"
				attrName="iconVerticalAlignment"
				key="iconVerticalAlignment"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ [ 'ul .stk-block-icon-list-item__content .stk--inner-svg', 'ol .stk-block-icon-list-item__content .stk-block-icon-list-item__marker' ] }
				styleRule="transform"
				attrName="iconVerticalOffset"
				key="iconVerticalOffset"
				responsive="all"
				format="translateY(%spx)"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-icon-list-item__marker::before"
				styleRule="content"
				attrName="hasPeriod"
				key="hasPeriod"
				valueCallback={ value => ! value ? `counter(stk-icon-list-counter, var(--stk-list-style-type, decimal))` : undefined }
				enabledCallback={ getAttribute => getAttribute( 'ordered' ) }
				dependencies={ [ 'ordered' ] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-icon-list-item__content"
				styleRule="marginInline"
				attrName="listAlignment"
				key="listAlignment-marginInline"
				responsive="all"
				valueCallback={ value => value === 'center' ? 'auto' : value === 'right' ? 'auto 0' : value === 'left' ? '0 auto' : '' }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ [ 'ul', 'ol' ] }
				responsive="all"
				styleRule="width"
				attrName="listFullWidth"
				key="listFullWidth"
				valueCallback={ value => ! value ? 'fit-content' : undefined }
				enabledCallback={ getAttribute => getAttribute( 'listDisplayStyle' ) === 'grid' }
				dependencies={ [ 'listDisplayStyle' ] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-icon-list__group"
				responsive="all"
				styleRule="marginInline"
				attrName="contentAlign"
				key="contentAlign-group"
				valueCallback={ value => value === 'center' ? 'auto' : value === 'right' ? 'auto 0' : value === 'left' ? '0 auto' : '' }
				enabledCallback={ getAttribute => getAttribute( 'listDisplayStyle' ) !== 'grid' }
				dependencies={ [ 'listDisplayStyle' ] }
			/>

			<BlockCss
				{ ...propsToPass }
				selector={ [ `.wp-block-stackable-icon-list-item:not(:nth-last-child(-n + ${ unborderedItems }))::after` ] }
				styleRule="borderBottomStyle"
				attrName="listItemBorderStyle"
				key="listItemBorderStyle"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ [ `.wp-block-stackable-icon-list-item:not(:nth-last-child(-n + ${ unborderedItems }))::after` ] }
				styleRule="borderWidth"
				attrName="listItemBorderWidth"
				key="listItemBorderWidth"
				responsive="all"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ [ `.wp-block-stackable-icon-list-item:not(:nth-last-child(-n + ${ unborderedItems }))::after` ] }
				styleRule="borderColor"
				attrName="listItemBorderColor"
				key="listItemBorderColor"
			/>
		</>
	)
}

const Styles = memo( _Styles )
Styles.Content = _Styles

export const IconListStyles = memo( props => {
	const { columns, listDisplayStyle } = useBlockAttributesContext( attributes => ( {
		columns: attributes.columns,
		listDisplayStyle: attributes.listDisplayStyle,
	} ) )

	return (
		<>
			<Alignment.Style { ...props } />
			<Typography.Style { ...props } { ...typographyOptions } />
			<MarginBottom.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<Styles { ...props } columns={ columns } listDisplayStyle={ listDisplayStyle } />
		</>
	)
} )

IconListStyles.defaultProps = {
	version: '',
}

IconListStyles.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}
	const columns = props.attributes.columns
	const listDisplayStyle = props.attributes.listDisplayStyle
	return (
		<BlockCssCompiler>
			<Alignment.Style.Content { ...props } />
			<Typography.Style.Content { ...props } { ...typographyOptions } />
			<MarginBottom.Style.Content { ...props } />
			<BlockDiv.Style.Content { ...props } />
			<EffectsAnimations.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<Styles.Content { ...props } columns={ columns } listDisplayStyle={ listDisplayStyle } />
		</BlockCssCompiler>
	)
}

IconListStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}
