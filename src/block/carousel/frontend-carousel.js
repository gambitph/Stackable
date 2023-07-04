/* eslint-disable no-mixed-operators */
/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

// More functions from https://spicyyoghurt.com/tools/easing-functions
const easeInOutQuad = ( t, b, c, d ) => {
	if ( ( t /= d / 2 ) < 1 ) {
		return c / 2 * t * t + b
	}
	return -c / 2 * ( ( --t ) * ( t - 2 ) - 1 ) + b
}

class _StackableCarousel {
	constructor( el ) {
		this.el = el
	}

	init = () => {
		this.currentSlide = 1
		this.currentZIndex = 1
		this.wrapper = this.el.querySelector( '.stk-block-carousel__slider-wrapper' )
		this.type = this.el.classList.contains( 'stk--is-fade' ) ? 'fade' : 'slide'
		this.slideDuration = 300 // TODO: make this a setting
		this.isInfiniteScroll = false // TODO: make this a setting
		this.sliderEl = this.el.querySelector( '.stk-block-carousel__slider' )
		this.slideEls = Array.from( this.sliderEl.children )

		const tempDotsEls = this.el.querySelectorAll( '.stk-block-carousel__dots' )
		const tempPrevEls = this.el.querySelectorAll( '.stk-block-carousel__button__prev' )
		const tempNextEls = this.el.querySelectorAll( '.stk-block-carousel__button__next' )

		this.dotsEl = tempDotsEls[ tempDotsEls.length - 1 ]
		this.prevEl = tempPrevEls[ tempPrevEls.length - 1 ]
		this.nextEl = tempNextEls[ tempNextEls.length - 1 ]

		// Add a live region to announce the slide number when using the previous/next buttons
		this.liveregion = document.createElement( 'div' )
		this.liveregion.setAttribute( 'aria-live', 'polite' )
		this.liveregion.setAttribute( 'aria-atomic', 'true' )
		this.liveregion.setAttribute( 'class', 'liveregion stk--hidden' )
		this.wrapper.appendChild( this.liveregion )

		this.slideEls[ this.currentSlide - 1 ].classList.add( 'stk-block-carousel__slide--active' )

		this.initProperties()
		this.addEventListeners()
		this.fixAccessibility( this.currentSlide )
		this.setDotActive( this.currentSlide )

		this.unpauseAutoplay()
	}

	initProperties = () => {
		this.slidesToShow = this.type === 'slide' ? parseInt( getComputedStyle( this.el ).getPropertyValue( '--slides-to-show' ), 10 ) : 1
		this.autoplay = this.sliderEl.dataset.autoplay
		this.updateDots()
	}

	updateDots = () => {
		if ( ! this.dotsEl ) {
			return
		}
		this.dotEls = []
		this.dotsEl.innerHTML = ''

		const dotLabel = this.dotsEl.dataset.label
		this.slideEls.forEach( ( slideEl, i ) => {
			if ( i >= this.slideEls.length - this.slidesToShow + 1 ) {
				return
			}

			const listEl = document.createElement( 'div' )
			const dotEl = document.createElement( 'button' )
			listEl.setAttribute( 'role', 'listitem' )
			dotEl.classList.add( 'stk-block-carousel__dot' )
			dotEl.setAttribute( 'aria-label', dotLabel.replace( /%+d/, ( i + 1 ) ) )
			if ( this.currentSlide === i + 1 ) {
				dotEl.classList.add( 'stk-block-carousel__dot--active' )
			}
			listEl.appendChild( dotEl )
			this.dotsEl.appendChild( listEl )

			dotEl.addEventListener( 'click', () => {
				this.pauseAutoplay()
				this.goToSlide( i + 1 )
				this.unpauseAutoplay()
			} )

			this.dotEls.push( dotEl )
		} )
	}

	addEventListeners = () => {
		if ( window ) {
			// eslint-disable-next-line @wordpress/no-global-event-listener
			window.addEventListener( 'resize', this.initProperties )
		}

		// Mousewheel left and right should scroll the fade carousel
		this.sliderEl.addEventListener( 'wheel', this.onWheel )

		// Dragging
		this.sliderEl.addEventListener( 'mousedown', this.dragMouseDown )
		this.sliderEl.addEventListener( 'touchstart', this.dragTouchStart )
		this.sliderEl.addEventListener( 'scroll', this.onScroll )

		// Autoplay
		if ( this.autoplay ) {
			this.el.addEventListener( 'mouseenter', this.pauseAutoplay )
			this.el.addEventListener( 'mouseleave', this.unpauseAutoplay )
		}

		// Buttons
		if ( this.prevEl ) {
			this.prevEl.addEventListener( 'click', this.prevSlide )
		}
		if ( this.nextEl ) {
			this.nextEl.addEventListener( 'click', this.nextSlide )
		}
	}

