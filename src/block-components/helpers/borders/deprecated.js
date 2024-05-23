import {
	extractRgba, rgbaToHexAlpha, getAttrNameFunction,
} from '~stackable/util'

import { addFilter } from '@wordpress/hooks'
import { dispatch } from '@wordpress/data'

addFilter( 'stackable.block-component.helpers.borders', 'borders', ( output, getAttribute, updateAttributes ) => {
	const borderRadius = getAttribute( 'borderRadius' )
	const borderRadiusTablet = getAttribute( 'borderRadiusTablet' )
	const borderRadiusMobile = getAttribute( 'borderRadiusMobile' )
	if ( borderRadius || borderRadiusTablet || borderRadiusMobile ) {
		dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
		updateAttributes( {
			borderRadius2: borderRadius ? {
				top: borderRadius,
				right: borderRadius,
				left: borderRadius,
				bottom: borderRadius,
			} : undefined,
			borderRadius2Tablet: borderRadiusTablet ? {
				top: borderRadiusTablet,
				right: borderRadiusTablet,
				left: borderRadiusTablet,
				bottom: borderRadiusTablet,
			} : undefined,
			borderRadius2Mobile: borderRadiusMobile ? {
				top: borderRadiusMobile,
				right: borderRadiusMobile,
				left: borderRadiusMobile,
				bottom: borderRadiusMobile,
			} : undefined,
			borderRadius: borderRadius ? '' : undefined,
			borderRadiusTablet: borderRadiusTablet ? '' : undefined,
			borderRadiusMobile: borderRadiusMobile ? '' : undefined,
		} )
	}
} )

export const deprecatedAddAttributes = ( attrObject, attrNameTemplate = '%s' ) => {
	attrObject.add( {
		attributes: {
			shadow: {
				type: 'string',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '3.12.11',
		attrNameTemplate,
	} )
}

export const deprecateShadowColor = {
	isEligible: attrNameTemplate => attributes => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		const getAttribute = _attrName => attributes[ getAttrName( _attrName ) ]

		if ( getAttribute( 'shadow' ) || getAttribute( 'shadowHover' ) || getAttribute( 'shadowParentHover' ) ) {
			return true
		}

		return false
	},
	migrate: attrNameTemplate => attributes => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		const getAttribute = _attrName => attributes[ getAttrName( _attrName ) ]

		const newAttributes = {
			...attributes,
		}

		const shadow = getAttribute( 'shadow' )
		const shadowHover = getAttribute( 'shadowHover' ) || shadow
		const shadowParentHover = getAttribute( 'shadowParentHover' ) || shadowHover

		if ( getAttribute( 'shadow' ) && getAttribute( 'shadow' ).indexOf( 'rgba' ) !== -1 ) {
			const { options, color } = extractRgba( shadow )
			const hex = rgbaToHexAlpha( color )
			newAttributes[ getAttrName( 'shadow' ) ] = `${ options } ${ hex }`
		}

		if ( getAttribute( 'shadowHover' ) && getAttribute( 'shadowHover' ).indexOf( 'rgba' ) !== -1 ) {
			const { options, color } = extractRgba( shadowHover )
			const hex = rgbaToHexAlpha( color )
			newAttributes[ getAttrName( 'shadowHover' ) ] = `${ options } ${ hex }`
		}

		if ( getAttribute( 'shadowParentHover' ) && getAttribute( 'shadowParentHover' ).indexOf( 'rgba' ) !== -1 ) {
			const { options, color } = extractRgba( shadowParentHover )
			const hex = rgbaToHexAlpha( color )
			newAttributes[ getAttrName( 'shadowParentHover' ) ] = `${ options } ${ hex }`
		}

		return newAttributes
	},
}
