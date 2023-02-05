export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			scrollbarHeight: {
				type: 'number',
				default: '',
			},
			scrollbarTrackColor: {
				type: 'string',
				default: '',
			},
			scrollbarThumbColor: {
				type: 'string',
				default: '',
			},
			scrollbarThumbRadius: {
				type: 'number',
				default: '',
				stkUnits: 'px',
			},
			showScrollbar: {
				type: 'boolean',
				default: false,
			},
		},
		versionAdded: '3.6.4',
		versionDeprecated: '',
	} )
}
