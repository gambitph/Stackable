import {
	Advanced,
	Alignment,
	BlockDiv,
	BlockLink,
	Style,
	ConditionalDisplay,
	CustomAttributes,
	CustomCSS,
	EffectsAnimations,
	Image,
	Responsive,
	Transform,
	Link,
	Typography,
} from '~stackable/block-components'
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()

	BlockDiv.addAttributes( attrObject )
	Style.addAttributes( attrObject )
	Image.addAttributes( attrObject )
	Link.addAttributes( attrObject, { selector: 'a.stk-link' } )
	Alignment.addAttributes( attrObject )
	Advanced.addAttributes( attrObject )
	Transform.addAttributes( attrObject )
	EffectsAnimations.addAttributes( attrObject )
	CustomAttributes.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	ConditionalDisplay.addAttributes( attrObject )
	BlockLink.addAttributes( attrObject )

	Typography.addAttributes( attrObject, '.stk-img-figcaption', {
		hasTextContent: true,
		attrNameTemplate: 'figcaption%s',
	} )

	attrObject.add( {
		attributes: {
			figcaptionShow: {
				type: 'boolean',
				default: false,
			},
			figcaptionAlignment: {
				type: 'string',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
