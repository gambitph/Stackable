import { colorOpacityToHexAplha } from '~stackable/util'

export const deprecatedAddAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			imageOverlayOpacity: {
				type: 'number',
				default: '',
				stkHover: true,
			},

			// These gradient options are now combined into just the color
			// option.
			imageOverlayColor2: {
				type: 'string',
				default: '',
				stkHover: true,
			},
			imageOverlayGradientDirection: {
				type: 'number',
				default: '',
				stkHover: true,
			},
			imageOverlayGradientLocation1: {
				type: 'number',
				default: '',
				stkHover: true,
			},
			imageOverlayGradientLocation2: {
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
		// Using the old opacity option.
		const hasColor = attributes.imageOverlayColor || attributes.imageOverlayColorHover || attributes.imageOverlayColorParentHover
		const colorHasOpacity = hasColor && hasColor.length > 7
		const hasOpacity = ( hasColor && ! attributes.imageOverlayOpacity ) || attributes.imageOverlayOpacity || attributes.imageOverlayOpacityHover || attributes.imageOverlayOpacityParentHover

		// Gradient colors are now updated to a single linear-gradient / radial-gradient value.
		const hasColor2 = attributes.imageOverlayColor2 || attributes.imageOverlayColor2Hover || attributes.imageOverlayColor2ParentHover
		const hasImageGradientOverlay = attributes.imageOverlayColorType === 'gradient' && ( hasColor || hasColor2 || attributes.imageOverlayGradientDirection || attributes.imageOverlayGradientLocation1 || attributes.imageOverlayGradientLocation2 )

		const isGradientUpdated = attributes.imageOverlayColorType === 'gradient' && ! attributes.imageOverlayColor2 && ! attributes.imageOverlayColor2Hover && ! attributes.imageOverlayColor2ParentHover &&
			( attributes.imageOverlayColor?.includes( '-gradient' ) || attributes.imageOverlayColorHover?.includes( '-gradient' ) || attributes.imageOverlayColorParentHover?.includes( '-gradient' ) )
		const isGradientEligible = hasImageGradientOverlay && ! isGradientUpdated

		return ( ! colorHasOpacity ? hasColor || hasOpacity : false ) || isGradientEligible
	},
	migrate: attributes => {
		let newAttributes = { ...attributes }

		const hasColor = attributes.imageOverlayColor || attributes.imageOverlayColorHover || attributes.imageOverlayColorParentHover
		const colorHasOpacity = hasColor.length > 7
		const hasOpacity = ( hasColor && ! attributes.imageOverlayOpacity ) || attributes.imageOverlayOpacity || attributes.imageOverlayOpacityHover || attributes.imageOverlayOpacityParentHover

		if ( ! colorHasOpacity ) {
			if ( hasColor || hasOpacity ) {
				const opacity = attributes.imageOverlayOpacity === 0 ? attributes.imageOverlayOpacity : ( attributes.imageOverlayOpacity || 0.3 )
				const opacityHover = attributes.imageOverlayOpacityHover || opacity
				const opacityParentHover = attributes.imageOverlayOpacityParentHover || opacity

				const imageOverlayColor = attributes.imageOverlayColor
				const imageOverlayColorHover = attributes.imageOverlayColorHover || imageOverlayColor
				const imageOverlayColorParentHover = attributes.imageOverlayColorParentHover || imageOverlayColor

				const imageOverlayColor2 = attributes.imageOverlayColor2
				const imageOverlayColor2Hover = attributes.imageOverlayColor2Hover || imageOverlayColor2
				const imageOverlayColor2ParentHover = attributes.imageOverlayColor2ParentHover || imageOverlayColor2

				newAttributes = {
					...newAttributes,
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
			}
		}

		// Gradient color.
		const hasColor2 = attributes.imageOverlayColor2 || attributes.imageOverlayColor2Hover || attributes.imageOverlayColor2ParentHover
		const hasImageGradientOverlay = attributes.imageOverlayColorType === 'gradient' && ( hasColor || hasColor2 || attributes.imageOverlayGradientDirection || attributes.imageOverlayGradientLocation1 || attributes.imageOverlayGradientLocation2 )

		const isGradientUpdated = attributes.imageOverlayColorType === 'gradient' && ! attributes.imageOverlayColor2 && ! attributes.imageOverlayColor2Hover && ! attributes.imageOverlayColor2ParentHover &&
			( attributes.imageOverlayColor?.includes( '-gradient' ) || attributes.imageOverlayColorHover?.includes( '-gradient' ) || attributes.imageOverlayColorParentHover?.includes( '-gradient' ) )
		const isGradientEligible = hasImageGradientOverlay && ! isGradientUpdated

		if ( attributes.imageOverlayColorType === 'gradient' && isGradientEligible ) {
			const imageOverlayColor = newAttributes.imageOverlayColor || 'rgba(0,0,0,0)'
			const imageOverlayColorHover = newAttributes.imageOverlayColorHover || imageOverlayColor
			const imageOverlayColorParentHover = newAttributes.imageOverlayColorParentHover || imageOverlayColor

			const imageOverlayColor2 = newAttributes.imageOverlayColor2 || 'rgba(0,0,0,0)'
			const imageOverlayColor2Hover = newAttributes.imageOverlayColor2Hover || imageOverlayColor2
			const imageOverlayColor2ParentHover = newAttributes.imageOverlayColor2ParentHover || imageOverlayColor2

			const imageOverlayGradientDirection = attributes.imageOverlayGradientDirection || attributes.imageOverlayGradientDirection === 0 ? attributes.imageOverlayGradientDirection : 90
			const imageOverlayGradientDirectionHover = attributes.imageOverlayGradientDirectionHover || imageOverlayGradientDirection
			const imageOverlayGradientDirectionParentHover = attributes.imageOverlayGradientDirectionParentHover || imageOverlayGradientDirection

			const imageOverlayGradientLocation1 = attributes.imageOverlayGradientLocation1 || attributes.imageOverlayGradientLocation1 === 0 ? attributes.imageOverlayGradientLocation1 : 0
			const imageOverlayGradientLocation1Hover = attributes.imageOverlayGradientLocation1Hover || imageOverlayGradientLocation1
			const imageOverlayGradientLocation1ParentHover = attributes.imageOverlayGradientLocation1ParentHover || imageOverlayGradientLocation1

			const imageOverlayGradientLocation2 = attributes.imageOverlayGradientLocation2 || attributes.imageOverlayGradientLocation2 === 0 ? attributes.imageOverlayGradientLocation2 : 100
			const imageOverlayGradientLocation2Hover = attributes.imageOverlayGradientLocation2Hover || imageOverlayGradientLocation2
			const imageOverlayGradientLocation2ParentHover = attributes.imageOverlayGradientLocation2ParentHover || imageOverlayGradientLocation2

			const hasNormal = newAttributes.imageOverlayColor || newAttributes.imageOverlayColor2 || attributes.imageOverlayGradientDirection || attributes.imageOverlayGradientLocation1 || attributes.imageOverlayGradientLocation2
			const hasHover = newAttributes.imageOverlayColorHover || newAttributes.imageOverlayColor2Hover || attributes.imageOverlayGradientDirectionHover || attributes.imageOverlayGradientLocation1Hover || attributes.imageOverlayGradientLocation2Hover
			const hasParentHover = newAttributes.imageOverlayColorParentHover || newAttributes.imageOverlayColor2ParentHover || attributes.imageOverlayGradientDirectionParentHover || attributes.imageOverlayGradientLocation1ParentHover || attributes.imageOverlayGradientLocation2ParentHover

			newAttributes = {
				...newAttributes,
				imageOverlayColor2: undefined,
				imageOverlayColor2Hover: undefined,
				imageOverlayColor2ParentHover: undefined,
				imageOverlayGradientDirection: undefined,
				imageOverlayGradientLocation1: undefined,
				imageOverlayGradientLocation2: undefined,
				imageOverlayGradientDirectionHover: undefined,
				imageOverlayGradientLocation1Hover: undefined,
				imageOverlayGradientLocation2Hover: undefined,
				imageOverlayGradientDirectionParentHover: undefined,
				imageOverlayGradientLocation1ParentHover: undefined,
				imageOverlayGradientLocation2ParentHover: undefined,
				imageOverlayColor: hasNormal ? `linear-gradient(${ imageOverlayGradientDirection }deg, ${ imageOverlayColor } ${ imageOverlayGradientLocation1 }%,  ${ imageOverlayColor2 } ${ imageOverlayGradientLocation2 }%)` : newAttributes.imageOverlayColor,
				imageOverlayColorHover: hasHover ? `linear-gradient(${ imageOverlayGradientDirectionHover }deg, ${ imageOverlayColorHover } ${ imageOverlayGradientLocation1Hover }%,  ${ imageOverlayColor2Hover } ${ imageOverlayGradientLocation2Hover }%)` : newAttributes.imageOverlayColorHover,
				imageOverlayColorParentHover: hasParentHover ? `linear-gradient(${ imageOverlayGradientDirectionParentHover }deg, ${ imageOverlayColorParentHover } ${ imageOverlayGradientLocation1ParentHover }%,  ${ imageOverlayColor2ParentHover } ${ imageOverlayGradientLocation2ParentHover }%)` : newAttributes.imageOverlayColorParentHover,
			}
		}

		return newAttributes
	},
}
