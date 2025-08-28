/**
 * This is a plugin that triggers a guided modal tour.
 * It is used to trigger a guided modal tour when a user visits a page with a GET parameter `tour=tourId`.
 * This is also in charge of clicking/opening things needed for the tour.
 */

import { registerPlugin } from '@wordpress/plugins'
import { useEffect } from '@wordpress/element'
import { dispatch } from '@wordpress/data'

const TourTrigger = () => {
	useEffect( () => {
		// Check th
		const tourId = window?.location?.search?.includes( 'tour=' ) ? window?.location?.search?.split( 'tour=' )[ 1 ] : null
		switch ( tourId ) {
			case 'editor':
				// When the editor tour is to be shown, no need to do anything here.
				break
			case 'design-library':
				// When the design library tour is to be shown, simluate a click on the design library button.
				setTimeout( () => {
					document.querySelector( '.ugb-insert-library-button' )?.click()
				}, 500 )
				break
			case 'design-system':
				// When the design system tour is to be shown, open the sidebar
				setTimeout( () => {
					dispatch( 'core/edit-post' )?.openGeneralSidebar( 'stackable-global-settings/sidebar' ) // For Block Editor
				}, 500 )
		}
	}, [] )

	return null
}

registerPlugin( 'stackable-guided-modal-tour-trigger', {
	render: TourTrigger,
	icon: () => null,
	showInSidebar: false,
} )
