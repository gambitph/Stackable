import './polyfill'
import { Component, createRef } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { Icon } from '@wordpress/components'
import withMemory from './with-memory'

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

export const closeAllOpenPanels = clickedEl => {
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

		this.state = {
			activeTab: this.props.initialTab ? this.props.initialTab : 'layout',
		}

		this.onButtonPanelClick = this.onButtonPanelClick.bind( this )
		this.containerDiv = createRef()
	}

	updateSidebarPanelTab( tab ) {
		const sidebarPanel = this.containerDiv.current.closest( '.components-panel' )
		sidebarPanel.setAttribute( 'data-ugb-tab', tab )
		sidebarPanel.closest( '.edit-post-sidebar' ).classList.add( 'ugb--has-panel-tabs' )
	}

	componentDidMount() {
		this.updateSidebarPanelTab( this.state.activeTab )

		// Listen to panel closes
		if ( this.props.closeOtherPanels ) {
			document.body.addEventListener( 'click', this.onButtonPanelClick )
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
		if ( ! toggle ) {
			return
		}

		closeAllOpenPanels( toggle )
		this.props.onClickPanel( toggle.closest( '.components-panel__body' ) )
	}

	select( tab ) {
		this.setState( { activeTab: tab } )
		this.updateSidebarPanelTab( tab )
		this.props.onClick( tab )
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
	onClickPanel: () => {},
	onClick: () => {},
}

export default withMemory( PanelTabs )
