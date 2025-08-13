/**
 * WordPress dependencies
 */
import { useRef } from '@wordpress/element'

const NOOP = () => {}

export const useAutoScroll = ( hostRef, shadowBodySizeRef, selectedTab ) => {
	const scrollPositionRef = useRef( 0 )
	const scrollIntervalRef = useRef( null )

	const onMouseOverImpl = () => {
		const shadowDomBody = hostRef?.current?.shadowRoot.querySelector( 'body' )
		if ( shadowDomBody && shadowBodySizeRef.current ) {
			scrollPositionRef.current = 0
			setTimeout( () => {
				if ( scrollPositionRef.current === -1 ) {
					return
				}

				if ( scrollIntervalRef.current ) {
					clearInterval( scrollIntervalRef.current )
				}

				scrollIntervalRef.current = setInterval( () => {
					const scrollDifference = shadowBodySizeRef.current.maxScrollTop - scrollPositionRef.current
					const shouldScroll = shadowBodySizeRef.current.maxScrollTop - scrollPositionRef.current > 0

					if ( ! shadowDomBody || ! shouldScroll ) {
						clearInterval( scrollIntervalRef.current )
						return
					}

					const scrollBy = scrollDifference >= 20 ? 20 : scrollDifference
					shadowDomBody.scrollTop = scrollPositionRef.current + scrollBy
					scrollPositionRef.current += scrollBy
				}, 20 )
			}, 500 )
		}
	}

	const onMouseOutImpl = () => {
		const shadowDomBody = hostRef?.current?.shadowRoot.querySelector( 'body' )
		if ( shadowDomBody ) {
			clearInterval( scrollIntervalRef.current )
			scrollIntervalRef.current = null
			shadowDomBody.scrollTo( {
				top: 0,
				behavior: 'smooth',
			} )
			scrollPositionRef.current = -1
		}
	}

	const onScrollImpl = () => {
		if ( scrollIntervalRef.current ) {
			clearInterval( scrollIntervalRef.current )
			scrollIntervalRef.current = null
		}
	}

	const onMouseOver = selectedTab === 'patterns' ? NOOP : onMouseOverImpl
	const onMouseOut = selectedTab === 'patterns' ? NOOP : onMouseOutImpl
	const onScroll = selectedTab === 'patterns' ? NOOP : onScrollImpl

	return {
		onMouseOver,
		onMouseOut,
		onScroll,
	}
}
