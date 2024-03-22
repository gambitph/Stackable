import { deprecatedAddAttributes } from './deprecated'

export const backgroundAttributes = {
	backgroundColorType: {
		type: 'string',
		default: '',
	},
	backgroundColor: {
		stkHover: true,
		type: 'string',
		default: '',
	},
	backgroundMediaId: {
		stkResponsive: true,
		type: 'string',
		default: '',
	},
	backgroundMediaUrl: {
		stkResponsive: true,
		type: 'string',
		default: '',
	},
	backgroundMediaThumbnailId: {
		stkResponsive: true,
		type: 'string',
		default: '',
	},
	backgroundMediaThumbnailUrl: {
		stkResponsive: true,
		type: 'string',
		default: '',
	},
	backgroundGradientBlendMode: {
		type: 'string',
		default: '',
	},
	backgroundPosition: {
		stkResponsive: true,
		type: 'string',
		default: '',
	},
	backgroundRepeat: {
		stkResponsive: true,
		type: 'string',
		default: '',
	},
	backgroundSize: {
		stkResponsive: true,
		type: 'string',
		default: '',
	},
	backgroundImageBlendMode: {
		type: 'string',
		default: '',
	},
	backgroundTintStrength: {
		stkHover: true,
		type: 'number',
		default: '',
	},
	backgroundCustomSize: {
		stkResponsive: true,
		stkUnits: '%',
		type: 'number',
		default: '',
	},
	fixedBackground: {
		type: 'boolean',
		default: '',
	},
	backgroundMediaExternalUrl: {
		stkResponsive: true,
		type: 'string',
		default: '',
	},
}

export const addBackgroundAttributes = ( attrObject, attrNameTemplate = '%s' ) => {
	deprecatedAddAttributes( attrObject, attrNameTemplate )

	attrObject.add( {
		attributes: backgroundAttributes,
		attrNameTemplate,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}

