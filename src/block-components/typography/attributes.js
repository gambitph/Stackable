import { convertResponsiveAttributes } from '~stackable/util'

export const typographyAttributes = {
	...convertResponsiveAttributes( {
		fontSize_: {
			type: 'number',
			default: '',
		},
		lineHeight_: {
			type: 'number',
			default: '',
		},
		fontSizeUnit_: {
			type: 'string',
			default: '',
		},
		lineHeightUnit_: {
			type: 'string',
			default: '',
		},
		textAlign_: {
			type: 'string',
			default: '',
		},
	} ),
	fontFamily: {
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
		type: 'string',
		default: '',
	},
	textColorType: {
		type: 'string',
		default: '',
	},
	textColor1: {
		type: 'string',
		default: '',
	},
	textColor2: {
		type: 'string',
		default: '',
	},
	textGradientDirection: {
		type: 'number',
		default: '',
	},
}

export const addAttributes = ( attrObject, selector = '.stk-content', options = {} ) => {
	const {
		enableTextTag = true,
		enableTextContent = true,
		defaultTextTag = 'p',
		attrNameTemplate = '%s',
	} = options
	attrObject.add( {
		attributes: {
			...typographyAttributes,
			...( enableTextContent ? {
				text: {
					source: 'html',
					selector,
					default: '',
				},
			} : {} ),
			...( enableTextTag ? {
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
