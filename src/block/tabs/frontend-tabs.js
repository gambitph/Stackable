/* eslint-disable @wordpress/no-global-event-listener */
/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

class _StackableTabs {
	constructor( el ) {
		this.uniqueId = el.getAttribute( 'data-block-id' )
		this.parentEl = el
		this.getDefaultState()
		this.initTabs()
		this.initWindowEventListeners()
	}

	getDefaultState = () => {
		this.activeTab = parseInt( this.parentEl.getAttribute( 'data-initial-tab' ) || '1', 10 )

		this.tabList = this.parentEl.querySelector( '[role="tablist"]' )
		this.tabs = this.parentEl.querySelector( '.stk-block-tab-labels__wrapper' ).children
		this.contents = this.parentEl.querySelector( '.stk-block-tab-content > .stk-inner-blocks' ).children

		this.customTabAnchors = {}
	}

	initTabs = () => {
		const tabAnchors = []
		// Set Aria attributes
		Array.from( this.tabs ).forEach( ( tab, index, tabs ) => {
			let isCustomAnchor = true
			if ( tab.getAttribute( 'id' ) ) {
				this.customTabAnchors[ tab.getAttribute( 'id' ) ] = { index: index + 1, tab }
			} else {
				tab.setAttribute( 'id', `stk-block-tab-label-${ this.uniqueId }-${ index + 1 }` )
				isCustomAnchor = false
			}
			tabAnchors.push( tab.getAttribute( 'id' ) )

			if ( window.location.hash === `#${ tab.getAttribute( 'id' ) }` ) {
				tabs[ this.activeTab - 1 ].classList.remove( 'stk-block-tabs__tab--active' )
				this.activeTab = index + 1
			}

			tab.setAttribute( 'aria-controls', `stk-block-tab-content-${ this.uniqueId }-${ index + 1 }` )
			tab.setAttribute( 'aria-selected', this.activeTab === ( index + 1 ) ? 'true' : 'false' )
			tab.setAttribute( 'tabindex', this.activeTab === ( index + 1 ) ? '0' : '-1' )

			if ( this.activeTab === ( index + 1 ) ) {
				tab.classList.add( 'stk-block-tabs__tab--active' )
			}

			// Add the click event.
			tab.addEventListener( 'click', () => {
				this.changeTab( index + 1 )
				if ( isCustomAnchor && window.location.hash !== `#${ tab.getAttribute( 'id' ) }` ) {
					// Update URL hash without scrolling
					history.pushState( {}, '', `#${ tab.getAttribute( 'id' ) }` )
				}
			} )
		} )

		// Set Aria attributes
		Array.from( this.contents ).forEach( ( content, index ) => {
			content.setAttribute( 'id', `stk-block-tab-content-${ this.uniqueId }-${ index + 1 }` )
			content.setAttribute( 'aria-labelledby', tabAnchors[ index ] )
			content.setAttribute( 'tabindex', '0' )
			if ( this.activeTab !== ( index + 1 ) ) {
				content.setAttribute( 'hidden', 'true' )
			} else {
				content.removeAttribute( 'hidden' )
			}
		} )

		// Enable arrow navigation between tabs in the tab list
		let tabFocus = 0

		// Keyboard events for the tablist
		this.tabList.addEventListener( 'keydown', e => {
			// Move right
			if ( e.key.startsWith( 'Arrow' ) ) {
				this.tabs[ tabFocus ].setAttribute( 'tabindex', -1 )
				if ( e.key === 'ArrowRight' || e.key === 'ArrowDown' ) {
					tabFocus++
					// If we're at the end, go to the start
					if ( tabFocus >= this.tabs.length ) {
						tabFocus = 0
					}
					// Move left
				} else if ( e.key === 'ArrowLeft' || e.key === 'ArrowUp' ) {
					tabFocus--
					// If we're at the start, move to the end
					if ( tabFocus < 0 ) {
						tabFocus = this.tabs.length - 1
					}
				}

				this.tabs[ tabFocus ].setAttribute( 'tabindex', 0 )
				this.tabs[ tabFocus ].focus()

				e.preventDefault()
			}
		} )
	}

	changeTab = tabIndex => {
		if ( this.activeTab === tabIndex ) {
			return
		}

		Array.from( this.tabs ).forEach( ( tab, index ) => {
			tab.setAttribute( 'aria-selected', tabIndex === ( index + 1 ) ? 'true' : 'false' )
			tab.setAttribute( 'tabindex', tabIndex === ( index + 1 ) ? '0' : '-1' )

			if ( tabIndex === ( index + 1 ) ) {
				tab.classList.add( 'stk-block-tabs__tab--active' )
			} else {
				tab.classList.remove( 'stk-block-tabs__tab--active' )
			}
		} )

		Array.from( this.contents ).forEach( ( content, index ) => {
			if ( tabIndex !== ( index + 1 ) ) {
				content.setAttribute( 'hidden', 'true' )
			} else {
				content.removeAttribute( 'hidden' )
			}
		} )

		this.activeTab = tabIndex
	}

	initWindowEventListeners = () => {
		// Add window event listener only when there are custom tab anchors
		if ( Object.keys( this.customTabAnchors ).length ) {
			// Change the active tab on hash change
			window.addEventListener( 'hashchange', () => {
			// Get hash without the # symbol
				const hash = window.location.hash.slice( 1 )
				if ( hash in this.customTabAnchors ) {
					this.changeTab( this.customTabAnchors[ hash ].index )
				}
			} )

			// Allows scrolling to tab on page load
			window.addEventListener( 'beforeunload', () => {
				const hash = window.location.hash.slice( 1 )
				if ( hash in this.customTabAnchors ) {
					this.customTabAnchors[ hash ].tab.scrollIntoView()
				}
			} )
		}
	}
}

class StackableTabs {
	init = () => {
		document.querySelectorAll( '.stk-block-tabs' )
			.forEach( el => {
				if ( ! el._StackableHasInitTabs ) {
					new _StackableTabs( el )
					el._StackableHasInitTabs = true
				}
			} )
	}
}

window.stackableTabs = new StackableTabs()
domReady( window.stackableTabs.init )
