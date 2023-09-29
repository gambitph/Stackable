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
	backgroundColor2: {
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
	backgroundColorOpacity: {
		stkHover: true,
		type: 'number',
		default: '',
	},
	backgroundTintStrength: {
		stkHover: true,
		type: 'number',
		default: '',
	},
	backgroundGradientDirection: {
		type: 'number',
		default: '',
	},
	backgroundCustomSize: {
		stkResponsive: true,
		stkUnits: '%',
		type: 'number',
		default: '',
	},
	backgroundGradientLocation1: {
		type: 'number',
		default: '',
	},
	backgroundGradientLocation2: {
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
	attrObject.add( {
		attributes: backgroundAttributes,
		attrNameTemplate,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
