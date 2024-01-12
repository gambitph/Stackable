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
	return (
		<>
			<BlockCss
				{ ...propsToPass }
				selector="ol li"
				styleRule="paddingInlineStart"
				attrName="iconGap"
				key="olIconGap"
				responsive="all"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector="ul li"
				styleRule="gap"
				attrName="iconGap"
				key="ulIconGap"
				responsive="all"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector="ol"
				styleRule="listStyleType"
				attrName="listType"
				key="listType"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="columnCount"
				attrName="columns"
				key="columns"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="columnGap"
				attrName="columnGap"
				key="columnGap"
				responsive="all"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector="li"
				styleRule="marginBottom"
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
				styleRule="--stk-icon-list-icon-color"
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
				format="%sem"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ [ 'li' ] }
				styleRule="marginInline"
				attrName="listAlignment"
				key="listAlignment"
				responsive="all"
				valueCallback={ value => value === 'center' ? 'auto' : value === 'right' ? 'auto 0' : value === 'left' ? '0 auto' : '' }
			/>
		</>
	)
}

export const IconListStyles = memo( props => {
	const icons = useBlockAttributesContext( attributes => attributes.icons )

	return (
		<>
			<Alignment.Style { ...props } />
			<Typography.Style { ...props } { ...typographyOptions } />
			<MarginBottom.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<Styles { ...props } icons={ icons } />
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

	return (
		<BlockCssCompiler>
			<Alignment.Style.Content { ...props } />
			<Typography.Style.Content { ...props } { ...typographyOptions } />
			<MarginBottom.Style.Content { ...props } />
			<BlockDiv.Style.Content { ...props } />
			<EffectsAnimations.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<Styles { ...props } />
		</BlockCssCompiler>
	)
}

IconListStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}
