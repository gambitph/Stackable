export const DEFAULT_SIZE = 150
export const DEFAULT_HEIGHT = 32

export const DEFAULT_THICKNESS = 8
export const DEFAULT_PERCENT = 50

export const addAttributes = ( attrObject, isCircle = false ) => {
	attrObject.add( {
		attributes: {
			progressPercent: {
				type: 'string', // String so that we can support dynamic content.
				default: '',
			},
			progressSize: {
				type: 'number',
				default: '',
			},
			progressAnimate: {
				type: 'boolean',
				default: true,
			},
			progressAriaValueText: {
				type: 'string',
				default: '',
			},
			progressColorType: {
				type: 'string',
				default: '',
			},
			progressColor1: {
				type: 'string',
				default: '',
			},
			progressColor2: {
				type: 'string',
				default: '',
			},
			progressColorGradientDirection: {
				type: 'number',
				default: '',
			},
			progressBackgroundColor: {
				type: 'string',
				default: '',
			},
			...( isCircle ? {
				progressThickness: {
					type: 'number',
					default: '',
				},
				progressRounded: {
					type: 'boolean',
					default: '',
				},
			} : {
				progressBorderRadius: {
					type: 'number',
					default: '',
					stkUnits: 'px',
				},
				progressColorGradientLocation1: {
					type: 'number',
					default: '',
				},
				progressColorGradientLocation2: {
					type: 'number',
					default: '',
				},
				progressColorGradientBlendMode: {
					type: 'string',
					default: '',
				},
			} ),
		},
		versionAdded: '3.4.5',
		versionDeprecated: '',
	} )
}
