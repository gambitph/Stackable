export const flexGapAttributes = {
	columnGap: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	rowGap: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
}

export const addFlexGapAttributes = ( attrObject, attrNameTemplate = '%s' ) => {
	attrObject.add( {
		attributes: flexGapAttributes,
		attrNameTemplate,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
