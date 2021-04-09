/**
 * External dependencies
 */
import { PanelTabs } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element'
import { createSlotFill } from '@wordpress/components'
import { InspectorControls, useBlockEditContext } from '@wordpress/block-editor'

const { Slot: PreInspectorTabSlot, Fill: PreInspectorTabFill } = createSlotFill( 'StackablePreInspectorTab' )
const { Slot: BlockInspectorTabSlot, Fill: BlockInspectorTabFill } = createSlotFill( 'StackableBlockInspectorTab' )
const { Slot: StyleInspectorTabSlot, Fill: StyleInspectorTabFill } = createSlotFill( 'StackableStyleInspectorTab' )
const { Slot: AdvancedInspectorTabSlot, Fill: AdvancedInspectorTabFill } = createSlotFill( 'StackableAdvancedInspectorTab' )

const InspectorBlockControls = ( { children } ) => {
	const { isSelected } = useBlockEditContext()
	return isSelected ? <BlockInspectorTabFill>{ children }</BlockInspectorTabFill> : null
}

const InspectorStyleControls = ( { children } ) => {
	const { isSelected } = useBlockEditContext()
	return isSelected ? <StyleInspectorTabFill>{ children }</StyleInspectorTabFill> : null
}

const InspectorAdvancedControls = ( { children } ) => {
	const { isSelected } = useBlockEditContext()
	return isSelected ? <AdvancedInspectorTabFill>{ children }</AdvancedInspectorTabFill> : null
}

export {
	PreInspectorTabFill,
	InspectorBlockControls,
	InspectorStyleControls,
	InspectorAdvancedControls,
}

const InspectorTabs = props => {
	const [ activeTab, setActiveTab ] = useState( null )

	return (
		<InspectorControls>
			<PreInspectorTabSlot />

			<PanelTabs
				tabs={ props.tabs }
				onTabFirstOpen={ setActiveTab }
				onClick={ setActiveTab }
			/>

			{ ( ! activeTab || activeTab === 'block' ) && <BlockInspectorTabSlot /> }

			{ ( ! activeTab || activeTab === 'style' ) && <StyleInspectorTabSlot /> }

			{ ( ! activeTab || activeTab === 'advanced' ) && <AdvancedInspectorTabSlot /> }
		</InspectorControls>
	)
}

InspectorTabs.defaultProps = {
	tabs: [ 'block', 'style', 'advanced' ],
}

export default InspectorTabs
