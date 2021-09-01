import { addAttributes } from './attributes'
import { Style } from './style'
import { useColumn } from './use-column'

import { ResizableColumn } from '~stackable/components'
import { useBlockAttributes } from '~stackable/hooks'

import { useBlockEditContext } from '@wordpress/block-editor'

export { getColumnClasses } from './use-column'

export const Column = props => {
	const {
		isHovered,
		...propsToPass
	} = props

	const { clientId } = useBlockEditContext()
	const setHandlers = useColumn()
	const attributes = useBlockAttributes( clientId )

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
