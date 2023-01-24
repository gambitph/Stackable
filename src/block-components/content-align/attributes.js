export const addAttributes = ( attrObject, options = {} ) => {
	const { columnFit = '' } = options
	attrObject.add( {
		attributes: {
			columnFit: {
				type: 'boolean',
				default: columnFit,
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