	maxSlides = () => {
		let maxSlides = this.slideEls.length
		if ( this.type === 'slide' ) {
			maxSlides -= ( this.slidesToShow - 1 )
		}
		return maxSlides
	}

	nextSlide = () => {
		let newSlide = this.currentSlide + 1
		if ( newSlide > this.maxSlides() ) {
			newSlide = 1
		}
		this.goToSlide( newSlide )
	}

	prevSlide = () => {
		let newSlide = this.currentSlide - 1
		if ( newSlide < 1 ) {
			newSlide = this.maxSlides()
		}
		this.goToSlide( newSlide )
	}

	goToSlide = ( slide, force = false ) => {
		if ( slide === this.currentSlide && ! force ) {
			return
		}

		let slid = false
		// Infinite scrolling. Method: e.g. when transitioning from the last
		// slide to the first slide, before scrolling, move the last slide to be
		// the first child. Abruptly change the scrollLeft to the start, then
		// move the scrollLeft to the first slide. After the animation, move the
		// last slide back to the last child. The good thing with this method is
		// we preseve the mousewheel scroll direction (you can still reach the end)
		if ( this._slideTimeoutNext ) {
			this._slideTimeoutNextFn()
		}
		if ( this._slideTimeoutPrev ) {
			this._slideTimeoutPrevFn()
		}
		if ( this.isInfiniteScroll && this.type === 'slide' ) {
			if ( slide === 1 && this.currentSlide === this.maxSlides() ) {
				this.sliderEl.classList.add( 'stk--snapping-deactivated' )
				this.sliderEl.scrollLeft = 0
				const currentSlideEl = this.slideEls[ this.currentSlide - 1 ]
				// Move currentSlideEl to the first child of this.sliderEl
				this.sliderEl.insertBefore( currentSlideEl, this.sliderEl.firstChild )
				this.sliderEl.classList.remove( 'stk--snapping-deactivated' )
				this._scrollLeft( this.slideEls[ slide - 1 ].offsetLeft )
				// After the animation, move currentSlideEl back to the last child of this.sliderEl
				this._slideTimeoutNextFn = () => {
					this.sliderEl.insertBefore( currentSlideEl, this.sliderEl.lastChild.nextSibling )
					this._slideTimeoutNext = null
				}
				this._slideTimeoutNext = setTimeout( this._slideTimeoutNextFn, this.slideDuration )
				slid = true
			}

			if ( slide === this.maxSlides() && this.currentSlide === 1 ) {
				this.sliderEl.classList.add( 'stk--snapping-deactivated' )
				const currentSlideEl = this.slideEls[ this.currentSlide - 1 ]
				// Move currentSlideEl to the last child of this.sliderEl
				this.sliderEl.appendChild( currentSlideEl )
				this.sliderEl.scrollLeft = this.slideEls[ this.currentSlide - 1 ].offsetLeft
				this.sliderEl.classList.remove( 'stk--snapping-deactivated' )
				this._scrollLeft( this.slideEls[ slide - 1 ].offsetLeft )
				// After the animation, move currentSlideEl back to the first child of this.sliderEl
				this._slideTimeoutPrevFn = () => {
					this.sliderEl.insertBefore( currentSlideEl, this.sliderEl.firstChild )
					this._slideTimeoutPrev = null
				}
				this._slideTimeoutPrev = setTimeout( this._slideTimeoutPrevFn, this.slideDuration )
				slid = true
			}
		}

		this.slideEls[ this.currentSlide - 1 ].classList.remove( 'stk-block-carousel__slide--active' )
		this.slideEls[ slide - 1 ].classList.add( 'stk-block-carousel__slide--active' )

		if ( ! slid && this.type === 'slide' ) {
			this._scrollLeft( this.slideEls[ slide - 1 ].offsetLeft )
		}

		if ( this.type === 'fade' ) {
			const slidePrevEl = this.slideEls[ this.currentSlide - 1 ]
			slidePrevEl.style.opacity = 0

			const slideEl = this.slideEls[ slide - 1 ]
			slideEl.style.zIndex = ++this.currentZIndex
			slideEl.style.transition = 'none'
			slideEl.style.opacity = 0
			slideEl.style.visibility = 'visible'
			slideEl.style.left = `-${ 100 * ( slide - 1 ) }%`
			setTimeout( () => {
				slideEl.style.transition = ''
				slideEl.style.opacity = 1
			}, 1 )
		}

		this.fixAccessibility( slide )
		this.setDotActive( slide )
		this.currentSlide = slide

		try {
			this.liveregion.textContent = this.sliderEl.dataset.labelSlideOf.replace( /%+d/, slide ).replace( /%+d/, this.maxSlides() )
		} catch ( err ) {
			// eslint-disable-next-line no-console
			console.error( 'Carousel Slide N of N accessibility label is of invalid format' )
		}

		clearTimeout( this.tempDisableOnScroll )
		this.tempDisableOnScroll = setTimeout( () => {
			this.tempDisableOnScroll = null
		}, 500 )
	}

