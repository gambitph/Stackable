/**
 * External dependencies
 */
import {
	BlockDiv,
	Advanced,
	Typography,
	Alignment,
	MarginBottom,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'
import {
	getUniqueBlockClass, useStyles, getStyles,
} from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'

/**
 * WordPress dependencies
 */
import {
	memo, Fragment, renderToString,
} from '@wordpress/element'

const getStyleParams = () => {
	return [
		{
			selector: '.stk-block-heading__top-line',
			styleRule: 'height',
			attrName: 'topLineHeight',
			format: '%spx',
		},
		{
			selector: '.stk-block-heading__top-line',
			styleRule: 'width',
			attrName: 'topLineWidth',
			hasUnits: 'px',
			hover: 'all',
		},
		{
			selector: '.stk-block-heading__top-line',
			styleRule: 'backgroundColor',
			attrName: 'topLineColor',
			hover: 'all',
		},
		{
			selector: '.stk-block-heading__top-line',
			styleRule: 'backgroundColor',
			attrName: 'topLineColor',
			hover: 'all',
		},
		{
			selector: '.stk-block-heading__top-line',
			styleRule: 'marginBottom',
			attrName: 'topLineMargin',
			responsive: 'all',
			format: '%spx',
		},
		{
			selector: '.stk-block-heading__top-line',
			styleRule: 'marginLeft',
			attrName: 'topLineAlign',
			responsive: 'all',
			valueCallback: value => value === 'center' || value === 'right' ? 'auto' : '0',
		},
		{
			selector: '.stk-block-heading__top-line',
			styleRule: 'marginRight',
			attrName: 'topLineAlign',
			responsive: 'all',
			valueCallback: value => value === 'center' || value === 'left' ? 'auto' : '0',
		},
		{
			selector: '.stk-block-heading__bottom-line',
			styleRule: 'height',
			attrName: 'bottomLineHeight',
			format: '%spx',
		},
		{
			selector: '.stk-block-heading__bottom-line',
			styleRule: 'width',
			attrName: 'bottomLineWidth',
			hasUnits: 'px',
			hover: 'all',
		},
		{
			selector: '.stk-block-heading__bottom-line',
			styleRule: 'backgroundColor',
			attrName: 'bottomLineColor',
			hover: 'all',
		},
		{
			selector: '.stk-block-heading__bottom-line',
			styleRule: 'backgroundColor',
			attrName: 'bottomLineColor',
			hover: 'all',
		},
		{
			selector: '.stk-block-heading__bottom-line',
			styleRule: 'marginTop',
			attrName: 'bottomLineMargin',
			responsive: 'all',
			format: '%spx',
		},
		{
			selector: '.stk-block-heading__bottom-line',
			styleRule: 'marginLeft',
			attrName: 'bottomLineAlign',
			responsive: 'all',
			valueCallback: value => value === 'center' || value === 'right' ? 'auto' : undefined,
		},
		{
			selector: '.stk-block-heading__bottom-line',
			styleRule: 'marginRight',
			attrName: 'bottomLineAlign',
			responsive: 'all',
			valueCallback: value => value === 'center' || value === 'left' ? 'auto' : undefined,
		},
	]
}

export const HeadingStyles = memo( props => {
	const topBottomLineStyles = useStyles( getStyleParams() )

	return (
		<Fragment>
			<Alignment.Style { ...props } />
			<BlockDiv.Style
				{ ...props }
				verticalAlignRule="justifyContent"
			/>
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<Typography.Style
				{ ...props }
				selector=".stk-block-heading__text"
			/>
			<StyleComponent
				styles={ topBottomLineStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...props }
			/>
			<EffectsAnimations.Style { ...props } />
		</Fragment>
	)
} )

HeadingStyles.defaultProps = {
	isEditor: false,
	attributes: {},
	options: {},
}

HeadingStyles.Content = props => {
	const {
		...propsToPass
	} = props

	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )
	const topBottomLineStyles = getStyles( props.attributes, getStyleParams() )

	const styles = (
		<Fragment>
			<Alignment.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...{
				...propsToPass,
				options: {
					...propsToPass.options,
					verticalAlignRule: 'justifyContent',
				},
			} } />
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<Typography.Style.Content { ...{
				...propsToPass,
				options: {
					...propsToPass.options,
					selector: '.stk-block-heading__text',
				},
			} } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<MarginBottom.Style.Content { ...propsToPass } />
			<StyleComponent.Content
				styles={ topBottomLineStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

HeadingStyles.Content.defaultProps = {
	attributes: {},
	options: {},
}
