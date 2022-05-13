import {
	Advanced,
	Alignment,
	BlockDiv,
	Style,
	ConditionalDisplay,
	CustomAttributes,
	CustomCSS,
	EffectsAnimations,
	Icon,
	Responsive,
	Transform,
	Link,
} from '~stackable/block-components'
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'
import { BlockLink } from '~stackable/block-components/block-link'

export const mapAttributes = {
	// We need to keep note whether the block used a Google API Key when it was
	// last saved, need this so that the map won't error when the api key is
	// added/removed.
	usesApiKey: {
		type: 'boolean',
		default: false,
	},

	location: {
		type: 'object',
		default: '',
	},
	zoom: {
		type: 'number',
		default: '',
	},
	height: {
		type: 'number',
		default: '',
		stkResponsive: true,
	},
	mapStyle: {
		type: 'string',
		default: '',
	},
	customMapStyle: {
		type: 'string',
		default: '',
	},
	// Google Map search query. This can be an address or lat,long coords.
	address: {
		type: 'string',
		default: '',
	},
	showMarker: {
		type: 'boolean',
		default: false,
	},
	showZoomButtons: {
		type: 'boolean',
		default: true,
	},
	showMapTypeButtons: {
		type: 'boolean',
		default: true,
	},
	showStreetViewButton: {
		type: 'boolean',
		default: true,
	},
	showFullScreenButton: {
		type: 'boolean',
		default: true,
	},
	isDraggable: {
		type: 'boolean',
		default: true,
	},
	iconAnchorPositionX: {
		type: 'number',
		default: '',
	},
	iconAnchorPositionY: {
		type: 'number',
		default: '',
	},
}

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()

	BlockDiv.addAttributes( attrObject )
	Style.addAttributes( attrObject )
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
	Icon.addAttributes( attrObject )

	attrObject.add( {
		attributes: mapAttributes,
		versionAdded: '3.2.0',
		versionDeprecated: '',
	} )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
