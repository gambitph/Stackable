/**
 * External dependencies
 */
import {
	Advanced,
	BlockDiv,
	CustomCSS,
	Responsive,
	Button,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
} from '~stackable/block-components'
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()
	BlockDiv.addAttributes( attrObject )
	EffectsAnimations.addAttributes( attrObject )
	CustomAttributes.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	ConditionalDisplay.addAttributes( attrObject )
	Advanced.addAttributes( attrObject )
	Button.addAttributes( attrObject, {
		selector: '.stk-button',
	} )

	attrObject.addDefaultValues( {
		attributes: {
			icon: 'fa-star',
		},
		versionAdded: '3.0.0',
		versionDeprecarted: '',
	} )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
