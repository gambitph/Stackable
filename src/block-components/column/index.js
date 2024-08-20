import { addAttributes } from './attributes'
import { getColumnHandlers } from './get-column-handlers'
import { Style } from './style'
export { getColumnClasses } from './use-column'

import { ResizableColumn } from '~stackable/components'
import { memo } from '@wordpress/element'

export const Column = memo( props => {
	const {
		isHovered,
		clientId,
		parentBlock,
		...propsToPass
	} = props

	const setHandlers = getColumnHandlers( clientId, parentBlock )

	return <ResizableColumn
		showHandle={ isHovered }
		isHovered={ isHovered }
		columnWidth={ props.columnWidth }
		columnWidthTablet={ props.columnWidthTablet }
		columnWidthMobile={ props.columnWidthMobile }
		{ ...setHandlers }
		{ ...propsToPass }
	/>
} )

Column.defaultProps = {
	isHovered: true,
}

Column.InspectorControls = null

Column.addAttributes = addAttributes

Column.Style = Style
