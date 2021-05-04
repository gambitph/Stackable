export const addAttributes = attrObject => {
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
			imageFocalPoint_: {
				type: 'object',
			},
			imageFit_: {
				type: 'string',
				default: '',
			},
			imageHeight_: {
				type: 'number',
				default: '',
			},
			imageWidth_: {
				type: 'number',
				default: '',
			},
			imageHeightUnit_: {
				type: 'string',
				default: 'px',
			},
			imageWidthUnit_: {
				type: 'string',
				default: '%',
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
