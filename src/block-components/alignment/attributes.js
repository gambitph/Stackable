export const addAttributes = attrObject => {
	// Assume that the block uses the BlockDiv Block Component and has a
	// uniqueId attribute
	attrObject.add( {
		attributes: {
			contentAlign: {
				stkResponsive: true,
				type: 'string',
				default: '',
			},
			rowAlign: {
				stkResponsive: true,
				type: 'string',
				default: '',
			},
			columnAlign: {
				stkResponsive: true,
				type: 'string',
				default: '',
			},
			innerBlockOrientation: {
				type: 'string',
				default: '',
			},
			innerBlockVerticalAlign: {
				stkResponsive: true,
				type: 'string',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
