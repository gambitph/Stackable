export const sizeAttributes = {
	height: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	heightUnit: {
		stkResponsive: true,
		type: 'string',
		default: 'px',
	},
	width: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	widthUnit: {
		stkResponsive: true,
		type: 'string',
		default: 'px',
	},

	verticalAlign: {
		stkResponsive: true,
		type: 'string',
		default: '',
	},
	horizontalAlign: {
		stkResponsive: true,
		type: 'string',
		default: '',
	},

	marginTop: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	marginRight: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	marginBottom: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	marginLeft: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	marginUnit: {
		stkResponsive: true,
		type: 'string',
		default: 'px',
	},

	paddingTop: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	paddingRight: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	paddingBottom: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	paddingLeft: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	paddingUnit: {
		stkResponsive: true,
		type: 'string',
		default: 'px',
	},
}

export const addSizeAttributes = ( attrObject, attrNameTemplate = '%s' ) => {
	attrObject.add( {
		attributes: sizeAttributes,
		attrNameTemplate,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
