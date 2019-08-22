/**
 * WordPress dependencies
 */
import { parse } from '@wordpress/blocks'

export const getExpectedBlockName = html => {
	const expectedBlockName = ( html.match( /<!--\s*[^:]*:([\/\w\d-]+)/i ) || [] )[ 1 ]
	if ( typeof expectedBlockName !== 'string' ) {
		return ''
	}
	if ( ! expectedBlockName.match( /^[^\/]+\// ) ) {
		return `core/${ expectedBlockName }`
	}
	return expectedBlockName
}

export const validateBlockHTML = html => {
	try {
		// Remove \n & \t since they may produce errors when inside attributes.
		const block = parse( html.replace( /\n/g, '' ).replace( /\t/g, '' ) )[ 0 ]
		const expectedBlockName = getExpectedBlockName( html )
		if ( block.name !== expectedBlockName ) {
			return `Block rendered as: ${ block.name }`
		}
		return block.isValid && block.name === expectedBlockName
	} catch ( err ) {
		return false
	}
}
