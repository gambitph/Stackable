
import classnames from 'classnames'

import {
	useEffect, createPortal, useRef,
} from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'
import { safeHTML } from '@wordpress/dom'

const NOOP = () => {}

export const DesignPreview = ( {
	blocks = '',
	shadowRoot,
	selectedTab,
	designIndex,
	onMouseDown = NOOP,
	updateShadowBodySize = NOOP,
	setIsLoading,
} ) => {
	const ref = useRef( null )
	const wrapperRef = useRef( null )

	const isDragging = useRef( false )
	const lastY = useRef( 0 )
	const lastScrollTop = useRef( 0 )

	const handleMouseDown = e => {
		// Disable the auto scroll
		onMouseDown()

		isDragging.current = true
		lastY.current = e.clientY
		const container = ref.current
		if ( container ) {
			lastScrollTop.current = container.scrollTop
		}
	}

	const handleMouseMove = e => {
		if ( ! isDragging.current ) {
			return
		}

		const container = ref.current
		if ( container ) {
			const deltaY = e.clientY - lastY.current
			container.scrollTop = lastScrollTop.current - ( deltaY * 4 )
		}
	}

	const handleMouseUp = () => {
		isDragging.current = false
	}

	useEffect( () => {
		const container = ref.current
		if ( ! container || selectedTab === 'patterns' ) {
			return
		}

		container.addEventListener( 'mousedown', handleMouseDown )
		// eslint-disable-next-line @wordpress/no-global-event-listener
		window.addEventListener( 'mousemove', handleMouseMove )
		// eslint-disable-next-line @wordpress/no-global-event-listener
		window.addEventListener( 'mouseup', handleMouseUp )

		// Clean up the event listeners when the component unmounts.
		return () => {
			container.removeEventListener( 'mousedown', handleMouseDown )
			// eslint-disable-next-line @wordpress/no-global-event-listener
			window.removeEventListener( 'mousemove', handleMouseMove )
			// eslint-disable-next-line @wordpress/no-global-event-listener
			window.removeEventListener( 'mouseup', handleMouseUp )
		}
	}, [ selectedTab ] )

	const shadowBodyClasses = classnames( applyFilters( 'stackable.global-styles.classnames', [
		'entry-content',
	] ), {
		'preview-pages': selectedTab === 'pages',
	} )

	useEffect( () => {
		const wrapper = wrapperRef.current

		if ( ! wrapper || ! blocks ) {
			return
		}

		setIsLoading( true )

		const ric = window.requestIdleCallback ? ( cb => window.requestIdleCallback( cb, { timeout: 1500 } ) )
			: ( cb => setTimeout( cb, designIndex * 20 ) )
		const sanitizedHTML = safeHTML( blocks )

		if ( selectedTab !== 'pages' || designIndex < 9 ) {
			// insert HTML for patterns and for the first 9 pages
			wrapper.innerHTML = sanitizedHTML
			requestAnimationFrame( () => {
				ric( () => setIsLoading( false ) )
			} )
			return
		}

		requestAnimationFrame( () => {
			ric( () => {
				wrapper.innerHTML = sanitizedHTML
				updateShadowBodySize()
				requestAnimationFrame( () => {
					ric( () => setIsLoading( false ) )
				} )
			} )
		} )
	}, [ blocks, shadowRoot ] ) // Only depend on blocks and shadowRoot; selectedTab and designIndex changes will cause blocks to update

	return createPortal( <>
		<body
			ref={ ref }
			className={ shadowBodyClasses }
		>
			<div
				ref={ wrapperRef }
				style={ { pointerEvents: 'none' } }	// prevent blocks from being clicked
			/>
		</body>
	</>, shadowRoot )
}
