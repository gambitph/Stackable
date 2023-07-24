export const addAttributes = attrObject => {
	// Assume that the block uses the BlockDiv Block Component and has a
	// uniqueId attribute
	attrObject.add( {
		attributes: {
			// We need to add this in because a deprecated wide/full width block
			// will lose its align attribute (Gutenberg issue)
			// @see https://github.com/WordPress/gutenberg/issues/50281
			align: {
				type: 'string',
			},
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

	attrObject.add( {
		attributes: {
			containerWidth: {
				stkResponsive: true,
				type: 'number',
				default: '',
			},
			containerHorizontalAlign: {
				stkResponsive: true,
				type: 'string',
				default: '',
			},
		},
		versionAdded: '3.10.1',
		versionDeprecated: '',
	} )
}
