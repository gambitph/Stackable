
import classnames from 'classnames'

import {
	useEffect, createPortal, useRef,
} from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'

const NOOP = () => {}

export const DesignPreview = ( {
	blocks = '',
	shadowRoot,
	selectedTab,
	adjustScale = NOOP,
	onMouseDown = NOOP,
} ) => {
	const ref = useRef( null )

	// Prevents scrolling using mousewheel
	const handleWheel = e => {
		e.preventDefault()
	}

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

		// Add the event listener with { passive: false } to force the browser to allow preventDefault() to work.
		container.addEventListener( 'wheel', handleWheel, { passive: false } )

		container.addEventListener( 'mousedown', handleMouseDown )
		// eslint-disable-next-line @wordpress/no-global-event-listener
		window.addEventListener( 'mousemove', handleMouseMove )
		// eslint-disable-next-line @wordpress/no-global-event-listener
		window.addEventListener( 'mouseup', handleMouseUp )

		// Clean up the event listeners when the component unmounts.
		return () => {
			container.removeEventListener( 'wheel', handleWheel )

			container.removeEventListener( 'mousedown', handleMouseDown )
			// eslint-disable-next-line @wordpress/no-global-event-listener
			window.removeEventListener( 'mousemove', handleMouseMove )
			// eslint-disable-next-line @wordpress/no-global-event-listener
			window.removeEventListener( 'mouseup', handleMouseUp )
		}
	}, [] )

	useEffect( () => {
		// The scale might not be correct on first load, so adjust it again to be sure.
		setTimeout( adjustScale, 100 )
	}, [] )

	const shadowBodyClasses = classnames( applyFilters( 'stackable.global-styles.classnames', [
		'entry-content',
	] ), {
		'preview-pages': selectedTab === 'pages',
	} )

	return createPortal( <>
		<body
			ref={ ref }
			className={ shadowBodyClasses }
		>
			<div
				dangerouslySetInnerHTML={ { __html: blocks } }
				style={ { pointerEvents: 'none' } }	// prevent blocks from being clicked
			/>
		</body>
	</>, shadowRoot )
}
