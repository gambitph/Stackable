/**
 * Internal dependencies
 */
import { useBlockAttributesContext } from './use-block-attributes-context'

/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element'

export const useBlockEl = selector => {
	const uniqueId = useBlockAttributesContext( attributes => attributes.uniqueId )
	return useMemo( () => new BlockEl( uniqueId, selector ), [ uniqueId, selector ] )
}

class BlockEl {
	constructor( uniqueId, selector ) {
		this.selector = `.stk-${ uniqueId }${ selector ? ' ' + selector : '' }`
	}

	el() {
		return document.querySelector( this.selector )
	}
}
