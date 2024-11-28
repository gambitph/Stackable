/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

class ImageOptimizerPolyfill {
	/**
	 * This script is loaded when EWWW Image Optimizer plugin is activated
	 * If Easy IO setting is activated for EWWW Image Optimizer plugin, dynamic images becomes blurry.
	 * This script fixes the issue by removing the &fit parameter from the srcset and src attributes
	 */
	init = () => {
		const imgs = document.querySelectorAll( '.stk-block img' )
		imgs.forEach( img => {
			if ( img.hasAttribute( 'srcset' ) ) {
				let srcset = img.getAttribute( 'srcset' )
				const pattern = /https?:\/\/[^\s,]+/g
				const urls = srcset.match( pattern )

				urls.forEach( url => {
					const index = url.indexOf( '&fit' )
					if ( index !== -1 ) {
						const newUrl = url.slice( 0, index )
						srcset = srcset.replace( url, newUrl )
					}
				} )

				img.setAttribute( 'srcset', srcset )
			}

			if ( img.getAttribute( 'src' ).indexOf( '&fit' ) !== -1 ) {
				const src = img.getAttribute( 'src' )
				const index = src.indexOf( '&fit' )
				const newSrc = src.slice( 0, index )
				img.setAttribute( 'src', newSrc )
			}
		} )
	}
}

window.ImageOptimizerPolyfill = new ImageOptimizerPolyfill()
domReady( window.ImageOptimizerPolyfill.init )
