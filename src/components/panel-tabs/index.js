import './polyfill'
import { Component, createRef } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { i18n } from 'stackable'
import { Icon } from '@wordpress/components'

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

const onButtonPanelClick = ev => {
	if ( ev.target.classList.contains( 'components-panel__body-toggle' ) ) {
		closeAllOpenPanels( ev.target )
	} else {
		const toggle = ev.target.closest( '.components-panel__body-toggle' )
		if ( toggle ) {
			closeAllOpenPanels( toggle )
		}
	}
}

class PanelTabs extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			activeTab: this.props.activeTab ? this.props.activeTab : 'layout',
		}
		this.containerDiv = createRef()
	}

	componentDidUpdate( prevProps ) {
		if ( this.props.activeTab && ! prevProps.activeTab ) {
			this.setState( { activeTab: this.props.activeTab } )
			this.updateSidebarPanelTab( this.props.activeTab )
		} else {
			this.updateSidebarPanelTab( this.state.activeTab )
		}
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
			document.body.addEventListener( 'click', onButtonPanelClick )
		}
	}

	componentWillUnmount() {
		const sidebarPanel = this.containerDiv.current.closest( '.components-panel' )
		sidebarPanel.removeAttribute( 'data-ugb-tab' )
		sidebarPanel.closest( '.edit-post-sidebar' ).classList.remove( 'ugb--has-panel-tabs' )

		// Remove listener to panel closes
		if ( this.props.closeOtherPanels ) {
			document.body.removeEventListener( 'click', onButtonPanelClick )
		}
	}

	select( tab ) {
		this.setState( { activeTab: tab } )
		this.updateSidebarPanelTab( tab )
	}

	render() {
		return (
			<div
				className="components-panel__body ugb-panel-tabs"
				ref={ this.containerDiv }
			>
				<button
					onClick={ () => this.select( 'layout' ) }
					className={ classnames( [ 'edit-post-sidebar__panel-tab' ],
						{
							'is-active': this.state.activeTab === 'layout',
						}
					) }
					aria-label={ __( 'Layout', i18n ) }
					data-label={ __( 'Layout', i18n ) }
				>
					<Icon icon="admin-settings" />
					{ __( 'Layout', i18n ) }
				</button>
				<button
					onClick={ () => this.select( 'style' ) }
					className={ classnames( [ 'edit-post-sidebar__panel-tab' ],
						{
							'is-active': this.state.activeTab === 'style',
						}
					) }
					aria-label={ __( 'Style', i18n ) }
					data-label={ __( 'Style', i18n ) }
				>
					<Icon icon="admin-appearance" />
					{ __( 'Style', i18n ) }
				</button>
				<button
					onClick={ () => this.select( 'advanced' ) }
					className={ classnames( [ 'edit-post-sidebar__panel-tab' ],
						{
							'is-active': this.state.activeTab === 'advanced',
						}
					) }
					aria-label={ __( 'Advanced', i18n ) }
					data-label={ __( 'Advanced', i18n ) }
				>
					<Icon icon="admin-tools" />
					{ __( 'Advanced', i18n ) }
				</button>
			</div>
		)
	}
}

PanelTabs.defaultProps = {
	closeOtherPanels: true,
}

export default PanelTabs
