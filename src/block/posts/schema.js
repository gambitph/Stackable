/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv,
	BlockLink,
	ConditionalDisplay,
	ContainerDiv,
	CustomAttributes,
	CustomCSS,
	EffectsAnimations,
	Image,
	Responsive,
	Typography,
	addFlexGapAttributes,
} from '~stackable/block-components'
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'

const postsAttributes = {
	// General.
	stkQueryId: {
		type: 'number',
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
	ContainerDiv.addAttributes( attrObject )
	Image.addAttributes( attrObject, { imageWidthUnitDefault: 'px' } )
	Alignment.addAttributes( attrObject )
	Advanced.addAttributes( attrObject )
	EffectsAnimations.addAttributes( attrObject )
	CustomAttributes.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	ConditionalDisplay.addAttributes( attrObject )
	BlockLink.addAttributes( attrObject )
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

	attrObject.add( {
		attributes: postsAttributes,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	addFlexGapAttributes( attrObject )

	attrObject.addDefaultValues( {
		attributes: {
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
			],
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
