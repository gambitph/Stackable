export const linkAttributes = ( selector = 'a' ) => {
	return {
		hasLink: {
			type: 'boolean',
			default: true,
		},
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
		hasTitle: {
			type: 'boolean',
			default: true,
		},
		title: {
			type: 'string',
			source: 'attribute',
			selector,
			attribute: 'title',
			default: '',
		},
		hasLightbox: {
			type: 'boolean',
			default: false,
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
