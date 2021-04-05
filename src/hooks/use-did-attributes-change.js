/**
 * External dependencies
 */
import { pick } from 'lodash'

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
 * changed
 * @param {string} blockName Name of the block
 * @param {Object} attributes The current attribute object
 * @param {boolean} nonDefaultsOnly If true, an attribute set to a default value
 * (e.g. blank string) will not trigger a change
 */
export const useDidAttributesChange = ( callback, blockName, attributes, nonDefaultsOnly = true ) => {
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

		// If one of the attributes were changed into a non-default value,
		// trigger the callback.
		const attrsChanged = []
		if ( nonDefaultsOnly ) {
			differences.forEach( attrName => {
				const defaultValue = blockAttributeDefaults[ blockName ][ attrName ]
				if ( attributes[ attrName ] !== defaultValue ) {
					attrsChanged.push( attrName )
				}
			} )
		} else {
			attrsChanged.push( ...differences )
		}

		// Do the callback on the attributes that have changed.
		if ( attrsChanged.length ) {
			callback(
				pick( attributes, attrsChanged ), // New attributes
				pick( attributeValues, attrsChanged ) // Old attributes
			)
		}

		// Our new attributes
		setAttributeValues( attributes )
	}, Object.values( attributes ) )
}
