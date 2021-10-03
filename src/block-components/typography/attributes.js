const typographyAttributes = {
	fontSize: {
		stkResponsive: true,
		type: 'number',
		default: '',
		stkUnits: 'px',
	},
	lineHeight: {
		stkResponsive: true,
		type: 'number',
		default: '',
		stkUnits: 'em',
	},
	fontFamily: {
		type: 'string',
		default: '',
	},
	fontStyle: {
		type: 'string',
		default: '',
	},
	fontWeight: {
		type: 'string',
		default: '',
	},
	textTransform: {
		type: 'string',
		default: '',
	},
	letterSpacing: {
		type: 'number',
		default: '',
	},
	textRemoveTextMargins: {
		type: 'boolean',
		default: '',
	},
	textColorType: {
		type: 'string',
		default: '',
	},
	textColorClass: {
		type: 'string',
		default: '',
	},
	textColor1: {
		type: 'string',
		stkHover: true,
		default: '',
	},
	textColor2: {
		type: 'string',
		default: '',
	},
	textAlign: {
		type: 'string',
		default: '',
	},
	textGradientDirection: {
		type: 'number',
		default: '',
	},
	hasP: {
		type: 'boolean',
		default: false,
	},
	show: {
		type: 'booleam',
		default: true,
	},
}

export const addAttributes = ( attrObject, selector = '.stk-content', options = {} ) => {
	const {
		hasTextTag = true,
		hasTextContent = true,
		defaultTextTag = 'p',
		attrNameTemplate = '%s',
		multiline,
		defaultText = '',
		multilineWrapperTags: __unstableMultilineWrapperTags,
	} = options

	attrObject.add( {
		attributes: {
			...typographyAttributes,
			...( hasTextContent ? {
				showText: {
					type: 'boolean',
					default: true,
				},
				text: {
					source: 'html',
					selector,
					multiline,
					default: defaultText,
					__unstableMultilineWrapperTags,
				},
			} : {} ),
			...( hasTextTag ? {
				textTag: {
					type: 'string',
					default: defaultTextTag,
				},
			} : {} ),
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
		attrNameTemplate,
	} )
}
