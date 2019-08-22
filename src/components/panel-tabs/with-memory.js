/**
 * Internal dependencies
 */
import { closeAllOpenPanels } from './'

/**
 * External dependencies
 */
import { isUnmodifiedBlock } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element'
import { createHigherOrderComponent } from '@wordpress/compose'
import PropTypes from 'prop-types'

const panelStatus = {}

const withMemory = createHigherOrderComponent(
	WrappedComponent => class extends Component {
		static propTypes = {
			blockProps: PropTypes.shape( {
				clientId: PropTypes.string.isRequired,
				name: PropTypes.string.isRequired,
				attributes: PropTypes.object.isRequired,
			} ),
		}

		constructor() {
			super( ...arguments )

			// Create a cache for the status of this panel.
			this.blockClientId = this.props.blockProps.clientId
			if ( typeof panelStatus[ this.blockClientId ] === 'undefined' ) {
				panelStatus[ this.blockClientId ] = {
					// New/default blocks should start at the layout tab, others in the style tab.
					tab: isUnmodifiedBlock( this.props.blockProps ) ? '' : 'style',
					panel: 0,
				}
			}

			this.onClickPanel = this.onClickPanel.bind( this )
			this.onClickTab = this.onClickTab.bind( this )
		}

		getActiveTab() {
			const mainContainer = document.querySelector( '.components-panel[data-ugb-tab]' )
			return mainContainer ? mainContainer.getAttribute( 'data-ugb-tab' ) : undefined
		}

		getActiveTabPanelContainer( tab = this.getActiveTab() ) {
			return tab ? document.querySelector( `.ugb-panel-${ tab }` ) : undefined
		}

		getPanelFromIndex( panelIndex = -1 ) {
			if ( panelIndex === -1 ) {
				return null
			}
			return this.getActiveTabPanelContainer().querySelector( `.components-panel__body:nth-child(${ panelIndex + 1 }):not(.is-opened) .components-panel__body-toggle` )
		}

		getPanelIndex( panel ) {
			return panel ? Array.prototype.slice.call( panel.parentElement.children ).indexOf( panel ) : -1
		}

		getOpenPanelIndex( tab = this.getActiveTab() ) {
			const container = this.getActiveTabPanelContainer( tab )
			const openPanel = container.querySelector( '.components-panel__body.is-opened' )
			return this.getPanelIndex( openPanel )
		}

		componentDidMount() {
			// Or if no panel was open, make sure all panels are closed.
			if ( panelStatus[ this.blockClientId ].panel === -1 ) {
				closeAllOpenPanels()
				return
			}

			// Open the previous panel.
			const panel = this.getPanelFromIndex( panelStatus[ this.blockClientId ].panel )
			if ( panel ) {
				panel.click()
			}
		}

		// Update the cache when closing/opening panels.
		onClickPanel( panel ) {
			panelStatus[ this.blockClientId ] = {
				...panelStatus[ this.blockClientId ],
				panel: ! panel.classList.contains( 'is-opened' ) ? this.getPanelIndex( panel ) : -1,
			}
		}

		// Update the cache when changing tabs.
		onClickTab( tab ) {
			panelStatus[ this.blockClientId ] = {
				tab,
				panel: this.getOpenPanelIndex( tab ),
			}
		}

		render() {
			return (
				<WrappedComponent
					initialTab={ panelStatus[ this.blockClientId ].tab }
					onClick={ this.onClickTab }
					onClickPanel={ this.onClickPanel }
					{ ...this.props }
				/>
			)
		}
	},
	'withMemory'
)

export default withMemory
