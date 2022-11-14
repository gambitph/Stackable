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
			columnSpacing: {
				stkResponsive: true,
				stkUnits: 'px',
				type: 'number',
				default: '',
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
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
