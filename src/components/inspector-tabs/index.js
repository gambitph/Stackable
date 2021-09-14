/**
 * External dependencies
 */
import { PanelTabs } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'
import { createSlotFill } from '@wordpress/components'
import { InspectorControls, useBlockEditContext } from '@wordpress/block-editor'
import { useGlobalState } from '~stackable/util/global-state'

const { Slot: PreInspectorTabSlot, Fill: PreInspectorTabFill } = createSlotFill( 'StackablePreInspectorTab' )
const { Slot: BlockInspectorTabSlot, Fill: BlockInspectorTabFill } = createSlotFill( 'StackableBlockInspectorTab' )
const { Slot: StyleInspectorTabSlot, Fill: StyleInspectorTabFill } = createSlotFill( 'StackableStyleInspectorTab' )
const { Slot: AdvancedInspectorTabSlot, Fill: AdvancedInspectorTabFill } = createSlotFill( 'StackableAdvancedInspectorTab' )

const InspectorBlockControls = ( { children } ) => {
	const { isSelected, name } = useBlockEditContext()
	const [ activeTab ] = useGlobalState( `tabCache-${ name }`, 'style' )

	if ( ! isSelected || activeTab !== 'block' ) {
		return null
	}

	return <BlockInspectorTabFill>{ children }</BlockInspectorTabFill>
}

const InspectorStyleControls = ( { children } ) => {
	const { isSelected, name } = useBlockEditContext()
	const [ activeTab ] = useGlobalState( `tabCache-${ name }`, 'style' )

	if ( ! isSelected || activeTab !== 'style' ) {
		return null
	}

	return <StyleInspectorTabFill>{ children }</StyleInspectorTabFill>
}

const InspectorAdvancedControls = ( { children } ) => {
	const { isSelected, name } = useBlockEditContext()
	const [ activeTab ] = useGlobalState( `tabCache-${ name }`, 'style' )

	if ( ! isSelected || activeTab !== 'advanced' ) {
		return null
	}

	return <AdvancedInspectorTabFill>{ children }</AdvancedInspectorTabFill>
}

export {
	PreInspectorTabFill,
	InspectorBlockControls,
	InspectorStyleControls,
	InspectorAdvancedControls,
}

const InspectorTabs = props => {
	const { name } = useBlockEditContext()
	const [ activeTab, setActiveTab ] = useGlobalState( `tabCache-${ name }`, 'style' )

	return (
		<InspectorControls>
			<PreInspectorTabSlot />

			<PanelTabs
				tabs={ props.tabs }
				initialTab={ activeTab }
				onClick={ setActiveTab }
			/>

			<BlockInspectorTabSlot />
			<StyleInspectorTabSlot />
			<AdvancedInspectorTabSlot />

		</InspectorControls>
	)
}

InspectorTabs.defaultProps = {
	tabs: [ 'block', 'style', 'advanced' ],
}

export default memo( InspectorTabs )
