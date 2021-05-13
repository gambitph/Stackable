import {
	Advanced,
	Alignment,
	BlockDiv,
	Column,
	ContainerDiv,
	CustomCSS,
	Image,
	Responsive,
} from '~stackable/block-components'
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'
import { BlockLink } from '~stackable/block-components/block-link'

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()

	BlockDiv.addAttributes( attrObject )
	ContainerDiv.addAttributes( attrObject, { hasDefaultContainer: true } )
	Column.addAttributes( attrObject )
	Image.addAttributes( attrObject, { imageWidthUnitDefault: 'px' } )
	Alignment.addAttributes( attrObject )
	Advanced.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	BlockLink.addAttributes( attrObject )

	attrObject.add( {
		attributes: {
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
