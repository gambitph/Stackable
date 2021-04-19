import { convertResponsiveAttributes } from '~stackable/util'

export const typographyAttributes = {
	...convertResponsiveAttributes( {
		fontSize: {
			type: 'number',
			default: '',
		},
		lineHeight: {
			type: 'number',
			default: '',
		},
		fontSizeUnit: {
			type: 'string',
			default: '',
		},
		lineHeightUnit: {
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
	textAlign: {
		type: 'string',
		default: '',
	},
}

export const addAttributes = ( attrObject, attrNameTemplate = '%s', selector = '.stk-content', options = {} ) => {
	const {
		enableTextTag = true,
		defaultTextTag = 'p',
	} = options
	attrObject.add( {
		attributes: {
			...typographyAttributes,
			text: {
				source: 'html',
				selector,
				default: '',
			},
			...( enableTextTag ? {
				textTag: {
					type: 'string',
					default: defaultTextTag,
				},
			} : {} ),
		},
		attrNameTemplate,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
