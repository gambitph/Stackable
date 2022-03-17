import {
	Advanced,
	Alignment,
	BlockDiv,
	Style,
	ConditionalDisplay,
	CustomAttributes,
	CustomCSS,
	EffectsAnimations,
	Image,
	Responsive,
	Transform,
	Link,
} from '~stackable/block-components'
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'
import { BlockLink } from '~stackable/block-components/block-link'

export const mapAttributes = {
	// Used to generate a simple example
	// @see example.js
	example: {
		type: 'html',
	},
	content: {
		type: 'string',
		default: '',
	},
	// Google Map search query
	mapZoom: {
		type: 'number',
		default: '',
	},
	mapAllowFullscreen: {
		type: 'boolean',
		default: false,
	},
	mapLocation: {
		type: 'string',
		default: '',
	},
	mapWidth: {
		type: 'number',
		default: '',
	},
	mapHeight: {
		type: 'number',
		default: '',
	},
}

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()

	BlockDiv.addAttributes( attrObject )
	Style.addAttributes( attrObject )
	Image.addAttributes( attrObject )
	Link.addAttributes( attrObject )
	Alignment.addAttributes( attrObject )
	Advanced.addAttributes( attrObject )
	Transform.addAttributes( attrObject )
	EffectsAnimations.addAttributes( attrObject )
	CustomAttributes.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	ConditionalDisplay.addAttributes( attrObject )
	BlockLink.addAttributes( attrObject )

	attrObject.add( {
		attributes: mapAttributes,
		versionAdded: '3.2.0',
		versionDeprecated: '',
	} )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
