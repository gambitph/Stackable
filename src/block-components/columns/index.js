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
addFilter( 'stackable.block-components.block-div.classnames.content', 'stackable/column-order', ( classes, props ) => {
	if ( props.attributes.columnArrangementMobile || props.attributes.columnArrangementTablet ) {
		classes.push( 'stk--has-column-order' )
	}
	return classes
} )
