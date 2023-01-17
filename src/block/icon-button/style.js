
/**
 * External dependencies
 */
import {
	Advanced,
	Button,
	BlockDiv,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'
import { getUniqueBlockClass } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { memo, renderToString } from '@wordpress/element'

const buttonOptions = {
	selector: '.stk-button',
	hoverSelector: '.stk-button:hover',
	textSelector: '.stk-button__inner-text',
	textHoverSelector: '.stk-button:hover .stk-button__inner-text',
}

export const IconButtonStyles = memo( props => {
	return (
		<>
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<Button.Style { ...props } { ...buttonOptions } />
			<EffectsAnimations.Style { ...props } />
		</>
	)
} )

IconButtonStyles.defaultProps = {
	isEditor: false,
	attributes: {},
	options: {},
}

IconButtonStyles.Content = props => {
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
			<EffectsAnimations.Style.Content { ...propsToPass } />
		</>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

IconButtonStyles.Content.defaultProps = {
	attributes: {},
	options: {},
}
