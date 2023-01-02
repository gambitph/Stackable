export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			hasDivider: {
				type: 'boolean',
				default: false,
			},
			dividerType: {
				type: 'string',
				default: '',
			},
			dividerColor: {
				type: 'string',
				default: '',
			},
			dividerSize: {
				type: 'number',
				default: '',
			},
		},
		versionAdded: '3.6.0',
		versionDeprecated: '',
	} )
}
