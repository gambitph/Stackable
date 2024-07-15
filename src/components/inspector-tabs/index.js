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
import { useGlobalState } from '~stackable/util/global-state'
import { __ } from '@wordpress/i18n'
import { getBlockSupport } from '@wordpress/blocks'

const { Slot: LayoutPanelSlot, Fill: LayoutPanelFill } = createSlotFill( 'StackableLayoutPanel' )

const InspectorLayoutControls = ( { children } ) => {
	return <InspectorControls>
		<LayoutPanelFill>{ children }</LayoutPanelFill>
	</InspectorControls>
}

const InspectorBlockControls = ( { children } ) => {
	const { name } = useBlockEditContext()
	const [ activeTab ] = useGlobalState( `tabCache-${ name }`, 'layout' )

	if ( activeTab !== 'layout' ) {
		return null
	}

	return <InspectorControls>{ children }</InspectorControls>
}

const InspectorStyleControls = ( { children } ) => {
	const { name } = useBlockEditContext()
	const [ activeTab ] = useGlobalState( `tabCache-${ name }`, 'layout' )

	if ( activeTab !== 'style' ) {
		return null
	}

	return <InspectorControls>{ children }</InspectorControls>
}

const InspectorAdvancedControls = ( { children } ) => {
	const { name } = useBlockEditContext()
	const [ activeTab ] = useGlobalState( `tabCache-${ name }`, 'layout' )

	if ( activeTab !== 'advanced' ) {
		return null
	}

	return <InspectorControls>{ children }</InspectorControls>
}

export {
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
			<InspectorControls>
				<PanelTabs
					tabs={ props.tabs }
					initialTab={ activeTab }
					onClick={ setActiveTab }
				/>
			</InspectorControls>

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

		</>
	)
}

InspectorTabs.defaultProps = {
	tabs: [ 'layout', 'style', 'advanced' ],
	hasLayoutPanel: true,
}

export default memo( InspectorTabs )
