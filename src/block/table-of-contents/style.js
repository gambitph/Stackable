/**
 * External dependencies
 */
import { isEmpty } from 'lodash'
import {
	Typography, MarginBottom, BlockDiv, Advanced, EffectsAnimations, Alignment, Transform,
} from '~stackable/block-components'
import {
	getStyles,
	getUniqueBlockClass,
	useStyles,
} from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'

/**
 * WordPress dependencies
 */
import {
	memo, Fragment, renderToString,
} from '@wordpress/element'

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

const getStyleParams = () => {
	return [
		{
			selector: 'li',
			styleRule: 'paddingInlineStart',
			attrName: 'iconGap',
			responsive: 'all',
			format: '%spx',
		},
		{
			selector: 'ul',
			styleRule: 'listStyleType',
			attrName: 'listType',
			valueCallback: value => ( value === 'none' ? 'none' : undefined ),
		},
		{
			selector: 'ol',
			styleRule: 'listStyleType',
			attrName: 'listType',
			valueCallback: value =>
				isEmpty( value ) || value === 'none' || value === 'unordered'
					? undefined
					: value,
		},
		{
			selector: '.stk-table-of-contents__table',
			styleRule: 'columnCount',
			attrName: 'columns',
			responsive: 'all',
		},
		{
			selector: '.stk-table-of-contents__table',
			styleRule: 'columnGap',
			attrName: 'columnGap',
			responsive: 'all',
			format: '%spx',
		},
		{
			renderIn: 'save',
			selector: 'li',
			styleRule: 'marginBottom',
			attrName: 'rowGap',
			responsive: 'all',
			format: '%spx',
		},
		{
			renderIn: 'edit',
			selector: '.stk-block-table-of-contents__list-item-inner',
			styleRule: 'marginBottom',
			attrName: 'rowGap',
			responsive: 'all',
			format: '%spx',
		},
		{
			selector: '.stk-table-of-contents__table ul',
			styleRule: 'marginTop',
			attrName: 'rowGap',
			responsive: 'all',
			format: '%spx',
		},
		{
			selector: [ 'ul', 'ol' ],
			styleRule: 'paddingLeft',
			attrName: 'indentation',
			responsive: 'all',
			format: '%spx',
		},
		{
			selector: 'li a',
			hover: 'all',
			styleRule: 'color',
			attrName: 'color',
		},
		{
			selector: [ 'li' ],
			styleRule: 'marginInline',
			attrName: 'listAlignment',
			responsive: 'all',
			valueCallback: value =>
				value === 'center'
					? 'auto'
					: value === 'right'
						? 'auto 0'
						: value === 'left'
							? '0 auto'
							: '',
		},
		{
			selector: 'html',
			styleRule: 'scroll-behavior',
			attrName: 'isSmoothScroll',
			valueCallback: value => ( value ? 'smooth' : undefined ),
		},
		{
			selector: 'html',
			styleRule: 'scroll-padding-top',
			attrName: 'scrollTopOffset',
			responsive: 'all',
			format: '%spx',
		},
		// This fixes the issue where the bullet becomes small when a global font size is set.
		{
			renderIn: 'edit',
			selector: '.%s.%s li',
			styleRule: 'fontSize',
			attrName: 'fontSize',
			responsive: 'all',
			format: '%spx',
		},
	]
}

export const TableOfContentsStyles = memo( props => {
	const iconStyles = useStyles( getStyleParams() )

	return (
		<Fragment>
			<Alignment.Style { ...props } />
			<Typography.Style { ...props } { ...typographyOptions } />
			<Typography.Style { ...props } { ...titleTypographyOptions } />
			<MarginBottom.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<StyleComponent
				styles={ iconStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...props }
			/>
		</Fragment>
	)
} )

TableOfContentsStyles.defaultProps = {
	attributes: {},
	options: {},
}

TableOfContentsStyles.Content = props => {
	const {
		...propsToPass
	} = props

	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )
	const iconStyles = getStyles( propsToPass.attributes, getStyleParams() )

	const styles = (
		<Fragment>
			<Alignment.Style.Content { ...propsToPass } />
			<Typography.Style.Content { ...propsToPass } options={ typographyOptions } />
			<Typography.Style.Content { ...propsToPass } options={ titleTypographyOptions } />
			<MarginBottom.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<StyleComponent.Content
				styles={ iconStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

TableOfContentsStyles.Content.defaultProps = {
	attributes: {},
	options: {},
}
