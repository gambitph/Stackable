/**
 * Internal dependencies
 */
import { openPanelId } from './util'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import domReady from '@wordpress/dom-ready'

let init = false
const COMMON_MATCHERS = {
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
	'.ugb-block-content > * > *',
	'.ugb-block-content > *',
	'.ugb-content-wrapper',
	'.ugb-top-separator',
	'.ugb-bottom-separator',
	'.ugb-inner-block',
	'.ugb-main-block',
]

export const addMatcher = ( blockName, clickedClass, targetPanelId ) => {
	if ( typeof MATCHERS[ blockName ] === 'undefined' ) {
		MATCHERS[ blockName ] = {}
	}
	MATCHERS[ blockName ][ clickedClass ] = targetPanelId
}

export const getMatchers = blockName => {
	return {
		...MATCHERS[ blockName ],
		...COMMON_MATCHERS,
	}
}

export const getBlockName = el => {
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

		const matchers = getMatchers( blockName )
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

					// Don't continue to other matchers.
					return openPanelId( panelId )
				}

				return false
			} )

			return didMatch
		} )
	} )
} )
