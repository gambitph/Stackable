import { deprecatedAddAttributes } from './deprecated'

export const addAttributes = ( attrObject, options = {} ) => {
	const {
		imageWidthUnitDefault = '%',
		selector = 'img',
	} = options

	deprecatedAddAttributes( attrObject, options )

	attrObject.add( {
		attributes: {
			imageShow: {
				type: 'boolean',
				default: true,
			},
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
				source: 'attribute',
				selector,
				attribute: 'alt',
				default: '',
			},
			imageShowEmptyAlt: {
				type: 'boolean',
				default: false,
			},
			imageAspectRatio: {
				stkResponsive: true,
				type: 'string',
				default: '',
			},
			imageSize: {
				type: 'string',
				default: 'full',
			},

			// Used internally to set the width & height attributes of the img
			// tag, this is so that our image would not produce a layout shift
			// when loading.
			imageWidthAttribute: {
				type: 'number',
				default: '',
			},

			imageHeightAttribute: {
				type: 'number',
				default: '',
			},
			imageBorderRadius: {
				type: 'number',
				default: '',
			},

			imageOverlayColorType: {
				type: 'string',
				default: '',
			},
			imageOverlayColor: {
				type: 'string',
				default: '',
				stkHover: true,
			},
			imageOverlayOpacity: {
				type: 'number',
				default: '',
				stkHover: true,
			},
			imageOverlayBlendMode: {
				type: 'string',
				default: '',
			},

			imageFocalPoint: {
				stkResponsive: true,
				stkHover: true,
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
			imageHasLightbox: {
				type: 'boolean',
				default: false,
			},
			imageZoom: {
				stkHover: true,
				type: 'number',
				default: '',
			},

			imageShadow: {
				stkHover: true,
				type: 'string',
				default: '',
			},
			imageFilter: {
				stkHover: true,
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
			imageExternalUrl: {
				type: 'string',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
