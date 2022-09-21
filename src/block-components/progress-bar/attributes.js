export const DEFAULT_SIZE = 150
export const DEFAULT_THICKNESS = 8
export const DEFAULT_PERCENT = 50

export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			progressPercent: {
				type: 'number',
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
			progressColor: {
				type: 'string',
				default: '',
			},
			progressBackgroundColor: {
				type: 'string',
				default: '',
			},
			progressThickness: {
				type: 'number',
				default: '',
			},
			progressRounded: {
				type: 'boolean',
				default: '',
			},
		},
		versionAdded: '3.4.5',
		versionDeprecated: '',
	} )
}
