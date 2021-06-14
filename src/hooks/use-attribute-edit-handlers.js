import { getAttrNameFunction } from '~stackable/util'

import { select, dispatch } from '@wordpress/data'
import { useBlockEditContext } from '@wordpress/block-editor'
import { useCallback } from '@wordpress/element'

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
	const { clientId } = useBlockEditContext()

	const getAttrName = getAttrNameFunction( attrNameTemplate )

	const getAttribute = useCallback( attrName => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		const attributes = select( 'core/block-editor' ).getBlockAttributes( clientId )
		return attributes[ getAttrName( attrName ) ]
	}, [ clientId, attrNameTemplate ] )

	const updateAttribute = useCallback( ( attrName, value ) => {
		const { updateBlockAttributes } = dispatch( 'core/block-editor' )
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		return updateBlockAttributes( clientId, {
			[ getAttrName( attrName ) ]: value,
		} )
	}, [ clientId, attrNameTemplate ] )

	const updateAttributeHandler = useCallback( attrName => {
		return value => updateAttribute( attrName, value )
	}, [ clientId, attrNameTemplate ] )

	const updateAttributes = useCallback( values => {
		const attributes = Object.keys( values ).reduce( ( attributes, attrName ) => {
			attributes[ getAttrName( attrName ) ] = values[ attrName ]
			return attributes
		}, {} )
		const { updateBlockAttributes } = dispatch( 'core/block-editor' )
		updateBlockAttributes( clientId, attributes )
	}, [ clientId, attrNameTemplate ] )

	return {
		getAttrName,
		getAttribute,
		updateAttributeHandler,
		updateAttributes,
		updateAttribute,
	}
}
