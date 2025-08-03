import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'

export const TOUR_STEPS = {
	'editor-welcome': [
		{
			title: '👋 ' + __( 'Welcome to Stackable', i18n ),
			description: __( 'We\'re excited to have you here. Let\'s get you started by opening the Design Library. Click the button above to get started.', i18n ),
			// size: 'medium',
			anchor: '.ugb-insert-library-button',
			position: 'bottom',
			nextEventTarget: '.ugb-insert-library-button',
			glowTarget: '.ugb-insert-library-button',
			showNext: false,
		},
	],
	'design-library-welcome': [
		{
			title: '👋 ' + __( 'Welcome to Your Design Library', i18n ),
			description: __( 'These are pre-built designs that are style-matched to your block theme. You can insert one or more patterns to quickly build your page.', i18n ),
			size: 'medium',
		},
		{
			title: __( 'Pick Styling Options', i18n ),
			description: __( 'Turn on backgrounds, change color schemes, to customize the library. Go ahead and click on "Section Background" and see your changes in real-time.', i18n ),
			anchor: '.ugb-modal-design-library__enable-background',
			position: 'right',
			nextEventTarget: '.ugb-modal-design-library__enable-background',
			// ctaLabel: __( 'Enable Background', i18n ),
			// ctaOnClick: () => {
			// 	const element = document.querySelector( '.ugb-modal-design-library__enable-background .components-form-toggle__input' )
			// 	element?.click()
			// },
			glowTarget: '.ugb-modal-design-library__enable-background',
			// showNext: false,
		},
		{
			title: __( 'Patterns and Full-Pages', i18n ),
			description: __( 'Click here to switch between patterns and full-page layouts.', i18n ),
			anchor: '.ugb-modal-design-library .components-modal__header',
			position: 'bottom',
		},
	],
}
