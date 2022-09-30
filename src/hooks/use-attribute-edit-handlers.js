import { getAttributeName, getAttrNameFunction } from '~stackable/util'

import { useBlockAttributesContext, useBlockSetAttributesContext } from './use-block-attributes-context'

/**
 * Provides all the functions needed to get and update attributes for control
 * Components. This is mainly used if the names of the attributes being adjusted
 * are part of a pattern. e.g. blockBackgroundColor and blockBackgroundMediaUrl
 *
 * You don't need to use this hook if you're adjusting attributes directly. Just
 * directly use the blocks' `setAttributes` function and access the block's
 * `attribute` prop.
 *
 * @param {string} attrNameTemplate The name template for the attribute. The
 * attribute name of will be run through this fitler.
 * @return {Object} Functions
 */
export const useAttributeEditHandlers = ( attrNameTemplate = '%s' ) => {
	const setAttributes = useBlockSetAttributesContext()
	const attributes = useBlockAttributesContext()

	const getAttrName = ( attrName, device = 'desktop', state = 'normal' ) => {
		return getAttributeName( getAttrNameFunction( attrNameTemplate )( attrName ), device, state )
	}

	const getAttribute = ( attrName, device = 'desktop', state = 'normal' ) => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		return attributes[ getAttributeName( getAttrName( attrName ), device, state ) ]
	}

	const getAttributes = () => attributes

	const updateAttribute = ( attrName, value, device = 'desktop', state = 'normal' ) => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		return setAttributes( {
			[ getAttributeName( getAttrName( attrName ), device, state ) ]: value,
		} )
	}

	const updateAttributeHandler = ( attrName, device = 'desktop', state = 'normal' ) => {
		return value => updateAttribute( attrName, value, device, state )
	}

	const updateAttributes = values => {
		const attributes = Object.keys( values ).reduce( ( attributes, attrName ) => {
			attributes[ getAttrName( attrName ) ] = values[ attrName ]
			return attributes
		}, {} )
		setAttributes( attributes )
	}

	return {
		getAttrName,
		getAttribute,
		getAttributes,
		updateAttributeHandler,
		updateAttributes,
		updateAttribute,
	}
}
