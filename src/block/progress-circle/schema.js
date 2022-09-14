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
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Transform,
} from '~stackable/block-components'

export const DEFAULT_THICKNESS = 8
export const DEFAULT_PERCENT = 50

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()

	BlockDiv.addAttributes( attrObject )
	Advanced.addAttributes( attrObject )
	Transform.addAttributes( attrObject )
	EffectsAnimations.addAttributes( attrObject )
	CustomAttributes.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	ConditionalDisplay.addAttributes( attrObject )
	Style.addAttributes( attrObject )

	attrObject.add( {
		attributes: {
			percentage: {
				type: 'number',
				default: DEFAULT_PERCENT,
			},
			animate: {
				type: 'boolean',
				default: false,
			},
			displayPercentage: {
				type: 'boolean',
				default: false,
			},
			ariaValueText: {
				type: 'string',
				default: '',
			},
			progressColor: {
				type: 'string',
				default: '#3498db',
			},
			progressBackgroundColor: {
				type: 'string',
				default: '#f0f0f0',
			},
			thickness: {
				type: 'number',
				default: DEFAULT_THICKNESS,
			},
			isRounded: {
				type: 'boolean',
				default: false,
			},
		},
		versionAdded: '3.4.5',
		versionDeprecated: '',
	} )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
