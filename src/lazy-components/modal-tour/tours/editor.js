import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'
import { createInterpolateElement } from '@wordpress/element'

export const editor = {
	hasConfetti: false,
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
}
