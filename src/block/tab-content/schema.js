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
	Separator,
	Transform,
} from '~stackable/block-components'
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'

const tabContentAttributes = {
	tabData: {
		type: 'string',
		selector: '[data-tab]',
		source: 'attribute',
		attribute: 'data-tab',
		default: '',
	},
	tabCount: {
		type: 'number',
		default: '',
	},
}

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()

	BlockDiv.addAttributes( attrObject )
	Style.addAttributes( attrObject )
	MarginBottom.addAttributes( attrObject )
	Row.addAttributes( attrObject )
	Alignment.addAttributes( attrObject )
	Advanced.addAttributes( attrObject )
	Transform.addAttributes( attrObject )
	EffectsAnimations.addAttributes( attrObject )
	CustomAttributes.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	ConditionalDisplay.addAttributes( attrObject )
	Separator.addAttributes( attrObject )

	attrObject.add( {
		attributes: tabContentAttributes,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
