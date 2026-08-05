import { addAttributes } from './attributes'
import { Edit } from './edit'
import { useBlockAttributesContext } from '~stackable/hooks'

import { applyFilters } from '@wordpress/hooks'

// Keep existing Premium Custom CSS working when Premium is deactivated.
const CustomCSSStyle = props => {
	const { css, isSaveContent } = props

	return !! css && <style className={ isSaveContent ? 'stk-custom-css' : undefined }>{ css }</style>
}

CustomCSSStyle.defaultProps = {
	css: '',
	isSaveContent: false,
}

export const CustomCSS = props => {
	const customCSSMinified = useBlockAttributesContext( attributes => attributes.customCSSMinified )

	return applyFilters(
		'stackable.block-component.custom-css',
		<CustomCSSStyle css={ customCSSMinified } />,
		props
	)
}

CustomCSS.defaultProps = {
	mainBlockClass: '',
}

CustomCSS.Content = props => {
	return applyFilters(
		'stackable.block-component.custom-css.content',
		<CustomCSSStyle css={ props.attributes.customCSSMinified } isSaveContent />,
		props
	)
}

CustomCSS.Content.defaultProps = {
	attributes: {},
}

CustomCSS.InspectorControls = Edit

CustomCSS.addAttributes = addAttributes
