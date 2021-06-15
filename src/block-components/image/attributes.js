export const addAttributes = ( attrObject, options = {} ) => {
	const {
		imageWidthUnitDefault = '%',
	} = options

	attrObject.add( {
		attributes: {
			imageUrl: {
				type: 'string',
				default: '',
			},
			imageId: {
				type: 'number',
				default: '',
			},
			imageAlt: {
				type: 'string',
				default: '',
			},
			imageSize: {
				type: 'string',
				default: 'full',
			},
			imageBorderRadius: {
				type: 'number',
				default: '',
			},
			imageFocalPoint: {
				stkResponsive: true,
				type: 'object',
			},
			imageFit: {
				stkResponsive: true,
				type: 'string',
				default: '',
			},
			imageHeight: {
				stkResponsive: true,
				stkUnits: 'px',
				type: 'number',
				default: '',
			},
			imageWidth: {
				stkResponsive: true,
				stkUnits: imageWidthUnitDefault,
				type: 'number',
				default: '',
			},
			imageZoom: {
				type: 'number',
				default: '',
			},

			imageShadow: {
				type: 'string',
				default: '',
			},
			imageFilter: {
				type: 'string',
				default: '',
			},

			// Shape.
			imageShape: {
				type: 'string',
				default: '',
			},
			imageShapeFlipX: {
				type: 'boolean',
				default: '',
			},
			imageShapeFlipY: {
				type: 'boolean',
				default: '',
			},
			imageShapeStretch: {
				type: 'boolean',
				default: true,
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
