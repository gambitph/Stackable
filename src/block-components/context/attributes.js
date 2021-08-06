export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			usesContext: {
				type: 'boolean',
				default: '',
			},
			contextType: {
				type: 'string',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
