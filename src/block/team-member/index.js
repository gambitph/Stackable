/**
 * BLOCK: Team Member Block.
 */

/**
 * Internal dependencies
 */
import './design'
import deprecated from './deprecated'
import edit from './edit'
import save from './save'

/**
 * External dependencies
 */
import {
	descriptionPlaceholder,
	createSocialButtonAttributes,
	createAllCombinationAttributes,
	createBackgroundAttributes,
	createImageAttributes,
	createTypographyAttributes,
	createImageBackgroundAttributes,
	SOCIAL_SITES,
} from '~stackable/util'
import { TeamMemberIcon } from '~stackable/icons'
import { upperFirst } from 'lodash'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { disabledBlocks, i18n } from 'stackable'
import { addFilter, applyFilters } from '@wordpress/hooks'

export const schema = {
	design: {
		type: 'string',
		default: 'basic',
	},
	columns: {
		type: 'number',
		default: 2,
	},
	borderRadius: {
		type: 'number',
		default: '',
	},
	shadow: {
		type: 'number',
		default: '',
	},

	// Column.
	...createBackgroundAttributes( 'column%s' ),

	// Image.
	showImage: {
		type: 'boolean',
		default: true,
	},
	imageColorOnHover: {
		type: 'boolean',
		default: false,
	},
	...createImageAttributes( 'image%s', {
		exclude: [
			'Url',
			'Id',
			'Alt',
			'BlendMode',
		],
	} ),
	imageShape: {
		type: 'string',
		default: 'circle',
	},
	...createAllCombinationAttributes(
		'image%sId', {
			type: 'number',
			default: '',
		},
		[ '1', '2', '3' ]
	),
	...createAllCombinationAttributes(
		'image%sUrl', {
			type: 'string',
			default: '',
			// Some layouts can have the image as an image background. Need this to be a normal attribute and not from `src`.
			// source: 'attribute',
			// selector: '.ugb-team-member__item%d .ugb-team-member__image img',
			// attribute: 'src',
		},
		[ '1', '2', '3' ]
	),
	...createAllCombinationAttributes(
		'image%sAlt', {
			type: 'string',
			default: '',
			source: 'attribute',
			selector: '.ugb-team-member__item%d .ugb-team-member__image img',
			attribute: 'alt',
		},
		[ '1', '2', '3' ]
	),
	...createAllCombinationAttributes(
		'image%sShape', {
			type: 'string',
			default: '',
		},
		[ '1', '2', '3' ]
	),
	...createAllCombinationAttributes(
		'image%s%s', {
			type: 'boolean',
			default: false,
		},
		[ '1', '2', '3' ],
		[ 'ShapeFlipX', 'ShapeFlipY', 'ShapeStretch' ]
	),
	// Used by overlay, overlay-simple & half layouts.
	...createAllCombinationAttributes(
		'image%sBackground%s', {
			type: 'number',
			default: '',
		},
		[ '', 'Tablet', 'Mobile' ],
		[ 'Width', 'Height' ],
	),
	...createImageBackgroundAttributes( 'image%s' ),
	...createImageBackgroundAttributes( 'image1%s' ),
	...createImageBackgroundAttributes( 'image2%s' ),
	...createImageBackgroundAttributes( 'image3%s' ),

	// Name.
	showName: {
		type: 'boolean',
		default: true,
	},
	...createAllCombinationAttributes(
		'name%s', {
			type: 'string',
			source: 'html',
			selector: '.ugb-team-member__item%d .ugb-team-member__name',
			default: __( 'Name', i18n ),
		},
		[ '1', '2', '3' ]
	),
	nameTag: {
		type: 'string',
		defualt: '',
	},
	...createTypographyAttributes( 'name%s' ),
	nameColor: {
		type: 'string',
		default: '',
	},

	// Position.
	showPosition: {
		type: 'boolean',
		default: true,
	},
	...createAllCombinationAttributes(
		'position%s', {
			type: 'string',
			source: 'html',
			selector: '.ugb-team-member__item%d .ugb-team-member__position',
			default: __( 'Position', i18n ),
		},
		[ '1', '2', '3' ]
	),
	...createTypographyAttributes( 'position%s' ),
	positionColor: {
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
			source: 'html',
			selector: '.ugb-team-member__item%d .ugb-team-member__description',
			default: descriptionPlaceholder( 'medium' ),
		},
		[ '1', '2', '3' ]
	),
	...createTypographyAttributes( 'description%s' ),
	descriptionColor: {
		type: 'string',
		default: '',
	},

	// Social.
	showSocial: {
		type: 'boolean',
		default: true,
	},
	...createSocialButtonAttributes( 'social%s' ),
	socialUseSocialColors: {
		type: 'boolean',
		default: false,
	},
	...createSocialButtonAttributes( 'social1%s', {
		selector: '.ugb-team-member__item1 .ugb-button-%s',
		facebookDefault: '#',
		twitterDefault: '#',
		instagramDefault: '#',
		pinterestDefault: '#',
		linkedinDefault: '#',
		youtubeDefault: '#',
		emailDefault: 'mailto:my@email.com',
	} ),
	...createSocialButtonAttributes( 'social2%s', {
		selector: '.ugb-team-member__item2 .ugb-button-%s',
		facebookDefault: '#',
		twitterDefault: '#',
		instagramDefault: '#',
		pinterestDefault: '#',
		linkedinDefault: '#',
		youtubeDefault: '#',
		emailDefault: 'mailto:my@email.com',
	} ),
	...createSocialButtonAttributes( 'social3%s', {
		selector: '.ugb-team-member__item3 .ugb-button-%s',
		facebookDefault: '#',
		twitterDefault: '#',
		instagramDefault: '#',
		pinterestDefault: '#',
		linkedinDefault: '#',
		youtubeDefault: '#',
		emailDefault: 'mailto:my@email.com',
	} ),
	// Individual social button show attributes.
	...Object.keys( SOCIAL_SITES ).reduce( ( propsToPass, socialId ) => {
		return {
			...propsToPass,
			[ `show${ upperFirst( socialId ) }` ]: {
				type: 'boolean',
				default: '',
			},
		}
	}, {} ),
	showFacebook: {
		type: 'boolean',
		default: true,
	},
	showTwitter: {
		type: 'boolean',
		default: true,
	},
	showInstagram: {
		type: 'boolean',
		default: true,
	},
	showPinterest: {
		type: 'boolean',
		default: false,
	},
	showLinkedin: {
		type: 'boolean',
		default: false,
	},
	showYoutube: {
		type: 'boolean',
		default: false,
	},
	showEmail: {
		type: 'boolean',
		default: true,
	},

	hoverEffect: {
		type: 'string',
		default: '',
	},

	// Alignment.
	...createAllCombinationAttributes(
		'%s%sAlign', {
			type: 'string',
			default: '',
		},
		[ 'Image', 'Name', 'Position', 'Description', 'Social' ],
		[ '', 'Tablet', 'Mobile' ]
	),

	// Spacing.
	...createAllCombinationAttributes(
		'%s%sBottomMargin', {
			type: 'number',
			default: '',
		},
		[ 'Image', 'Name', 'Position', 'Description', 'Social' ],
		[ '', 'Tablet', 'Mobile' ]
	),
	...createAllCombinationAttributes(
		'social%sGap', {
			type: 'number',
			default: '',
		},
		[ '', 'Tablet', 'Mobile' ]
	),

	// Advanced colors.
	...createAllCombinationAttributes(
		'Column%sBackgroundColor', {
			type: 'string',
			default: '',
		},
		[ '1', '2', '3' ]
	),
}

