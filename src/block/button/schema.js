/**
 * External dependencies
 */
import {
	Advanced,
	BlockDiv,
	Style,
	CustomCSS,
	Responsive,
	Button,
	Typography,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Transform,
} from '~stackable/block-components'
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()
	BlockDiv.addAttributes( attrObject )
	Style.addAttributes( attrObject )
	EffectsAnimations.addAttributes( attrObject )
	CustomAttributes.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	ConditionalDisplay.addAttributes( attrObject )
	Advanced.addAttributes( attrObject )
	Transform.addAttributes( attrObject )
	Button.addAttributes( attrObject, {
		selector: '.stk-button',
	} )

	Typography.addAttributes( attrObject, '.stk-button__inner-text', {
		hasTextTag: false,
		hasColor: false,
	} )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
