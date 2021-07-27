/**
 * External dependencies
 */
import { omit } from 'lodash'

export const createIconAttributes = ( options = {} ) => {
	const {
		defaultIcon = '',
	} = options

	return {
		icon: {
			type: 'string',
			default: defaultIcon,
		},
		iconColorType: {
			type: 'string',
			default: '',
		},
		iconColor1: {
			stkHover: true,
			type: 'string',
			default: '',
		},
		iconColor2: {
			stkHover: true,
			type: 'string',
			default: '',
		},
		iconColorGradientDirection: {
			stkHover: true,
			type: 'number',
			default: '',
		},
		iconOpacity: {
			stkHover: true,
			type: 'number',
			default: '',
		},
		iconRotation: {
			stkHover: true,
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
			stkHover: true,
			type: 'string',
			default: '',
		},
		shapeBorderRadius: {
			stkHover: true,
			type: 'number',
			default: '',
		},
		shapePadding: {
			stkHover: true,
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
			stkHover: true,
			type: 'string',
			default: '',
		},
		backgroundShapeOpacity: {
			stkHover: true,
			type: 'string',
			default: '',
		},
		backgroundShapeSize: {
			stkHover: true,
			type: 'number',
			default: '',
		},
		backgroundShapeOffsetHorizontal: {
			stkHover: true,
			type: 'number',
			default: '',
		},
		backgroundShapeOffsetVertical: {
			stkHover: true,
			type: 'number',
			default: '',
		},
		shapeOutline: {
			type: 'boolean',
			default: false,
		},
		shapeOutlineColor: {
			stkHover: true,
			type: 'string',
			default: '',
		},
		iconSize: {
			stkHover: true,
			stkResponsive: true,
			type: 'number',
			default: '',
		},
		shapeOutlineWidth: {
			stkHover: true,
			stkResponsive: true,
			type: 'object',
		},
	}
}

export const addAttributes = ( attrObject, options = {} ) => {
	const {
		excludedAttributes = [],
		hasGradient = true,
		hasShape = true,
		hasBackgroundShape = true,
	} = options

	const finalExcludedAttributes = [ ...excludedAttributes ]

	if ( ! hasGradient ) {
		finalExcludedAttributes.push(
			'iconColorType',
			'iconColor2',
			'iconColorGradientDirection'
		)
	}

	if ( ! hasShape ) {
		finalExcludedAttributes.push(
			'shaped',
			'shapeColor',
			'shapeBorderRadius',
			'shapePadding',
			'shapeOutline',
			'shapeOutlineColor',
			'shapeOutlineWidth',
		)
	}

	if ( ! hasBackgroundShape ) {
		finalExcludedAttributes.push(
			'showBackgroundShape',
			'backgroundShape',
			'backgroundShapeColor',
			'backgroundShapeOpacity',
			'backgroundShapeSize',
			'backgroundShapeOffsetHorizontal',
			'backgroundShapeOffsetVertical'
		)
	}

	const iconAttributes = createIconAttributes( options )

	attrObject.add( {
		attributes: finalExcludedAttributes.length ? omit( iconAttributes, finalExcludedAttributes ) : iconAttributes,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
