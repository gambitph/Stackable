export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			columnSpacing: {
				stkResponsive: true,
				stkUnits: 'px',
				type: 'number',
				default: '',
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
			columnWrapDesktop: { // Only applies to desktops
				type: 'boolean',
				default: false,
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
