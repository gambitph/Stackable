/**
 * Loads the stylesheets of Stackable blocks added to the page by scripts
 * after it loaded (the page only has the CSS rules its own blocks use).
 * Printed inline by Stackable_Frontend_CSS::print_injected_loader() as
 * src/frontend-css-injected-loader.min.js (keep both in sync).
 *
 * c.u: dist URL, c.v: version, c.s: shared stylesheets, c.c: color scheme
 * stylesheet, c.p: blocks with a Premium stylesheet, c.n: blocks without a
 * free stylesheet.
 */
( function( d, c ) {
	const loaded = new Set() // Files we added a <link> for.
	let queue = []
	let timer = 0
	// Our CSS: block stylesheets go before it (same order as the old single stylesheet).
	const ours = d.querySelector( 'style[id^=stk-frontend-css]' )
	const cls = el => el.getAttribute( 'class' ) || ''
	const add = ( file, premium ) => {
		if ( ! loaded.has( file ) ) {
			loaded.add( file )
			const link = d.createElement( 'link' )
			link.rel = 'stylesheet'
			link.href = c.u + file + '?ver=' + c.v
			;( ours ? ours.parentNode : d.head ).insertBefore( link, ours && ( premium ? ours.nextSibling : ours ) )
		}
	}
	const run = () => {
		timer = 0
		for ( const node of queue.splice( 0 ) ) {
			// Skip removed nodes and content rendered by the server with its CSS.
			if ( node.isConnected && ! node.closest( '.stk-injected-content' ) && ( cls( node ).includes( 'stk-' ) || node.querySelector( '[class*=stk-]' ) ) ) {
				for ( const el of [ node, ...node.querySelectorAll( '[class*=wp-block-stackable-]' ) ] ) {
					const m = cls( el ).match( /wp-block-stackable-([\w-]+)/ )
					// A copy of a block on the page (e.g. carousel slides cloned by its script) has its CSS.
					const id = cls( el ).match( /\bstk-[\da-f]{7}\b/ )
					if ( m && ! ( id && d.getElementsByClassName( id[ 0 ] ).length > 1 ) ) {
						c.s.forEach( f => add( f ) )
						c.n.includes( m[ 1 ] ) || add( 'blocks/' + m[ 1 ] + '.css' )
						c.p.includes( m[ 1 ] ) && add( 'blocks/' + m[ 1 ] + '__premium_only.css', 1 )
					}
				}
				if ( c.c && ( cls( node ).includes( '-scheme' ) || node.querySelector( '[class*=-scheme]' ) ) ) {
					add( c.c )
				}
			}
		}
	}
	new MutationObserver( records => {
		for ( const record of records ) {
			for ( const node of record.addedNodes ) {
				node.nodeType === 1 && queue.push( node )
			}
		}
		if ( queue.length && ! timer ) {
			timer = ( window.requestIdleCallback || setTimeout )( run, { timeout: 100 } )
		}
	} ).observe( d.body, { childList: true, subtree: true } )
}( document, __STK_CONFIG__ ) )
