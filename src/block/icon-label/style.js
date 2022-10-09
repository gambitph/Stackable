/**
 * Internal dependencies
 */

/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv,
	Column,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'
import { Style as StyleComponent } from '~stackable/components'
import {
	getUniqueBlockClass, useStyles, getStyles,
} from '~stackable/util'

/**
 * WordPress dependencies
 */
import { memo, renderToString } from '@wordpress/element'

const getStyleParams = () => {
	return [
		{
			renderIn: 'save',
			selector: '.stk-block-icon',
			attrName: 'iconGap',
			styleRule: 'flexBasis',
			format: '%spx',
			responsive: 'all',
		},
		{
			renderIn: 'edit',
			selector: '.stk-inner-blocks [data-block][data-type="stackable/icon"]',
			attrName: 'iconGap',
			styleRule: 'flexBasis',
			format: '%spx',
			responsive: 'all',
		},
	]
}

export const IconLabelStyles = memo( props => {
	const styles = useStyles( getStyleParams() )

	return (
		<>
			{ /* Alignment has been removed in 3.3.0, but retained here to prevent block errors */ }
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Column.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<StyleComponent
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...props }
			/>
		</>
	)
} )

IconLabelStyles.defaultProps = {
	isEditor: false,
}

IconLabelStyles.Content = props => {
	const {
		...propsToPass
	} = props

	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )
	const styles = getStyles( propsToPass.attributes, getStyleParams() )

	const stylesToRender = (
		<>
			{ /* Alignment has been removed in 3.3.0, but retained here to prevent block errors */ }
			<Alignment.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<Column.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<StyleComponent.Content
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</>
	)

	return renderToString( stylesToRender ) ? <style>{ stylesToRender }</style> : null
}

IconLabelStyles.Content.defaultProps = {
	attributes: {},
}
