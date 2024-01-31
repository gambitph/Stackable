import {
	Advanced,
	BlockDiv,
	Style,
	CustomAttributes,
	CustomCSS,
	EffectsAnimations,
	Responsive,
	Typography,
	MarginBottom,
	Alignment,
	Transform,
	ConditionalDisplay,
} from '~stackable/block-components'
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'
import { DEFAULT_SVG } from '../util'

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
	indentation: {
		type: 'number',
		default: '',
	},
	listAlignment: {
		stkResponsive: true,
		type: 'string',
		default: '',
	},

	// Icon.
	icon: {
		type: 'string',
		default: DEFAULT_SVG,
	},
	markerColor: {
		type: 'string',
		default: '',
		stkHover: true,
	},
	icons: {
		type: 'object',
		default: {},
	},
	iconSize: {
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
		type: 'number',
		default: '',
	},

	// Numbers.
	listType: {
		type: 'string',
		default: '',
	},
	iconGap: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	rowGap: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
}

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()

	Alignment.addAttributes( attrObject )
	Advanced.addAttributes( attrObject )
	Transform.addAttributes( attrObject )
	BlockDiv.addAttributes( attrObject )
	Style.addAttributes( attrObject )
	CustomAttributes.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	EffectsAnimations.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	ConditionalDisplay.addAttributes( attrObject )
	Typography.addAttributes( attrObject, 'ul,ol', {
		hasTextTag: false,
		multiline: 'li',
		multilineWrapperTags: [ 'ol', 'ul' ],
	} )
	MarginBottom.addAttributes( attrObject )

	attrObject.add( {
		attributes: iconListAttributes,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	return attrObject.getMerged( version )
}
export default attributes( VERSION )
