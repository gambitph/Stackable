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
				stkResponsive: true,
				type: 'number',
				default: '',
			},
			rowGap: {
				stkResponsive: true,
				type: 'number',
				default: '',
			},
			innerBlockContentAlign: {
				type: 'string',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
