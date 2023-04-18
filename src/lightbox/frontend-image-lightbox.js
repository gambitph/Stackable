import domReady from '@wordpress/dom-ready'
import GLightbox from 'glightbox'

// Gets the highest resolution image from the srcset.
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

// Detects the type of the URL if it's a video URL.
const detectIfVideo = url => {
	if ( url.match( /(youtube\.com|youtu\.be)/ ) ) {
		return true
	} else if ( url.match( /vimeo\.com/ ) ) {
		return true
	} else if ( url.match( /\.(mp4|webm|mov)$/i ) ) {
		return true
	}
	return false
}

const isButtonBlock = el => {
	return el.classList.contains( 'stk-block-button' ) || el.classList.contains( 'stk-block-icon-button' ) || el.classList.contains( 'stk-block-icon' )
}

class StackableImageLightbox {
	init = () => {
		this.elements = []
		this.gatherImages()
		this.createLightboxes()
	}

	gatherImages = () => {
		document.querySelectorAll( '.stk--has-lightbox' ).forEach( el => {
			const imageBlock = el.querySelector( 'img[srcset]' )

			// Look for the anchor link where we can get the link to open in the
			// lightbox.
			let link = el.querySelector( '.stk-link:not(.stk-button)' )
			if ( isButtonBlock( el ) ) {
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

			this.elements.push( {
				block: link.classList.contains( 'stk-block' ) ? link : link.closest( '.stk-block' ),
				element: link,
				href: linkToOpen,
				// If we're using an image block as the source, the link to open
				// isn't sometimes detected as an image.
				type: isUsingImageBlock ? 'image' : undefined,
			} )
		} )
	}

	createLightboxes = () => {
		// Group together elements that belong to blocks which are adjacent to one another.
		const elementsGrouped = this.elements.reduce( ( elements, element, index ) => {
			const nextElementBlock = index + 1 < this.elements.length ? this.elements[ index + 1 ].block : undefined
			const prevElementBlock = index > 0 ? this.elements[ index - 1 ].block : undefined
			const { block } = element
			let isNextBlockAdjacent = block.nextElementSibling === nextElementBlock
			let isPrevBlockAdjacent = block.previousElementSibling === prevElementBlock

			// Button blocks are always not grouped together.
			if ( isNextBlockAdjacent && isButtonBlock( nextElementBlock ) ) {
				isNextBlockAdjacent = false
			}
			if ( isPrevBlockAdjacent && isButtonBlock( prevElementBlock ) ) {
				isPrevBlockAdjacent = false
			}
			if ( isButtonBlock( block ) ) {
				isNextBlockAdjacent = false
				isPrevBlockAdjacent = false
			}

			if ( ! isPrevBlockAdjacent && isNextBlockAdjacent ) {
				elements.push( [ element ] )
			} else if ( isPrevBlockAdjacent ) {
				elements[ elements.length - 1 ].push( element )
			} else {
				elements.push( element )
			}

			return elements
		}, [] )

		elementsGrouped.forEach( elementGroup => {
			// If the blocks are beside each other, display as a gallery.
			if ( Array.isArray( elementGroup ) ) {
				const elements = elementGroup.map( ( {
					element, href, type,
				} ) => {
					return {
						elements: [ element ],
						href,
						// We'll need to detect the type because auto-detect
						// doesn't work here for some unknown reason.
						type: type || ( detectIfVideo( href ) ? 'video' : 'image' ),
					}
				} )

				const lightbox = GLightbox( { elements } )

				elementGroup.forEach( ( { element }, i ) => {
					this.addClickHandler( element, lightbox, i )
				} )
			} else {
				const {
					element, href, type,
				} = elementGroup

				const lightbox = GLightbox( {
					elements: [ element ],
					href,
					type,
				} )

				this.addClickHandler( element, lightbox, 0 )
			}
		} )
	}

	addClickHandler = ( element, lightbox, i ) => {
		element.style.cursor = 'pointer'
		element.setAttribute( 'aria-role', 'button' )

		element.addEventListener( 'click', ev => {
			lightbox.openAt( i )
			ev.preventDefault()
			ev.stopImmediatePropagation()
		} )
	}
}

window.stackableImageLightbox = new StackableImageLightbox()
domReady( window.stackableImageLightbox.init )

