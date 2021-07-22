import { addAttributes } from './attributes'
import { Edit } from './edit'

import { applyFilters } from '@wordpress/hooks'

export const CustomCSS = props => {
	return applyFilters( 'stackable.block-component.custom-css', null, props )
}

CustomCSS.defaultProps = {
	mainBlockClass: '',
}

CustomCSS.Content = props => {
	return applyFilters( 'stackable.block-component.custom-css.content', null, props )
}

CustomCSS.Content.defaultProps = {
	attributes: {},
}

CustomCSS.InspectorControls = Edit

CustomCSS.addAttributes = addAttributes
