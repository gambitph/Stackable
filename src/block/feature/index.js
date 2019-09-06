/**
 * BLOCK: Feature Block.
 */

/**
 * Internal dependencies
 */
import deprecated from './deprecated'

/**
 * External dependencies
 */
import {
	descriptionPlaceholder, createImageAttributes, createBackgroundAttributes, createTypographyAttributes, createButtonAttributes, createResponsiveAttributes, createAllCombinationAttributes,
} from '~stackable/util'
import edit from './edit'
import { FeatureIcon } from '~stackable/icons'
import save from './save'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { disabledBlocks, i18n } from 'stackable'
import { applyFilters } from '@wordpress/hooks'

export const schema = {
	design: {
		type: 'string',
		default: 'plain',
	},
	...createResponsiveAttributes( 'imageColumn%sWidth', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( 'container%sWidth', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( 'container%sOffset', {
		type: 'number',
		default: '',
	} ),
	invert: {
		type: 'boolean',
		default: false,
	},
	borderRadius: {
		type: 'number',
		default: 12,
	},
	shadow: {
		type: 'number',
		default: 3,
	},

	// Background.
	...createBackgroundAttributes( 'column%s' ),

	// Image.
	...createImageAttributes( 'image%s' ),
	imageUrl: {
		type: 'string',
		default: '',
	},
	imageShapeStretch: {
		type: 'boolean',
		default: true,
	},
	...createResponsiveAttributes( 'imageBackground%sHeight', {
		type: 'number',
		default: '',
	} ),

	// Title.
	title: {
		source: 'html',
		selector: '.ugb-feature__title',
		default: __( 'Title for This Block', i18n ),
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
		selector: '.ugb-feature__description',
		default: descriptionPlaceholder( 'medium' ),
	},
	showDescription: {
		type: 'boolean',
		default: true,
	},
	...createTypographyAttributes( 'description%s' ),
	descriptionColor: {
		type: 'string',
		defualt: '',
	},

	// Button.
	showButton: {
		type: 'boolean',
		default: true,
	},
	...createButtonAttributes( 'button%s', { selector: '.ugb-button' } ),

	// Spacing.
	...createResponsiveAttributes( 'title%sBottomMargin', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( 'description%sBottomMargin', {
		type: 'number',
		default: '',
	} ),

	// Alignments.
	...createAllCombinationAttributes(
		'%s%sAlign', {
			type: 'string',
			default: '',
		},
		[ 'Title', 'Description', 'Button' ],
		[ '', 'Tablet', 'Mobile' ]
	),

	// imageSize: {
	// 	type: 'number',
	// 	default: 400,
	// },
	// imageId: {
	// 	type: 'number',
	// },
	// imageUrl: {
	// 	type: 'url',
	// },
	// imageAlt: {
	// 	type: 'string',
	// },
	// title: {
	// 	source: 'html',
	// 	selector: 'h2',
	// 	default: __( 'Title for This Block', i18n ),
	// },
	// description: {
	// 	source: 'html',
	// 	selector: 'p',
	// 	default: descriptionPlaceholder( 'medium' ),
	// },
	// buttonURL: {
	// 	type: 'string',
	// 	source: 'attribute',
	// 	selector: '.ugb-button',
	// 	attribute: 'href',
	// 	default: '',
	// },
	// buttonNewTab: {
	// 	type: 'boolean',
	// 	source: 'attribute',
	// 	selector: '.ugb-button',
	// 	attribute: 'target',
	// 	default: false,
	// },
	// buttonText: {
	// 	source: 'html',
	// 	selector: '.ugb-button span',
	// 	default: __( 'Button text', i18n ),
	// },
	// buttonColor: {
	// 	type: 'string',
	// },
	// buttonTextColor: {
	// 	type: 'string',
	// },
	// buttonSize: {
	// 	type: 'string',
	// 	default: 'normal',
	// },
	// buttonBorderRadius: {
	// 	type: 'number',
	// 	default: 4,
	// },
	// buttonDesign: {
	// 	type: 'string',
	// 	default: 'basic',
	// },
	// buttonIcon: {
	// 	type: 'string',
	// },
	// backgroundColorType: {
	// 	type: 'string',
	// 	default: '',
	// },
	// backgroundColor: {
	// 	type: 'string',
	// },
	// backgroundColor2: {
	// 	type: 'string',
	// 	default: '',
	// },
	// backgroundColorDirection: {
	// 	type: 'number',
	// 	default: 0,
	// },
	// backgroundType: {
	// 	type: 'string',
	// 	default: '',
	// },
	// backgroundImageID: {
	// 	type: 'number',
	// },
	// backgroundImageURL: {
	// 	type: 'string',
	// },
	// backgroundOpacity: {
	// 	type: 'number',
	// 	default: 5,
	// },
	// fixedBackground: {
	// 	type: 'boolean',
	// 	default: false,
	// },
	// contentWidth: {
	// 	type: 'boolean',
	// 	default: false,
	// },
	// align: {
	// 	type: 'string',
	// },
	hoverEffect: {
		type: 'string',
		default: '',
	},
}

export const name = 'ugb/feature'

export const settings = {
	title: __( 'Feature', i18n ),
	description: __( 'Display a product feature or a service in a large area.', i18n ),
	icon: FeatureIcon,
	category: 'stackable',
	keywords: [
		__( 'Feature', i18n ),
		__( 'Stackable', i18n ),
	],
	supports: {
		align: [ 'center', 'wide', 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	deprecated,
	edit,
	save,

	attributes: schema,

	// Stackable modules.
	modules: {
		'advanced-block-spacing': true,
		// 'advanced-column-spacing': {
		// 	columnGap: false,
		// },
		'advanced-responsive': true,
		'block-background': true,
		'block-separators': true,
		// 'block-title': true,
		'content-align': true,
		'custom-css': {
			default: applyFilters( 'stackable.feature.custom-css.default', '' ),
		},
	},
}

export const showOptions = blockProps => {
	const {
		design = 'basic',
		showTitle = true,
		showDescription = true,
		showButton = true,
	} = blockProps.attributes

	// const borderRadius = ( ! showBlockBackground && align !== 'full' ) || ( showBlockBackground && blockInnerWidth !== 'full' )

	return applyFilters( 'stackable.feature.show', {
		imageColumnWidth: [ 'basic', 'plain', 'half' ].includes( design ),
		containerWidth: design.match( /^overlap/ ),
		containerOffset: design.match( /^overlap(.*)?[2-5]$/ ),
		reverseHorizontally: ! design.match( /^overlap-?\w*[45]$/ ),
		borderRadius: design !== 'plain',
		columnBackground: design !== 'plain',
		featuredImageAsBackground: design.match( /^(overlap-bg|half)/ ),
		titleSpacing: showTitle && ( showDescription || showButton ),
		descriptionSpacing: showDescription && showButton,
	}, blockProps )
}
