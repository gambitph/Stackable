export const sizeAttributes = {
	height: {
		stkResponsive: true,
		stkHover: true,
		stkUnits: 'px',
		type: 'number',
		default: '',
	},
	width: {
		stkResponsive: true,
		stkHover: true,
		stkUnits: 'px',
		type: 'number',
		default: '',
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

	margin: {
		stkResponsive: true,
		stkHover: true,
		stkUnits: 'px',
		type: 'object',
	},
	padding: {
		stkResponsive: true,
		stkHover: true,
		stkUnits: 'px',
		type: 'object',
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
