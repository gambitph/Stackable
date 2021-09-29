export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			columnFit: {
				type: 'boolean',
				default: '',
			},
			columnFitAlign: {
				type: 'string',
				default: '',
				stkResponsive: true,
			},
			columnGap: {
				type: 'number',
				default: '',
			},
			contentAlign: {
				type: 'string',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
