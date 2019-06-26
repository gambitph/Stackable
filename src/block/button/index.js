/**
 * BLOCK: Button Block.
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

import { addFilter, applyFilters } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'
import { ButtonIcon } from '@stackable/icons'
import { createButtonAttributes } from '@stackable/util'
import deprecated from './deprecated'
import { disabledBlocks } from 'stackable'
import edit from './edit'
import save from './save'

export const schema = {
	design: {
		type: 'string',
		default: 'basic',
	},
	borderRadius: {
		type: 'number',
		default: '',
	},
	collapseOn: {
		type: 'string',
		default: '',
	},
	showButton2: {
		type: 'boolean',
		default: false,
	},
	showButton3: {
		type: 'boolean',
		default: false,
	},
	...createButtonAttributes( 'button1%s', { selector: '.ugb-button1' } ),
	...createButtonAttributes( 'button2%s', { selector: '.ugb-button2' } ),
	...createButtonAttributes( 'button3%s', { selector: '.ugb-button3' } ),
}

export const name = 'ugb/button'

export const settings = {
	title: __( 'Button' ),
	icon: ButtonIcon,
	description: __( 'Add a customizable button.' ),
	category: 'stackable',
	keywords: [
		__( 'Button' ),
		__( 'Stackable' ),
	],
	attributes: schema,
	supports: {
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	deprecated,
	edit,
	save,

	// Stackable modules.
	modules: {
		'advanced-block-spacing': true,
		'advanced-responsive': true,
		'block-background': true,
		'block-separators': true,
		// 'block-title': true,
		'content-align': true,
		'custom-css': {
			default: applyFilters( 'stackable.button.custom-css.default', '' ),
		},
	},

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/button-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}

// Change the main class name since we're using `ugb-button` for the button element.
addFilter( 'stackable.button.mainClassName', 'stackable/button', () => {
	return 'ugb-button-wrapper'
} )

// If the alignment was changed, but the design doesn't support it, go back to the basic design to allow the alignment change.
addFilter( 'stackable.button.setAttributes', 'stackable/button/contentAlign', ( attributes, blockProps ) => {
	if ( typeof attributes.contentAlign === 'undefined' ) {
		return attributes
	}

	if ( ! [ '', 'basic' ].includes( blockProps.attributes.design ) ) {
		attributes.design = 'basic'
	}

	return attributes
} )

// If the design was changed, but the design doesn't support alignment, reset the alignment attribute.
addFilter( 'stackable.button.setAttributes', 'stackable/button/design', attributes => {
	if ( typeof attributes.design === 'undefined' ) {
		return attributes
	}

	if ( ! [ '', 'basic' ].includes( attributes.design ) ) {
		attributes.contentAlign = ''
	}

	return attributes
} )
