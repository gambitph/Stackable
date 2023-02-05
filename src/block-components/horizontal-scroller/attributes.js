export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			horizontalScrollerColumnWidth: {
				stkResponsive: true,
				type: 'number',
				default: '',
				stkUnits: 'px',
			},
			horizontalScrollerHeight: {
				type: 'number',
				default: '',
			},
			horizontalScrollerColumnGap: {
				stkResponsive: true,
				type: 'number',
				default: '',
			},
			horizontalScrollerSnap: {
				type: 'string',
				default: '',
			},
			horizontalScrollerLeftOffset: {
				stkResponsive: true,
				type: 'number',
				default: '',
				stkUnits: 'px',
			},
			templateLock: {
				type: 'string',
				default: '',
			},
			columnArrangement: {
				stkResponsive: true,
				type: 'string',
				default: '',
			},
		},
		versionAdded: '3.6.4',
		versionDeprecated: '',
	} )
}
