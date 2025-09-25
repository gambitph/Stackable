/**
 * WordPress dependencies
 */
import {
	useRef, useEffect, useCallback,
} from '@wordpress/element'

const NOOP = () => {}

export const useAutoScroll = ( hostRef, shadowBodySizeRef, selectedTab ) => {
	const scrollPositionRef = useRef( 0 )
	const animationFrameRef = useRef( null )
	const isScrollingRef = useRef( false )
	const delayTimeoutRef = useRef( null )

	const smoothScrollToBottom = ( shadowDomBody, targetScrollTop ) => {
		if ( ! shadowDomBody || ! isScrollingRef.current ) {
			return
		}

		const currentScrollTop = shadowDomBody.scrollTop
		const distance = targetScrollTop - currentScrollTop
		const totalDistance = shadowBodySizeRef.current.maxScrollTop
		const progress = 1 - ( distance / totalDistance ) // 0 at start, 1 at end

		// If we're close enough to the target, stop scrolling
		if ( Math.abs( distance ) < 1 ) {
			isScrollingRef.current = false
			return
		}

		// Bell curve: faster ramp up, starts at reasonable speed, peaks in middle
		// Creates a more aggressive acceleration and deceleration pattern
		const bellCurve = 8 * progress * ( 1 - progress ) // Peaks at 2.0 in the middle
		const baseSpeed = 20 // Base speed multiplier
		const scrollStep = Math.max( baseSpeed * bellCurve, 5 ) // Minimum 1.5px for better start

		// Apply the scroll step
		shadowDomBody.scrollTop = currentScrollTop + scrollStep
		scrollPositionRef.current = shadowDomBody.scrollTop

		// Continue scrolling on next frame
		animationFrameRef.current = requestAnimationFrame( () =>
			smoothScrollToBottom( shadowDomBody, targetScrollTop )
		)
	}

	const onMouseOverImpl = () => {
		const shadowDomBody = hostRef?.current?.shadowRoot?.querySelector?.( 'body' )
		if ( shadowDomBody && shadowBodySizeRef.current ) {
			// Reset scroll position and start smooth scrolling
			scrollPositionRef.current = 0
			isScrollingRef.current = true

			// Clear any existing timeout
			if ( delayTimeoutRef.current ) {
				clearTimeout( delayTimeoutRef.current )
				delayTimeoutRef.current = null
			}

			delayTimeoutRef.current = setTimeout( () => {
				if ( scrollPositionRef.current === -1 || ! isScrollingRef.current ) {
					return
				}

				// Clear any existing animation
				if ( animationFrameRef.current ) {
					cancelAnimationFrame( animationFrameRef.current )
				}

				// Start smooth scrolling to bottom
				const targetScrollTop = shadowBodySizeRef.current.maxScrollTop
				if ( targetScrollTop > 0 ) {
					smoothScrollToBottom( shadowDomBody, targetScrollTop )
				}

				delayTimeoutRef.current = null
			}, 1000 )
		}
	}

	const onMouseOutImpl = () => {
		const shadowDomBody = hostRef?.current?.shadowRoot?.querySelector?.( 'body' )
		if ( shadowDomBody ) {
			// Stop scrolling and smoothly return to top
			isScrollingRef.current = false
			if ( animationFrameRef.current ) {
				cancelAnimationFrame( animationFrameRef.current )
				animationFrameRef.current = null
			}

			// Clear any existing timeout
			if ( delayTimeoutRef.current ) {
				clearTimeout( delayTimeoutRef.current )
				delayTimeoutRef.current = null
			}

			shadowDomBody.scrollTo( {
				top: 0,
				behavior: 'smooth',
			} )
			scrollPositionRef.current = -1
		}
	}

	const onMouseDownImpl = useCallback( () => {
		// Stop auto-scrolling when user interacts
		isScrollingRef.current = false
		if ( animationFrameRef.current ) {
			cancelAnimationFrame( animationFrameRef.current )
			animationFrameRef.current = null
		}

		// Clear any existing timeout
		if ( delayTimeoutRef.current ) {
			clearTimeout( delayTimeoutRef.current )
			delayTimeoutRef.current = null
		}
		scrollPositionRef.current = -1
	}, [] )

	// Cleanup any pending animation on unmount.
	useEffect( () => {
		return () => {
			isScrollingRef.current = false
			if ( animationFrameRef.current ) {
				cancelAnimationFrame( animationFrameRef.current )
				animationFrameRef.current = null
			}

			// Clear any existing timeout
			if ( delayTimeoutRef.current ) {
				clearTimeout( delayTimeoutRef.current )
				delayTimeoutRef.current = null
			}
			scrollPositionRef.current = -1
		}
	}, [] )

	const onMouseOver = selectedTab === 'patterns' ? NOOP : onMouseOverImpl
	const onMouseOut = selectedTab === 'patterns' ? NOOP : onMouseOutImpl
	const onMouseDown = selectedTab === 'patterns' ? NOOP : onMouseDownImpl

	return {
		onMouseOver,
		onMouseOut,
		onMouseDown,
	}
}
