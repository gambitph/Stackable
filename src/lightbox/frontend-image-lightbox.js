import domReady from '@wordpress/dom-ready'
import GLightbox from 'glightbox'

// Gets the highest resolution image from the srcset.
const getImageFromSrcset = el => {
	if ( ! el || ! el.getAttribute( 'srcset' ) ) {
		return null
	}

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

// Get the outermost container block element.
const getRootColumnsBlock = el => {
	let currentEl = el
	let parentColumnsBlock = null
	while ( currentEl ) {
		// We need to add .entry-content here so that we treat the root block as
		// the outermost block.
		currentEl = currentEl.parentElement && currentEl.parentElement.closest( '.entry-content .stk-block, .entry-content .wp-block-columns, .entry-content .wp-block-group' )
		if ( currentEl ) {
			parentColumnsBlock = currentEl
		}
	}
	return parentColumnsBlock
}

const isButtonBlock = el => {
	return el && ( el.classList.contains( 'stk-block-button' ) || el.classList.contains( 'stk-block-icon-button' ) || el.classList.contains( 'stk-block-icon' ) )
}

const isImageBlock = el => {
	return el && el.classList.contains( 'stk-block-image' )
}

class StackableImageLightbox {
	init = () => {
		this.elements = []
		this.gatherImages()
		this.createLightboxes()
	}

	gatherImages = () => {
		document.querySelectorAll( '.stk--has-lightbox' ).forEach( el => {
			const imageBlock = el.querySelector( 'img[srcset], img[src]' )

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
				: imageBlock ? ( getImageFromSrcset( imageBlock ) || imageBlock.getAttribute( 'src' ) )
					: null

			if ( ! linkToOpen ) {
				return
			}

			if ( ! link ) {
				link = el
			}

			let title = link && href ? link.getAttribute( 'title' ) : null
			if ( ! title && imageBlock ) {
				title = imageBlock.getAttribute( 'alt' ) || null
			}

			const isUsingImageBlock = ( ! link || ! href ) && imageBlock

			this.elements.push( {
				block: link.classList.contains( 'stk-block' ) ? link : link.closest( '.stk-block' ),
				element: link,
				href: linkToOpen,
				// If we're using an image block as the source, the link to open
				// isn't sometimes detected as an image.
				type: isUsingImageBlock ? 'image' : undefined,
				title,
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

			// Image blocks placed in the same Columns block are grouped
			// together. Even if there's another block between the image blocks
			// inside the same column, that should still be okay.
			if ( isImageBlock( block ) && isImageBlock( nextElementBlock ) ) {
				const blockRootColumns = getRootColumnsBlock( block )
				const nextBlockRootColumns = getRootColumnsBlock( nextElementBlock )
				if ( blockRootColumns && blockRootColumns === nextBlockRootColumns ) {
					isNextBlockAdjacent = true
				}
			}
			if ( isImageBlock( block ) && isImageBlock( prevElementBlock ) ) {
				const blockRootColumns = getRootColumnsBlock( block )
				const prevBlockRootColumns = getRootColumnsBlock( prevElementBlock )
				if ( blockRootColumns && blockRootColumns === prevBlockRootColumns ) {
					isPrevBlockAdjacent = true
				}
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
					element, href, type, title,
				} ) => {
					return {
						elements: [ element ],
						href,
						// We'll need to detect the type because auto-detect
						// doesn't work here for some unknown reason.
						type: type || ( detectIfVideo( href ) ? 'video' : 'image' ),
						title,
					}
				} )

				const lightbox = GLightbox( {
					skin: 'clean glightbox-stk', // Add a class to style lightbox description.
					elements,
				} )

				elementGroup.forEach( ( { element }, i ) => {
					this.addClickHandler( element, lightbox, i )
				} )
			} else {
				const {
					element, href, type, title,
				} = elementGroup

				const lightbox = GLightbox( {
					skin: 'clean glightbox-stk', // Add a class to style lightbox description.
					elements: [ element ],
					href,
					type,
					title,
				} )

				this.addClickHandler( element, lightbox, 0 )
			}
		} )
	}

	addClickHandler = ( element, lightbox, i ) => {
		element.style.cursor = 'pointer'
		element.setAttribute( 'aria-role', 'button' )

		element.addEventListener( 'click', ev => {
			// this prevents the lightbox to open during drag in the horizontal scroller block
			if ( element.hasAttribute( 'isDragging' ) ) {
				return
			}
			lightbox.openAt( i )
			ev.preventDefault()
			ev.stopImmediatePropagation()
		} )
	}
}

window.stackableImageLightbox = new StackableImageLightbox()
domReady( window.stackableImageLightbox.init )