export const name = 'ugb/team-member'

export const settings = {
	title: __( 'Team Member', i18n ),
	description: __( 'Display members of your team or your office. Use multiple Team Member blocks if you have a large team.', i18n ),
	icon: TeamMemberIcon,
	category: 'stackable',
	keywords: [
		__( 'Team Member', i18n ),
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
		'advanced-general': true,
		'advanced-block-spacing': true,
		'advanced-column-spacing': true,
		'advanced-responsive': true,
		'block-background': true,
		'block-separators': true,
		'block-title': true,
		'content-align': true,
		'block-designs': true,
		'custom-css': {
			default: applyFilters( 'stackable.team-member.custom-css.default', '' ),
		},
	},
}

// Reset some attributes if some global attributes are set.
addFilter( 'stackable.team-member.setAttributes', 'stackable/team-member/imageShape', attributes => {
	if ( typeof attributes.imageShape !== 'undefined' ) {
		return {
			...attributes,
			image1Shape: '',
			image2Shape: '',
			image3Shape: '',
			image1ShapeFlipX: '',
			image1ShapeFlipY: '',
			image1ShapeStretch: '',
			image2ShapeFlipX: '',
			image2ShapeFlipY: '',
			image2ShapeStretch: '',
			image3ShapeFlipX: '',
			image3ShapeFlipY: '',
			image3ShapeStretch: '',
		}
	}

	if ( typeof attributes.imageShapeFlipX !== 'undefined' ) {
		return {
			...attributes,
			image1ShapeFlipX: '',
			image2ShapeFlipX: '',
			image3ShapeFlipX: '',
		}
	}

	if ( typeof attributes.imageShapeFlipY !== 'undefined' ) {
		return {
			...attributes,
			image1ShapeFlipY: '',
			image2ShapeFlipY: '',
			image3ShapeFlipY: '',
		}
	}

	if ( typeof attributes.imageShapeStretch !== 'undefined' ) {
		return {
			...attributes,
			image1ShapeStretch: '',
			image2ShapeStretch: '',
			image3ShapeStretch: '',
		}
	}

	if ( typeof attributes.columnBackgroundColor !== 'undefined' || typeof attributes.columnBackgroundColorType !== 'undefined' ) {
		return {
			...attributes,
			column1BackgroundColor: '',
			column2BackgroundColor: '',
			column3BackgroundColor: '',
		}
	}

	return attributes
} )