	// Animates scrollLeft
	_scrollLeft = offset => {
		// this.sliderEl.scrollLeft = offset
		cancelAnimationFrame( this._animation )

		return new Promise( resolve => {
			this.sliderEl.classList.add( 'stk--snapping-deactivated' )
			const offsetStart = this.sliderEl.scrollLeft
			const offsetChange = offset - offsetStart

			// From https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
			let start
			this._animation = timeStamp => {
				if ( ! start ) {
					start = timeStamp
				}
				const elapsed = timeStamp - start
				const newValue = easeInOutQuad( elapsed, offsetStart, offsetChange, this.slideDuration )
				this.sliderEl.scrollLeft = newValue

				if ( elapsed < this.slideDuration ) {
					requestAnimationFrame( this._animation )
				} else {
					this.sliderEl.scrollLeft = offset
					this.sliderEl.classList.remove( 'stk--snapping-deactivated' )
					resolve( this.sliderEl.scrollLeft )
				}
			}
			requestAnimationFrame( this._animation )
		} )
	}

	fixAccessibility = slide => {
		if ( this.type === 'slide' ) {
			for ( let i = 1; i <= this.slideEls.length; i++ ) {
				if ( slide <= i && i <= slide + this.slidesToShow - 1 ) {
					this.setSlideToVisible( i )
				} else {
					this.setSlideToHide( i )
				}
			}
		} else {
			for ( let i = 1; i <= this.slideEls.length; i++ ) {
				if ( i === slide ) {
					this.setSlideToVisible( i )
				} else {
					this.setSlideToHide( i )
				}
			}
		}
	}

	setDotActive = slide => {
		this.dotEls?.forEach( ( dotEl, i ) => {
			if ( slide === i + 1 ) {
				dotEl.classList.add( 'stk-block-carousel__dot--active' )
			} else {
				dotEl.classList.remove( 'stk-block-carousel__dot--active' )
			}
		} )
	}

	setSlideToVisible = slide => {
		const slideEl = this.slideEls[ slide - 1 ]
		// Remove all tabindex="-1" on all input elements
		slideEl.querySelectorAll( 'button, a, input, [role="button"]' ).forEach( el => {
			el.removeAttribute( 'tabindex' )
		} )
		// Set aria-hidden="false"
		slideEl.setAttribute( 'aria-hidden', 'false' )
	}

	setSlideToHide = slide => {
		const slideEl = this.slideEls[ slide - 1 ]
		// Set all input elements to tabindex="-1"
		slideEl.querySelectorAll( 'button, a, input, [role="button"]' ).forEach( el => {
			el.setAttribute( 'tabindex', '-1' )
		} )
		// Set aria-hidden="true"
		slideEl.setAttribute( 'aria-hidden', 'true' )
	}

	pauseAutoplay = () => {
		// Use setTimeout here because leaving/entering can cause a race condition.
		setTimeout( () => {
			clearInterval( this.autoplayInterval )
		} )
	}

	unpauseAutoplay = () => {
		if ( this.autoplay ) {
			clearInterval( this.autoplayInterval )
			this.autoplayInterval = setInterval( this.nextSlide, this.autoplay )
		}
	}

	onWheel = e => {
		if ( this.type === 'fade' ) {
			if ( this.wheelTimeout ) {
				return
			}
			if ( e.deltaX >= 15 ) {
				this.nextSlide()
				this.wheelTimeout = setTimeout( () => {
					this.wheelTimeout = null
				}, 500 )
			} else if ( e.deltaX <= -15 ) {
				this.prevSlide()
				this.wheelTimeout = setTimeout( () => {
					this.wheelTimeout = null
				}, 500 )
			}
		}
	}

