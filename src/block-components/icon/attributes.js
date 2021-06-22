/**
 * External dependencies
 */
import { omit } from 'lodash'

export const iconAttributes = {
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
	iconSize: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	shapeOutlineWidthTop: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	shapeOutlineWidthRight: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	shapeOutlineWidthBottom: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	shapeOutlineWidthLeft: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
}

export const addAttributes = ( attrObject, options = {} ) => {
	const {
		attrNameTemplate = '%s',
		excludedAttributes = [],
		enableGradient = true,
		enableShape = true,
		enableBackgroundShape = true,
	} = options

	const finalExcludedAttributes = [ ...excludedAttributes ]

	if ( ! enableGradient ) {
		finalExcludedAttributes.push(
			'iconColorType',
			'iconColor2',
			'iconColorGradientDirection'
		)
	}

	if ( ! enableShape ) {
		finalExcludedAttributes.push(
			'shaped',
			'shapeColor',
			'shapeBorderRadius',
			'shapePadding',
			'shapeOutline',
			'shapeOutlineColor',
			'shapeOutlineWidthTop',
			'shapeOutlineWidthRight',
			'shapeOutlineWidthBottom',
			'shapeOutlineWidthLeft',
			'shapeOutlineWidthTopTablet',
			'shapeOutlineWidthRightTablet',
			'shapeOutlineWidthBottomTablet',
			'shapeOutlineWidthLeftTablet',
			'shapeOutlineWidthTopMobile',
			'shapeOutlineWidthRightMobile',
			'shapeOutlineWidthBottomMobile',
			'shapeOutlineWidthLeftMobile'
		)
	}

	if ( ! enableBackgroundShape ) {
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

	attrObject.add( {
		attributes: finalExcludedAttributes.length ? omit( iconAttributes, finalExcludedAttributes ) : iconAttributes,
		versionAdded: '3.0.0',
		versionDeprecated: '',
		attrNameTemplate,
	} )
}
