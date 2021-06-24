export const addAttributes = ( attrObject, selector = '.stk-content', options = {} ) => {
	const {
		hasTextTag = true,
		hasTextContent = true,
		defaultTextTag = 'p',
		attrNameTemplate = '%s',
	} = options
	attrObject.add( {
		attributes: {
			fontSize: {
				stkResponsive: true,
				stkHover: true,
				type: 'number',
				default: '',
				stkUnits: 'px',
			},
			lineHeight: {
				stkResponsive: true,
				type: 'number',
				default: '',
				stkUnits: 'em',
			},
			fontFamily: {
				type: 'string',
				default: '',
			},
			fontWeight: {
				type: 'string',
				default: '',
			},
			textTransform: {
				type: 'string',
				default: '',
			},
			letterSpacing: {
				type: 'string',
				default: '',
			},
			textColorType: {
				type: 'string',
				default: '',
			},
			textColor1: {
				type: 'string',
				stkHover: true,
				default: '',
			},
			textColor2: {
				type: 'string',
				default: '',
			},
			textGradientDirection: {
				type: 'number',
				default: '',
			},
			...( hasTextContent ? {
				showText: {
					type: 'boolean',
					default: true,
				},
				text: {
					source: 'html',
					selector,
					default: '',
				},
			} : {} ),
			...( hasTextTag ? {
				textTag: {
					type: 'string',
					default: defaultTextTag,
				},
			} : {} ),
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
		attrNameTemplate,
	} )
}
