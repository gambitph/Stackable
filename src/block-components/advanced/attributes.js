export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			htmlTag: {
				type: 'string',
				default: '',
			},
			opacity: {
				stkResponsive: true,
				type: 'number',
				default: '',
			},
			zIndex: {
				stkResponsive: true,
				type: 'number',
				default: '',
			},
			overflow: {
				stkResponsive: true,
				type: 'string',
				default: '',
			},

			clear: {
				type: 'string',
				default: '',
			},
			position: {
				stkResponsive: true,
				stkUnits: 'px',
				type: 'string',
				default: '',
			},
			positionTop: {
				stkResponsive: true,
				type: 'number',
				default: '',
			},
			positionRight: {
				stkResponsive: true,
				type: 'number',
				default: '',
			},
			positionBottom: {
				stkResponsive: true,
				type: 'number',
				default: '',
			},
			positionLeft: {
				stkResponsive: true,
				type: 'number',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
