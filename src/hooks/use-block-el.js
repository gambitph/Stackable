/**
 * Internal dependencies
 */
import { useBlockAttributes } from './use-block-attributes'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
import { useMemo } from '@wordpress/element'

export const useBlockEl = selector => {
	const { clientId } = useBlockEditContext()
	const { uniqueId } = useBlockAttributes( clientId )
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
