/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv,
	Style,
	ConditionalDisplay,
	ContainerDiv,
	CustomAttributes,
	CustomCSS,
	EffectsAnimations,
	Image,
	Responsive,
	Typography,
	addFlexGapAttributes,
	Transform,
	ContentAlign,
} from '~stackable/block-components'
import { AttributeObject } from '~stackable/util'
import { version as VERSION, i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

const postsAttributes = {
	// General.
	stkQueryId: {
		type: 'string',
	},
	columns: {
		type: 'number',
		default: '',
		stkResponsive: true,
	},
	contentOrder: {
		type: 'array',
		default: '',
	},
	innerBlockContentWidth: {
		stkResponsive: true,
		stkUnits: 'px',
		type: 'number',
		default: '',
	},
	innerBlockAlign: {
		type: 'string',
		default: '',
	},
	// Query.
	numberOfItems: {
		type: 'number',
		default: 6,
	},
	order: {
		type: 'string',
		default: 'desc',
	},
	orderBy: {
		type: 'string',
		default: 'date',
	},
	type: {
		type: 'string',
		default: 'post',
	},
	taxonomyType: {
		type: 'string',
		default: 'category',
	},
	taxonomy: {
		type: 'string',
		default: '',
	},
	taxonomyFilterType: {
		type: 'string',
		default: '__in',
	},
	postOffset: {
		type: 'number',
		default: '',
	},
	postExclude: {
		type: 'string',
		default: '',
	},
	excludeCurrentPost: {
		type: 'boolean',
		default: '',
	},
	postInclude: {
		type: 'string',
		default: '',
	},
	readmoreText: {
		type: 'string',
		default: '',
	},

	// Spacing.
	imageSpacing: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	titleSpacing: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	categorySpacing: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	excerptSpacing: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	metaSpacing: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	readmoreSpacing: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},

	// Panels.
	titleShow: {
		type: 'boolean',
		default: true,
	},
	categoryShow: {
		type: 'boolean',
		default: true,
	},
	excerptShow: {
		type: 'boolean',
		default: true,
	},
	metaShow: {
		type: 'boolean',
		default: true,
	},
	readmoreShow: {
		type: 'boolean',
		default: true,
	},

	// Misc.
	authorShow: {
		type: 'boolean',
		default: '',
	},
	dateShow: {
		type: 'boolean',
		default: '',
	},
	commentsShow: {
		type: 'boolean',
		default: '',
	},
	excerptLength: {
		type: 'number',
		default: '',
	},
	metaSeparator: {
		type: 'string',
		default: '',
	},

	// Addition Typography Options.
	titleHoverStateInContainer: {
		type: 'boolean',
		default: '',
	},
	categoryHoverStateInContainer: {
		type: 'boolean',
		default: '',
	},
	categoryHighlighted: {
		type: 'boolean',
		default: '',
	},
	categoryHighlightColor: {
		stkHover: true,
		type: 'string',
		default: '',
	},
	excerptHoverStateInContainer: {
		type: 'boolean',
		default: '',
	},
	metaHoverStateInContainer: {
		type: 'boolean',
		default: '',
	},
	readmoreHoverStateInContainer: {
		type: 'boolean',
		default: '',
	},
	imageHoverStateInContainer: {
		type: 'boolean',
		default: '',
	},
	imageHasLink: {
		type: 'boolean',
		default: true,
	},
}

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()

	BlockDiv.addAttributes( attrObject )
	Style.addAttributes( attrObject )
	ContainerDiv.addAttributes( attrObject )
	Image.addAttributes( attrObject, { imageWidthUnitDefault: 'px' } )
	Alignment.addAttributes( attrObject )
	Advanced.addAttributes( attrObject )
	EffectsAnimations.addAttributes( attrObject )
	CustomAttributes.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	ConditionalDisplay.addAttributes( attrObject )
	Typography.addAttributes( attrObject, 'stk-block-posts__title', {
		hasTextContent: false,
		attrNameTemplate: 'title%s',
	} )
	Typography.addAttributes( attrObject, 'stk-block-posts__category', {
		hasTextTag: false,
		hasTextContent: false,
		attrNameTemplate: 'category%s',
	} )
	Typography.addAttributes( attrObject, 'stk-block-posts__excerpt', {
		hasTextTag: false,
		hasTextContent: false,
		attrNameTemplate: 'excerpt%s',
	} )
	Typography.addAttributes( attrObject, 'stk-block-posts__meta', {
		hasTextTag: false,
		hasTextContent: false,
		attrNameTemplate: 'meta%s',
	} )
	Typography.addAttributes( attrObject, 'stk-block-posts__readmore', {
		hasTextTag: false,
		hasTextContent: false,
		attrNameTemplate: 'readmore%s',
	} )
	Transform.addAttributes( attrObject )
	ContentAlign.addAttributes( attrObject )

	attrObject.add( {
		attributes: {
			// This keeps track of the version of the block, just when we need
			// to force update the block with new attributes and the save markup
			// doesn't change.
			version: {
				type: 'number',
				source: 'attribute',
				attribute: 'data-v',
				default: undefined,
			},
			...postsAttributes,
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	addFlexGapAttributes( attrObject )

	attrObject.addDefaultValues( {
		attributes: {
			readmoreText: __( 'Continue Reading', i18n ),
			commentsShow: true,
			authorShow: true,
			dateShow: true,
			titleShow: true,
			titleTextTag: 'h3',
			postType: 'post',
			numberOfItems: 6,
			orderBy: 'date',
			order: 'desc',
			taxonomyType: 'category',
			taxonomy: '',
			taxonomyFilterType: '__in',
			contentOrder: [
				'category',
				'featured-image',
				'title',
				'meta',
				'excerpt',
				'readmore',
			],
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	attrObject.addDefaultValues( {
		attributes: {
			version: 2,
		},
		versionAdded: '3.8.0',
		versionDeprecated: '',
	} )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
