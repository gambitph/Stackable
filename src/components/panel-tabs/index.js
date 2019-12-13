/**
 * Internal dependencies
 */
import './polyfill'
import withMemory from './with-memory'
import withSticky from './with-sticky'

/**
 * WordPress dependencies
 */
import { Component, createRef } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { i18n } from 'stackable'
import { Icon } from '@wordpress/components'

const TABS = [
	{
		value: 'layout',
		title: __( 'Layout', i18n ),
		label: __( 'Layout Tab', i18n ),
		icon: 'admin-settings',
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

		this.tabsToUse = this.props.tabs || [ 'layout', 'style', 'advanced' ]

		this.state = {
			activeTab: this.props.initialTab ? this.props.initialTab : this.tabsToUse[ 0 ],
		}

		this.onButtonPanelClick = this.onButtonPanelClick.bind( this )
		this.updateSidebarPanelTab = this.updateSidebarPanelTab.bind( this )
		this.select = this.select.bind( this )
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

		// Don't auto-close panels in the layout tab.
		if ( this.state.activeTab === 'layout' ) {
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
					{ TABS.map( ( {
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
	blockProps: {},
	initialTab: '',
	onClickPanel: () => {},
	onClick: () => {},
	tabs: null,
}

export default withSticky( withMemory( PanelTabs ) )
