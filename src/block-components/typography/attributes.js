export const addAttributes = ( attrObject, selector = '.stk-content', options = {} ) => {
	const {
		enableTextTag = true,
		enableTextContent = true,
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
				stkHover: true,
				type: 'number',
				default: '',
				stkUnits: 'px',
			},
			textAlign: {
				stkResponsive: true,
				stkHover: true,
				type: 'string',
				default: '',
			},
			fontFamily: {
				type: 'string',
				stkHover: true,
				default: '',
			},
			fontWeight: {
				type: 'string',
				stkHover: true,
				default: '',
			},
			textTransform: {
				type: 'string',
				stkHover: true,
				default: '',
			},
			letterSpacing: {
				type: 'string',
				stkHover: true,
				default: '',
			},
			textColorType: {
				type: 'string',
				stkHover: true,
				default: '',
			},
			textColor1: {
				type: 'string',
				stkHover: true,
				default: '',
			},
			textColor2: {
				type: 'string',
				stkHover: true,
				default: '',
			},
			textGradientDirection: {
				type: 'number',
				stkHover: true,
				default: '',
			},
			...( enableTextContent ? {
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
			...( enableTextTag ? {
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
