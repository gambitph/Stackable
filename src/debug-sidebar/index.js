import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post'
import { __ } from '@wordpress/i18n'
import DeprecatedTester from './components/deprecated-tester'
import { Fragment } from '@wordpress/element'
import HTMLValidator from './components/html-validator'
import { PanelBody } from '@wordpress/components'
import { registerPlugin } from '@wordpress/plugins'

const id = 'stackable-block-tester'

const Component = () => (
	<Fragment>
		<PluginSidebarMoreMenuItem
			target={ id }
		>
			{ __( 'Stackable Debugger' ) }
		</PluginSidebarMoreMenuItem>
		<PluginSidebar
			name={ id }
			isPinnable={ false }
			title={ __( 'Stackable Debugger' ) }
		>
			<div className="ugb-debugger-panel">
				<p className="components-base-control__help">
					{ __( 'This area contains a number of testing and debugging tools made specifically for Stackable.' ) }
				</p>
			</div>
			<PanelBody
				initialOpen={ false }
				title={ __( 'Block Validity Checker' ) }
			>
				<HTMLValidator />
			</PanelBody>
			<PanelBody
				initialOpen={ false }
				title={ __( 'Block Migration Tests' ) }
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
