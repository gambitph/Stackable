/**
 * BLOCK: Image Box Block.
 */

import { disabledBlocks, i18n } from 'stackable'
import { __ } from '@wordpress/i18n'
import { ImageBoxIcon } from '@stackable/icons'

export const schema = {
	align: {
		type: 'string',
	},
	columns: {
		type: 'number',
		default: 3,
	},
	titleColor: {
		type: 'string',
		default: '#ffffff',
	},
	subtitleColor: {
		type: 'string',
		default: '#ffffff',
	},
	overlayColor: {
		type: 'string',
	},
	width: {
		type: 'number',
		default: 400,
	},
	height: {
		type: 'number',
		default: 400,
	},
	verticalAlign: {
		type: 'string',
		default: 'center',
	},
	horizontalAlign: {
		type: 'string',
		default: 'center',
	},
	design: {
		type: 'string',
		default: 'basic',
	},
	borderRadius: {
		type: 'number',
		default: 12,
	},
	shadow: {
		type: 'number',
		default: 3,
	},
	overlayOpacity: {
		type: 'number',
		default: 7,
	},
	imageHoverEffect: {
		type: 'string',
		default: '',
	},
	arrow: {
		type: 'string',
		default: '',
	},
	hoverEffect: {
		type: 'string',
		default: '',
	},

	// Keep the old attributes. Gutenberg issue https://github.com/WordPress/gutenberg/issues/10406
	full: {
		type: 'boolean',
	},
	title: {
		type: 'string',
	},
	subtitle: {
		type: 'string',
	},
	id: {
		type: 'number',
	},
	url: {
		type: 'string',
	},
	href: {
		type: 'string',
	},

	// Custom CSS attributes.
	customCSSUniqueID: {
		type: 'string',
		default: '',
	},
	customCSS: {
		type: 'string',
		default: '',
	},
	customCSSCompiled: {
		type: 'string',
		default: '',
	},
}

// Wrap in curly or else statement will merge with the previous one and will error out.
{ [ 1, 2, 3, 4 ].forEach( i => {
	schema[ `title${ i }` ] = {
		source: 'html',
		selector: `.ugb-image-box__item:nth-of-type(${ i }) .ugb-image-box__title`,
		default: __( 'Title', i18n ),
	}
	schema[ `description${ i }` ] = {
		source: 'html',
		selector: `.ugb-image-box__item:nth-of-type(${ i }) .ugb-image-box__description`,
		default: __( 'Description', i18n ),
	}
	schema[ `imageURL${ i }` ] = {
		type: 'string',
	}
	schema[ `imageID${ i }` ] = {
		type: 'number',
	}
	schema[ `link${ i }` ] = {
		type: 'string',
		source: 'attribute',
		selector: `.ugb-image-box__item:nth-of-type(${ i }) .ugb-image-box__overlay`,
		attribute: 'href',
		default: '',
	}
	schema[ `newTab${ i }` ] = {
		type: 'boolean',
		source: 'attribute',
		selector: `.ugb-image-box__item:nth-of-type(${ i }) .ugb-image-box__overlay`,
		attribute: 'target',
		default: false,
	}
} ) }

export const name = 'ugb/image-box'

export const settings = {
	title: __( 'Image Box', i18n ),
	description: __( 'Display an image that shows more information when hovered on. Can be used as a fancy link to other pages.', i18n ),
	icon: ImageBoxIcon,
	category: 'stackable',
	keywords: [
		__( 'Image Box', i18n ),
		__( 'Stackable', i18n ),
	],
	supports: {
		align: [ 'center', 'wide', 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},
	attributes: schema,
}
