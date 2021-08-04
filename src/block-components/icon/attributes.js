const iconAttributes = {
	icon: {
		type: 'string',
		default: '',
	},
	iconColorType: {
		type: 'string',
		default: '',
	},
	iconColor1: {
		stkHover: true,
		type: 'string',
		default: '',
	},
	iconColor2: {
		type: 'string',
		default: '',
	},
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
	shapeColor: {
		stkHover: true,
		type: 'string',
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
