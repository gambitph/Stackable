import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'
import { createInterpolateElement } from '@wordpress/element'

/**
 * Guided Modal Tour Step Properties Documentation
 *
 * Tour-level properties (per tour object, not per step):
 *
 * - steps (array): The array of step objects as described above.
 * - hasConfetti (boolean): If true, confetti is shown on the last step. Default is true.
 * - condition (function): A function that returns true, false, or null to control if/when the tour is shown. null will show the tour only once.
 *
 * Each step in a tour is an object with the following possible properties:
 *
 * - title (string): The title text displayed at the top of the modal.
 * - description (string|ReactNode): The main content or instructions for the step.
 * - help (string|ReactNode): If provided, a help text will be shown below the description.
 * - size (string): The size of the modal. Can be 'small', 'medium', or 'large'. Default is 'small'.
 * - anchor (string): A CSS selector for the element to which the modal should be anchored. If not provided, modal is centered.
 * - position (string): The position of the modal relative to the anchor. Can be 'left', 'right', 'top', 'bottom', or 'center'. Default is 'center'.
 * - offsetX (number): X-axis offset in pixels for fine-tuning the modal's position relative to the anchor.
 * - offsetY (number): Y-axis offset in pixels for fine-tuning the modal's position relative to the anchor.
 * - ctaLabel (string): If provided, a call-to-action button will be shown with this label.
 * - ctaOnClick (function): Function to call when the CTA button is clicked. The tour will move to the next step after this is called.
 * - showNext (boolean): If true, a "Next" button is shown. Default is true.
 * - nextEventTarget (string): A CSS selector for an element. If provided, the tour will wait for the specified event on this element before moving to the next step.
 * - nextEvent (string): The event name to listen for on nextEventTarget (e.g., 'click'). Default is 'click'.
 * - glowTarget (string): A CSS selector for an element to highlight/glow during this step.
 *
 * Example:
 * {
 *   title: 'Welcome',
 *   description: 'This is the first step.',
 *   size: 'medium',
 *   anchor: '.my-element',
 *   position: 'bottom',
 *   offsetX: 10,
 *   offsetY: 0,
 *   ctaLabel: 'Get Started',
 *   ctaOnClick: () => { ... },
 *   showNext: false,
 *   nextEventTarget: '.my-button',
 *   nextEvent: 'click',
 *   glowTarget: '.my-element',
 * }
 */

export const TOUR_STEPS = {
	'design-system-welcome': {
		steps: [
			{
				title: '👋 ' + __( 'Welcome to Your Design System', i18n ),
				description: __( 'Design once, apply everywhere! Set global styles so every block across your site looks and feels unified.', i18n ),
				size: 'medium',
				anchor: '.interface-interface-skeleton__sidebar',
				position: 'left',
				// glowTarget: '.interface-interface-skeleton__sidebar',
			},
			{
				title: __( 'Use The Style Guide', i18n ),
				description: __( 'You can use the Style Guide to see how your complete design system looks.', i18n ),
				help: createInterpolateElement( __( 'Click the <strong>Preview Design System</strong> button to continue.', i18n ), {
					strong: <strong />,
				} ),
				anchor: '.ugb-global-settings__preview-button',
				position: 'left',
				nextEventTarget: '.ugb-global-settings__preview-button',
				glowTarget: '.ugb-global-settings__preview-button',
				postStep: () => {
					// Open the style guide if it's not open.
					if ( ! document.querySelector( '.ugb-style-guide-popover' ) ) {
						document.querySelector( '.ugb-global-settings__preview-button' )?.click()
					}
				},
			},
			// TODO: this is not yet finished
		],
	},
	'editor-welcome': {
		hasConfetti: false,
		condition: () => { // If provided, true will show the tour (even if it's already done), false will not show the tour, null will show the tour only once.
			// Do not show the tour if there is a GET parameter that shows another tour.
			return window?.location?.search?.includes( 'tour=' ) ? false : null
		},
		steps: [
			{
				title: '👋 ' + __( 'Welcome to Stackable', i18n ),
				description: __( 'We\'re excited to have you here. Let\'s get you started by opening the Design Library.', i18n ),
				help: createInterpolateElement( __( 'Click the <strong>Design Library</strong> button to continue.', i18n ), {
					strong: <strong />,
				} ),
				// size: 'medium',
				anchor: '.ugb-insert-library-button',
				position: 'bottom',
				nextEventTarget: '.ugb-insert-library-button',
				glowTarget: '.ugb-insert-library-button',
				showNext: false,
			},
		],
	},
	'design-library-welcome': {
		condition: () => { // If provided, true will show the tour (even if it's already done), false will not show the tour, null will show the tour only once.
			// TODO: The new quick button in the getting started area should open the editor with `tour=design-library-welcome`
			// Force show the tour if there is a GET parameter tour=design-library-welcome
			return window?.location?.search?.includes( 'tour=design-library-welcome' ) ? true : null
		},
		steps: [
			{
				title: '👋 ' + __( 'Welcome to Your Design Library', i18n ),
				description: __( 'These are hundreds ofpre-built designs that are style-matched to your block theme. You can insert one or more patterns to quickly build your page.', i18n ),
				help: createInterpolateElement( __( 'Pick one of the <strong>designs</strong> to continue.', i18n ), {
					strong: <strong />,
				} ),
				size: 'medium',
				nextEventTarget: '.ugb-design-library-item',
				offsetX: '-400px',
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
				description: __( 'Great! Your entire library is now styled. Aside from patterns, there are also full-page layouts in the library.', i18n ),
				help: createInterpolateElement( __( 'Click the <strong>Pages</strong> tab to continue.', i18n ), {
					strong: <strong />,
				} ),
				// TODO: Change these when we have the pages tab already.
				anchor: '.ugb-modal-design-library .components-modal__header',
				position: 'bottom',
				nextEventTarget: '.ugb-modal-design-library .components-modal__header',
				glowTarget: '.ugb-modal-design-library .components-modal__header',
			},
		],
	},
}
