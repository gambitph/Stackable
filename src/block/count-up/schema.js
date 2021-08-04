/**
 * External dependencies
 */
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'
import {
	BlockDiv,
	CustomCSS,
	Responsive,
	Advanced,
	Typography,
	Alignment,
	MarginBottom,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
} from '~stackable/block-components'

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()

	Alignment.addAttributes( attrObject )
	BlockDiv.addAttributes( attrObject )
	EffectsAnimations.addAttributes( attrObject )
	CustomAttributes.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	MarginBottom.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	ConditionalDisplay.addAttributes( attrObject )
	Advanced.addAttributes( attrObject )
	Typography.addAttributes( attrObject, '.stk-block-count-up__text' )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
