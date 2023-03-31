import {
	Advanced,
	BlockDiv,
	Style,
	CustomAttributes,
	CustomCSS,
	EffectsAnimations,
	Responsive,
	Typography,
	MarginBottom,
	Alignment,
	Transform,
	ConditionalDisplay,
} from '~stackable/block-components'
import { AttributeObject } from '~stackable/util'
import { version as VERSION, i18n } from 'stackable'
import { __ } from '@wordpress/i18n'

export const tableofContentsAttributes = {
	// Used to generate a simple example
	// @see example.js
	example: {
		type: 'html',
	},

	// Columns.
	isSmoothScroll: {
		type: 'boolean',
		default: '',
	},
	columns: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	columnGap: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	ordered: {
		type: 'boolean',
		default: '',
	},
	indentation: {
		type: 'number',
		default: '',
	},

	// Bullets and Numbers.
	listType: {
		type: 'string',
		default: '',
	},
	iconGap: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	rowGap: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},

	// Headings
	// { level, customText, isExcluded }
	headings: {
		type: 'array',
		default: [],
	},
	includeH1: {
		type: 'boolean',
		default: false,
	},
	includeH2: {
		type: 'boolean',
		default: true,
	},
	includeH3: {
		type: 'boolean',
		default: true,
	},
	includeH4: {
		type: 'boolean',
		default: true,
	},
	includeH5: {
		type: 'boolean',
		default: true,
	},
	includeH6: {
		type: 'boolean',
		default: true,
	},
}

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()

	Alignment.addAttributes( attrObject )
	Advanced.addAttributes( attrObject )
	Transform.addAttributes( attrObject )
	BlockDiv.addAttributes( attrObject )
	Style.addAttributes( attrObject )
	CustomAttributes.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	EffectsAnimations.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	ConditionalDisplay.addAttributes( attrObject )
	Typography.addAttributes( attrObject, 'ul,ol', {
		hasTextTag: false,
		multiline: 'li',
		multilineWrapperTags: [ 'ol', 'ul' ],
	} )
	MarginBottom.addAttributes( attrObject )

	attrObject.add( {
		attributes: tableofContentsAttributes,
		versionAdded: '3.2.0',
		versionDeprecated: '',
	} )

	attrObject.addDefaultValues( {
		attributes: {
			htmlTag: 'nav',
		},
		versionAdded: '3.2.0',
		versionDeprecated: '',
	} )

	//Does not generate titleShow, generates titleShowText. That is why we added titleShow manually below
	Typography.addAttributes( attrObject, '.stk-table-of-contents__title', {
		hasTextTag: false,
		hasTextContent: true,
		attrNameTemplate: 'title%s',
		defaultText: __( 'Table of Contents', i18n ),
	} )

	attrObject.add( {
		attributes: {
			titleShow: {
				type: 'boolean',
				default: true,
			},
		},
		versionAdded: '3.6.3',
		versionDeprecated: '',
	} )

	return attrObject.getMerged( version )
}
export default attributes( VERSION )
