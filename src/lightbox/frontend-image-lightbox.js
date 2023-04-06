import domReady from '@wordpress/dom-ready'
import GLightbox from 'glightbox'

const getImageFromSrcset = el => {
	const src = el.getAttribute( 'srcset' ).split( ',' ).map( v => v.trim().split( ' ' ) ).reduce( ( largestImgData, imgData ) => {
		const size = parseInt( imgData[ 1 ], 10 )
		if ( largestImgData.size < size ) {
			return { url: imgData[ 0 ], size }
		}
		return largestImgData
	}, { url: '', size: 0 } )
	return src.url
}

class StackableImageLightbox {
	init = () => {
		this.elements = []

		document.querySelectorAll( '.stk--has-lightbox' ).forEach( el => {
			const imageBlock = el.querySelector( 'img[srcset]' )

			// Look for the anchor link where we can get the link to open in the
			// lightbox.
			let link = el.querySelector( '.stk-link:not(.stk-button)' )
			if ( el.classList.contains( 'stk-block-button' ) ) {
				link = el.querySelector( '.stk-link' )
			}
			if ( imageBlock && ! link ) {
				link = imageBlock.closest( '.stk-link' ) || imageBlock.closest( 'a' )
			}

			const href = link && link.getAttribute( 'href' )

			// The link to open either comes from the href, or from the srcset
			// of an image block.
			const linkToOpen = link && href ? href
				: imageBlock ? getImageFromSrcset( imageBlock )
					: null

			if ( ! linkToOpen ) {
				return
			}

			if ( ! link ) {
				link = el
			}

			const isUsingImageBlock = ( ! link || ! href ) && imageBlock

			const lightbox = GLightbox( {
				elements: [ link ],
				href: linkToOpen,
				// If we're using an image block as the source, the link to open
				// isn't sometimes detected as an image.
				type: isUsingImageBlock ? 'image' : undefined,
			} )

			link.style.cursor = 'pointer'
			link.setAttribute( 'aria-role', 'button' )

			link.addEventListener( 'click', ev => {
				lightbox.open()
				ev.preventDefault()
				ev.stopImmediatePropagation()
			} )
		} )
	}
}

window.stackableImageLightbox = new StackableImageLightbox()
domReady( window.stackableImageLightbox.init )

