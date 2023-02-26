export const deprecatedAddAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			// TODO: remove
			// TODO: find all references to the Columns block-component, then deprecate the columnFit & columnFitAlign attributes, change them to columnJustify from the alignment block component
			// Deprecation will be when columnFit is true
			columnFit: {
				type: 'boolean',
				default: '',
			},
			// TODO: remove, this is replaced with columnJustify
			columnFitAlign: {
				type: 'string',
				default: '',
				stkResponsive: true,
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '3.8.0',
	} )
}
