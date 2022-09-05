export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			generatedCss: {
				type: 'string',
				source: 'html',
				selector: 'div > style:not(.stk-custom-css)',
				default: '',
			},
		},
		versionAdded: '3.0.3',
		versionDeprecated: '',
	} )
}
