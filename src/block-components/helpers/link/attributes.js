export const linkAttributes = ( selector = 'a' ) => {
	return {
		url: {
			type: 'string',
			source: 'attribute',
			selector,
			attribute: 'href',
			default: '',
		},
		newTab: {
			type: 'boolean',
			source: 'attribute',
			selector,
			attribute: 'target',
			default: false,
		},
		rel: {
			type: 'string',
			source: 'attribute',
			selector,
			attribute: 'rel',
			default: '',
		},
		tag: {
			type: 'string',
			default: '',
		},
	}
}

export const addLinkAttributes = ( attrObject, attrNameTemplate = '%s', selector = 'a' ) => {
	attrObject.add( {
		attributes: linkAttributes( selector ),
		attrNameTemplate,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
