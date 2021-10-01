export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			effectType: {
				type: 'string',
				default: '',
			},
			effectEntrance: {
				type: 'string',
				stkResponsive: 'all',
				default: '',
			},
			effectEntranceDuration: {
				type: 'string',
				default: '',
			},
			effectEntranceDelay: {
				type: 'number',
				default: '',
			},
			effectAnimationSmooth: {
				type: 'boolean',
				default: '',
			},
			effectAnimation3d: {
				type: 'boolean',
				default: '',
			},
			effectAnimationPerspective: {
				type: 'number',
				default: '',
			},
			effectAnimationOut: {
				type: 'object',
				default: {},
			},
			effectAnimationIn: {
				type: 'object',
				default: {},
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
