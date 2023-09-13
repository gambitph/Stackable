import { colorOpacityToHexAplha } from '~stackable/util'

export const deprecatedAddAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			imageOverlayOpacity: {
				type: 'number',
				default: '',
				stkHover: true,
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '3.12.0',
	} )
}

export const deprecationImageOverlayOpacity = {
	isEligible: attributes => {
		const hasColor = attributes.imageOverlayColor || attributes.imageOverlayColorHover || attributes.imageOverlayColorParentHover
		const hasOpacity = ( hasColor && ! attributes.imageOverlayOpacity ) || attributes.imageOverlayOpacity || attributes.imageOverlayOpacityHover || attributes.imageOverlayOpacityParentHover
		return hasColor || hasOpacity
	},
	migrate: attributes => {
		const hasColor = attributes.imageOverlayColor || attributes.imageOverlayColorHover || attributes.imageOverlayColorParentHover
		const hasOpacity = ( hasColor && ! attributes.imageOverlayOpacity ) || attributes.imageOverlayOpacity || attributes.imageOverlayOpacityHover || attributes.imageOverlayOpacityParentHover
		if ( ! hasColor && ! hasOpacity ) {
			return attributes
		}

		const opacity = attributes.imageOverlayOpacity === 0 ? attributes.imageOverlayOpacity : ( attributes.imageOverlayOpacity || 0.3 )
		const opacityHover = attributes.imageOverlayOpacityHover || opacity
		const opacityParentHover = attributes.imageOverlayOpacityParentHover || opacity

		const imageOverlayColor = attributes.imageOverlayColor
		const imageOverlayColorHover = attributes.imageOverlayColorHover || imageOverlayColor
		const imageOverlayColorParentHover = attributes.imageOverlayColorParentHover || imageOverlayColor

		const imageOverlayColor2 = attributes.imageOverlayColor2
		const imageOverlayColor2Hover = attributes.imageOverlayColor2Hover || imageOverlayColor2
		const imageOverlayColor2ParentHover = attributes.imageOverlayColor2ParentHover || imageOverlayColor2

		const newAttributes = {
			...attributes,
			imageOverlayOpacity: undefined,
			imageOverlayOpacityHover: undefined,
			imageOverlayOpacityParentHover: undefined,
			imageOverlayColor: attributes.imageOverlayColor ? colorOpacityToHexAplha( imageOverlayColor, opacity ) : attributes.imageOverlayColor,
			imageOverlayColor2: attributes.imageOverlayColor2 ? colorOpacityToHexAplha( imageOverlayColor2, opacity ) : attributes.imageOverlayColor2,
			imageOverlayColorHover: ( attributes.imageOverlayColorHover || attributes.imageOverlayOpacityHover ) ? colorOpacityToHexAplha( imageOverlayColorHover, opacityHover ) : attributes.imageOverlayColorHover,
			imageOverlayColor2Hover: ( attributes.imageOverlayColor2Hover || attributes.imageOverlayOpacityHover ) ? colorOpacityToHexAplha( imageOverlayColor2Hover, opacityHover ) : attributes.imageOverlayColor2Hover,
			imageOverlayColorParentHover: ( attributes.imageOverlayColorParentHover || attributes.imageOverlayOpacityParentHover ) ? colorOpacityToHexAplha( imageOverlayColorParentHover, opacityParentHover ) : attributes.imageOverlayColorParentHover,
			imageOverlayColor2ParentHover: ( attributes.imageOverlayColor2ParentHover || attributes.imageOverlayOpacityParentHover ) ? colorOpacityToHexAplha( imageOverlayColor2ParentHover, opacityParentHover ) : attributes.imageOverlayColor2ParentHover,
		}

		return newAttributes
	},
}
