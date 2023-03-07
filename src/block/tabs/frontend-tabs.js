/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

class _StackableTabs {
	constructor( el ) {
		this.parentEl = el
		this.tabsLabels = el.querySelectorAll( '.stk-block-tabs__tab' )
		this.tabsContent = el.querySelectorAll( '.stk-block-tab-content__wrapper > .stk-block-column.stk-block-column--v3' )
		this.getDefaultState()
		this.initTabs()
	}

	getDefaultState = () => {
		this.activeTab = '1'
	}

	hideTabs = () => {
		this.tabsContent.forEach( ( element, index ) => {
			if ( this.activeTab === ( index + 1 ).toString() ) {
				element.style.display = 'flex'
			} else {
				element.style.display = 'none'
			}
		} )
	}

	changeTab = tabIndex => {
		if ( this.activeTab === tabIndex ) {
			return
		}

		this.tabsContent.forEach( ( element, index ) => {
			if ( tabIndex === ( index + 1 ).toString() ) {
				element.style.display = 'flex'
			} else {
				element.style.display = 'none'
			}
		} )

		this.activeTab = tabIndex
	}

	initTabs = () => {
		this.hideTabs()
		this.tabsLabels.forEach( tabEl => {
			tabEl.addEventListener( 'click', el => {
				this.changeTab( el.target.getAttribute( 'data-tab' ) )
			} )
		} )
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

window.StackableTabs = new StackableTabs()
domReady( window.StackableTabs.init )
