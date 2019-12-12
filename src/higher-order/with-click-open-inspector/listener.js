/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

let init = false
const commonMatchers = {
	'.ugb-top-separator': 'top-separator',
	'.ugb-bottom-separator': 'bottom-separator',
	'.ugb-inner-block': 'column-background',
	'.ugb-block-title': 'block-title',
	'.ugb-block-description': 'block-description',
	'.ugb--has-block-background': 'block-background',
}
const MATCHERS = {}

// These selectors will be listened to in this order.
// If a selector is matched, the succeeding selectors are skipped.
const CLICK_LISTENER_CLASSES = [
	'.editor-rich-text__editable',
	'svg',
	'img',
	'figure',
	'.ugb-button',
	'[role="button"]',
	'.ugb-block-content > *',
	'.ugb-top-separator',
	'.ugb-bottom-separator',
	'.ugb-inner-block',
	'.ugb-main-block',
]

export const addMatcher = ( blockName, clickedClass, targetPanelId ) => {
	if ( typeof MATCHERS[ blockName ] === 'undefined' ) {
		MATCHERS[ blockName ] = { ...commonMatchers }
	}
	MATCHERS[ blockName ][ clickedClass ] = targetPanelId
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

const getBlockName = el => {
	const blockEl = el.closest( '[data-type]' )
	if ( blockEl ) {
		if ( ! blockEl.getAttribute( 'data-type' ).match( /^ugb\//i ) ) {
			return ''
		}
		return blockEl.getAttribute( 'data-type' ).replace( /^ugb\//i, '' )
	}
	return ''
}

domReady( () => {
	if ( init ) {
		return
	}
	init = true

	// Don't do this if browser doesn't support matches.
	if ( ! Element.prototype.matches ) {
		return
	}

	const overrides = applyFilters( 'stackable.click-open-inspector.listener-override', {} )

	document.body.addEventListener( 'dblclick', ev => {
		const blockName = getBlockName( ev.target )
		if ( ! blockName ) {
			return
		}
		const matchers = MATCHERS[ blockName ]
		if ( ! matchers ) {
			return
		}

		let classOverrides = []

		Object.keys( overrides ).some( overrideSelector => {
			if ( ev.target.closest( overrideSelector ) ) {
				classOverrides = overrides[ overrideSelector ]
				return true
			}
			return false
		} );

		( [ ...classOverrides, ...CLICK_LISTENER_CLASSES ] ).some( listenerClass => {
			// Only listen to these so that we won't have to check a lot of things.
			const target = ev.target.closest( listenerClass )
			if ( ! target ) {
				return false
			}

			// Checks whether the clicked element matches anything that we're listening for.
			const didMatch = Object.keys( matchers ).some( matchSelector => {
				if ( target.matches( matchSelector ) ) {
					// Get the panel that we need to open.
					const panelId = matchers[ matchSelector ]
					const panelToOpen = getPanel( panelId )
					if ( panelToOpen ) {
						const tab = getTabOfPanel( panelToOpen )
						openTab( tab )
						openPanel( panelToOpen )
					}

					// Don't continue to other matchers.
					return !! panelToOpen
				}

				return false
			} )

			return didMatch
		} )
	} )
} )
