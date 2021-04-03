export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			htmlTag: {
				type: 'string',
				default: '',
			},
			opacity_: {
				type: 'number',
				default: '',
			},
			zIndex_: {
				type: 'number',
				default: '',
			},
			overflow_: {
				type: 'string',
				default: '',
			},

			clear: {
				type: 'string',
				default: '',
			},
			position_: {
				type: 'string',
				default: '',
			},
			positionTop_: {
				type: 'number',
				default: '',
			},
			positionRight_: {
				type: 'number',
				default: '',
			},
			positionBottom_: {
				type: 'number',
				default: '',
			},
			positionLeft_: {
				type: 'number',
				default: '',
			},
			positionUnit_: {
				type: 'string',
				default: 'px',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
