/**
 * Internal dependencies
 */
import {
	useAttributeName, useBlockAttributesContext, useBlockSetAttributesContext,
} from '~stackable/hooks'
import {
	get, set, cloneDeep,
} from 'lodash'

export const useControlHandlers = ( _attribute, responsive = false, hover = false, valueCallback = null, changeCallback = null ) => {
	// If there's a '.' it means the attribute value is an object, and we want
	// to change a single property inside that object.
	const willUpdateObjectProperty = _attribute.includes( '.' )
	const attribute = willUpdateObjectProperty ? _attribute.split( '.' )[ 0 ] : _attribute

	const setAttributes = useBlockSetAttributesContext()
	const attrName = useAttributeName( attribute, responsive, hover )
	const _value = useBlockAttributesContext( attributes => attributes[ attrName ] )

	// We're just updating the attribute directly.
	if ( ! willUpdateObjectProperty ) {
		const originalValue = _value !== undefined ? _value : ''
		let value = originalValue
		if ( valueCallback ) {
			value = valueCallback( value )
		}

		const onChange = _value => {
			const value = changeCallback ? changeCallback( _value, originalValue ) : _value
			setAttributes( { [ attrName ]: value } )
		}

		return [ value, onChange ]
	}

	// If we reach here, then the attribute's value is an object and we're
	// updating one property in it.  _attribute is the path in the format of
	// 'attribute.property' or 'attribute.property1.property2'
	const path = _attribute.substring( _attribute.indexOf( '.' ) + 1 )
	const originalObjectValue = _value !== undefined ? _value : {}
	const originalValue = _value !== undefined ? get( _value, path, '' ) : ''
	let value = originalValue
	if ( valueCallback ) {
		value = valueCallback( value )
	}

	const onChange = _value => {
		const value = changeCallback ? changeCallback( _value, originalValue ) : _value
		const newObjectValue = set( cloneDeep( originalObjectValue ), path, value )
		setAttributes( { [ attrName ]: newObjectValue } )
	}

	return [ value, onChange ]
}
