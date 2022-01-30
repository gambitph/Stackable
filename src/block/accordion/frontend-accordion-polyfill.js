/**
 * @see https://gist.github.com/remy/370590
 */
( function( window, document ) {
	if ( 'open' in document.createElement( 'details' ) ) {
		return
	}

	// made global by myself to be reused elsewhere
	const addEvent = ( function() {
		if ( document.addEventListener ) {
			return function( el, type, fn ) {
				if ( ( el && el.nodeName ) || el === window ) {
					el.addEventListener( type, fn, false )
				} else if ( el && el.length ) {
					for ( let i = 0; i < el.length; i++ ) {
						addEvent( el[ i ], type, fn )
					}
				}
			}
		}
		return function( el, type, fn ) {
			if ( ( el && el.nodeName ) || el === window ) {
				el.attachEvent( 'on' + type, function() {
					return fn.call( el, window.event )
				} )
			} else if ( el && el.length ) {
				for ( let i = 0; i < el.length; i++ ) {
					addEvent( el[ i ], type, fn )
				}
			}
		}
	}() )

	function firstNode( source ) {
		if ( source.firstChild.nodeName !== '#text' ) {
			return source.firstChild
		}
		source = source.firstChild
		do {
			source = source.nextSibling
		} while ( source && source.nodeName === '#text' )

		return source || null
	}

	function isSummary( el ) {
		const nn = el.nodeName.toUpperCase()
		if ( nn === 'DETAILS' ) {
			return false
		} else if ( nn === 'SUMMARY' ) {
			return true
		}
		return isSummary( el.parentNode )
	}

	function toggleDetails( event ) {
		// more sigh - need to check the clicked object
		let keypress = event.type === 'keypress'
		const target = event.target || event.srcElement
		if ( keypress || isSummary( target ) ) {
			if ( keypress ) {
				// if it's a keypress, make sure it was enter or space
				keypress = event.which || event.keyCode
				if ( keypress === 32 || keypress === 13 ) {
					// all's good, go ahead and toggle
				} else {
					return
				}
			}

			const open = this.getAttribute( 'open' )
			if ( open === null ) {
				this.setAttribute( 'open', 'open' )
			} else {
				this.removeAttribute( 'open' )
			}

			// this.className = open ? 'open' : ''; // Lame
			// trigger reflow (required in IE - sometimes in Safari too)
			setTimeout( function() {
				document.body.className = document.body.className
			}, 13 )

			if ( keypress ) {
				event.preventDefault && event.preventDefault()
				return false
			}
		}
	}

	function addStyle() {
		const
			head = document.getElementsByTagName( 'head' )[ 0 ],
			key =
				style.innerText === undefined ? 'textContent' : 'innerText',
			style = document.createElement( 'style' )

		const rules = [
			'details{display: block;}',
			'details > *{display: none;}',
			'details.open > *{display: block;}',
			'details[open] > *{display: block;}',
			'details > summary:first-child{display: block;cursor: pointer;}',
			'details[open]{display: block;}',
		]
		i = rules.length

		style[ key ] = rules.join( '\n' )
		head.insertBefore( style, head.firstChild )
	}

	const details = document.querySelectAll( '.stk-block-accordion' )
	const label = document.createElement( '.stk-block-accordion .stk-block-accordion__heading' )
	let first = null,
		i = details.length,
		j, wrapper

	label.appendChild( document.createTextNode( 'Details' ) )

	while ( i-- ) {
		first = firstNode( details[ i ] )

		if ( first !== null && first.nodeName.toUpperCase() === 'SUMMARY' ) {
			// we've found that there's a details label already
		} else {
			// first = label.cloneNode(true); // cloned nodes weren't picking up styles in IE - random
			first = document.createElement( 'summary' )
			first.appendChild( document.createTextNode( 'Details' ) )
			if ( details[ i ].firstChild ) {
				details[ i ].insertBefore( first, details[ i ].firstChild )
			} else {
				details[ i ].appendChild( first )
			}
		}

		// this feels *really* nasty, but we can't target details :text in css :(
		j = details[ i ].childNodes.length
		while ( j-- ) {
			if (
				details[ i ].childNodes[ j ].nodeName === '#text' &&
				( details[ i ].childNodes[ j ].nodeValue || '' ).replace(
					/\s/g,
					''
				).length
			) {
				wrapper = document.createElement( 'text' )
				wrapper.appendChild( details[ i ].childNodes[ j ] )
				details[ i ].insertBefore( wrapper, details[ i ].childNodes[ j ] )
			}
		}

		first.legend = true
		first.tabIndex = 0
	}

	// trigger details in case this being used on it's own
	document.createElement( 'details' )
	addEvent( details, 'click', toggleDetails )
	addEvent( details, 'keypress', toggleDetails )
	addStyle()
}( window, document ) )
