/**
 * External dependencies
 */
import { PanelTabs, PanelAdvancedSettings } from '~stackable/components'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'
import { createSlotFill } from '@wordpress/components'
import { InspectorControls, useBlockEditContext } from '@wordpress/block-editor'
import { useSelect } from '@wordpress/data'
import { useGlobalState } from '~stackable/util/global-state'
import { __ } from '@wordpress/i18n'
import { getBlockSupport } from '@wordpress/blocks'

const { Slot: PreInspectorTabSlot, Fill: PreInspectorTabFill } = createSlotFill( 'StackablePreInspectorTab' )
const { Slot: BlockInspectorTabSlot, Fill: BlockInspectorTabFill } = createSlotFill( 'StackableBlockInspectorTab' )
const { Slot: StyleInspectorTabSlot, Fill: StyleInspectorTabFill } = createSlotFill( 'StackableStyleInspectorTab' )
const { Slot: AdvancedInspectorTabSlot, Fill: AdvancedInspectorTabFill } = createSlotFill( 'StackableAdvancedInspectorTab' )
const { Slot: LayoutPanelSlot, Fill: LayoutPanelFill } = createSlotFill( 'StackableLayoutPanel' )

const InspectorLayoutControls = ( { children } ) => {
	const { isSelected, name } = useBlockEditContext()
	const [ activeTab ] = useGlobalState( `tabCache-${ name }`, 'layout' )

	if ( ! isSelected || activeTab !== 'layout' ) {
		return null
	}

	return <LayoutPanelFill>{ children }</LayoutPanelFill>
}

const InspectorBlockControls = ( { children } ) => {
	const { isSelected, name } = useBlockEditContext()
	const [ activeTab ] = useGlobalState( `tabCache-${ name }`, 'layout' )

	if ( ! isSelected || activeTab !== 'layout' ) {
		return null
	}

	return <BlockInspectorTabFill>{ children }</BlockInspectorTabFill>
}

const InspectorStyleControls = ( { children } ) => {
	const { clientId, name } = useBlockEditContext()
	const { firstBlockSelected, sameBlockSelected } = useSelect( select => {
		const {
			getSelectedBlockClientId, getFirstMultiSelectedBlockClientId, getMultiSelectedBlocks,
		} = select( 'core/block-editor' )
		const selectedBlocks = getMultiSelectedBlocks()
		return {
			firstBlockSelected: getSelectedBlockClientId() || getFirstMultiSelectedBlockClientId(),
			sameBlockSelected: selectedBlocks ? selectedBlocks.every( block => block.name === selectedBlocks[ 0 ].name ) : false,
		}
	} )
	const [ activeTab ] = useGlobalState( `tabCache-${ name }`, 'layout' )

	if ( clientId !== firstBlockSelected || ! sameBlockSelected || activeTab !== 'style' ) {
		return null
	}

	return (
		<StyleInspectorTabFill>{ children }</StyleInspectorTabFill>
	)
}

const InspectorAdvancedControls = ( { children } ) => {
	const { isSelected, name } = useBlockEditContext()
	const [ activeTab ] = useGlobalState( `tabCache-${ name }`, 'layout' )

	if ( ! isSelected || activeTab !== 'advanced' ) {
		return null
	}

	return <AdvancedInspectorTabFill>{ children }</AdvancedInspectorTabFill>
}

export {
	PreInspectorTabFill,
	InspectorLayoutControls,
	InspectorBlockControls,
	InspectorStyleControls,
	InspectorAdvancedControls,
}

const InspectorTabs = props => {
	const { name } = useBlockEditContext()
	const defaultTab = getBlockSupport( name, 'stkDefaultTab' ) || 'style'
	const [ activeTab, setActiveTab ] = useGlobalState( `tabCache-${ name }`, props.tabs.includes( defaultTab ) ? defaultTab : 'style' )

	return (
		<>
			{ /* Make sure the layout panel is the very first one */ }
			<InspectorBlockControls>
				{ props.hasLayoutPanel && (
					<PanelAdvancedSettings
						title={ __( 'Layout', i18n ) }
						id="layout"
						initialOpen={ true }
					>
						<LayoutPanelSlot />
					</PanelAdvancedSettings>
				) }
			</InspectorBlockControls>

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
		</>
	)
}

InspectorTabs.defaultProps = {
	tabs: [ 'layout', 'style', 'advanced' ],
	hasLayoutPanel: true,
}

export default memo( InspectorTabs )
