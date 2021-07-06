export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			customAttributes: {
				type: 'array',
				default: [],
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
