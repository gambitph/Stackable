export const addAttributes = attrObject => {
	attrObject.add(	{
		attributes: {
			premadeHoverEffect: {
				type: 'string',
				default: '',
			},
		},
		versionAdded: '3.2.0',
		versionDeprecated: '',
	} )
}
