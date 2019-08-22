/**
 * External dependencies
 */
import { InspectorPanelControls, PanelTabs } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { Component, Fragment } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'
import { createHigherOrderComponent } from '@wordpress/compose'
import { InspectorControls } from '@wordpress/block-editor'

const withTabbedInspector = ( tabs = null ) => createHigherOrderComponent(
	WrappedComponent => class extends Component {
		static defaultProps = {
			attributes: {},
			blockName: '',
		}

		render() {
			const { blockName } = this.props
			const blockStyleControls = applyFilters( `stackable.${ blockName }.edit.inspector.style.block`, null, this.props )

			return (
				<Fragment>
					{ applyFilters( `stackable.${ blockName }.edit.inspector.before`, null, this.props ) }

					<InspectorControls>
						<PanelTabs tabs={ tabs } blockProps={ this.props } />
					</InspectorControls>

					<InspectorPanelControls>
						{ applyFilters( `stackable.${ blockName }.edit.inspector.layout.before`, null, this.props ) }
						{ applyFilters( `stackable.${ blockName }.edit.inspector.layout.after`, null, this.props ) }
					</InspectorPanelControls>

					<InspectorPanelControls tab="style">
						{ applyFilters( `stackable.${ blockName }.edit.inspector.style.before`, null, this.props ) }
						{ applyFilters( `stackable.${ blockName }.edit.inspector.style.after`, null, this.props ) }
						{ blockStyleControls && <div className="ugb-panel-controls-separator" role="presentation">— — —</div> }
						{ blockStyleControls }
					</InspectorPanelControls>

					<InspectorPanelControls tab="advanced">
						{ applyFilters( `stackable.${ blockName }.edit.inspector.advanced.before`, null, this.props ) }
						{ applyFilters( `stackable.${ blockName }.edit.inspector.advanced.after`, null, this.props ) }
					</InspectorPanelControls>

					<WrappedComponent { ...this.props } />
				</Fragment>
			)
		}
	},
	'withTabbedInspector'
)

export default withTabbedInspector
