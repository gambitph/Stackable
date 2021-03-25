/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data'
import { useState, useEffect } from '@wordpress/element'

// All default values will be kept here for caching purposes.
const blockAttributeDefaults = {}

/**
 * Used to track whether an attribute has changed, and then trigger the callback
 * supplied.
 *
 * @param {Function} callback Function to call when a given attribute has
 *                            changed
 * @param {string} blockName Name of the block
 * @param {Object} attributes The current attribute object
 */
export const useDidAttributesChange = ( callback, blockName, attributes ) => {
	// We keep the current state of the attributes here.
	const [ attributeValues, setAttributeValues ] = useState( attributes )

	// Get all the default values of the block we're checking, we cross check
	// against this list.
	if ( ! blockAttributeDefaults[ blockName ] ) {
		const attributeDefinition = select( 'core/blocks' ).getBlockType( blockName ).attributes
		blockAttributeDefaults[ blockName ] = Object.keys( attributeDefinition ).reduce( ( defaultValues, attrName ) => {
			defaultValues[ attrName ] = attributeDefinition[ attrName ].default || ''
			return defaultValues
		}, {} )
	}

	// When an attribute changes, check whether the attribute changed into a
	// non-default value.
	useEffect( () => {
		const differences = Object.keys( attributes ).filter( k => attributes[ k ] !== attributeValues[ k ] )
		setAttributeValues( attributes )

		// If one of the attributes were changed into a non-default value,
		// trigger the callback.
		differences.some( attrName => {
			const defaultValue = blockAttributeDefaults[ blockName ][ attrName ]
			if ( attributes[ attrName ] !== defaultValue ) {
				callback()
				return true
			}
			return false
		} )
	}, Object.values( attributes ) )
}
