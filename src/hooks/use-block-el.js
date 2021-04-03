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
	return document.querySelector( `.stk-${ uniqueId }${ selector ? ' ' + selector : '' }` )
}
