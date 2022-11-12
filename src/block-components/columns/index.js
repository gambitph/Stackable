import { addFilter } from '@wordpress/hooks'
import { addAttributes } from './attributes'
import { Edit } from './edit'
import { Style } from './style'

export const Columns = () => {
	return null
}

Columns.InspectorControls = Edit

Columns.Style = Style

Columns.addAttributes = addAttributes

// We need to add a special class for column orders.
addFilter( 'stackable.block-components.block-div.classnames.content', 'stackable/column-order', ( classes, attributes ) => {
	if ( attributes.columnArrangementMobile || attributes.columnArrangementTablet ) {
		return [ ...classes, 'stk--has-column-order' ]
	}
	return classes
} )
