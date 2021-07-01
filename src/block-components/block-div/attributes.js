import {
	addBackgroundAttributes,
	addBorderAttributes,
	addSizeAttributes,
} from '../helpers'

export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			uniqueId: {
				type: 'string',
				source: 'attribute',
				selector: '[data-id]',
				attribute: 'data-id',
				default: '',
			},
			hasBackground: {
				type: 'boolean',
				default: false,
			},
			hasBorders: {
				type: 'boolean',
				default: false,
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	addBackgroundAttributes( attrObject, 'block%s' )
	addBorderAttributes( attrObject, 'block%s' )
	addSizeAttributes( attrObject, 'block%s' )
}
