/**
 * External dependencies
 */
import { InspectorPanelControls, PanelTabs } from '~stackable/components'

/**
 * WordPress dependencies
 */
import {
	Fragment, useState,
} from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'
import { InspectorControls } from '@wordpress/block-editor'

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
						tabs={ tabs }
						blockProps={ props }
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
