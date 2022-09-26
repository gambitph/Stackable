
/**
 * External dependencies
 */
import {
	Advanced,
	Button,
	BlockDiv,
	Typography,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'
import { Style as StyleComponent } from '~stackable/components'
import { getUniqueBlockClass, useStyles } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { memo, renderToString } from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'

const buttonOptions = {
	selector: '.stk-button',
}

const typographyOptions = {
	selector: '.stk-button__inner-text',
	hoverSelector: '.stk-button:hover .stk-button__inner-text',
}

const getStyleParams = ( options = {} ) => {
	const {
		clientId,
	} = options

	return [
		// This makes the block fullwidth inside the editor.
		{
			renderIn: 'edit',
			selectorCallback: () => `.editor-styles-wrapper [data-block="${ clientId }"]`,
			styleRule: 'width',
			attrName: 'buttonFullWidth',
			valueCallback: value => {
				return value ? '100%' : undefined
			},
		},
	]
}

export const ButtonStyles = memo( props => {
	const { clientId } = useBlockEditContext()
	const styles = useStyles( getStyleParams( { ...props, clientId } ) )

	return (
		<>
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<Button.Style { ...props } { ...buttonOptions } />
			<Typography.Style { ...props } { ...typographyOptions } />
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

ButtonStyles.defaultProps = {
	isEditor: false,
	attributes: {},
	options: {},
}

ButtonStyles.Content = props => {
	const {
		...propsToPass
	} = props

	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	propsToPass.blockUniqueClassName = getUniqueBlockClass( propsToPass.attributes.uniqueId )

	const styles = (
		<>
			<BlockDiv.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<Button.Style.Content { ...propsToPass } options={ buttonOptions } />
			<Typography.Style.Content { ...propsToPass } options={ typographyOptions } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
		</>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

ButtonStyles.Content.defaultProps = {
	attributes: {},
	options: {},
}
