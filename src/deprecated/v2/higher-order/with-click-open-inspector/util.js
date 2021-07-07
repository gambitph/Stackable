import { supportsInspectorPositionSticky } from '~stackable/util'

export const openPanelId = panelId => {
	let panelToOpen = getPanel( panelId )
	if ( panelToOpen ) {
		const tab = getTabOfPanel( panelToOpen )
		openTab( tab )
		openPanel( panelToOpen )
	}

	// If the panel cannot be found, that means that the tab is closed.  When
	// this happens, assume that the panel is inside the another tab, try the
	// other tabs and check again.
	//
	// We need to do this because our tabs will not render other panels if
	// they're not open.
	if ( ! panelToOpen ) {
		const selectorsToTry = [ `.ugb-tab--style`, `.ugb-tab--layout`, `.ugb-tab--section`, `.ugb-tag--advanced` ]
		selectorsToTry.some( selector => {
			const tab = document.querySelector( selector )
			openTab( tab )
			panelToOpen = getPanel( panelId )
			if ( panelToOpen ) {
				openPanel( panelToOpen )
			}
			return !! panelToOpen
		} )
	}

	return panelToOpen
}

const getPanel = panelId => {
	return document.querySelector( `.ugb-panel--${ panelId }` )
}

const getTabOfPanel = panelEl => {
	const panelContainer = panelEl.closest( '.ugb-inspector-panel-controls' )
	if ( ! panelContainer ) {
		return null
	}
	const panelTabMatch = panelContainer.getAttribute( 'class' ).match( /ugb-panel-(\w+)/ )
	if ( panelTabMatch ) {
		const panelTabName = panelTabMatch[ 1 ]
		return document.querySelector( `.ugb-tab--${ panelTabName }` )
	}
	return null
}

const openTab = tabEl => {
	if ( tabEl ) {
		if ( ! tabEl.classList.contains( 'is-active' ) ) {
			tabEl.click()
		}
	}
}

const openPanel = panelEl => {
	if ( ! panelEl ) {
		return
	}

	// Don't do anything if panel is already open.
	if ( ! panelEl.classList.contains( 'is-opened' ) ) {
		const panelButton = panelEl.querySelector( 'button' )
		// Open the panel if it's not yet open.
		if ( panelButton ) {
			panelButton.click()
		}
	}
	scrollPanelIntoView( panelEl )
}

export const scrollPanelIntoView = panelEl => {
	const tabs = document.querySelector( '.ugb-panel-tabs' )
	const sidebar = document.querySelector( '.edit-post-sidebar, .edit-widgets-sidebar' )

	let offset = panelEl.getBoundingClientRect().top + 2
	offset -= tabs ? tabs.getBoundingClientRect().height : 0
	offset -= sidebar.getBoundingClientRect().top

	if ( ! supportsInspectorPositionSticky() ) {
		const sidebarHeader = document.querySelector( '.edit-post-sidebar-header' )
		offset -= sidebarHeader ? sidebarHeader.getBoundingClientRect().height - 1 : 0
	}

	document.querySelector( '.edit-post-sidebar, .edit-widgets-sidebar' ).scrollTop += offset
}
