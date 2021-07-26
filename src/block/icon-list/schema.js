import {
	Advanced,
	BlockDiv,
	CustomAttributes,
	CustomCSS,
	EffectsAnimations,
	Responsive,
	Typography,
} from '~stackable/block-components'
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'
import { DEFAULT_SVG } from './util'

export const iconListAttributes = {
	// Columns.
	columns: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	columnGap: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	ordered: {
		type: 'boolean',
		default: false,
	},

	// Icon.
	icon: {
		type: 'string',
		default: DEFAULT_SVG,
	},
	iconColor: {
		type: 'string',
		default: '',
		stkHover: true,
	},
	icons: {
		type: 'array',
		default: [],
	},
	iconSize: {
		stkHover: true,
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	iconOpacity: {
		stkHover: true,
		type: 'number',
		default: '',
	},
	iconRotation: {
		stkHover: true,
		type: 'number',
		default: '',
	},
}

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()

	Advanced.addAttributes( attrObject )
	BlockDiv.addAttributes( attrObject )
	CustomAttributes.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	EffectsAnimations.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	Typography.addAttributes( attrObject, 'ul,ol', {
		hasTextTag: false,
		multiline: 'li',
		multilineWrapperTags: [ 'ol', 'ul' ],
	} )

	attrObject.add( {
		attributes: iconListAttributes,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
