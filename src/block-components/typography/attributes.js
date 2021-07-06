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
	showTopLine: {
		type: 'boolean',
		default: '',
	},
	topLineWidth: {
		type: 'number',
		default: '',
		stkUnits: 'px',
		stkHover: true,
	},
	topLineHeight: {
		type: 'number',
		default: '',
	},
	topLineColor: {
		type: 'string',
		default: '',
		stkHover: true,
	},
	topLineMargin: {
		type: 'number',
		default: '',
		stkResponsive: true,
	},
	topLineAlign: {
		type: 'string',
		default: '',
		stkResponsive: true,
	},
	showBottomLine: {
		type: 'boolean',
		default: '',
	},
	bottomLineWidth: {
		type: 'number',
		default: '',
		stkUnits: 'px',
		stkHover: true,
	},
	bottomLineHeight: {
		type: 'number',
		default: '',
	},
	bottomLineColor: {
		type: 'string',
		default: '',
		stkHover: true,
	},
	bottomLineMargin: {
		type: 'number',
		default: '',
		stkResponsive: true,
	},
	bottomLineAlign: {
		type: 'string',
		default: '',
		stkResponsive: true,
	},
}

export const addAttributes = ( attrObject, selector = '.stk-content', options = {} ) => {
	const {
		hasTextTag = true,
		hasTextContent = true,
		hasTopBottomLine = false,
		hasColor = true,
		hasColumns = false,
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

	if ( ! hasColumns ) {
		attributesToExclude.push(
			'hasColumns'
		)
	}

	if ( ! hasTopBottomLine ) {
		attributesToExclude.push(
			'showTopLine',
			'topLineWidth',
			'topLineHeight',
			'topLineColor',
			'topLineAlign',
			'showBottomLine',
			'bottomLineWidth',
			'bottomLineHeight',
			'bottomLineColor',
			'bottomLineAlign',
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
