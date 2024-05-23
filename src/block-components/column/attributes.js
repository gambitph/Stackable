export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			columnWidth: {
				stkResponsive: true,
				type: 'number',
				default: '',
			},
			// This is used to set the amount of column gap to compute for flex basis.
			columnAdjacentCount: {
				stkResponsive: true,
				type: 'number',
				default: '',
			},
			columnWrapDesktop: {
				type: 'boolean',
				default: false,
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
