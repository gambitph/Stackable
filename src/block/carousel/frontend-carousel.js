/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

// Function to check if the user is on an iOS device
function isiOS() {
	const userAgent = navigator?.userAgent
	return userAgent && ( userAgent.indexOf( 'iPhone' ) === -1 || userAgent.indexOf( 'iPad' ) )
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
		this.sliderEl = this.el.querySelector( '.stk-block-carousel__slider' )
		this.slideEls = Array.from( this.sliderEl.children )
		this.isRTL = document.documentElement?.getAttribute( 'dir' ) === 'rtl' || document.body?.getAttribute( 'dir' ) === 'rtl'
		this.infiniteScroll = this.el.classList.contains( 'stk--infinite-scroll' )

		// for iOS devices:
		// fix double clicks on links after triggering touch events of carousel
		this.isiOS = isiOS()
		this.hasTouched = false

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

		this.fixChildrenAccessibility() // This needs to be first before infinte scrolling clones slides.
		this.initProperties()
	}

	initProperties = () => {
		this.slidesToShow = this.type === 'slide' ? parseInt( getComputedStyle( this.el ).getPropertyValue( '--slides-to-show' ), 10 ) : 1
		this.autoplay = this.sliderEl.dataset.autoplay
		// for RTL, slideOffset is the starting slide number
		// it is the leftmost slide for the first set of slides to show
		this.slideOffset = this.isRTL && this.type === 'slide' ? this.slidesToShow : 1

		if ( this.isRTL ) {
			// update default icons here instead on save.js so that
			// users won't have to update/save in editor when changing site language
			this.updateDefaultIcon()
			if ( this.slidesToShow > 1 ) {
				this.currentSlide = this.slidesToShow
				this.setDotActive( this.currentSlide )
			}
		}

		// If we have infiniteScroll, call this after cloning the slides
		const otherInitCalls = () => {
			this.addEventListeners()
			this.fixAccessibility( this.currentSlide )
			this.setDotActive( this.currentSlide )
			this.fixInlineScrollNavigation()

			this.slideEls[ this.currentSlide - 1 ].classList.add( 'stk-block-carousel__slide--active' )

			this.unpauseAutoplay()
		}

		if ( this.infiniteScroll && ! this.el._StackableHasInitCarousel ) {
			// clone slides
			this.clones = []
			const clonesToAdd = []
			let lastClone = null
			let index = 0
			let step = 0

			const runInitSteps = () => {
				if ( step === 0 ) {
					// Clone only the last slide and the first N slides (where N equals to slidesToShow)
					const slideIndex = index === this.slidesToShow ? this.slideEls.length - 1 : index
					const original = this.slideEls[ slideIndex ]
					const clone = original.cloneNode( true )
					clone.classList.add( `stk-slide-clone-${ slideIndex + 1 }` )
					original.style.willChange = 'transform'
					original.style.transform = 'TranslateX( 0 )'

					// prevents flickering when changing the value of TranslateX
					original.style.transition = 'transform 0s'

					this.clones.push( clone )

					if ( index === this.slidesToShow ) {
						lastClone = clone
						step++
					} else {
						clonesToAdd.push( clone )
					}

					index++
				} else if ( step === 1 ) {
					// Append clones at the end except for the last slide clone which will be placed at the front
					this.sliderEl.append( ...clonesToAdd )
					if ( lastClone ) {
						this.sliderEl.insertBefore( lastClone, this.slideEls[ 0 ] )
					}
					step++
				} else if ( step === 2 ) {
					const numSlides = this.slideEls.length
					const slideClientRect = this.slideEls[ 0 ].getBoundingClientRect()
					const slideWidth = slideClientRect.width

					this.slideTranslateX = `calc((${ slideWidth }px * ${ numSlides }) + (var(--gap) * ${ numSlides }))`

					step++
				} else if ( step === 3 ) {
					// IMPORTANT: Do style reads before applying style change to improve performance
					// https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing
					const targetOffsetLeft = this.slideEls[ 0 ].offsetLeft

					// Scroll without animation to the first slide
					this.sliderEl.style.scrollBehavior = 'unset'
					this.sliderEl.scrollLeft = targetOffsetLeft
					step++
				} else if ( step === 4 ) {
					this.sliderEl.style.scrollBehavior = ''

					this.currentSlide = 1
					this.swappedSlides = 0
					this.updateDots()
					step++
				} else if ( step === 5 ) {
					otherInitCalls()
					step++
				}

				if ( step <= 5 ) {
					requestAnimationFrame( runInitSteps )
				}
			}

			requestAnimationFrame( runInitSteps )
			return
		}

		this.updateDots()
		otherInitCalls()
	}

	updateDots = () => {
		if ( ! this.dotsEl ) {
			return
		}
		this.dotEls = []
		this.dotsEl.innerHTML = ''

		const dotLabel = this.dotsEl.dataset.label
		this.slideEls.forEach( ( slideEl, i ) => {
			if ( ! this.infiniteScroll &&
				! this.isRTL &&
				i >= this.slideEls.length - this.slidesToShow + 1 ) {
				return
			}

			const listEl = document.createElement( 'div' )
			const dotEl = document.createElement( 'button' )
			listEl.setAttribute( 'role', 'listitem' )
			dotEl.classList.add( 'stk-block-carousel__dot' )
			dotEl.setAttribute( 'aria-label', dotLabel.replace( /%+d/, i + 1 ) )
			if ( this.currentSlide === i + 1 ) {
				dotEl.classList.add( 'stk-block-carousel__dot--active' )
			}
			listEl.appendChild( dotEl )
			// if RTL, display only dots starting from the offset
			// if site is not RTL, slideOffset = 1 so all listEl will still be appended
			if ( i >= this.slideOffset - 1 ) {
				this.dotsEl.appendChild( listEl )
			}

			dotEl.addEventListener( 'click', () => {
				this.pauseAutoplay()
				this.goToSlide( i + 1 )
				this.unpauseAutoplay()
			} )

			this.dotEls.push( dotEl )
		} )
	}

	// switch default icons if site is RTL
	updateDefaultIcon = () => {
		const prevButton = this.el.querySelector( '.stk-block-carousel__button.stk-block-carousel__button__prev .fa-chevron-left' )
		const nextButton = this.el.querySelector( '.stk-block-carousel__button.stk-block-carousel__button__next .fa-chevron-right' )
		if ( prevButton ) {
			prevButton.style.transform = 'rotate(180deg)'
		}
		if ( nextButton ) {
			nextButton.style.transform = 'rotate(180deg)'
		}
	}

	addEventListeners = () => {
		if ( window ) {
			// eslint-disable-next-line @wordpress/no-global-event-listener
			window.addEventListener( 'resize', this.initProperties )
		}

		// Mousewheel left and right should scroll the fade carousel
		this.sliderEl.addEventListener( 'wheel', this.onWheel, { passive: true } )

		// Dragging
		this.sliderEl.addEventListener( 'mousedown', this.dragMouseDown )
		this.sliderEl.addEventListener( 'touchstart', this.dragTouchStart, { passive: true } )
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

		if ( this.isiOS ) {
			document.body.addEventListener( 'touchend', this.onTouchEndIOS )
		}
	}

	maxSlides = () => {
		let maxSlides = this.slideEls.length
		if ( this.type === 'slide' && ! this.isRTL ) {
			maxSlides -= ( this.slidesToShow - 1 )
		}
		return maxSlides
	}

	needToSwapCount = slide => {
		return this.slidesToShow - ( this.slideEls.length - slide + 1 )
	}

	nextSlide = () => {
		let newSlide = this.currentSlide + 1

		if ( this.type === 'slide' && this.infiniteScroll && newSlide > this.maxSlides() ) {
			this.swapSlides( newSlide, 'N' )
			return
		}

		if ( ! this.infiniteScroll && newSlide > this.maxSlides() ) {
			newSlide = this.slideOffset
		}
		this.goToSlide( newSlide )
	}

	prevSlide = () => {
		let newSlide = this.currentSlide - 1

		if ( this.type === 'slide' && this.infiniteScroll &&
			( newSlide < this.slideOffset || this.needToSwapCount( newSlide ) >= 0 ) ) {
			this.swapSlides( newSlide, 'P' )
			return
		}

		if ( ! this.infiniteScroll && newSlide < this.slideOffset ) {
			newSlide = this.maxSlides()
		}
		this.goToSlide( newSlide )
	}

	swapSlides = ( slide, dir ) => {
		let scrollToSlide = false
		if ( dir === 'N' && slide > this.slideEls.length ) {
			slide = this.slideOffset
			scrollToSlide = true
		} else if ( dir === 'P' && slide < this.slideOffset ) {
			slide = this.slideEls.length
			scrollToSlide = true
		}

		const needToSwap = this.needToSwapCount( slide )
		let startIndex = 0
		let endIndex = 0
		let slideTranslateXValue = 0
		if ( needToSwap > 0 && this.swappedSlides < needToSwap ) {
			startIndex = this.swappedSlides
			endIndex = needToSwap

			slideTranslateXValue = this.slideTranslateX

			this.swappedSlides = endIndex
		} else if ( this.swappedSlides > needToSwap ) {
			startIndex = needToSwap > 0 ? needToSwap : 0
			endIndex = this.swappedSlides

			this.swappedSlides = startIndex
		}

		let step = 0

		const runSteps = () => {
			if ( step === 0 ) {
				this.slideEls.slice( startIndex, endIndex ).forEach( slide => {
					slide.style.transform = `TranslateX(${ slideTranslateXValue })`
				} )
				step++
				requestAnimationFrame( runSteps )
			} else if ( step === 1 ) {
				this.slideEls.slice( startIndex, endIndex ).forEach( slide => slide.offsetLeft )

				if ( scrollToSlide ) {
					const lastCloneSlide = this.clones[ this.clones.length - 1 ].offsetLeft
					const firstCloneSide = this.clones[ 0 ].offsetLeft

					let initSlide = null

					if ( dir === 'N' ) {
						initSlide = lastCloneSlide
					} else if ( this.slidesToShow === 1 ) {
						initSlide = lastCloneSlide
					} else {
						initSlide = firstCloneSide
					}

					// Move from the last slide to the first slide (N - next) or
					// Move from the first slide to the last slide (P - prev)
					this.sliderEl.style.scrollBehavior = 'unset'
					this.sliderEl.scrollLeft = initSlide
					this.sliderEl.style.scrollBehavior = ''
				}

				step++
				requestAnimationFrame( runSteps )
			} else {
				requestAnimationFrame( () => this.goToSlide( slide ) )
			}
		}

		requestAnimationFrame( runSteps )
	}

	goToSlide = ( slide, force = false ) => {
		if ( slide === this.currentSlide && ! force ) {
			return
		}
		const currentSlideEl = this.slideEls[ this.currentSlide - 1 ]
		const newSlideEl = this.slideEls[ slide - 1 ]
		const offsetLeft = newSlideEl.offsetLeft

		currentSlideEl.classList.remove( 'stk-block-carousel__slide--active' )
		newSlideEl.classList.add( 'stk-block-carousel__slide--active' )

		if ( this.type === 'slide' ) {
			this.sliderEl.scrollLeft = offsetLeft
		} else if ( this.type === 'fade' ) { // fade
			currentSlideEl.style.opacity = 0

			newSlideEl.style.zIndex = ++this.currentZIndex
			newSlideEl.style.transition = 'none'
			newSlideEl.style.opacity = 0
			newSlideEl.style.visibility = 'visible'
			newSlideEl.style.left = `${ this.isRTL ? '' : '-' }${ 100 * ( slide - 1 ) }%`
			setTimeout( () => {
				newSlideEl.style.transition = ''
				newSlideEl.style.opacity = 1
			}, 1 )
		}
		this.fixAccessibility( slide )
		this.setDotActive( slide )
		this.currentSlide = slide

		// Dispatch an event when the carousel change slide
		this.el.dispatchEvent( new CustomEvent( 'stackable-carousel-slide-change', {
			detail: {
				element: this.el,
				currentSlide: slide,
			},
		} ) )

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

	fixChildrenAccessibility = () => {
		this.slideEls.forEach( slide => {
			slide.setAttribute( 'role', 'listitem' )
		} )
	}

	setDotActive = slide => {
		this.dotEls?.forEach( ( dotEl, i ) => {
			if ( slide === i + 1 ||
				( this.infiniteScroll && slide === 0 && i === this.dotEls.length - 1 ) ) {
				// sets active dot to the last dot if slider goes to the previous slide from the first slide
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
		const sliderElScrollLeft = this.sliderEl.scrollLeft
		const lastSlideOffset = this.slideEls[ this.slideEls.length - 1 ].offsetLeft
		const firstCloneOffset = this.clones[ 0 ].offsetLeft
		const slidesOffset = this.slideEls.map( slide => slide.offsetLeft )
		const clonesOffset = this.clones.map( slide => slide.offsetLeft )
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
		// For infinite scrolling, set the scroll position to the actual slide ( not to the clone of the slide )
		} else if ( this.infiniteScroll && e.deltaX <= -1 && sliderElScrollLeft === 0 ) {
			this.sliderEl.style.scrollBehavior = 'unset'
			this.sliderEl.scrollLeft = lastSlideOffset
			this.sliderEl.style.scrollBehavior = ''
		} else if ( this.infiniteScroll && e.deltaX >= 1 && sliderElScrollLeft >= firstCloneOffset ) {
			clonesOffset.some( ( offset, i ) => {
				if ( sliderElScrollLeft === offset ) {
					this.sliderEl.style.scrollBehavior = 'unset'
					this.sliderEl.scrollLeft = slidesOffset[ i ]
					this.sliderEl.style.scrollBehavior = ''
					return true
				}
				return false
			} )
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
		let dx = e.clientX - this.initialClientX
		const sliderElScrollLeft = this.sliderEl.scrollLeft
		const lastSlideOffsetLeft = this.slideEls[ this.slideEls.length - 1 ].offsetLeft
		const firstCloneOffsetLeft = this.clones[ 0 ].offsetLeft

		if ( this.type === 'slide' ) {
			if ( this.infiniteScroll && sliderElScrollLeft === 0 && dx > 0 ) {
				this.initialScrollLeft = lastSlideOffsetLeft
				this.initialClientX = e.clientX
				dx = 0
			} else if ( this.infiniteScroll && sliderElScrollLeft >= firstCloneOffsetLeft && dx < 0 ) {
				this.initialScrollLeft = firstCloneOffsetLeft
				this.initialClientX = e.clientX
				dx = 0
			}

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
		if ( this.isiOS ) {
			this.hasTouched = true
		}

		this.sliderEl.addEventListener( 'touchend', this.dragTouchEnd )
		this.sliderEl.addEventListener( 'touchmove', this.dragTouchMove )

		this.initialClientX = e.targetTouches[ 0 ].clientX

		this.pauseAutoplay()
	}

	dragTouchEnd = () => {
		this.sliderEl.removeEventListener( 'touchend', this.dragTouchEnd )
		this.sliderEl.removeEventListener( 'touchmove', this.dragTouchMove )
		this.unpauseAutoplay()
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
			const slideEls = this.infiniteScroll ? [ ...this.slideEls, ...this.clones ] : this.slideEls
			let { slide } = slideEls.reduce( ( result, slideEl, i ) => {
				const slide = i + 1
				const offsetDiff = Math.abs( slideEl.offsetLeft - scrollLeft )
				if ( offsetDiff <= result.offsetDiff ) {
					return { slide, offsetDiff }
				}
				return result
			}, { slide: 1, offsetDiff: 1000 } )

			if ( this.infiniteScroll && slide > this.slideEls.length ) {
				slide -= this.slideEls.length
			}

			this.currentSlide = slide
			this.setDotActive( slide )
		}
	}

	// Reference: https://github.com/wp-media/wp-rocket/issues/3142#issuecomment-1870722927
	onTouchEndIOS = e => {
		if ( ! this.hasTouched ) {
			return
		}
		const target = e.target

		// Manually trigger click event on links and buttons
		if ( ! target.closest( '.stk-block-carousel__slider' ) &&
			( target.tagName === 'A' ||
			target.tagName === 'BUTTON' ||
			target.closest( 'a' ) ||
			target.closest( 'button' )
			 ) ) {
			const clickEvent = new MouseEvent( 'click', { bubbles: true, cancelable: true } )
			target.dispatchEvent( clickEvent )
			e.preventDefault()
		}

		this.hasTouched = false
	}

	// Pause autoplay while inline navigation is in progress
	fixInlineScrollNavigation = () => {
		let listenerTimeout = null

		const handleEndScroll = () => {
			this.unpauseAutoplay()
			document.removeEventListener( 'scroll', scrollListener )
		}

		// After 200ms of non-scrolling, then the navigation scroll is done, restart the autoplay
		const scrollListener = () => {
			clearTimeout( listenerTimeout )
			listenerTimeout = setTimeout( handleEndScroll, 200 )
		}

		// Listen to any scroll navigation clicks, including dynamically added
		document.addEventListener( 'click', e => {
			// Check if we're inside an anchor link
			// eslint-disable-next-line @wordpress/no-global-event-listener
			if ( e.target.closest( '[href^="#"]' ) ) {
				this.pauseAutoplay()
				document.addEventListener( 'scroll', scrollListener, { passive: true } )
				clearTimeout( listenerTimeout )
				listenerTimeout = setTimeout( handleEndScroll, 200 )
			}
		}, { passive: true } )
	}
}

class StackableCarousel {
	init = () => {
		const els = document.querySelectorAll( '.stk-block-carousel' )
		els.forEach( el => {
			if ( ! el._StackableHasInitCarousel ) {
				const carousel = new _StackableCarousel( el )
				el.carousel = carousel
				carousel.init()
				el._StackableHasInitCarousel = true
			}
		} )
	}
}

window.stackableCarousel = new StackableCarousel()
domReady( window.stackableCarousel.init )
