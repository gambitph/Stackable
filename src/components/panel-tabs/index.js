import './polyfill'
import { Component, createRef } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { Icon } from '@wordpress/components'
import { isUnmodifiedBlock } from '@stackable/util'

const TABS = [
	{
		value: 'layout',
		title: __( 'Layout' ),
		label: __( 'Layout Tab' ),
		icon: 'admin-settings',
	},
	{
		value: 'style',
		title: __( 'Style' ),
		label: __( 'Style Tab' ),
		icon: 'admin-appearance',
	},
	{
		value: 'advanced',
		title: __( 'Advanced' ),
		label: __( 'Advanced Tab' ),
		icon: 'admin-tools',
	},
]

const panelStatus = {}

const closeAllOpenPanels = clickedEl => {
	[].forEach.call( document.querySelectorAll( '.components-panel__body .components-panel__body-toggle' ), el => {
		if ( el.offsetHeight === 0 ) {
			return
		}
		if ( el.parentElement.parentElement.classList.contains( 'is-opened' ) ) {
			if ( clickedEl !== el ) {
				el.click()
			}
		}
	} )
}

class PanelTabs extends Component {
	constructor() {
		super( ...arguments )

		// Create a cache for the status of this panel.
		this.blockClientId = this.props.blockProps.clientId
		if ( typeof panelStatus[ this.blockClientId ] === 'undefined' ) {
			panelStatus[ this.blockClientId ] = {
				// New/default blocks should start at the layout tab, others in the style tab.
				tab: isUnmodifiedBlock( this.props.blockProps ) ? 'layout' : 'style',
				panel: 0,
			}
		}

		this.state = {
			activeTab: this.props.initialTab ? this.props.initialTab : panelStatus[ this.blockClientId ].tab,
		}

		this.onButtonPanelClick = this.onButtonPanelClick.bind( this )
		this.containerDiv = createRef()
	}

	updateSidebarPanelTab( tab ) {
		const sidebarPanel = this.containerDiv.current.closest( '.components-panel' )
		sidebarPanel.setAttribute( 'data-ugb-tab', tab )
		sidebarPanel.closest( '.edit-post-sidebar' ).classList.add( 'ugb--has-panel-tabs' )
	}

	getPanelIndex( panel ) {
		return panel ? Array.prototype.slice.call( panel.parentElement.children ).indexOf( panel ) : -1
	}

	getOpenPanelIndex( tab = this.state.activeTab ) {
		const openPanel = this.containerDiv.current.parentElement.querySelector( `.ugb-inspector-panel-controls.ugb-panel-${ tab } .components-panel__body.is-opened` )
		return this.getPanelIndex( openPanel )
	}

	getPanelFromIndex( panelIndex = -1 ) {
		if ( panelIndex === -1 ) {
			return null
		}
		const container = this.containerDiv.current.parentElement.querySelector( `.ugb-inspector-panel-controls.ugb-panel-${ this.state.activeTab }` )
		return container.querySelector( `.components-panel__body:nth-child(${ panelIndex + 1 }):not(.is-opened) .components-panel__body-toggle` )
	}

	componentDidMount() {
		this.updateSidebarPanelTab( this.state.activeTab )

		// Listen to panel closes
		if ( this.props.closeOtherPanels ) {
			document.body.addEventListener( 'click', this.onButtonPanelClick )
		}

		// Open the previous panel.
		const panel = this.getPanelFromIndex( panelStatus[ this.blockClientId ].panel )
		if ( panel ) {
			panel.click()
		}
		// Or close everything.
		if ( panelStatus[ this.blockClientId ].panel === -1 ) {
			closeAllOpenPanels()
		}
	}

	componentWillUnmount() {
		const sidebarPanel = this.containerDiv.current.closest( '.components-panel' )
		sidebarPanel.removeAttribute( 'data-ugb-tab' )
		sidebarPanel.closest( '.edit-post-sidebar' ).classList.remove( 'ugb--has-panel-tabs' )

		// Remove listener to panel closes
		if ( this.props.closeOtherPanels ) {
			document.body.removeEventListener( 'click', this.onButtonPanelClick )
		}
	}

	onButtonPanelClick( ev ) {
		const toggle = ev.target.closest( '.components-panel__body-toggle' )
		if ( toggle ) {
			closeAllOpenPanels( toggle )

			// Update the cache, get the current open panel
			const panel = toggle.closest( '.components-panel__body' )
			panelStatus[ this.blockClientId ] = {
				...panelStatus[ this.blockClientId ],
				panel: ! panel.classList.contains( 'is-opened' ) ? this.getPanelIndex( panel ) : -1, //this.getOpenPanelIndex(),
			}
		}
	}

	select( tab ) {
		this.setState( { activeTab: tab } )
		this.updateSidebarPanelTab( tab )

		// Update the cache.
		panelStatus[ this.blockClientId ] = {
			tab,
			panel: this.getOpenPanelIndex( tab ),
		}
	}

	render() {
		return (
			<div
				className="components-panel__body ugb-panel-tabs"
				ref={ this.containerDiv }
			>
				{ TABS.map( ( { value, title, label, icon }, i ) => {
					return (
						<button
							key={ i }
							onClick={ () => this.select( value ) }
							className={ classnames( [ 'edit-post-sidebar__panel-tab' ],
								{
									'is-active': this.state.activeTab === value,
								}
							) }
							aria-label={ label }
							data-label={ label }
						>
							<Icon icon={ icon } />
							{ title }
						</button>
					)
				} ) }
			</div>
		)
	}
}

PanelTabs.defaultProps = {
	closeOtherPanels: true,
	blockProps: {},
	initialTab: '',
}

export default PanelTabs
