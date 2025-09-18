
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
	onMouseDown = NOOP,
} ) => {
	const ref = useRef( null )

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

	return createPortal( <>
		<body
			ref={ ref }
			className={ shadowBodyClasses }
		>
			<div
				dangerouslySetInnerHTML={ { __html: safeHTML( blocks ) } }
				style={ { pointerEvents: 'none' } }	// prevent blocks from being clicked
			/>
		</body>
	</>, shadowRoot )
}
