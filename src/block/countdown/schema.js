/**
 * External dependencies
 */
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'
import {
	BlockDiv,
	Divider,
	Style,
	ContainerDiv,
	CustomCSS,
	Responsive,
	Advanced,
	Alignment,
	MarginBottom,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Transform,
	Typography,
} from '~stackable/block-components'

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()

	Divider.addAttributes( attrObject )
	BlockDiv.addAttributes( attrObject )
	ContainerDiv.addAttributes( attrObject )
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

	Typography.addAttributes( attrObject, 'stk-block-countdown__digit', {
		hasTextTag: false,
		hasTextContent: false,
		attrNameTemplate: 'digit%s',
	} )

	Typography.addAttributes( attrObject, 'stk-block-countdown__label', {
		hasTextTag: false,
		hasTextContent: false,
		attrNameTemplate: 'label%s',
	} )

	attrObject.add( {
		attributes: {
			days: { // The inner text `p` tag can be overridden.
				type: 'string',
				default: '',
			},
			hours: {
				type: 'string',
				default: '',
			},
			minutes: {
				type: 'string',
				default: '',
			},
			seconds: {
				type: 'string',
				default: '',
			},
			dayText: {
				type: 'string',
				default: '',
			},
			hourText: {
				type: 'string',
				default: '',
			},
			minuteText: {
				type: 'string',
				default: '',
			},
			secondText: {
				type: 'string',
				default: '',
			},
			endDate: {
				type: 'string',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	attrObject.addDefaultValues( {
		attributes: {
			days: '0',
			hours: '0',
			minutes: '0',
			seconds: '0',
			dayText: 'Days',
			hourText: 'Hours',
			minuteText: 'Minutes',
			secondText: 'Seconds',
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )

