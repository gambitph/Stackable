export const addAttributes = attrObject => {
	// Assume that the block uses the BlockDiv Block Component and has a
	// uniqueId attribute
	attrObject.add( {
		attributes: {
			contentAlign_: {
				type: 'string',
				default: '',
			},
			rowAlign_: {
				type: 'string',
				default: '',
			},
			columnAlign_: {
				type: 'string',
				default: '',
			},
			innerBlockOrientation: {
				type: 'string',
				default: '',
			},
			innerBlockVerticalAlign_: {
				type: 'string',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
