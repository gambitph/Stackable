import { addAttributes } from './attributes'
import { Edit } from './edit'
import { isUndefined, omit } from 'lodash'
import striptags from 'striptags'

export const INVALID_HTML_ATTRIBUTES = [
	'class',
	'className',
	'id',
	'ref',
	'style',
	'dangerouslySetInnerHTML',
]

const INVALID_BLOCK_ATTRIBUTES = [
	'customAttributes',
]

export const CustomAttributes = () => {
	return null
}

CustomAttributes.InspectorControls = Edit

CustomAttributes.addAttributes = addAttributes

// CustomAttributes.Style = Style

CustomAttributes.getCustomAttributes = ( attributes, attributeName = 'customAttributes' ) => {
	if ( ! Array.isArray( attributes[ attributeName ] ) || attributes[ attributeName ].length === 0 ) {
		return {}
	}

	const customAttributes = Object.fromEntries( attributes[ attributeName ] )
	const invalidBlockAttributes = [ ...INVALID_BLOCK_ATTRIBUTES, attributeName ]
	Object.keys( customAttributes ).forEach( key => {
		// Unescape the value, since we're storing them as escaped strings.
		let value = unescape( customAttributes[ key ] )
		customAttributes[ key ] = value

		try {
			// Replace the value if it's dynamic
			const dynamicAttributeMatch = value.match( /%[^\%]*%/g )
			if ( dynamicAttributeMatch ) {
				dynamicAttributeMatch.forEach( _match => {
					const match = _match.substr( 1, _match.length - 2 )
					if (
						! invalidBlockAttributes.includes( match ) &&
						attributes.hasOwnProperty( match ) &&
						! isUndefined( attributes[ match ] )
					) {
						value = value.replace( _match, striptags( attributes[ match ].toString() ) )
					}
				} )
				customAttributes[ key ] = value
			}
		} catch {}
	} )

	return omit( customAttributes, INVALID_HTML_ATTRIBUTES )
}
