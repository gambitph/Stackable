import {
	addBackgroundAttributes,
	addBorderAttributes,
	addSizeAttributes,
} from '../helpers'

export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			hasContainer: {
				type: 'boolean',
				default: false,
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	addBackgroundAttributes( attrObject, 'container%s' )
	addBorderAttributes( attrObject, 'container%s' )
	addSizeAttributes( attrObject, 'container%s' )
}
