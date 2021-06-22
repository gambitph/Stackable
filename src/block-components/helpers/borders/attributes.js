export const borderAttributes = {
	borderType: {
		type: 'string',
		default: '',
	},
	borderColor: {
		type: 'string',
		default: '',
	},
	borderWidthTop: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	borderWidthRight: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	borderWidthBottom: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	borderWidthLeft: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	borderRadius: {
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
