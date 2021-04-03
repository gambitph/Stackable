import {
	addBackgroundAttributes,
	addBorderAttributes,
	addSizeAttributes,
} from '../helpers'

export const addAttributes = ( attrObject, options ) => {
	const {
		hasDefaultContainer = false,
	} = options

	attrObject.add( {
		attributes: {
			hasContainer: {
				type: 'boolean',
				default: hasDefaultContainer,
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	addBackgroundAttributes( attrObject, 'container%s' )
	addBorderAttributes( attrObject, 'container%s' )
	addSizeAttributes( attrObject, 'container%s' )
}