	dragMouseDown = e => {
		this.initialClientX = 0
		this.sliderEl.style.cursor = 'grabbing'

		clearTimeout( this.dragTimeout )
		this.sliderEl.classList.add( 'stk--snapping-deactivated' )

		// The current scroll
		this.initialScrollLeft = this.sliderEl.scrollLeft
		// Get the current mouse position
		this.initialClientX = e.clientX

		document.body.addEventListener( 'mousemove', this.dragMouseMove )
		document.body.addEventListener( 'mouseup', this.dragMouseUp )
		this.pauseAutoplay()
	}

	dragMouseMove = e => {
		// How far the mouse has been moved
		const dx = e.clientX - this.initialClientX

		if ( this.type === 'slide' ) {
			// Scroll the element
			this.sliderEl.scrollTo( {
				left: this.initialScrollLeft - dx,
			} )
		} else if ( this.type === 'fade' ) { // Fade
			if ( dx < -40 ) {
				this.nextSlide()
				this.dragMouseUp()
			} else if ( dx > 40 ) {
				this.prevSlide()
				this.dragMouseUp()
			}
		}

		// Prevent selection of contents because of dragging.
		e.preventDefault()

		this.pauseAutoplay()
	}

	dragMouseUp = () => {
		document.body.removeEventListener( 'mousemove', this.dragMouseMove )
		document.body.removeEventListener( 'mouseup', this.dragMouseUp )

		this.sliderEl.style.cursor = ''

		if ( this.type === 'slide' ) {
			// This smooth scrolls to the place where we're supposed to snap.
			const oldScrollLeft = this.sliderEl.scrollLeft
			this.sliderEl.classList.remove( 'stk--snapping-deactivated' )
			const newScrollLeft = this.sliderEl.scrollLeft
			this.sliderEl.classList.add( 'stk--snapping-deactivated' )

			this.sliderEl.scrollLeft = oldScrollLeft
			this.sliderEl.scrollTo( {
				left: newScrollLeft,
				behavior: 'smooth',
			} )

			const { slide } = this.slideEls.reduce( ( result, slideEl, i ) => {
				const slide = i + 1
				const offsetDiff = Math.abs( slideEl.offsetLeft - newScrollLeft )
				if ( offsetDiff <= result.offsetDiff ) {
					return { slide, offsetDiff }
				}
				return result
			}, { slide: 1, offsetDiff: 1000 } )

			this.currentSlide = slide
			this.setDotActive( slide )
		}

		clearTimeout( this.dragTimeout )
		this.dragTimeout = setTimeout( () => {
			this.sliderEl.classList.remove( 'stk--snapping-deactivated' )
		}, 500 )

		this.unpauseAutoplay()
	}

	dragTouchStart = e => {
		this.sliderEl.addEventListener( 'touchend', this.dragTouchEnd )
		this.sliderEl.addEventListener( 'touchmove', this.dragTouchMove )

		this.initialClientX = e.targetTouches[ 0 ].clientX

		this.pauseAutoplay()
	}

	dragTouchEnd = () => {
		this.sliderEl.removeEventListener( 'touchend', this.dragTouchEnd )
		this.sliderEl.removeEventListener( 'touchmove', this.dragTouchMove )
		this.pauseAutoplay()
	}

	dragTouchMove = e => {
		if ( this.type === 'fade' ) {
			const diff = e.targetTouches[ 0 ].clientX - this.initialClientX
			if ( diff <= -40 ) {
				this.nextSlide()
				this.dragTouchEnd()
			} else if ( diff >= 40 ) {
				this.prevSlide()
				this.dragTouchEnd()
			}
		}
	}

	onScroll = () => {
		if ( this.type === 'slide' ) {
			if ( this.tempDisableOnScroll ) {
				return
			}
			const scrollLeft = this.sliderEl.scrollLeft
			const { slide } = this.slideEls.reduce( ( result, slideEl, i ) => {
				const slide = i + 1
				const offsetDiff = Math.abs( slideEl.offsetLeft - scrollLeft )
				if ( offsetDiff <= result.offsetDiff ) {
					return { slide, offsetDiff }
				}
				return result
			}, { slide: 1, offsetDiff: 1000 } )

			this.currentSlide = slide
			this.setDotActive( slide )
		}
	}
}

class StackableCarousel {
	init = () => {
		const els = document.querySelectorAll( '.stk-block-carousel' )
		els.forEach( el => {
			const carousel = new _StackableCarousel( el )
			el.carousel = carousel
			carousel.init()
		} )
	}
}

window.stackableCarousel = new StackableCarousel()
domReady( window.stackableCarousel.init )
