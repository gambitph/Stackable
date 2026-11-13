import { addAttributes } from './attributes'
import { getColumnHandlers } from './get-column-handlers'
import { addStyles } from './style'
export { getColumnClasses } from './use-column'

import { ResizableColumn } from '~stackable/components'
import { memo } from '@wordpress/element'
import { getPropsWithDefaults } from '../../util/props'

export const Column = memo( incomingProps => {
	const props = getPropsWithDefaults( incomingProps, COLUMN_DEFAULT_PROPS )
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

const COLUMN_DEFAULT_PROPS = {
	isHovered: true,
}

Column.InspectorControls = null

Column.addAttributes = addAttributes

Column.addStyles = addStyles
