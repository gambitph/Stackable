export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			generatedCss: {
				type: 'string',
				source: 'html',
				selector:
					`.stk-block > style:not(.stk-custom-css),
					 .stk-block > * > style:not(.stk-custom-css)`,
				default: '',
			},
		},
		versionAdded: '3.0.3',
		versionDeprecated: '',
	} )
}
