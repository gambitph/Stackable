export const borderAttributes = {
	borderType: {
		type: 'string',
		default: '',
	},
	borderColor: {
		stkHover: true,
		type: 'string',
		default: '',
	},
	borderWidth: {
		stkResponsive: true,
		stkHover: true,
		type: 'object',
	},
	borderRadius: {
		stkResponsive: true,
		stkHover: true,
		type: 'number',
		default: '',
	},
	shadow: {
		stkHover: true,
		type: 'string',
		default: '',
	},
}

export const addBorderAttributes = ( attrObject, attrNameTemplate = '%s' ) => {
	attrObject.add( {
		attributes: borderAttributes,
		attrNameTemplate,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
