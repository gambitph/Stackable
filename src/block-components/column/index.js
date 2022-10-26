import { addAttributes } from './attributes'
import { Style } from './style'
import { useColumn } from './use-column'

import { ResizableColumn } from '~stackable/components'
import { useBlockAttributesContext } from '~stackable/hooks'

export { getColumnClasses } from './use-column'

export const Column = props => {
	const {
		isHovered,
		...propsToPass
	} = props

	const setHandlers = useColumn()
	const attributes = useBlockAttributesContext( attributes => {
		return {
			columnWidth: attributes.columnWidth,
			columnWidthTablet: attributes.columnWidthTablet,
			columnWidthMobile: attributes.columnWidthMobile,
		}
	} )

	return <ResizableColumn
		showHandle={ isHovered }
		columnWidth={ attributes.columnWidth }
		columnWidthTablet={ attributes.columnWidthTablet }
		columnWidthMobile={ attributes.columnWidthMobile }
		{ ...setHandlers }
		{ ...propsToPass }
	/>
}

Column.defaultProps = {
	isHovered: true,
}

Column.InspectorControls = null

Column.addAttributes = addAttributes

Column.Style = Style
