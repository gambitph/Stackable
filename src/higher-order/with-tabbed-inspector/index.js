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
		const [ panelStatus, setPanelStatus ] = useState( {} )

		const propsWithPanelStatus = {
			...props,
			panelStatus,
		}
		const blockStyleControls = applyFilters( `stackable.${ blockName }.edit.inspector.style.block`, null, propsWithPanelStatus )

		return (
			<Fragment>
				{ applyFilters( `stackable.${ blockName }.edit.inspector.before`, null, propsWithPanelStatus ) }

				<InspectorControls>
					<PanelTabs
						tabs={ tabs }
						blockProps={ props }
						onTabFirstOpen={ setActiveTab }
						onClick={ setActiveTab }
						setPanelStatus={ setPanelStatus }
					/>

					{ ( ! activeTab || activeTab === 'layout' ) &&
						<InspectorPanelControls>
							{ applyFilters( `stackable.${ blockName }.edit.inspector.layout.before`, null, propsWithPanelStatus ) }
							{ applyFilters( `stackable.${ blockName }.edit.inspector.layout.after`, null, propsWithPanelStatus ) }
						</InspectorPanelControls>
					}

					{ ( ! activeTab || activeTab === 'style' ) &&
						<InspectorPanelControls tab="style">
							{ applyFilters( `stackable.${ blockName }.edit.inspector.style.before`, null, propsWithPanelStatus ) }
							{ applyFilters( `stackable.${ blockName }.edit.inspector.style.after`, null, propsWithPanelStatus ) }
							{ blockStyleControls && <div className="ugb-panel-controls-separator" role="presentation">— — —</div> }
							{ blockStyleControls }
						</InspectorPanelControls>
					}

					{ ( ! activeTab || activeTab === 'advanced' ) &&
						<InspectorPanelControls tab="advanced">
							{ applyFilters( `stackable.${ blockName }.edit.inspector.advanced.before`, null, propsWithPanelStatus ) }
							{ applyFilters( `stackable.${ blockName }.edit.inspector.advanced.after`, null, propsWithPanelStatus ) }
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
