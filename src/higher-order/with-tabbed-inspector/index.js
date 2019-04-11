import { Component, Fragment } from '@wordpress/element'
import { InspectorPanelControls, PanelTabs } from '@stackable/components'
import { applyFilters } from '@wordpress/hooks'
import { createHigherOrderComponent } from '@wordpress/compose'
import { InspectorControls } from '@wordpress/editor'

const withTabbedInspector = createHigherOrderComponent(
	WrappedComponent => class extends Component {
		render() {
			const blockName = this.props.blockName
			const { design = '' } = this.props.attributes

			return (
				<Fragment>
					<InspectorControls>
						<PanelTabs />
					</InspectorControls>

					<InspectorPanelControls>
						{ applyFilters( `stackable.${ blockName }.edit.inspector.layout.before`, null, this.props ) }
						{ applyFilters( `stackable.${ blockName }.edit.inspector.layout.after`, null, this.props ) }
					</InspectorPanelControls>

					<InspectorPanelControls tab="style">
						{ applyFilters( `stackable.${ blockName }.edit.inspector.style.before`, null, this.props ) }
						{ applyFilters( `stackable.${ blockName }.edit.inspector.style.after`, null, this.props ) }
					</InspectorPanelControls>

					<InspectorPanelControls tab="advanced">
						{ applyFilters( `stackable.${ blockName }.edit.inspector.advanced.before`, null, this.props ) }
						{ applyFilters( `stackable.${ blockName }.edit.inspector.advanced.after`, null, this.props ) }
					</InspectorPanelControls>

					{ applyFilters( `stackable.${ blockName }.edit.output.before`, null, design, this.props ) }
					<WrappedComponent { ...this.props } />
					{ applyFilters( `stackable.${ blockName }.edit.output.after`, null, design, this.props ) }
				</Fragment>
			)
		}
	},
	'withTabbedInspector'
)

export default withTabbedInspector
