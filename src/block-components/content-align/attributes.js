export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			innerBlockContentAlign: {
				type: 'string',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
