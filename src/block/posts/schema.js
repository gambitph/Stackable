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
} from '~stackable/block-components'
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'

const postsAttributes = {
	// General.
	columns: {
		type: 'number',
		default: '',
		stkResponsive: true,
	},
	columnGap: {
		type: 'number',
		default: '',
		stkResponsive: true,
	},
	contentOrder: {
		type: 'array',
		default: '',
	},
	rowGap: {
		type: 'number',
		default: '',
		stkResponsive: true,
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
	postType: {
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
	postInclude: {
		type: 'string',
		default: '',
	},
	readmoreText: {
		type: 'string',
		default: '',
	},

	// Misc.
	showTitle: {
		type: 'boolean',
		default: '',
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

	attrObject.addDefaultValues( {
		attributes: {
			showTitle: true,
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
