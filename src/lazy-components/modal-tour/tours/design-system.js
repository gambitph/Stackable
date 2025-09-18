import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'
import { createInterpolateElement } from '@wordpress/element'

export const designSystem = {
	steps: [
		{
			title: '👋 ' + __( 'Welcome to Your Design System', i18n ),
			description: __( 'Design once, apply everywhere! Set global styles so every block across your site looks and feels unified.', i18n ),
			size: 'medium',
			anchor: '.interface-interface-skeleton__sidebar',
			position: 'left-top',
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
		{
			title: __( 'This is Your Style Guide', i18n ),
			description: __( 'This Style Guide shows a live preview of your entire design system showing how the different design elements look. This updates based on your current settings.', i18n ),
			help: __( 'Scroll down to explore', i18n ),
			size: 'medium',
			anchor: '.ugb-style-guide-popover > .components-popover__content',
			position: 'center',
			// glowTarget: '.interface-interface-skeleton__sidebar',
		},
		{
			title: __( 'Customize Your Design System', i18n ),
			description: __( 'These settings are applied to all blocks across your entire site. They are used as defaults for your blocks, but you can override them on a per block basis.', i18n ),
			help: createInterpolateElement( __( 'Open the <strong>Global Typography</strong> panel to continue.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.ugb-global-typography__panel .components-panel__body-title',
			position: 'left',
			glowTarget: '.ugb-global-typography__panel .components-panel__body-toggle',
			nextEventTarget: '.ugb-global-typography__panel .components-panel__body-toggle',
			skipIf: () => {
				return document.querySelector( '.ugb-global-typography__panel' )?.classList.contains( 'is-opened' )
			},
			postStep: () => {
				// Open the typography panel if it's not open.
				if ( document.querySelector( '.ugb-global-typography__panel:not(.is-opened)' ) ) {
					document.querySelector( '.ugb-global-typography__panel .components-panel__body-toggle' )?.click()
				}
			},
		},
		{
			title: __( 'Try Changing Your Font Pair', i18n ),
			description: __( 'Try changing the font pair to see how it looks in the Style Guide.', i18n ),
			help: createInterpolateElement( __( 'Pick another <strong>Preset Font Pair</strong> to continue.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.ugb-global-settings-font-pair-control:not(.ugb-global-settings-font-pair__selected)',
			position: 'left',
			glowTarget: '.ugb-global-settings-font-pair-control:not(.ugb-global-settings-font-pair__selected)',
			nextEventTarget: '.ugb-global-settings-font-pair__container [role="button"]',
			preStep: () => {
				// Make sure that the typography panel is open.
				if ( document.querySelector( '.ugb-global-typography__panel:not(.is-opened)' ) ) {
					document.querySelector( '.ugb-global-typography__panel .components-panel__body-title' )?.click()
				}
				const el = document.querySelector( '.ugb-global-settings-font-pair__container' )
				if ( el ) {
					// Scroll this to the top.
					el.scrollTo( {
						top: 0,
						behavior: 'auto',
					} )
				}
			},
		},
		{
			title: __( 'Whoa! Your Site Updated', i18n ),
			description: __( 'Did you see that? Your site has been updated with the new font pair. You can see the changes in the Style Guide as well!', i18n ),
			help: __( 'Other parts below the style guide also updated!', i18n ),
			anchor: '.ugb-style-guide__color-container',
			position: 'top',
			glowTarget: '.ugb-style-guide__color-container',
			preStep: () => {
				const el = document.querySelector( '.ugb-style-guide-popover > .components-popover__content' )
				// Scroll this to the top.
				if ( el ) {
					el.scrollTo( {
						top: 0,
						behavior: 'smooth',
					} )
				}
			},
		},
		{
			title: __( 'Share Your Style Guide', i18n ),
			description: __( 'You can easily share your design system with others by exporting your Style Guide as an image. This is perfect for sharing with clients, teammates, or for documentation.', i18n ),
			anchor: '.ugb-style-guide__print-button',
			position: 'bottom',
			glowTarget: '.ugb-style-guide__print-button',
			preStep: () => {
				const el = document.querySelector( '.ugb-style-guide-popover > .components-popover__content' )
				// Scroll this to the top.
				if ( el ) {
					el.scrollTo( {
						top: 0,
						behavior: 'smooth',
					} )
				}
			},
		},
		{
			title: __( 'You Did It!', i18n ),
			description: __( 'That\'s it for the tour! Click the X to close the Style Guide. Your new styles are now live on your site. 🎉', i18n ),
			anchor: '.ugb-style-guide-popover__close-button',
			position: 'bottom',
			glowTarget: '.ugb-style-guide-popover__close-button',
			nextEventTarget: '.ugb-style-guide-popover__close-button',
			postStep: () => {
				document.querySelector( '.ugb-style-guide-popover__close-button' )?.click()
			},
		},
	],
}
