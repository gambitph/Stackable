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
			videoLink: {
				type: 'string',
				default: '',
			},
			videoId: {
				type: 'string',
				source: 'attribute',
				selector: '[data-video]',
				attribute: 'data-video',
				default: '',
			},
			ariaLabel: {
				type: 'string',
				source: 'attribute',
				selector: 'button',
				attribute: 'aria-label',
				default: '',
			},
			videoFullscreen: {
				type: 'boolean',
				default: true,
			},
			videoDownload: {
				type: 'boolean',
				default: true,
			},
			videoLoop: {
				type: 'boolean',
				default: false,
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
