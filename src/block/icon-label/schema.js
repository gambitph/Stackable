import {
	Advanced,
	Alignment,
	BlockDiv,
	Style,
	ConditionalDisplay,
	CustomAttributes,
	CustomCSS,
	EffectsAnimations,
	MarginBottom,
	Responsive,
	Row,
	Transform,
} from '~stackable/block-components'
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()

	BlockDiv.addAttributes( attrObject )
	Style.addAttributes( attrObject )
	MarginBottom.addAttributes( attrObject )
	Row.addAttributes( attrObject )
	Advanced.addAttributes( attrObject )
	Transform.addAttributes( attrObject )
	Alignment.addAttributes( attrObject )
	EffectsAnimations.addAttributes( attrObject )
	CustomAttributes.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	ConditionalDisplay.addAttributes( attrObject )
	attrObject.add( {
		attributes: {
			iconGap: {
				type: 'number',
				stkResponsive: true,
				default: '',
			},
			version: {
				type: 'number',
				source: 'attribute',
				attribute: 'data-v',
				default: undefined,
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	attrObject.addDefaultValues( {
		attributes: {
			version: 2,
		},
		versionAdded: '3.13.2',
		versionDeprecated: '',
	} )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
