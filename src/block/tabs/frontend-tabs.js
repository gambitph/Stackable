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
	}

	getDefaultState = () => {
		this.activeTab = parseInt( this.parentEl.getAttribute( 'data-initial-tab' ) || '1', 10 )

		this.tabList = this.parentEl.querySelector( '[role="tablist"]' )
		this.tabs = this.parentEl.querySelector( '.stk-block-tab-labels__wrapper' ).children
		this.contents = this.parentEl.querySelector( '.stk-block-tab-content > .stk-inner-blocks' ).children
	}

	initTabs = () => {
		// Set Aria attributes
		Array.from( this.tabs ).forEach( ( tab, index ) => {
			tab.setAttribute( 'id', `stk-block-tab-label-${ this.uniqueId }-${ index + 1 }` )
			tab.setAttribute( 'aria-controls', `stk-block-tab-content-${ this.uniqueId }-${ index + 1 }` )
			tab.setAttribute( 'aria-selected', this.activeTab === ( index + 1 ) ? 'true' : 'false' )
			tab.setAttribute( 'tabindex', this.activeTab === ( index + 1 ) ? '0' : '-1' )

			if ( this.activeTab === ( index + 1 ) ) {
				tab.classList.add( 'stk-block-tabs__tab--active' )
			}

			// Add the click event.
			tab.addEventListener( 'click', () => {
				this.changeTab( index + 1 )
			} )
		} )

		// Set Aria attributes
		Array.from( this.contents ).forEach( ( content, index ) => {
			content.setAttribute( 'id', `stk-block-tab-content-${ this.uniqueId }-${ index + 1 }` )
			content.setAttribute( 'aria-labelledby', `stk-block-tab-label-${ this.uniqueId }-${ index + 1 }` )
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
}

class StackableTabs {
	init = () => {
		document.querySelectorAll( '.stk-block-tabs' )
			.forEach( el => {
				new _StackableTabs( el )
			} )
	}
}

window.stackableTabs = new StackableTabs()
domReady( window.stackableTabs.init )
