/**
 * External dependencies
 */
import { getAttrNameFunction } from '~stackable/util'

const createSeparatorLayerAttributes = ( location = 'top', layer = 2 ) => ( {
	[ `${ location }SeparatorLayer${ layer }Show` ]: {
		type: 'boolean',
		default: '',
	},
	[ `${ location }SeparatorLayer${ layer }Color` ]: {
		type: 'string',
		default: '',
	},
	[ `${ location }SeparatorLayer${ layer }Height` ]: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	[ `${ location }SeparatorLayer${ layer }Width` ]: {
		type: 'number',
		default: '',
	},
	[ `${ location }SeparatorLayer${ layer }FlipHorizontally` ]: {
		type: 'boolean',
		default: '',
	},
	[ `${ location }SeparatorLayer${ layer }Inverted` ]: {
		type: 'boolean',
		default: '',
	},
	[ `${ location }SeparatorLayer${ layer }Opacity` ]: {
		type: 'number',
		default: '',
	},
	[ `${ location }SeparatorLayer${ layer }BlendMode` ]: {
		type: 'string',
		default: '',
	},
} )

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
	...createSeparatorLayerAttributes( 'top', 2 ),
	...createSeparatorLayerAttributes( 'top', 3 ),
	...createSeparatorLayerAttributes( 'bottom', 2 ),
	...createSeparatorLayerAttributes( 'bottom', 3 ),
}

export const addAttributes = ( attrObject, options = {} ) => {
	const { } = options
	attrObject.add( {
		attributes: separatorAttributes,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
