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
	Separator,
	Transform,
} from '~stackable/block-components'
import { AttributeObject } from '~stackable/util'
import { i18n, version as VERSION } from 'stackable'
import { __ } from '@wordpress/i18n'

const tabLabelsAttributes = {
	tabCount: { // TOOD: Delete this, use tabs attribute instead.
		type: 'number',
		default: 3,
	},
	initialTabOpen: {
		type: 'string',
		default: '1',
	},
	tabs: {
		type: 'array',
		default: [
			{ label: __( 'Tab', i18n ) + ' 1', icon: '' },
			{ label: __( 'Tab', i18n ) + ' 2', icon: '' },
			{ label: __( 'Tab', i18n ) + ' 3', icon: '' },
		],
	},
}

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
	Separator.addAttributes( attrObject )

	attrObject.add( {
		attributes: tabLabelsAttributes,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
