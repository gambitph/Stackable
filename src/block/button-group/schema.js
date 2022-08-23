import { addDeprecatedAttributes } from './deprecated/attributes'
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
	addFlexGapAttributes,
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
	Alignment.addAttributes( attrObject )
	Advanced.addAttributes( attrObject )
	Transform.addAttributes( attrObject )
	EffectsAnimations.addAttributes( attrObject )
	CustomAttributes.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	ConditionalDisplay.addAttributes( attrObject )
	attrObject.add( {
		attributes: {
			flexWrap: {
				type: 'string',
				stkResponsive: true,
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
	attrObject.add( {
		attributes: {
			buttonAlign: {
				type: 'string',
				stkResponsive: true,
				default: '',
			},
			buttonFullWidth: {
				type: 'boolean',
				default: '',
			},
		},
		versionAdded: '3.4.3',
		versionDeprecated: '',
	} )
	addFlexGapAttributes( attrObject )

	addDeprecatedAttributes( attrObject )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
