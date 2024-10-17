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
		value: 'layout',
		title: __( 'Layout', i18n ),
		label: __( 'Layout Tab', i18n ),
		icon: 'align-left',
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
		icon: 'admin-generic',
	},
]

const DEFAULT_TABS = [ 'layout', 'style', 'advanced' ]

export const closeAllOpenPanels = clickedEl => {
	[].forEach.call( document.querySelector( '.edit-post-sidebar, .edit-widgets-sidebar, .block-editor-block-inspector' )?.querySelectorAll( '.components-panel__body .components-panel__body-toggle.stk-panel' ) || [], el => {
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
		const toggle = ev.target.closest( '.components-panel__body-toggle.stk-panel' )
		if ( ! toggle ) {
			return
		}

		// Allow other panels to override the auto-closing behavior.
		if ( ! applyFilters( 'stackable.panel.tabs.panel-auto-close', true, toggle ) ) {
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
					{ applyFilters( 'stackable.inspector.tabs', TABS ).map( ( tabProps, i ) => {
						let {
							value, title, label, icon,
						} = tabProps

						if ( ! this.tabsToUse.includes( value ) ) {
							return null
						}

						// Allow the different display attributes of the tab to be overridden.
						if ( this.props.tabOverrides && this.props.tabOverrides[ value ] ) {
							const override = this.props.tabOverrides[ value ]
							title = override.title ? override.title : title
							label = override.label ? override.label : label
							icon = override.icon ? override.icon : icon
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
