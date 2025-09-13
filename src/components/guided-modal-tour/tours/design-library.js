import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'
import { createInterpolateElement } from '@wordpress/element'

export const designLibrary = {
	condition: () => { // If provided, true will show the tour (even if it's already done), false will not show the tour, null will show the tour only once.
		// Force show the tour if there is a GET parameter tour=design-library
		return window?.location?.search?.includes( 'tour=design-library' ) ? true : null
	},
	initialize: () => {
		// Make sure the patterns tab is selected
		document.querySelector( '.ugb-modal-design-library button[value="patterns"]:not(.is-primary)' )?.click()
	},
	steps: [
		{
			title: '👋 ' + __( 'Welcome to Your Design Library', i18n ),
			description: __( 'These are hundreds of pre-built designs that are style-matched to your block theme. You can insert one or more patterns to quickly build your page.', i18n ),
			help: createInterpolateElement( __( 'Pick one of the <strong>designs</strong> to continue.', i18n ), {
				strong: <strong />,
			} ),
			size: 'medium',
			nextEventTarget: '.ugb-design-library-item',
			nextEvent: 'mouseup',
			offsetX: '-400px',
			postStep: () => {
				// Make sure the first one (or at least there is one) that's toggled
				if ( ! document.querySelector( '.ugb-design-library-item.ugb--is-toggled' ) ) {
					document.querySelector( '.ugb-design-library-item' )?.click()
				}
			},
		},
		{
			title: __( 'Pick Styling Options', i18n ),
			description: __( 'Optionally, you can turn on backgrounds, change color schemes, to customize the library in real-time.', i18n ),
			help: createInterpolateElement( __( 'Toggle the <strong>Section Background</strong> to continue.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.ugb-modal-design-library__enable-background',
			position: 'right',
			nextEventTarget: '.ugb-modal-design-library__enable-background',
			glowTarget: '.ugb-modal-design-library__enable-background',
			postStep: () => {
				const el = document.querySelector( '.ugb-modal-design-library__enable-background input' )
				// If the input is not checked, click the button.
				if ( ! el.checked ) {
					el.click()
				}
			},
		},
		{
			title: __( 'Change Color Schemes', i18n ),
			description: __( 'Awesome! Your designs now have a background. Try out the available color schemes below. You can also create your own later!', i18n ),
			help: createInterpolateElement( __( 'Pick a <strong>Color Scheme</strong> to continue.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.ugb-design-library__color-scheme-popover',
			position: 'top',
			nextEventTarget: '.ugb-design-library__color-scheme-popover .ugb-modal-design-library__stk-color-scheme',
			glowTarget: '.ugb-design-library__color-scheme-popover .ugb-modal-design-library__stk-color-scheme:last-of-type',
			preStep: () => {
				// Let's make sure the background scheme is open.
				if ( ! document.querySelector( '.ugb-design-library__color-scheme-popover' ) ) {
					document.querySelector( '.ugb-modal-design-library__background-scheme .ugb-modal-design-library__stk-color-scheme' )?.click()
				}
			},
			postStep: () => {
				document.querySelector( '.ugb-design-library__color-scheme-popover .ugb-modal-design-library__stk-color-scheme:last-of-type' )?.click()
				document.querySelector( '.ugb-modal-design-library__color-scheme-close-button' )?.click()
			},
		},
		{
			title: __( 'Patterns and Full-Pages', i18n ),
			description: __( 'Great! Your entire library is now styled. Aside from patterns, Stackable also provides you with full-page layouts.', i18n ),
			help: createInterpolateElement( __( 'Click the <strong>Next</strong> to continue.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.stk-design-library-tabs .components-button-group',
			position: 'bottom',
			nextEventTarget: '.stk-design-library-tabs .components-button-group',
			glowTarget: '.stk-design-library-tabs .components-button-group',
			preStep: () => {
				// Disable for now the pages tab
				const pagesButton = document.querySelector( '.stk-design-library-tabs button[value="pages"]' )
				if ( pagesButton ) {
					pagesButton.disabled = true
				}
			},
			postStep: () => {
				// Enable the pages tab
				const pagesButton = document.querySelector( '.stk-design-library-tabs button[value="pages"]' )
				if ( pagesButton ) {
					pagesButton.disabled = false
				}
			},
		},
		{
			title: __( 'Let\'s Insert Our Pattern', i18n ),
			description: __( 'Now let\'s insert our pattern into our page.', i18n ),
			help: createInterpolateElement( __( 'Click on <strong>Add Designs</strong> to continue.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.ugb-modal-design-library__add-multi',
			position: 'top-right',
			nextEventTarget: '.ugb-modal-design-library__add-multi',
			glowTarget: '.ugb-modal-design-library__add-multi',
			preStep: () => {
				// Make sure the patterns tab is selected
				document.querySelector( '.ugb-modal-design-library button[value="patterns"]:not(.is-primary)' )?.click()

				// Make sure the first one (or at least there is one) that's toggled
				if ( ! document.querySelector( '.ugb-design-library-item.ugb--is-toggled' ) ) {
					document.querySelector( '.ugb-design-library-item' )?.click()
				}
			},
			postStep: () => {
				setTimeout( () => {
					// If the design library is still open, click the add button.
					if ( document.querySelector( '.ugb-modal-design-library' ) ) {
						document.querySelector( '.ugb-modal-design-library__add-multi' )?.click()
					}
				}, 100 )
			},
		},
	],
}
