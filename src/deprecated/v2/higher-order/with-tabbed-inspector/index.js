/**
 * Internal dependencies
 */
import withMemory from './with-memory'

/**
 * External dependencies
 */
import { InspectorPanelControls, PanelTabs as _PanelTabs } from '~stackable/components'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	Fragment, useState,
} from '@wordpress/element'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { InspectorControls } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'

const PanelTabs = withMemory( _PanelTabs )

// Add the layout tab.
addFilter( 'stackable.inspector.tabs', 'stackable/v2', tabs => {
	if ( tabs.find( ( { value } ) => value === 'layout' ) ) {
		return tabs
	}
	return [
		{
			value: 'layout',
			title: __( 'Layout', i18n ),
			label: __( 'Layout Tab', i18n ),
			icon: 'admin-settings',
		},
		...tabs,
	]
} )

const withTabbedInspector = ( tabs = null ) => WrappedComponent => {
	const NewComp = props => {
		const { blockName } = props
		const [ activeTab, setActiveTab ] = useState( null )
		const blockStyleControls = applyFilters( `stackable.${ blockName }.edit.inspector.style.block`, null, props )

		return (
			<Fragment>
				{ applyFilters( `stackable.edit.inspector.before`, null, props ) }
				{ applyFilters( `stackable.${ blockName }.edit.inspector.before`, null, props ) }

				<InspectorControls>
					<PanelTabs
						tabs={ tabs || [ 'layout', 'style', 'advanced' ] }
						onTabFirstOpen={ setActiveTab }
						onClick={ setActiveTab }
					/>

					{ ( ! activeTab || activeTab === 'layout' ) &&
						<InspectorPanelControls>
							{ applyFilters( `stackable.${ blockName }.edit.inspector.layout.before`, null, props ) }
							{ applyFilters( `stackable.${ blockName }.edit.inspector.layout.after`, null, props ) }
						</InspectorPanelControls>
					}

					{ ( ! activeTab || activeTab === 'style' ) &&
						<InspectorPanelControls tab="style">
							{ applyFilters( `stackable.${ blockName }.edit.inspector.style.before`, null, props ) }
							{ applyFilters( `stackable.${ blockName }.edit.inspector.style.after`, null, props ) }
							{ blockStyleControls && <div className="ugb-panel-controls-separator" role="presentation">— — —</div> }
							{ blockStyleControls }
						</InspectorPanelControls>
					}

					{ ( ! activeTab || activeTab === 'advanced' ) &&
						<InspectorPanelControls tab="advanced">
							{ applyFilters( `stackable.${ blockName }.edit.inspector.advanced.before`, null, props ) }
							{ applyFilters( `stackable.${ blockName }.edit.inspector.advanced.after`, null, props ) }
						</InspectorPanelControls>
					}
				</InspectorControls>

				<WrappedComponent { ...props } />
			</Fragment>
		)
	}

	NewComp.defaultProps = {
		...( WrappedComponent.defaultProps || {} ),
		attributes: {},
		blockName: '',
	}

	return NewComp
}

export default withTabbedInspector
