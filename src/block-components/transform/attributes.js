export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			transitionDuration: {
				type: 'number',
				default: '',
			},
			transitionFunction: {
				type: 'string',
				default: '',
			},
			transform: {
				type: 'string',
				stkHover: true,
				stkResponsive: true,
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
