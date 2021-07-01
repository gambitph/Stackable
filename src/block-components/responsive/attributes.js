export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			hideDesktop: {
				type: 'boolean',
				default: false,
			},
			hideTablet: {
				type: 'boolean',
				default: false,
			},
			hideMobile: {
				type: 'boolean',
				default: false,
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
