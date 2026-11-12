import { addAttributes } from './attributes'
import { Edit } from './edit'
import { useBlockAttributesContext } from '~stackable/hooks'

import { applyFilters } from '@wordpress/hooks'
import { getPropsWithDefaults } from '../../util/props'

// Keep existing Premium Custom CSS working when Premium is deactivated.
const CustomCSSStyle = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, CUSTOM_CSSSTYLE_DEFAULT_PROPS )
	const { css, isSaveContent } = props

	return !! css && <style className={ isSaveContent ? 'stk-custom-css' : undefined }>{ css }</style>
}

const CUSTOM_CSSSTYLE_DEFAULT_PROPS = {
	css: '',
	isSaveContent: false,
}

export const CustomCSS = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, CUSTOM_CSS_DEFAULT_PROPS )
	const customCSSMinified = useBlockAttributesContext( attributes => attributes.customCSSMinified )

	return applyFilters(
		'stackable.block-component.custom-css',
		<CustomCSSStyle css={ customCSSMinified } />,
		props
	)
}

const CUSTOM_CSS_DEFAULT_PROPS = {
	mainBlockClass: '',
}

CustomCSS.Content = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, CUSTOM_CSS_CONTENT_DEFAULT_PROPS )
	return applyFilters(
		'stackable.block-component.custom-css.content',
		<CustomCSSStyle css={ props.attributes.customCSSMinified } isSaveContent />,
		props
	)
}

const CUSTOM_CSS_CONTENT_DEFAULT_PROPS = {
	attributes: {},
}

CustomCSS.InspectorControls = Edit

CustomCSS.addAttributes = addAttributes
