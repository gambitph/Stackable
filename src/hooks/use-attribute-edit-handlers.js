import { useCallback } from '@wordpress/element'
import { getAttributeName, getAttrNameFunction } from '~stackable/util'

import { useBlockSetAttributesContext } from './use-block-attributes-context'

/**
 * Provides write helpers for block attributes in inspector controls.
 *
 * For reads, use useAttributeValue at each read site to avoid
 * rerendering on unrelated attribute changes.
 *
 * @param {string} attrNameTemplate The name template for the attribute.
 * @return {Object} Functions
 */
export const useAttributeEditHandlers = ( attrNameTemplate = '%s' ) => {
	const setAttributes = useBlockSetAttributesContext()

	const getAttrName = useCallback( ( attrName, device = 'desktop', state = 'normal' ) => {
		return getAttributeName( getAttrNameFunction( attrNameTemplate )( attrName ), device, state )
	}, [ attrNameTemplate ] )

	const updateAttribute = useCallback( ( attrName, value, device = 'desktop', state = 'normal' ) => {
		return setAttributes( {
			[ getAttrName( attrName, device, state ) ]: value,
		} )
	}, [ setAttributes, getAttrName ] )

	const updateAttributeHandler = useCallback( ( attrName, device = 'desktop', state = 'normal' ) => {
		return value => updateAttribute( attrName, value, device, state )
	}, [ updateAttribute ] )

	const updateAttributes = useCallback( values => {
		const attributesToSet = Object.keys( values ).reduce( ( attributes, attrName ) => {
			attributes[ getAttrName( attrName ) ] = values[ attrName ]
			return attributes
		}, {} )
		setAttributes( attributesToSet )
	}, [ setAttributes, getAttrName ] )

	return {
		getAttrName,
		updateAttributeHandler,
		updateAttributes,
		updateAttribute,
	}
}
