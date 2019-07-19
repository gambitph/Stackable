import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post'
import { __ } from '@wordpress/i18n'
import DeprecatedTester from './components/deprecated-tester'
import { Fragment } from '@wordpress/element'
import HTMLValidator from './components/html-validator'
import { i18n } from 'stackable'
import { PanelBody } from '@wordpress/components'
import { registerPlugin } from '@wordpress/plugins'

const id = 'stackable-block-tester'

const Component = () => (
	<Fragment>
		<PluginSidebarMoreMenuItem
			target={ id }
		>
			{ __( 'Stackable Debugger', i18n ) }
		</PluginSidebarMoreMenuItem>
		<PluginSidebar
			name={ id }
			isPinnable={ false }
			title={ __( 'Stackable Debugger', i18n ) }
		>
			<div className="ugb-debugger-panel">
				<p className="components-base-control__help">
					{ __( 'This area contains a number of testing and debugging tools made specifically for Stackable.', i18n ) }
				</p>
			</div>
			<PanelBody
				initialOpen={ false }
				title={ __( 'Block Validity Checker', i18n ) }
			>
				<HTMLValidator />
			</PanelBody>
			<PanelBody
				initialOpen={ false }
				title={ __( 'Block Migration Tests', i18n ) }
			>
				<DeprecatedTester />
			</PanelBody>
		</PluginSidebar>
	</Fragment>
)

registerPlugin( id, {
	icon: 'clipboard',
	render: Component,
} )
