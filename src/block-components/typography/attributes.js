/**
 * External dependencies
 */
import { omit } from 'lodash'

const typographyAttributes = {
	fontSize: {
		stkResponsive: true,
		stkHover: true,
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
	textRemoveTextMargins: {
		type: 'boolean',
		default: '',
	},
	textColorType: {
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
	textGradientDirection: {
		type: 'number',
		default: '',
	},
	hasP: {
		type: 'boolean',
		default: false,
	},
}

export const addAttributes = ( attrObject, selector = '.stk-content', options = {} ) => {
	const {
		hasTextTag = true,
		hasTextContent = true,
		hasColor = true,
		defaultTextTag = 'p',
		attrNameTemplate = '%s',
	} = options

	const attributesToExclude = []
	if ( ! hasColor ) {
		attributesToExclude.push(
			'textColorType',
			'textColor1',
			'textColor2',
			'textGradientDirection',
		)
	}

	attrObject.add( {
		attributes: {
			...( attributesToExclude.length
				? omit( typographyAttributes, attributesToExclude )
				: typographyAttributes ),
			...( hasTextContent ? {
				showText: {
					type: 'boolean',
					default: true,
				},
				text: {
					source: 'html',
					selector,
					default: '',
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
