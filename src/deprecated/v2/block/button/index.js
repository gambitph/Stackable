/**
 * BLOCK: Button Block.
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

/**
 * External dependencies
 */
import { ButtonIcon } from '~stackable/icons'
import { v2disabledBlocks as disabledBlocks } from 'stackable'

/**
 * Internal dependencies
 */
import './design'
import deprecated from './deprecated'
import edit from './edit'
import save from './save'
import schema from './schema'
import example from './example'
import _metadata from './block.json'

/**
 * WordPress dependencies
 */
import { addFilter, applyFilters } from '@wordpress/hooks'

const {
	name,
	...metadata
} = _metadata

export { name }

export const settings = {
	...metadata,
	title: metadata.title + ' (v2)',
	icon: ButtonIcon,
	attributes: schema,
	example,
	supports: {
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
		anchor: true,
	},

	deprecated,
	edit,
	save,

	// Stackable modules.
	modules: {
		'advanced-general': true,
		'advanced-block-spacing': true,
		'advanced-custom-attributes': true,
		'advanced-responsive': true,
		'block-background': {
			importantBackgroundSize: true,
		},
		'block-separators': true,
		// 'block-title': true,
		'content-align': true,
		'block-designs': true,
		'custom-css': {
			default: applyFilters( 'stackable.button.custom-css.default', '' ),
		},
	},
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
