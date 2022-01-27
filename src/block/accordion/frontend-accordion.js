/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

const ANIM_OPTS = {
	duration: 400,
	easing: 'cubic-bezier(0.2, 0.6, 0.4, 1)',
}

class StackableAccordion {
	init = () => {
		// If reduce motion is on, don't use smooth resizing.
		const reduceMotion = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches
		if ( ! ( 'ResizeObserver' in window ) || reduceMotion ) {
			return
		}

		// This observer is called whenever the size element is changed.
		const RO = new ResizeObserver( entries => { // eslint-disable-line compat/compat
			return entries.forEach( entry => {
				const height = entry.borderBoxSize[ 0 ].blockSize
				const el = entry.target

				// Take note of the current height of the element, this is
				// referenced in different points of the accordion.
				el.dataset.height = height

				// If the accordion is opened/closed this will trigger an
				// animation.
				if ( el.doAnimate ) {
					el.doAnimate = false
					const preHeight = el.dataset.preHeight

					// Animate the accordion height.
					el.anim = el.animate( {
						height: [ `${ preHeight }px`, `${ height }px` ],
					}, ANIM_OPTS )

					// We need to animate the content as well since it will
					// overflow out the accordion.
					if ( height - preHeight >= 0 ) {
						el.contentEl.anim = el.contentEl.animate( {
							maxHeight: [ `0px`, `${ height - preHeight }px` ],
						}, ANIM_OPTS )
					}
				}
			} )
		} )

		// This observer is called whenever the accordion's `open` attribute is
		// changed.
		const MO = new MutationObserver( function( mutations ) {
			mutations.forEach( function( mutation ) {
				const el = mutation.target

				// Cancel any animations if there are any.
				if ( el.anim ) {
					el.anim.cancel()
				}
				if ( el.contentEl.anim ) {
					el.contentEl.anim.cancel()
				}

				el.classList[
					! Array.from( el.classList ).includes( 'stk--is-open' ) ? 'add' : 'remove'
				]( 'stk--is-open' )

				// When the accordion is triggered to open/close, we animate
				// from this current height.
				el.dataset.preHeight = el.dataset.height

				// Trigger the animation when the accordion is opened/closed.
				el.doAnimate = true

				// Close other adjacent accordions if needed.
				if ( el.open && el.classList.contains( 'stk--single-open' ) ) {
					let adjacent = el.nextElementSibling
					while ( adjacent && adjacent.classList.contains( 'stk-block-accordion' ) ) {
						if ( adjacent.open ) {
							adjacent.open = false
						}
						adjacent = adjacent.nextElementSibling
					}
					adjacent = el.previousElementSibling
					while ( adjacent && adjacent.classList.contains( 'stk-block-accordion' ) ) {
						if ( adjacent.open ) {
							adjacent.open = false
						}
						adjacent = adjacent.previousElementSibling
					}
				}
			} )
		  } )

		const els = document.querySelectorAll( '.stk-block-accordion' )
		els.forEach( el => {
			el.contentEl = el.querySelector( '.stk-block-accordion__content' )
			RO.observe( el )
			MO.observe( el, {
				attributeFilter: [ 'open' ],
				attributeOldValue: true,
			} )
		} )
	}
}

window.stackableAccordion = new StackableAccordion()
domReady( window.stackableAccordion.init )

// Polyfill for browser's without support for details and summary elements.
// See https://gist.github.com/remy/370590.

