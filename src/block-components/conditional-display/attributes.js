export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			displayCondition: {
				type: 'object',
				default: {},
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
