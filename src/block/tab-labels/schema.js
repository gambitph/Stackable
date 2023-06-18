/**
 * External dependencies
 */
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'
import {
	BlockDiv,
	Style,
	CustomCSS,
	Responsive,
	Advanced,
	Typography,
	Alignment,
	MarginBottom,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Transform,
} from '~stackable/block-components'

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
	Alignment.addAttributes( attrObject )
	MarginBottom.addAttributes( attrObject )
	Typography.addAttributes( attrObject, '.stk-block-tab-labels__text', { hasTextTag: false } )

	attrObject.add( {
		attributes: {
			tabLabels: {
				type: 'array',
				default: [
					{ label: '', icon: '' },
					{ label: '', icon: '' },
					{ label: '', icon: '' },
				],
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
