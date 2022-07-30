/**
 * Internal dependencies
 */
import {
	useAttributeName, useBlockAttributesContext, useBlockSetAttributesContext,
} from '~stackable/hooks'

export const useControlHandlers = ( attribute, responsive = false, hover = false, valueCallback = null, changeCallback = null ) => {
	const setAttributes = useBlockSetAttributesContext()
	const attrName = useAttributeName( attribute, responsive, hover )
	const _value = useBlockAttributesContext( attributes => attributes[ attrName ] )

	const originalValue = _value !== undefined ? _value : ''
	let value = _value !== undefined ? _value : ''
	if ( valueCallback ) {
		value = valueCallback( value )
	}

	const onChange = _value => {
		const value = changeCallback ? changeCallback( _value, originalValue ) : _value
		setAttributes( { [ attrName ]: value } )
	}

	return [ value, onChange ]
}
