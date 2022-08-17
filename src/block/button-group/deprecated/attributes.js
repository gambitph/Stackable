export const addDeprecatedAttributes = attrObject => {
	// We removed collapseOn in favor of buttonAlign
	attrObject.add( {
		attributes: {
			collapseOn: {
				type: 'string',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '3.4.3',
	} )
}
