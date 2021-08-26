/**
 * External dependencies
 */
import { range } from 'lodash'

const iconAttributes = {
	icon: {
		type: 'string',
		default: '',
	},
	icon2: { // Some parent blocks may have use for this second icon. By default this is rendered in the save output as a hidden SVG.
		type: 'string',
		default: '',
	},
	iconColorType: {
		type: 'string',
		default: '',
	},
	...( range( 1, 11 ).reduce( ( acc, curr ) => {
		return {
			...acc,
			[ `iconColor${ curr }` ]: {
				stkHover: true,
				type: 'string',
				default: '',
			},
			[ `iconOpacity{ curr }` ]: {
				stkHover: true,
				type: 'number',
				default: '',
			},
		}
	}, {} ) ),
	iconColorGradientDirection: {
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
	iconPosition: {
		type: 'string',
		default: '',
	},
	iconGap: {
		type: 'number',
		default: '',
	},
	shapeColorType: {
		type: 'string',
		default: '',
	},
	shapeColor1: {
		stkHover: true,
		type: 'string',
		default: '',
	},
	shapeColor2: {
		type: 'string',
		default: '',
	},
	shapeGradientDirection: {
		type: 'number',
		default: '',
	},
	shapeBorderRadius: {
		stkHover: true,
		type: 'number',
		default: '',
	},
	shapePadding: {
		type: 'number',
		default: '',
	},
	showBackgroundShape: {
		type: 'boolean',
		default: false,
	},
	backgroundShape: {
		type: 'string',
		default: '',
	},
	backgroundShapeColor: {
		stkHover: true,
		type: 'string',
		default: '',
	},
	backgroundShapeOpacity: {
		stkHover: true,
		type: 'number',
		default: '',
	},
	backgroundShapeSize: {
		type: 'number',
		default: '',
	},
	backgroundShapeOffsetHorizontal: {
		type: 'number',
		default: '',
	},
	backgroundShapeOffsetVertical: {
		type: 'number',
		default: '',
	},
	shapeOutlineColor: {
		stkHover: true,
		type: 'string',
		default: '',
	},
	iconSize: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	shapeOutlineWidth: {
		stkResponsive: true,
		type: 'object',
	},
}

export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: iconAttributes,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
