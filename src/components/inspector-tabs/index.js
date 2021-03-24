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
const { Slot: SectionInspectorTabSlot, Fill: SectionInspectorTabFill } = createSlotFill( 'StackableSectionInspectorTab' )
const { Slot: StyleInspectorTabSlot, Fill: StyleInspectorTabFill } = createSlotFill( 'StackableStyleInspectorTab' )
const { Slot: AdvancedInspectorTabSlot, Fill: AdvancedInspectorTabFill } = createSlotFill( 'StackableAdvancedInspectorTab' )

const InspectorSectionControls = ( { children } ) => {
	const { isSelected } = useBlockEditContext()
	return isSelected ? <SectionInspectorTabFill>{ children }</SectionInspectorTabFill> : null
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
	InspectorSectionControls,
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

			{ ( ! activeTab || activeTab === 'style' ) && <StyleInspectorTabSlot /> }

			{ ( ! activeTab || activeTab === 'section' ) && <SectionInspectorTabSlot /> }

			{ ( ! activeTab || activeTab === 'advanced' ) && <AdvancedInspectorTabSlot /> }
		</InspectorControls>
	)
}

InspectorTabs.defaultProps = {
	tabs: [ 'section', 'style', 'advanced' ],
}

export default InspectorTabs
