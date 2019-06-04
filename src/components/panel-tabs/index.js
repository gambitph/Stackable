import './polyfill'
import { Component, createRef } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { Icon } from '@wordpress/components'
import { isUnmodifiedBlock } from '@stackable/util';

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
		const defaultTab = isUnmodifiedBlock( this.props.blockProps ) ? 'layout' : 'style'
		this.state = {
			activeTab: this.props.activeTab ? this.props.activeTab : defaultTab,
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
}

export default PanelTabs
