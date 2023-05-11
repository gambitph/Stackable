/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv,
	BlockLink,
	Column,
	ConditionalDisplay,
	ContainerDiv,
	CustomAttributes,
	CustomCSS,
	EffectsAnimations,
	Image,
	Responsive,
	Transform,
	Style,
} from '~stackable/block-components'
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()

	BlockDiv.addAttributes( attrObject )
	ContainerDiv.addAttributes( attrObject )
	Column.addAttributes( attrObject )
	Image.addAttributes( attrObject, { imageWidthUnitDefault: 'px' } )
	Alignment.addAttributes( attrObject )
	Advanced.addAttributes( attrObject )
	Transform.addAttributes( attrObject )
	EffectsAnimations.addAttributes( attrObject )
	CustomAttributes.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	ConditionalDisplay.addAttributes( attrObject )
	BlockLink.addAttributes( attrObject )
	Style.addAttributes( attrObject )

	attrObject.add( {
		attributes: {
			// This keeps track of the version of the block, just when we need
			// to force update the block with new attributes and the save markup
			// doesn't change.
			version: {
				type: 'number',
				source: 'attribute',
				attribute: 'data-v',
				default: undefined,
			},
			design: {
				type: 'string',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	attrObject.addDefaultValues( {
		attributes: {
			hasContainer: true,
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	attrObject.addDefaultValues( {
		attributes: {
			version: 2,
		},
		versionAdded: '3.8.0',
		versionDeprecated: '',
	} )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
