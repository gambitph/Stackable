/**
 * BLOCK: CTA Block.
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */
import {
	createAllCombinationAttributes,
	createBackgroundAttributes,
	createButtonAttributes,
	createResponsiveAttributes,
	createTypographyAttributes,
	descriptionPlaceholder,
} from '@stackable/util'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { CTAIcon } from '@stackable/icons'
import deprecated from './deprecated'
import { disabledBlocks } from 'stackable'
import edit from './edit'
import save from './save'

const schema = {
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

	// Title.
	title: {
		source: 'html',
		selector: 'h3, .ugb-cta__title',
		default: __( 'Title for This Block' ),
	},
	showTitle: {
		type: 'boolean',
		default: true,
	},
	titleTag: {
		type: 'string',
		defualt: '',
	},
	...createTypographyAttributes( 'title%s' ),
	titleColor: {
		type: 'string',
		default: '',
	},

	// Description.
	description: {
		source: 'html',
		selector: 'p, .ugb-cta__description',
		default: descriptionPlaceholder(),
	},
	showDescription: {
		type: 'boolean',
		default: true,
	},
	...createTypographyAttributes( 'description%s' ),
	descriptionColor: {
		type: 'string',
		default: '',
	},

	// Button.
	showButton: {
		type: 'boolean',
		default: true,
	},
	...createButtonAttributes( 'button%s', { selector: '.ugb-button' } ),

	...createBackgroundAttributes( 'column%s' ),

	hoverEffect: {
		type: 'string',
		default: '',
	},

	...createResponsiveAttributes( 'title%sBottomMargin', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( 'description%sBottomMargin', {
		type: 'number',
		default: '',
	} ),

	...createAllCombinationAttributes(
		'%s%sAlign', {
			type: 'string',
			default: '',
		},
		[ 'Title', 'Description', 'Button' ],
		[ '', 'Tablet', 'Mobile' ]
	),

	// TODO: Not anymore supported?
	contentWidth: {
		type: 'boolean',
		default: false,
	},
}

export const name = 'ugb/cta'

export const settings = {
	title: __( 'Call to Action' ),
	description: __( 'A small section you can use to call the attention of your visitors. Great for calling attention to your products or deals.' ),
	icon: CTAIcon,
	category: 'stackable',
	keywords: [
		__( 'Call to Action' ),
		__( 'Stackable' ),
		__( 'CTA' ),
	],
	attributes: schema,
	supports: {
		align: [ 'center', 'wide', 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	deprecated,
	edit,
	save,

	// Stackable modules.
	modules: {
		'advanced-block-spacing': true,
		'advanced-column-spacing': {
			columnGap: false,
		},
		'advanced-responsive': true,
		'block-background': true,
		'block-separators': true,
		// 'block-title': true,
		'content-align': true,
		'custom-css': {
			default: applyFilters( 'stackable.cta.custom-css.default', '' ),
		},
	},

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/call-to-action-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}

export const showOptions = blockProps => {
	const {
		design = 'basic',
		showBlockBackground = false,
		blockInnerWidth = '',
		align = '',
	} = blockProps.attributes

	// Border radius options aren't available in non-plain & full width.
	let borderRadius = true
	if ( design === 'plain' ) {
		borderRadius = false
	} else if ( align === 'full' ) {
		if ( ! showBlockBackground ) {
			borderRadius = false
		} else if ( blockInnerWidth === 'full' ) {
			borderRadius = false
		}
	}

	return applyFilters( 'stackable.cta.show', {
		columnBackground: design !== 'plain',
		borderRadius,
		titleSpacing: true,
		descriptionSpacing: true,
	}, blockProps )
}
