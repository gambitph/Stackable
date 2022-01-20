/**
 * Internal dependencies
 */
import {
	useAttributeName, useAttributeEditHandlers,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { useCallback } from '@wordpress/element'

export const useControlHandlers = ( attribute, responsive = false, hover = false, valueCallback = null, changeCallback = null ) => {
	const attrName = useAttributeName( attribute, responsive, hover )

	const { updateAttributes, getAttributes } = useAttributeEditHandlers()

	const attributes = getAttributes()

	const originalValue = attributes ? attributes[ attrName ] : ''
	let value = attributes ? attributes[ attrName ] : ''
	if ( valueCallback ) {
		value = valueCallback( value )
	}

	const onChange = useCallback( _value => {
		const value = changeCallback ? changeCallback( _value, originalValue ) : _value
		updateAttributes( { [ attrName ]: value } )
	}, [ attrName, changeCallback, originalValue, updateAttributes ] )

	return [ value, onChange ]
}
