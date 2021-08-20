/**
 * External dependencies
 */
import { getAttrNameFunction } from '~stackable/util'

export const createSeparatorLayerAttributes = ( attrNameTemplate = 'top%s', layer = 2 ) => {
	const getAttrName = getAttrNameFunction( attrNameTemplate )

	return {
		[ getAttrName( `SeparatorLayer${ layer }Show` ) ]: {
			type: 'boolean',
			default: '',
		},
		[ getAttrName( `SeparatorLayer${ layer }Color` ) ]: {
			type: 'string',
			default: '',
		},
		[ getAttrName( `SeparatorLayer${ layer }Height` ) ]: {
			stkResponsive: true,
			type: 'number',
			default: '',
		},
		[ getAttrName( `SeparatorLayer${ layer }Width` ) ]: {
			type: 'number',
			default: '',
		},
		[ getAttrName( `SeparatorLayer${ layer }FlipHorizontally` ) ]: {
			type: 'boolean',
			default: '',
		},
		[ getAttrName( `SeparatorLayer${ layer }Inverted` ) ]: {
			type: 'boolean',
			default: '',
		},
		[ getAttrName( `SeparatorLayer${ layer }Opacity` ) ]: {
			type: 'number',
			default: '',
		},
		[ getAttrName( `SeparatorLayer${ layer }BlendMode` ) ]: {
			type: 'string',
			default: '',
		},
	}
}

export const createSeparatorAttributes = ( attrNameTemplate = '%s' ) => {
	const getAttrName = getAttrNameFunction( attrNameTemplate )

	return {
		[ getAttrName( 'separatorShow' ) ]: {
			type: 'boolean',
			default: '',
		},
		[ getAttrName( 'separatorDesign' ) ]: {
			type: 'string',
			default: '',
		},
		[ getAttrName( 'separatorColor' ) ]: {
			type: 'string',
			default: '',
		},
		[ getAttrName( 'separatorHeight' ) ]: {
			stkResponsive: true,
			type: 'number',
			default: '',
		},
		[ getAttrName( 'separatorWidth' ) ]: {
			type: 'number',
			default: '',
		},
		[ getAttrName( 'separatorShadow' ) ]: {
			type: 'string',
			default: '',
		},
		[ getAttrName( 'separatorInverted' ) ]: {
			type: 'boolean',
			default: '',
		},
		[ getAttrName( 'separatorFlipHorizontally' ) ]: {
			type: 'boolean',
			default: '',
		},
		[ getAttrName( 'separatorFlipVertically' ) ]: {
			type: 'boolean',
			default: '',
		},
		[ getAttrName( 'separatorBringToFront' ) ]: {
			type: 'boolean',
			default: '',
		},
	}
}

const separatorAttributes = {
	...createSeparatorAttributes( 'top%s' ),
	...createSeparatorAttributes( 'bottom%s' ),
	...createSeparatorLayerAttributes( 'top%s', 2 ),
	...createSeparatorLayerAttributes( 'top%s', 3 ),
	...createSeparatorLayerAttributes( 'bottom%s', 2 ),
	...createSeparatorLayerAttributes( 'bottom%s', 3 ),
}

export const addAttributes = ( attrObject, options = {} ) => {
	const { } = options
	attrObject.add( {
		attributes: separatorAttributes,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
