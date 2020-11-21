/**
 * Internal dependencies
 */
import DeprecatedTester from './components/deprecated-tester'
import HTMLValidator from './components/html-validator'

/**
 * WordPress dependencies
 */
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post'
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { PanelAdvancedSettings } from '~stackable/components'

const DebugSidebar = () => (
	<Fragment>
		<PluginSidebarMoreMenuItem
			target={ 'stackable-block-tester' }
		>
			{ __( 'Stackable Debugger', i18n ) }
		</PluginSidebarMoreMenuItem>
		<PluginSidebar
			name={ 'stackable-block-tester' }
			isPinnable={ false }
			title={ __( 'Stackable Debugger', i18n ) }
		>
			<div className="ugb-debugger-panel">
				<p className="components-base-control__help">
					{ __( 'This area contains a number of testing and debugging tools made specifically for Stackable.', i18n ) }
				</p>
			</div>
			<PanelAdvancedSettings
				initialOpen={ false }
				title={ __( 'Block Validity Checker', i18n ) }
			>
				<HTMLValidator />
			</PanelAdvancedSettings>
			<PanelAdvancedSettings
				initialOpen={ false }
				title={ __( 'Block Migration Tests', i18n ) }
			>
				<DeprecatedTester />
			</PanelAdvancedSettings>
		</PluginSidebar>
	</Fragment>
)

export default DebugSidebar
