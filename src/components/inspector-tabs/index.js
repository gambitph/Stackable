/**
 * External dependencies
 */
import { PanelTabs, PanelAdvancedSettings } from '~stackable/components'
import {
	i18n, isPro, showProNotice,
} from 'stackable'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'
import { createSlotFill } from '@wordpress/components'
import { InspectorControls, useBlockEditContext } from '@wordpress/block-editor'
import { useGlobalState } from '~stackable/util/global-state'
import { __ } from '@wordpress/i18n'
import { getBlockSupport } from '@wordpress/blocks'
import { BlockStylesControl } from '../block-styles-control'
import ResponsiveControlVisibility, { ResponsiveControlFilterProvider } from '../responsive-control-visibility'
import useResponsiveControlVisibility from '~stackable/hooks/use-responsive-control-visibility'
import useCoreResponsiveStylesCompatibility from './use-core-responsive-styles-compatibility'

const { Slot: LayoutPanelSlot, Fill: LayoutPanelFill } = createSlotFill( 'StackableLayoutPanel' )

const InspectorLayoutControls = ( { children } ) => {
	return <ResponsiveControlFilterProvider>
		<InspectorControls>
			<LayoutPanelFill>{ children }</LayoutPanelFill>
		</InspectorControls>
	</ResponsiveControlFilterProvider>
}

const InspectorBlockControls = ( { children } ) => {
	const { name } = useBlockEditContext()
	const [ activeTab ] = useGlobalState( `tabCache-${ name }`, 'layout' )

	if ( activeTab !== 'layout' ) {
		return null
	}

	return <ResponsiveControlFilterProvider>
		<InspectorControls>{ children }</InspectorControls>
	</ResponsiveControlFilterProvider>
}

const InspectorStyleControls = ( { children } ) => {
	const { name } = useBlockEditContext()
	const [ activeTab ] = useGlobalState( `tabCache-${ name }`, 'layout' )

	if ( activeTab !== 'style' ) {
		return null
	}

	return <ResponsiveControlFilterProvider>
		<InspectorControls>{ children }</InspectorControls>
	</ResponsiveControlFilterProvider>
}

const InspectorAdvancedControls = ( { children } ) => {
	const { name } = useBlockEditContext()
	const [ activeTab ] = useGlobalState( `tabCache-${ name }`, 'layout' )

	if ( activeTab !== 'advanced' ) {
		return null
	}

	return <ResponsiveControlFilterProvider>
		<InspectorControls>{ children }</InspectorControls>
	</ResponsiveControlFilterProvider>
}

export {
	InspectorLayoutControls,
	InspectorBlockControls,
	InspectorStyleControls,
	InspectorAdvancedControls,
}

const ResponsivePanelTabs = props => {
	// Core owns its Advanced panel, so expose a scoped marker that lets the
	// stylesheet mirror Core's responsive inspector without hiding our tab.
	const isResponsiveFiltering = ! useResponsiveControlVisibility( false )

	return <PanelTabs
		{ ...props }
		className={ isResponsiveFiltering ? 'ugb-panel-tabs--is-responsive-filtering' : '' }
	/>
}

const InspectorTabs = props => {
	const { name, clientId } = useBlockEditContext()
	const defaultTab = getBlockSupport( name, 'stkDefaultTab' ) || 'style'
	const [ activeTab, setActiveTab ] = useGlobalState( `tabCache-${ name }`, props.tabs.includes( defaultTab ) ? defaultTab : 'style' )

	useCoreResponsiveStylesCompatibility( clientId )

	return (
		<ResponsiveControlFilterProvider>
			<InspectorControls>
				<ResponsiveControlVisibility responsive={ false }>
					{ ( isPro || showProNotice ) && <BlockStylesControl blockName={ name } clientId={ clientId } /> }
				</ResponsiveControlVisibility>
				<ResponsivePanelTabs
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

		</ResponsiveControlFilterProvider>
	)
}

InspectorTabs.defaultProps = {
	tabs: [ 'layout', 'style', 'advanced' ],
	hasLayoutPanel: true,
}

export default memo( InspectorTabs )
