/**
 * Internal dependencies
 */
import { useBlockAttributes } from './use-block-attributes'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'

export const useBlockEl = selector => {
	const { clientId } = useBlockEditContext()
	const { uniqueId } = useBlockAttributes( clientId )
	return new BlockEl( uniqueId, selector )
}

class BlockEl {
	constructor( uniqueId, selector ) {
		this.selector = `.stk-${ uniqueId }${ selector ? ' ' + selector : '' }`
	}

	el() {
		return document.querySelector( this.selector )
	}
}
