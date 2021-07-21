export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			htmlTag: {
				type: 'string',
				default: '',
			},
			opacity: {
				stkResponsive: true,
				stkHover: true,
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
				type: 'string',
				default: '',
			},
			positionNum: {
				stkResponsive: true,
				stkHover: true,
				type: 'object',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
