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
			columnWidth_: {
				type: 'number',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
