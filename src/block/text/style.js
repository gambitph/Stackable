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
import { renderToString, memo } from '@wordpress/element'

const typographyOptions = {
	selector: '.stk-block-text__text',
	hoverSelector: '.stk-block-text__text:hover',
}

const getStyleParams = () => {
	return [
		{
			selector: '',
			styleRule: 'columnCount',
			attrName: 'columns',
			responsive: 'all',
		},
		{
			selector: '',
			styleRule: 'columnGap',
			attrName: 'columnGap',
			responsive: 'all',
			format: '%spx',
		},
	]
}

export const TextStyles = memo( props => {
	const columnStyles = useStyles( getStyleParams() )

	return (
		<>
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<Typography.Style { ...props } { ...typographyOptions } />
			<StyleComponent
				styles={ columnStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...props }
			/>
			<EffectsAnimations.Style { ...props } />
		</>
	)
} )

TextStyles.defaultProps = {
	isEditor: false,
}

TextStyles.Content = props => {
	const {
		...propsToPass
	} = props

	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )
	const columnStyles = getStyles( props.attributes, getStyleParams( props ) )

	const styles = (
		<>
			<Alignment.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<Typography.Style.Content { ...propsToPass } options={ typographyOptions } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<MarginBottom.Style.Content { ...propsToPass } />
			<StyleComponent.Content
				styles={ columnStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

TextStyles.Content.defaultProps = {
	attributes: {},
	options: {},
}

