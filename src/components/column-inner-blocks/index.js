import { createContext, useState } from '@wordpress/element'
import { InnerBlocks } from '@wordpress/block-editor'

/**
 * Context used by the Columns block to apply a class that
 */
export const ColumnShowTooltipContext = createContext( {
	showColumnTooltip: false,
	setShowColumnTooltip: () => {},
} )

// Implementation of ColumnShowTooltipContext in a hook, this is used by the Columns block.
export const useColumnShowTooltipContext = () => {
	const [ showColumnTooltip, setShowColumnTooltip ] = useState( false )
	return [
		{ showColumnTooltip, setShowColumnTooltip }, // value that should be passed to the Provider (<ColumnInnerBlocks />)
		showColumnTooltip ? 'stk--column-tooltip-hovered' : '', // the classname for the columns.
	]
}

const ColumnInnerBlocks = props => {
	const {
		providerValue,
		...propsToPass
	} = props

	return (
		<ColumnShowTooltipContext.Provider value={ providerValue } >
			<InnerBlocks { ...propsToPass } />
		</ColumnShowTooltipContext.Provider>
	)
}

ColumnInnerBlocks.useContext = useColumnShowTooltipContext

export default ColumnInnerBlocks
