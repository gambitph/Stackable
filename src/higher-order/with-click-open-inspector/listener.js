/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

let init = false
const matchers = {
	'ugb-top-separator': 'top-separator',
	'ugb-bottom-separator': 'bottom-separator',
	'ugb-inner-block': 'column-background',
	'ugb-block-title': 'block-title',
	'ugb-block-description': 'block-description',
	'ugb--has-block-background': 'block-background',
}

// These selectors will be listened to in this order.
// If a selector is matched, the succeeding selectors are skipped.
const CLICK_LISTENER_CLASSES = [
	'.editor-rich-text__editable',
	'.ugb-button',
	'.ugb-top-separator',
	'.ugb-bottom-separator',
	'.ugb-inner-block',
	'.ugb-main-block',
]

export const addMatcher = ( clickedClass, targetPanelId ) => {
	matchers[ clickedClass ] = targetPanelId
}

const getPanel = panelId => {
	return document.querySelector( `.ugb-panel--${ panelId }` )
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

const scrollPanelIntoView = panelEl => {
	const tabs = document.querySelector( '.ugb-panel-tabs' )
	const sidebarHeader = document.querySelector( '.edit-post-sidebar-header' )
	const sidebar = document.querySelector( '.edit-post-sidebar' )

	// Adjust the scroll manually instead of scrollIntoView since we have sticky tabs.
	document.querySelector( '.edit-post-sidebar' ).scrollTop =
		document.querySelector( '.edit-post-sidebar' ).scrollTop +
		(
			panelEl.getBoundingClientRect().top -
			( sidebarHeader ? sidebarHeader.getBoundingClientRect().bottom - 2 : sidebar.getBoundingClientRect().top ) -
			( tabs ? tabs.getBoundingClientRect().height : 0 )
		)
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

domReady( () => {
	if ( init ) {
		return
	}
	init = true

	document.body.addEventListener( 'dblclick', ev => {
		CLICK_LISTENER_CLASSES.some( listenerClass => {
			// Only listen to these so that we won't have to check a lot of things.
			const target = ev.target.closest( listenerClass )
			if ( ! target ) {
				return false
			}

			// listen to clicks here
			const didMatch = [].slice.apply( target.classList ).some( c => {
				if ( Object.keys( matchers ).includes( c ) ) {
					// If found, open the panel.
					const panelId = matchers[ c ]
					const panelToOpen = getPanel( panelId )
					if ( panelToOpen ) {
						const tab = getTabOfPanel( panelToOpen )
						openTab( tab )
						openPanel( panelToOpen )
					}

					// Don't continue to other matchers.
					return true
				}
				return false
			} )

			return didMatch
		} )
	} )
} )
