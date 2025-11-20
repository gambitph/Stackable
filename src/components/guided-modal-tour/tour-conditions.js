import { guidedTourStates } from 'stackable'

// For each condition, true will show the tour (even if it's already done), false will not show the tour, null will show the tour only once.
export const TOUR_CONDITIONS = {
	blocks: () => {
		// Force show the tour if there is a GET parameter tour=blocks
		return window?.location?.search?.includes( 'tour=blocks' )
	},
	'design-library': () => {
		// Force show the tour if there is a GET parameter tour=design-library
		return window?.location?.search?.includes( 'tour=design-library' ) ? true : null
	},
	'design-system-picker': () => {
		// Force show the tour if there is a GET parameter tour=design-system-picker
		return window?.location?.search?.includes( 'tour=design-system-picker' ) ? true : null
	},
	'design-system': () => {
		// Force show the tour if there is a GET parameter tour=design-system
		return window?.location?.search?.includes( 'tour=design-system' ) ? true : null
	},
	editor: () => {
		// Do not show the tour if there is a GET parameter that shows another tour.
		return window?.location?.search?.includes( 'tour=' ) ? false
			: guidedTourStates.includes( 'design-library' ) ? false : null
	},
	'site-kit': () => {
		// Force show the tour if there is a GET parameter tour=site-kit
		return window?.location?.search?.includes( 'tour=site-kit' ) ? true : null
	},
	'block-backgrounds': () => {
		// Force show the tour if there is a GET parameter tour=block-backgrounds
		return window?.location?.search?.includes( 'tour=block-backgrounds' ) ? true : null
	},
	'responsive-controls': () => {
		// Force show the tour if there is a GET parameter tour=responsive-controls
		return window?.location?.search?.includes( 'tour=responsive-controls' ) ? true : null
	},
	'hover-states': () => {
		// Force show the tour if there is a GET parameter tour=hover-states
		return window?.location?.search?.includes( 'tour=hover-states' ) ? true : null
	},
	'advanced-hover-states': () => {
		// Force show the tour if there is a GET parameter tour=advanced-hover-states
		return window?.location?.search?.includes( 'tour=advanced-hover-states' ) ? true : null
	},
	'global-color-schemes': () => {
		// Force show the tour if there is a GET parameter tour=global-color-schemes
		return window?.location?.search?.includes( 'tour=global-color-schemes' ) ? true : null
	},
}
