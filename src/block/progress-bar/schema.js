/**
 * External dependencies
 */
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'
import {
	BlockDiv,
	Alignment,
	Style,
	CustomCSS,
	Responsive,
	MarginBottom,
	Advanced,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Transform,
	ProgressBar,
	Typography,
} from '~stackable/block-components'

export const DEFAULT_PERCENT = 50

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()

	BlockDiv.addAttributes( attrObject )
	Alignment.addAttributes( attrObject )
	Advanced.addAttributes( attrObject )
	MarginBottom.addAttributes( attrObject )
	Transform.addAttributes( attrObject )
	EffectsAnimations.addAttributes( attrObject )
	CustomAttributes.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	ConditionalDisplay.addAttributes( attrObject )
	Style.addAttributes( attrObject )
	ProgressBar.addAttributes( attrObject )
	Typography.addAttributes( attrObject, '.stk-progress-bar__inner-text', {
		hasTextTag: false,
		hasColor: false,
	} )

	attrObject.add( {
		attributes: {
			progressInnerText: {
				type: 'string',
				default: '',
			},
		},
		versionAdded: '3.4.5',
		versionDeprecated: '',
	} )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
