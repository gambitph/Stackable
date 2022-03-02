/**
 * Internal dependencies
 */
import './polyfill'

/**
 * WordPress dependencies
 */
import { Component, createRef } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { i18n, settings } from 'stackable'
import { applyFilters } from '@wordpress/hooks'
import { Icon } from '@wordpress/components'

const TABS = [
	{
		value: 'block',
		title: __( 'Block', i18n ),
		label: __( 'Block Tab', i18n ),
		icon: 'block-default',
	},
	{
		value: 'style',
		title: __( 'Style', i18n ),
		label: __( 'Style Tab', i18n ),
		icon: 'admin-appearance',
	},
	{
		value: 'advanced',
		title: __( 'Advanced', i18n ),
		label: __( 'Advanced Tab', i18n ),
		icon: 'admin-tools',
	},
]

const DEFAULT_TABS = [ 'block', 'style', 'advanced' ]

export const closeAllOpenPanels = clickedEl => {
	[].forEach.call( document.querySelector( '.edit-post-sidebar, .edit-widgets-sidebar' )?.querySelectorAll( '.components-panel__body .components-panel__body-toggle' ) || [], el => {
		if ( el.offsetHeight === 0 ) {
			return
		}
		if ( el.parentElement.parentElement.classList.contains( 'is-opened' ) ) {
			if ( clickedEl !== el ) {
				// Allow other panels to override the auto-closing behavior.
				if ( applyFilters( 'stackable.panel.tabs.panel-auto-close', true, el ) ) {
					el.click()
				}
			}
		}
	} )
}

class PanelTabs extends Component {
	constructor() {
		super( ...arguments )

		this.tabsToUse = this.props.tabs || DEFAULT_TABS

		this.state = {
			activeTab: this.props.initialTab ? this.props.initialTab : this.tabsToUse[ 0 ],
		}

		this.onButtonPanelClick = this.onButtonPanelClick.bind( this )
		this.updateSidebarPanelTab = this.updateSidebarPanelTab.bind( this )
		this.select = this.select.bind( this )
		this.containerDiv = createRef()

		// Auto-closing panels also re-triggers click listeners, this flag prevents that.
		this.suspendClickListener = false

		this.props.onTabFirstOpen( this.state.activeTab )
	}

	updateSidebarPanelTab( tab ) {
		const sidebarPanel = this.containerDiv.current.closest( '.components-panel' )
		if ( sidebarPanel ) {
			setTimeout( () => {
				if ( sidebarPanel ) {
					sidebarPanel.setAttribute( 'data-ugb-tab', tab )
					sidebarPanel.closest( '.edit-post-sidebar, .edit-widgets-sidebar, .interface-complementary-area' )?.classList.add( 'ugb--has-panel-tabs' )
				}
			}, 1 )
		}
	}

	componentDidMount() {
		this.updateSidebarPanelTab( this.state.activeTab )

		// Listen to panel closes
		if ( this.props.closeOtherPanels && settings.stackable_auto_collapse_panels ) {
			document.body.addEventListener( 'click', this.onButtonPanelClick )
		}
	}

	componentWillUnmount() {
		const sidebarPanel = document.querySelector( '[data-ugb-tab]' )
		if ( sidebarPanel ) {
			sidebarPanel.removeAttribute( 'data-ugb-tab' )
			sidebarPanel.closest( '.edit-post-sidebar, .edit-widgets-sidebar, .interface-complementary-area' ).classList.remove( 'ugb--has-panel-tabs' )
		}

		// Remove listener to panel closes
		if ( this.props.closeOtherPanels && settings.stackable_auto_collapse_panels ) {
			document.body.removeEventListener( 'click', this.onButtonPanelClick )
		}
	}

	onButtonPanelClick( ev ) {
		const toggle = ev.target.closest( '.components-panel__body-toggle' )
		if ( ! toggle ) {
			return
		}

		// Allow other panels to override the auto-closing behavior.
		if ( ! applyFilters( 'stackable.panel.tabs.panel-auto-close', true, toggle ) ) {
			return
		}

		// Don't auto-close panels in the layout tab. (v2)
		if ( this.state.activeTab === 'layout' ) {
			return
		}

		// Prevent re-triggering of this click listener when closing other panels below.
		if ( this.suspendClickListener ) {
			return
		}
		this.suspendClickListener = true

		closeAllOpenPanels( toggle )

		// Resume click handler.
		this.suspendClickListener = false
	}

	select( tab ) {
		this.setState( { activeTab: tab } )
		this.updateSidebarPanelTab( tab )
		this.props.onClick( tab )
	}

	render() {
		const classNames = classnames( [
			this.props.className,
			'components-panel__body',
			'ugb-panel-tabs',
		] )
		return (
			<div
				className={ classNames }
				style={ this.props.style }
				ref={ this.containerDiv }
			>
				<div className="ugb-panel-tabs__wrapper">
					{ applyFilters( 'stackable.inspector.tabs', TABS ).map( ( {
						value, title, label, icon,
					}, i ) => {
						if ( ! this.tabsToUse.includes( value ) ) {
							return null
						}
						return (
							<button
								key={ i }
								onClick={ () => this.select( value ) }
								className={ classnames(
									[
										'edit-post-sidebar__panel-tab',
										`ugb-tab--${ value }`,
									],
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
			</div>
		)
	}
}

PanelTabs.defaultProps = {
	className: '',
	style: {},
	closeOtherPanels: true,
	initialTab: '',
	onClickPanel: () => {},
	onClick: () => {},
	tabs: null,
	onTabFirstOpen: () => {},
}

export default PanelTabs
