export const DEFAULT_THICKNESS = 8
export const DEFAULT_PERCENT = 50

export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			progressPercent: {
				type: 'number',
				default: DEFAULT_PERCENT,
			},
			progressAnimate: {
				type: 'boolean',
				default: false,
			},
			progressDisplayPercent: {
				type: 'boolean',
				default: true,
			},
			progressAriaValueText: {
				type: 'string',
				default: '',
			},
			progressColor: {
				type: 'string',
				default: '#3498db',
			},
			progressBackgroundColor: {
				type: 'string',
				default: '#f0f0f0',
			},
			progressThickness: {
				type: 'number',
				default: DEFAULT_THICKNESS,
			},
			progressRounded: {
				type: 'boolean',
				default: false,
			},
		},
		versionAdded: '3.4.5',
		versionDeprecated: '',
	} )
}
