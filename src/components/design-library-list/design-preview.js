
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
	onScroll = NOOP,
} ) => {
	const ref = useRef( null )

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
			onWheel={ onScroll }
		>
			<div
				dangerouslySetInnerHTML={ { __html: blocks } }
				style={ { pointerEvents: 'none' } }	// prevent blocks from being clicked
			/>
		</body>
	</>, shadowRoot )
}