domReady( () =>
	/* eslint-disable */
	(function(window, document) {
		if ('open' in document.createElement('details')) {
			return;
		}

		// made global by myself to be reused elsewhere
		var addEvent = (function() {
			if (document.addEventListener) {
				return function(el, type, fn) {
					if ((el && el.nodeName) || el === window) {
						el.addEventListener(type, fn, false);
					} else if (el && el.length) {
						for (let i = 0; i < el.length; i++) {
							addEvent(el[i], type, fn);
						}
					}
				};
			}
			return function(el, type, fn) {
				if ((el && el.nodeName) || el === window) {
					el.attachEvent('on' + type, function() {
						return fn.call(el, window.event);
					});
				} else if (el && el.length) {
					for (let i = 0; i < el.length; i++) {
						addEvent(el[i], type, fn);
					}
				}
			};
		})();

		/**
		 * details support - typically in it's own script
		 *
		 * @param source
		 */
		// find the first /real/ node
		function firstNode(source) {
			const node = null;
			if (source.firstChild.nodeName != '#text') {
				return source.firstChild;
			}
			source = source.firstChild;
			do {
				source = source.nextSibling;
			} while (source && source.nodeName == '#text');

			return source || null;
		}

		function isSummary(el) {
			const nn = el.nodeName.toUpperCase();
			if (nn == 'DETAILS') {
				return false;
			} else if (nn == 'SUMMARY') {
				return true;
			}
			return isSummary(el.parentNode);
		}

		function toggleDetails(event) {
			// more sigh - need to check the clicked object
			let keypress = event.type == 'keypress',
				target = event.target || event.srcElement;
			if (keypress || isSummary(target)) {
				if (keypress) {
					// if it's a keypress, make sure it was enter or space
					keypress = event.which || event.keyCode;
					if (keypress == 32 || keypress == 13) {
						// all's good, go ahead and toggle
					} else {
						return;
					}
				}

				const open = this.getAttribute('open');
				if (open === null) {
					this.setAttribute('open', 'open');
				} else {
					this.removeAttribute('open');
				}

				// this.className = open ? 'open' : ''; // Lame
				// trigger reflow (required in IE - sometimes in Safari too)
				setTimeout(function() {
					document.body.className = document.body.className;
				}, 13);

				if (keypress) {
					event.preventDefault && event.preventDefault();
					return false;
				}
			}
		}

		function addStyle() {
			const style = document.createElement('style'),
				head = document.getElementsByTagName('head')[0],
				key =
					style.innerText === undefined ? 'textContent' : 'innerText';

			const rules = [
				'details{display: block;}',
				'details > *{display: none;}',
				'details.open > *{display: block;}',
				'details[open] > *{display: block;}',
				'details > summary:first-child{display: block;cursor: pointer;}',
				'details[open]{display: block;}',
			];
			i = rules.length;

			style[key] = rules.join('\n');
			head.insertBefore(style, head.firstChild);
		}

		var details = document.getElementsByTagName('details'),
			wrapper,
			i = details.length,
			j,
			first = null,
			label = document.createElement('summary');

		label.appendChild(document.createTextNode('Details'));

		while (i--) {
			first = firstNode(details[i]);

			if (first != null && first.nodeName.toUpperCase() == 'SUMMARY') {
				// we've found that there's a details label already
			} else {
				// first = label.cloneNode(true); // cloned nodes weren't picking up styles in IE - random
				first = document.createElement('summary');
				first.appendChild(document.createTextNode('Details'));
				if (details[i].firstChild) {
					details[i].insertBefore(first, details[i].firstChild);
				} else {
					details[i].appendChild(first);
				}
			}

			// this feels *really* nasty, but we can't target details :text in css :(
			j = details[i].childNodes.length;
			while (j--) {
				if (
					details[i].childNodes[j].nodeName === '#text' &&
					(details[i].childNodes[j].nodeValue || '').replace(
						/\s/g,
						''
					).length
				) {
					wrapper = document.createElement('text');
					wrapper.appendChild(details[i].childNodes[j]);
					details[i].insertBefore(wrapper, details[i].childNodes[j]);
				}
			}

			first.legend = true;
			first.tabIndex = 0;
		}

		// trigger details in case this being used on it's own
		document.createElement('details');
		addEvent(details, 'click', toggleDetails);
		addEvent(details, 'keypress', toggleDetails);
		addStyle();
	})(window, document)
	/* eslint-disable */
);
