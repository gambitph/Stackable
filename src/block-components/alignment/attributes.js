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
			columnJustify: {
				type: 'string',
				default: '',
				stkResponsive: true,
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
			// Flex.
			innerBlockJustify: {
				stkResponsive: true,
				type: 'string',
				default: '',
			},
			innerBlockAlign: {
				stkResponsive: true,
				type: 'string',
				default: '',
			},
			innerBlockWrap: {
				type: 'string',
				default: '',
			},
			innerBlockColumnGap: {
				stkResponsive: true,
				type: 'number',
				default: '',
			},
			innerBlockRowGap: {
				stkResponsive: true,
				type: 'number',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
