export const addAttributes = ( attrObject, options = {} ) => {
	const {
		attrNameTemplate = '%s',
		versionAdded = '3.0.0',
	} = options

	attrObject.add( {
		attributes: {
			customAttributes: {
				type: 'array',
				default: [],
			},
		},
		attrNameTemplate,
		versionAdded,
		versionDeprecated: '',
	} )
}
