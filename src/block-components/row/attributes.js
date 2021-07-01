export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			numInnerBlocks: {
				type: 'number',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
