import {
	Advanced,
	Alignment,
	BlockDiv,
	Column,
	CustomCSS,
	Image,
} from '~stackable/block-components'
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()

	BlockDiv.addAttributes( attrObject )
	Column.addAttributes( attrObject )
	Image.addAttributes( attrObject )
	Alignment.addAttributes( attrObject )
	Advanced.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )

	attrObject.add( {
		attributes: {
			hasContainer: {
				type: 'boolean',
				default: true,
			},
			design: {
				type: 'string',
				default: '',
			},
			displayCondition: {
				type: 'object',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
