export const createIconAttributes = ( options = {} ) => {
	const {
		defaultIcon = '',
	} = options

	return {
		icon: {
			type: 'string',
			default: defaultIcon,
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
		shaped: {
			type: 'boolean',
			default: false,
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
		shapeOutline: {
			type: 'boolean',
			default: false,
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
}

export const addAttributes = ( attrObject, options = {} ) => {
	const iconAttributes = createIconAttributes( options )

	attrObject.add( {
		attributes: iconAttributes,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
