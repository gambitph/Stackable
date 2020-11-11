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
				const activeTab = isUnmodifiedBlock( this.props.blockProps ) ? '' : 'style'
				panelStatus[ this.blockClientId ] = {
					// New/default blocks should start at the layout tab, others in the style tab.
					activeTab,
					[ `${ activeTab || 'style' }OpenedPanel` ]: 0,
				}
			}

			this.onClickPanel = this.onClickPanel.bind( this )
			this.onClickTab = this.onClickTab.bind( this )
			this.updateOpenedPanel = this.updateOpenedPanel.bind( this )
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
			const container = this.getActiveTabPanelContainer()
			if ( container ) {
				return container.querySelector( `.components-panel__body:nth-child(${ panelIndex + 1 }):not(.is-opened) .components-panel__body-toggle` )
			}
			return null
		}

		getPanelIndex( panel ) {
			return panel ? Array.prototype.slice.call( panel.parentElement.children ).indexOf( panel ) : -1
		}

		async getOpenPanelIndex( tab = this.getActiveTab() ) {
			// Get the element asynchronously.
			const container = await new window.Promise( resolve => setTimeout( resolve, 0 ) )
				.then( () => this.getActiveTabPanelContainer( tab ) )

			if ( container ) {
				const openPanel = container.querySelector( '.components-panel__body.is-opened' )
				return this.getPanelIndex( openPanel )
			}
		}

		componentDidMount() {
			this.updateOpenedPanel()
		}

		updateOpenedPanel( activeTab = panelStatus[ this.blockClientId ].activeTab ) {
			// If initially opened. Don't do anything.
			if ( ! activeTab ) {
				return
			}

			// Or if no panel was open, make sure all panels are closed.
			if ( panelStatus[ this.blockClientId ][ `${ activeTab }openedPanel` ] === -1 ) {
				closeAllOpenPanels()
				return
			}

			// Open the previous panel.
			setTimeout( () => {
				const panel = this.getPanelFromIndex( panelStatus[ this.blockClientId ][ `${ activeTab }OpenedPanel` ] )
				if ( panel ) {
					panel.click()
				}
			}, 0 )
		}

		// Update the cache when closing/opening panels.
		onClickPanel( panel ) {
			const { activeTab } = panelStatus[ this.blockClientId ]
			panelStatus[ this.blockClientId ] = {
				...panelStatus[ this.blockClientId ],
				[ `${ activeTab }OpenedPanel` ]: ! panel.classList.contains( 'is-opened' ) ? this.getPanelIndex( panel ) : -1,
			}
		}

		// Update the cache when changing tabs.
		async onClickTab( tab ) {
			const openedPanel = panelStatus[ this.blockClientId ][ `${ tab }OpenedPanel` ]

			this.updateOpenedPanel( tab )

			panelStatus[ this.blockClientId ] = {
				...panelStatus[ this.blockClientId ],
				activeTab: tab,
				[ `${ tab }OpenedPanel` ]: openedPanel !== undefined ? openedPanel : await this.getOpenPanelIndex( tab ),
			}
		}

		render() {
			return (
				<WrappedComponent
					initialTab={ panelStatus[ this.blockClientId ].activeTab }
					onClickTab={ this.onClickTab }
					onClickPanel={ this.onClickPanel }
					{ ...this.props }
				/>
			)
		}
	},
	'withMemory'
)

export default withMemory
