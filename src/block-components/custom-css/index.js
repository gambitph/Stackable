import { addAttributes } from './attributes'
import { Edit } from './edit'

import { applyFilters } from '@wordpress/hooks'
import { useBlockAttributesContext } from '~stackable/hooks'

export const CustomCSS = props => {
	// Don't do anything if the custom CSS is not set.
	const customCSS = useBlockAttributesContext( attributes => attributes.customCSS )
	if ( ! customCSS ) {
		return null
	}
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
