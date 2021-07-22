import {
	Advanced,
	BlockDiv,
	CustomAttributes,
	CustomCSS,
	EffectsAnimations,
	Responsive,
	Typography,
} from '~stackable/block-components'
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()

	Advanced.addAttributes( attrObject )
	BlockDiv.addAttributes( attrObject )
	CustomAttributes.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	EffectsAnimations.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	Typography.addAttributes( attrObject, 'ul', {
		hasTextTag: false,
		multiline: 'li',
	} )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
