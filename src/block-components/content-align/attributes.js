import { deprecatedAddAttributes } from './deprecated'

export const addAttributes = attrObject => {
	deprecatedAddAttributes( attrObject )

	attrObject.add( {
		attributes: {
			innerBlockContentAlign: {
				type: 'string',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
