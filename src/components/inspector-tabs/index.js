/**
 * External dependencies
 */
import { PanelTabs } from '~stackable/components'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'
import { createSlotFill } from '@wordpress/components'
import { useSelect } from '@wordpress/data'
import { InspectorControls, useBlockEditContext } from '@wordpress/block-editor'
import { useGlobalState } from '~stackable/util/global-state'
import { __ } from '@wordpress/i18n'

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
	const {
		clientId, isSelected, name,
	} = useBlockEditContext()
	const [ activeTab ] = useGlobalState( `tabCache-${ name }`, 'style' )

	const hasInnerBlocks = useSelect(
		select => {
			const block = select( 'core/block-editor' ).getBlock( clientId )
			return !! block?.innerBlocks?.length
		}, [ clientId ] )

	if ( ! isSelected || activeTab !== 'style' ) {
		return null
	}

	return (
		<StyleInspectorTabFill>
			{ children }
			{ ! hasInnerBlocks ? null : <p className="stk-inspector-tab__footnote">{ __( 'Click on any inner block in the editor to style it.', i18n ) }</p> }
		</StyleInspectorTabFill>
	)
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
	const [ activeTab, setActiveTab ] = useGlobalState( `tabCache-${ name }`, props.tabs.includes( 'style' ) ? 'style' : 'block' )

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
