export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			columnWidth: {
				stkResponsive: true,
				type: 'number',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
