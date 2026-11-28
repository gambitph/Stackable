/**
 * The injected-block loader.
 *
 * Step 5 of the frontend CSS loading (see src/frontend-css.md).
 *
 * The page only has the CSS rules that its own blocks use. When a script adds
 * Stackable blocks to the page after it loaded (e.g. HTML copied from another
 * page, or content loaded without its CSS), this loads the full stylesheets of
 * those blocks, once each.
 *
 * To stay light:
 * - One MutationObserver for the whole page.
 * - Added elements are queued, and checked in one batch when the browser is idle.
 * - Only the added elements are searched, never the whole page.
 *
 * Printed inline by Stackable_Frontend_CSS_Injected_Loader::print_loader(),
 * which replaces __STK_CONFIG__ with the settings below.
 */

/* global __STK_CONFIG__ */
const config = __STK_CONFIG__
// config.distUrl: the URL of the plugin's dist/ folder.
// config.version: the plugin version, for the ?ver= of the stylesheets.
// config.sharedFiles: the stylesheets every block needs, e.g. frontend_core.css.
// config.colorSchemesFile: the color schemes stylesheet, or '' if not needed.
// config.schemeMarker: the color scheme marker class, see class-color-schemes.php.
// config.schemeSelectors: the elements that get the marker class.
// config.premiumBlocks: the blocks with a Premium stylesheet.
// config.blocksWithoutCss: the blocks without a free stylesheet.

// The files we already added a <link> for.
const loadedFiles = new Set()

// The added elements waiting to be checked.
let addedElements = []
let isCheckScheduled = false

// Our printed CSS. Block stylesheets go before it, like in the old single
// stylesheet, and Premium ones after it.
const ourStyle = document.querySelector( 'style[id^=stk-frontend-css]' )

const getClasses = element => element.getAttribute( 'class' ) || ''

const loadFile = ( file, isPremium = false ) => {
	if ( loadedFiles.has( file ) ) {
		return
	}
	loadedFiles.add( file )

	const link = document.createElement( 'link' )
	link.rel = 'stylesheet'
	link.href = config.distUrl + file + '?ver=' + config.version

	if ( ! ourStyle ) {
		document.head.appendChild( link )
		return
	}
	const insertBefore = isPremium ? ourStyle.nextSibling : ourStyle
	ourStyle.parentNode.insertBefore( link, insertBefore )
}

// A copy of a block already on the page (e.g. carousel slides cloned by its
// script) is already styled: two elements have its unique stk-1234abc class.
const isCopyOfBlockOnPage = element => {
	const uniqueClass = getClasses( element ).match( /\bstk-[\da-f]{7}\b/ )
	if ( ! uniqueClass ) {
		return false
	}
	return document.getElementsByClassName( uniqueClass[ 0 ] ).length > 1
}

const loadBlockFiles = element => {
	// e.g. "wp-block-stackable-heading" => "heading"
	const blockClass = getClasses( element ).match( /wp-block-stackable-([\w-]+)/ )
	if ( ! blockClass || isCopyOfBlockOnPage( element ) ) {
		return
	}
	const blockName = blockClass[ 1 ]

	config.sharedFiles.forEach( file => loadFile( file ) )
	if ( ! config.blocksWithoutCss.includes( blockName ) ) {
		loadFile( 'blocks/' + blockName + '.css' )
	}
	if ( config.premiumBlocks.includes( blockName ) ) {
		loadFile( 'blocks/' + blockName + '__premium_only.css', true )
	}
}

const hasStackableContent = element => {
	return getClasses( element ).includes( 'stk-' ) || element.querySelector( '[class*=stk-]' ) !== null
}

// The color scheme rules start with :where(.stk-has-scheme). PHP adds that
// marker class to the blocks it renders, so we add it to the added markup the
// same way (see Stackable_Frontend_CSS_Color_Schemes::add_markers()).
// Returns whether any element got the marker.
const addColorSchemeMarkers = element => {
	const elements = [ ...element.querySelectorAll( config.schemeSelectors ) ]
	if ( element.matches( config.schemeSelectors ) ) {
		elements.push( element )
	}
	elements.forEach( el => el.classList.add( config.schemeMarker ) )
	return elements.length > 0
}

const checkElement = element => {
	// Removed again, or rendered by the server with its own CSS.
	if ( ! element.isConnected || element.closest( '.stk-injected-content' ) ) {
		return
	}
	if ( ! hasStackableContent( element ) ) {
		return
	}

	loadBlockFiles( element )
	element.querySelectorAll( '[class*=wp-block-stackable-]' ).forEach( loadBlockFiles )

	if ( addColorSchemeMarkers( element ) && config.colorSchemesFile ) {
		loadFile( config.colorSchemesFile )
	}
}

const checkAddedElements = () => {
	isCheckScheduled = false
	const elements = addedElements
	addedElements = []
	elements.forEach( checkElement )
}

const whenIdle = window.requestIdleCallback || setTimeout

new MutationObserver( mutations => {
	mutations.forEach( mutation => {
		mutation.addedNodes.forEach( node => {
			// Only elements, not text or comments.
			if ( node.nodeType === 1 ) {
				addedElements.push( node )
			}
		} )
	} )
	if ( addedElements.length && ! isCheckScheduled ) {
		isCheckScheduled = true
		whenIdle( checkAddedElements, { timeout: 100 } )
	}
} ).observe( document.body, { childList: true, subtree: true } )
