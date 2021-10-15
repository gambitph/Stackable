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
			triggerHoverState: {
				type: 'boolean',
				default: true,
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	addBackgroundAttributes( attrObject, 'container%s' )
	addBorderAttributes( attrObject, 'container%s' )
	addSizeAttributes( attrObject, 'container%s' )
}
