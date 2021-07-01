export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			isFirstBlock: {
				type: 'boolean',
				default: false,
			},
			isLastBlock: {
				type: 'boolean',
				default: false,
			},
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
