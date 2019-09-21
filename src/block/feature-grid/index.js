/**
 * BLOCK: Feature Grid Block.
 */

/**
 * Internal dependencies
 */
import deprecated from './deprecated'
import edit from './edit'
import save from './save'

/**
 * External dependencies
 */
import {
	descriptionPlaceholder,
	createBackgroundAttributes,
	createImageAttributes,
	createTypographyAttributes,
	createButtonAttributes,
	createAllCombinationAttributes,
} from '~stackable/util'
import { FeatureGridIcon } from '~stackable/icons'
import { disabledBlocks, i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters, addFilter } from '@wordpress/hooks'

export const schema = {
	design: {
		type: 'string',
		default: 'basic',
	},
	columns: {
		type: 'number',
		default: 3,
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
	showImage: {
		type: 'boolean',
		default: true,
	},
	...createImageAttributes( 'image%s', {
		exclude: [
			'Url',
			'Id',
			'Alt',
			'BlendMode',
		],
	} ),
	...createAllCombinationAttributes(
		'image%sId', {
			type: 'number',
			default: '',
		},
		[ '1', '2', '3', '4' ]
	),
	...createAllCombinationAttributes(
		'image%sUrl', {
			type: 'string',
			default: '',
			source: 'attribute',
			selector: '.ugb-feature-grid__item%d .ugb-feature-grid__image img',
			attribute: 'src',
		},
		[ '1', '2', '3', '4' ]
	),
	...createAllCombinationAttributes(
		'image%sAlt', {
			type: 'string',
			default: '',
			source: 'attribute',
			selector: '.ugb-feature-grid__item%d .ugb-feature-grid__image img',
			attribute: 'alt',
		},
		[ '1', '2', '3', '4' ]
	),
	...createAllCombinationAttributes(
		'image%sShape', {
			type: 'string',
			default: '',
		},
		[ '1', '2', '3', '4' ]
	),
	...createAllCombinationAttributes(
		'image%s%s', {
			type: 'boolean',
			default: false,
		},
		[ '1', '2', '3', '4' ],
		[ 'ShapeFlipX', 'ShapeFlipY', 'ShapeStretch' ]
	),

	// Title.
	showTitle: {
		type: 'boolean',
		default: true,
	},
	...createAllCombinationAttributes(
		'title%s', {
			type: 'string',
			default: __( 'Title', i18n ),
		},
		[ '1', '2', '3', '4' ]
	),
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
	showDescription: {
		type: 'boolean',
		default: true,
	},
	...createAllCombinationAttributes(
		'description%s', {
			type: 'string',
			default: descriptionPlaceholder( 'short' ),
		},
		[ '1', '2', '3', '4' ]
	),
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
	...createButtonAttributes( 'button%s', {
		exclude: [
			'Text',
			'Url',
			'NewWindow',
			'NoFollow',
		],
	} ),
	...createButtonAttributes( 'button1%s', {
		selector: '.ugb-feature-grid__item1 .ugb-button',
		include: [
			'Text',
			'Url',
			'NewWindow',
			'NoFollow',
			'Icon',
		],
	} ),
	...createButtonAttributes( 'button2%s', {
		selector: '.ugb-feature-grid__item2 .ugb-button',
		include: [
			'Text',
			'Url',
			'NewWindow',
			'NoFollow',
			'Icon',
		],
	} ),
	...createButtonAttributes( 'button3%s', {
		selector: '.ugb-feature-grid__item3 .ugb-button',
		include: [
			'Text',
			'Url',
			'NewWindow',
			'NoFollow',
			'Icon',
		],
	} ),
	...createButtonAttributes( 'button4%s', {
		selector: '.ugb-feature-grid__item4 .ugb-button',
		include: [
			'Text',
			'Url',
			'NewWindow',
			'NoFollow',
			'Icon',
		],
	} ),

	// Alignments.
	...createAllCombinationAttributes(
		'%s%sAlign', {
			type: 'string',
			default: '',
		},
		[ 'Image', 'Title', 'Description', 'Button' ],
		[ '', 'Tablet', 'Mobile' ]
	),

	// Spacing.
	...createAllCombinationAttributes(
		'%s%sBottomMargin', {
			type: 'number',
			default: '',
		},
		[ 'Image', 'Title', 'Description' ],
		[ '', 'Tablet', 'Mobile' ]
	),

	hoverEffect: {
		type: 'string',
		default: '',
	},

	// Advanced colors.
	...createAllCombinationAttributes(
		'Column%sBackgroundColor', {
			type: 'string',
			default: '',
		},
		[ '1', '2', '3', '4' ]
	),
	...createAllCombinationAttributes(
		'%s%sColor', {
			type: 'string',
			default: '',
		},
		[ 'Title', 'Description' ],
		[ '1', '2', '3', '4' ]
	),
}

export const name = 'ugb/feature-grid'

export const settings = {
	title: __( 'Feature Grid', i18n ),
	description: __( 'Display multiple product features or services. You can use Feature Grids one after another.', i18n ),
	icon: FeatureGridIcon,
	category: 'stackable',
	keywords: [
		__( 'Feature Grid', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	supports: {
		align: [ 'wide' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	deprecated,
	edit,
	save,

	// Stackable modules.
	modules: {
		'advanced-block-spacing': true,
		'advanced-column-spacing': true,
		'advanced-responsive': true,
		'block-background': true,
		'block-separators': true,
		'block-title': true,
		'content-align': true,
		'custom-css': {
			default: applyFilters( 'stackable.feature-grid.custom-css.default', '' ),
		},
	},
}

export const showOptions = blockProps => {
	const {
		design = 'basic',
		showImage = true,
		showTitle = true,
		showDescription = true,
		showButton1 = true,
		showButton2 = true,
		showButton3 = true,
		showButton4 = true,
	} = blockProps.attributes

	const showButton = showButton1 || showButton2 || showButton3 || showButton4
	return applyFilters( 'stackable.feature-grid.show', {
		columnBackground: design !== 'plain',
		imageSpacing: showImage && ( showTitle || showDescription || showButton ),
		titleSpacing: showTitle && ( showDescription || showButton ),
		descriptionSpacing: showDescription && showButton,
	}, blockProps )
}

// If the alignment was changed, but the design doesn't support it, go back to the basic design to allow the alignment change.
addFilter( 'stackable.feature-grid.setAttributes', 'stackable/feature-grid/imageShape', attributes => {
	if ( typeof attributes.imageShape !== 'undefined' ) {
		return {
			...attributes,
			image1Shape: '',
			image2Shape: '',
			image3Shape: '',
			image4Shape: '',
			image1ShapeFlipX: '',
			image1ShapeFlipY: '',
			image1ShapeStretch: '',
			image2ShapeFlipX: '',
			image2ShapeFlipY: '',
			image2ShapeStretch: '',
			image3ShapeFlipX: '',
			image3ShapeFlipY: '',
			image3ShapeStretch: '',
			image4ShapeFlipX: '',
			image4ShapeFlipY: '',
			image4ShapeStretch: '',
		}
	}

	if ( typeof attributes.imageShapeFlipX !== 'undefined' ) {
		return {
			...attributes,
			image1ShapeFlipX: '',
			image2ShapeFlipX: '',
			image3ShapeFlipX: '',
			image4ShapeFlipX: '',
		}
	}

	if ( typeof attributes.imageShapeFlipY !== 'undefined' ) {
		return {
			...attributes,
			image1ShapeFlipY: '',
			image2ShapeFlipY: '',
			image3ShapeFlipY: '',
			image4ShapeFlipY: '',
		}
	}

	if ( typeof attributes.imageShapeStretch !== 'undefined' ) {
		return {
			...attributes,
			image1ShapeStretch: '',
			image2ShapeStretch: '',
			image3ShapeStretch: '',
			image4ShapeStretch: '',
		}
	}

	return attributes
} )
