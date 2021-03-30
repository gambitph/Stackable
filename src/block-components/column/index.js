import { addAttributes } from './attributes'
import { addStyles } from './style'
import { useColumn } from './use-column'

import { ResizableColumn } from '~stackable/components'
import { useBlockAttributes, useBlockContext } from '~stackable/hooks'

import { useBlockEditContext } from '@wordpress/block-editor'
import { useEffect } from '@wordpress/element'

export { getColumnClasses } from './use-column'

export const Column = props => {
	const {
		isHovered,
		...propsToPass
	} = props

	const { clientId } = useBlockEditContext()
	const { isFirstBlock, isLastBlock } = useBlockContext()
	const setHandlers = useColumn()
	const attributes = useBlockAttributes( clientId )

	// Quietly update the first block attribute.
	useEffect( () => {
		attributes.isFirstBlock = isFirstBlock
	}, [ clientId, isFirstBlock ] )

	// Quietly update the last block attribute.
	useEffect( () => {
		attributes.isLastBlock = isLastBlock
	}, [ clientId, isLastBlock ] )

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

Column.addStyles = addStyles
