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
	...createButtonAttributes( 'button1%s' ),
	...createButtonAttributes( 'button2%s' ),
	...createButtonAttributes( 'button3%s' ),
	// buttons: {
	// 	type: 'number',
	// 	default: 1,
	// },
	// url: {
	// 	type: 'string',
	// 	source: 'attribute',
	// 	selector: 'a',
	// 	attribute: 'href',
	// 	default: '',
	// },
	// newTab: {
	// 	type: 'boolean',
	// 	source: 'attribute',
	// 	selector: 'a',
	// 	attribute: 'target',
	// 	default: false,
	// },
	// text: {
	// 	source: 'html',
	// 	selector: 'a span',
	// 	default: __( 'Button text' ),
	// },
	// align: {
	// 	type: 'string',
	// 	default: 'center',
	// },
	// color: {
	// 	type: 'string',
	// },
	// textColor: {
	// 	type: 'string',
	// },
	// size: {
	// 	type: 'string',
	// 	default: 'normal',
	// },
	// cornerButtonRadius: {
	// 	type: 'number',
	// 	default: 4,
	// },
	// design: {
	// 	type: 'string',
	// 	default: 'basic',
	// },
	// icon: {
	// 	type: 'string',
	// },

	// url2: {
	// 	type: 'string',
	// 	source: 'attribute',
	// 	selector: 'div:nth-of-type(2) .ugb-button',
	// 	attribute: 'href',
	// 	default: '',
	// },
	// newTab2: {
	// 	type: 'boolean',
	// 	source: 'attribute',
	// 	selector: 'div:nth-of-type(2) .ugb-button',
	// 	attribute: 'target',
	// 	default: false,
	// },
	// text2: {
	// 	source: 'html',
	// 	selector: 'div:nth-of-type(2) .ugb-button span',
	// 	default: __( 'Button text' ),
	// },
	// color2: {
	// 	type: 'string',
	// },
	// textColor2: {
	// 	type: 'string',
	// 	default: '#ffffff',
	// },
	// size2: {
	// 	type: 'string',
	// 	default: 'normal',
	// },
	// design2: {
	// 	type: 'string',
	// 	default: 'basic',
	// },
	// icon2: {
	// 	type: 'string',
	// },

	// url3: {
	// 	type: 'string',
	// 	source: 'attribute',
	// 	selector: 'div:nth-of-type(3) .ugb-button',
	// 	attribute: 'href',
	// 	default: '',
	// },
	// newTab3: {
	// 	type: 'boolean',
	// 	source: 'attribute',
	// 	selector: 'div:nth-of-type(3) .ugb-button',
	// 	attribute: 'target',
	// 	default: false,
	// },
	// text3: {
	// 	source: 'html',
	// 	selector: 'div:nth-of-type(3) .ugb-button span',
	// 	default: __( 'Button text' ),
	// },
	// color3: {
	// 	type: 'string',
	// },
	// textColor3: {
	// 	type: 'string',
	// 	default: '#ffffff',
	// },
	// size3: {
	// 	type: 'string',
	// 	default: 'normal',
	// },
	// design3: {
	// 	type: 'string',
	// 	default: 'basic',
	// },
	// icon3: {
	// 	type: 'string',
	// },

	// // Custom CSS attributes.
	// customCSSUniqueID: {
	// 	type: 'string',
	// 	default: '',
	// },
	// customCSS: {
	// 	type: 'string',
	// 	default: '',
	// },
	// customCSSCompiled: {
	// 	type: 'string',
	// 	default: '',
	// },
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
addFilter( 'stackable.setAttributes', 'stackable/button/contentAlign', ( attributes, blockProps ) => {
	if ( typeof attributes.contentAlign === 'undefined' ) {
		return attributes
	}

	if ( ! [ '', 'basic' ].includes( blockProps.attributes.design ) ) {
		attributes.design = 'basic'
	}

	return attributes
} )

// If the design was changed, but the design doesn't support alignment, reset the alignment attribute.
addFilter( 'stackable.setAttributes', 'stackable/button/design', attributes => {
	if ( typeof attributes.design === 'undefined' ) {
		return attributes
	}

	if ( ! [ '', 'basic' ].includes( attributes.design ) ) {
		attributes.contentAlign = ''
	}

	return attributes
} )
