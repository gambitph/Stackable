export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			customCSS: {
				type: 'string',
				default: '',
			},
			// The above attribute but already compiled for the frontend.
			customCSSMinified: {
				type: 'string',
				source: 'html',
				selector: 'style.stk-custom-css',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
