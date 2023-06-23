import {
	Advanced,
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
	ContentAlign,
	Typography,
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
	EffectsAnimations.addAttributes( attrObject )
	CustomAttributes.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	ConditionalDisplay.addAttributes( attrObject )
	ContentAlign.addAttributes( attrObject )
	Typography.addAttributes( attrObject, '.stk-block-timeline__date' )

	attrObject.add( {
		attributes: {
			timelineAnchor: {
				type: 'number',
				default: '',
				stkResponsive: true,
			},
			timelinePosition: {
				type: 'string',
				default: '',
			},
			timelineGap: {
				type: 'number',
				default: '',
				stkResponsive: 'all',
			},
			timelineDotSize: {
				type: 'number',
				default: '',
			},
			timelineDotBorderRadius: {
				type: 'number',
				default: '',
			},
			timelineThickness: {
				type: 'number',
				default: '',
			},
			timelineOffset: {
				type: 'number',
				default: '',
			},
			timelineAccentColor: {
				type: 'string',
				default: '',
			},
			timelineBackgroundColor: {
				type: 'string',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	attrObject.addDefaultValues( {
		attributes: {
			// Get the current date in MMM DD, YYYY format
			text: new Date().toLocaleDateString( 'en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			} ),
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
