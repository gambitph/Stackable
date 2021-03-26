import { useBlockAttributes } from './use-block-attributes'

import { getAttrNameFunction } from '~stackable/util'

import { useDispatch } from '@wordpress/data'
import { useBlockEditContext } from '@wordpress/block-editor'

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
	const attributes = useBlockAttributes( clientId )
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )

	const getAttrName = getAttrNameFunction( attrNameTemplate )
	const getAttribute = attrName => attributes[ getAttrName( attrName ) ]
	const updateAttributeHandler = attrName => value => updateBlockAttributes( clientId, { [ getAttrName( attrName ) ]: value } )
	const updateAttributes = values => {
		const attributes = Object.keys( values ).reduce( ( attributes, attrName ) => {
			attributes[ getAttrName( attrName ) ] = values[ attrName ]
			return attributes
		}, {} )
		updateBlockAttributes( clientId, attributes )
	}

	return {
		getAttrName,
		getAttribute,
		updateAttributeHandler,
		updateAttributes,
	}
}
