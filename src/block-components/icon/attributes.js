/**
 * External dependencies
 */
import { omit } from 'lodash'
import { convertResponsiveAttributes } from '~stackable/util'

export const iconAttributes = {
	showIcon: {
		type: 'boolean',
		default: false,
	},
	icon: {
		type: 'string',
		default: '',
	},
	iconColorType: {
		type: 'string',
		default: '',
	},
	iconColor1: {
		type: 'string',
		default: '',
	},
	iconColor2: {
		type: 'string',
		default: '',
	},
	iconColorGradientDirection: {
		type: 'number',
		default: '',
	},
	iconOpacity: {
		type: 'number',
		default: '',
	},
	iconRotation: {
		type: 'number',
		default: '',
	},
	iconPosition: {
		type: 'string',
		default: '',
	},
	iconGap: {
		type: 'number',
		default: '',
	},

	shaped: {
		type: 'boolean',
		default: false,
	},
	shapeColor: {
		type: 'string',
		default: '',
	},
	shapeBorderRadius: {
		type: 'number',
		default: '',
	},
	shapePadding: {
		type: 'number',
		default: '',
	},

	showBackgroundShape: {
		type: 'boolean',
		default: false,

	},
	backgroundShape: {
		type: 'string',
		default: '',
	},
	backgroundShapeColor: {
		type: 'string',
		default: '',
	},
	backgroundShapeOpacity: {
		type: 'string',
		default: '',
	},
	backgroundShapeSize: {
		type: 'number',
		default: '',
	},
	backgroundShapeOffsetHorizontal: {
		type: 'number',
		default: '',
	},
	backgroundShapeOffsetVertical: {
		type: 'number',
		default: '',
	},

	shapeOutline: {
		type: 'boolean',
		default: false,
	},
	shapeOutlineColor: {
		type: 'string',
		default: '',
	},

	...convertResponsiveAttributes( {
		iconSize_: {
			type: 'number',
			default: '',
		},
		shapeOutlineWidthTop_: {
			type: 'number',
			default: '',
		},
		shapeOutlineWidthRight_: {
			type: 'number',
			default: '',
		},
		shapeOutlineWidthBottom_: {
			type: 'number',
			default: '',
		},
		shapeOutlineWidthLeft_: {
			type: 'number',
			default: '',
		},
	} ),

}

export const addAttributes = ( attrObject, options = {} ) => {
	const {
		attrNameTemplate = '%s',
		excludedAttributes = [],
	} = options

	attrObject.add( {
		attributes: excludedAttributes.length ? omit( iconAttributes, excludedAttributes ) : iconAttributes,
		versionAdded: '3.0.0',
		versionDeprecated: '',
		attrNameTemplate,
	} )
}
