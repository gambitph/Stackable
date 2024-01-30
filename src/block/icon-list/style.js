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

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}

	const columns = props.columns ? props.columns : 1

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				selector={ [ 'ul li .stk-block-icon-list-item__content', 'ol li .stk-block-icon-list-item__content' ] }
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
				selector="ul li .stk-block-icon-list-item__content .stk--svg-wrapper"
				styleRule="marginRight"
				attrName="iconSize"
				key="iconMarginRight"
				responsive="all"
				valueCallback={ value => value === 0 ? '0px' : undefined }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ [ 'ul li .stk-block-icon-list-item__content .stk--svg-wrapper', 'ol li .stk-block-icon-list-item__content .stk-block-icon-list-item__marker' ] }
				styleRule="alignSelf"
				attrName="iconVerticalAlignment"
				key="iconVerticalAlignment"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ [ 'ul li .stk-block-icon-list-item__content .stk--inner-svg svg', 'ol li .stk-block-icon-list-item__content .stk-block-icon-list-item__marker' ] }
				styleRule="marginTop"
				attrName="iconVerticalOffset"
				key="iconVerticalOffset"
				responsive="all"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ [ 'li .stk-block-icon-list-item__content' ] }
				styleRule="marginInline"
				attrName="listAlignment"
				key="listAlignment-marginInline"
				responsive="all"
				valueCallback={ value => value === 'center' ? 'auto' : value === 'right' ? 'auto 0' : value === 'left' ? '0 auto' : '' }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ [ 'li .stk-block-icon-list-item__content' ] }
				styleRule="justifyContent"
				attrName="listAlignment"
				key="listAlignment-justifyContent"
				responsive="all"
				valueCallback={ value => value === 'center' ? 'center' : value === 'right' ? 'flex-end' : value === 'left' ? 'flex-start' : '' }
			/>

			<BlockCss
				{ ...propsToPass }
				selector={ [ 'ul', 'ol' ] }
				responsive="all"
				styleRule="width"
				attrName="columns"
				key="listWidth-columns"
				valueCallback={ ( value, getAttribute, device ) => {
					if ( getAttribute( 'contentAlign', device ) === undefined || getAttribute( 'contentAlign', device ) === '' ) {
						return value === 1 ? 'fit-content' : '100%'
					}

					return 'fit-content'
				} }
				dependencies={ [ 'contentAlign' ] }
			/>

			<BlockCss
				{ ...propsToPass }
				selector={ [ `.wp-block-stackable-icon-list-item:not(:nth-last-child(-n + ${ columns })) .stk-block-icon-list-item__content::after` ] }
				styleRule="borderBottomStyle"
				attrName="listItemBorderStyle"
				key="listItemBorderStyle"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ [ `.wp-block-stackable-icon-list-item:not(:nth-last-child(-n + ${ columns })) .stk-block-icon-list-item__content::after` ] }
				styleRule="borderWidth"
				attrName="listItemBorderWidth"
				key="listItemBorderWidth"
				responsive="all"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ [ `.wp-block-stackable-icon-list-item:not(:nth-last-child(-n + ${ columns })) .stk-block-icon-list-item__content::after` ] }
				styleRule="borderColor"
				attrName="listItemBorderColor"
				key="listItemBorderColor"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ [ 'ul li .stk-block-icon-list-item__content', 'ol li .stk-block-icon-list-item__content' ] }
				styleRule="width"
				attrName="listItemBorderFullWidth"
				key="listItemBorderFullWidth"
				valueCallback={ value => value ? '100%' : undefined }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ [ 'ul', 'ol' ] }
				responsive="all"
				styleRule="width"
				attrName="listItemBorderFullWidth"
				key="listWidth-listItemBorder"
				valueCallback={ ( value, getAttribute, device ) => {
					if ( getAttribute( 'columns', device ) === undefined || getAttribute( 'columns', device ) === '' || getAttribute( 'columns', device ) === 1 ) {
						return value ? '100%' : undefined
					}

					return undefined
				} }
				dependencies={ [ 'columns' ] }
			/>
		</>
	)
}

export const IconListStyles = memo( props => {
	const columns = useBlockAttributesContext( attributes => attributes.columns )

	return (
		<>
			<Alignment.Style { ...props } />
			<Typography.Style { ...props } { ...typographyOptions } />
			<MarginBottom.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<Styles { ...props } columns={ columns } />
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
	return (
		<BlockCssCompiler>
			<Alignment.Style.Content { ...props } />
			<Typography.Style.Content { ...props } { ...typographyOptions } />
			<MarginBottom.Style.Content { ...props } />
			<BlockDiv.Style.Content { ...props } />
			<EffectsAnimations.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<Styles { ...props } columns={ columns } />
		</BlockCssCompiler>
	)
}

IconListStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}
