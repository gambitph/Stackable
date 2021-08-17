const createSeparatorLayerAttributes = ( location = 'top', layer = 2 ) => ( {
	[ `${ location }SeparatorLayer${ layer }` ]: {
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
	[ `${ location }SeparatorLayer${ layer }FlipHorizontally` ]: {
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

const separatorAttributes = {
	topSeparatorShow: {
		type: 'boolean',
		default: '',
	},
	topSeparatorDesign: {
		type: 'string',
		default: '',
	},
	topSeparatorColor: {
		type: 'string',
		default: '',
	},
	topSeparatorHeight: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	topSeparatorWidth: {
		type: 'number',
		default: '',
	},
	topSeparatorShadow: {
		type: 'string',
		default: '',
	},
	topSeparatorFlipHorizontally: {
		type: 'boolean',
		default: '',
	},
	topSeparatorBringToFront: {
		type: 'boolean',
		default: '',
	},
	bottomSeparatorShow: {
		type: 'boolean',
		default: '',
	},
	bottomSeparatorDesign: {
		type: 'string',
		default: '',
	},
	bottomSeparatorColor: {
		type: 'string',
		default: '',
	},
	bottomSeparatorHeight: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	bottomSeparatorWidth: {
		type: 'number',
		default: '',
	},
	bottomSeparatorShadow: {
		type: 'string',
		default: '',
	},
	bottomSeparatorFlipHorizontally: {
		type: 'boolean',
		default: '',
	},
	bottomSeparatorBringToFront: {
		type: 'boolean',
		default: '',
	},
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
